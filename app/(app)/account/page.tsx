"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import ChangeCardForm from "@/components/ChangeCardForm";
import {
  auth,
  getStatus,
  getPlans,
  createCheckoutSession,
  resubscribe,
  removeCard,
  cancelSubscription,
  resumeSubscription,
  changePassword,
  deleteAccount,
  logout,
  type SubStatus,
  type Plan,
} from "@/lib/api";

const PLATFORM_LABEL: Record<string, string> = {
  web: "Web", apple: "App Store", google: "Google Play",
};

type View = "overview" | "plans" | "checkout";

function AccountInner() {
  const router = useRouter();
  const params = useSearchParams();
  const planParam = params.get("plan");
  const cameFromPricing = !!planParam;

  const [plans, setPlans] = useState<Plan[]>([]);
  const [status, setStatus] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("overview");
  const [plan, setPlan] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [activating, setActivating] = useState(false);
  const autoStarted = useRef(false);

  // Latest status kept in a ref so choosePlan can read `hasSavedCard` without depending on `status`
  // (which the load effect sets — a dep on it would loop the effect that also calls choosePlan).
  const statusRef = useRef<SubStatus | null>(null);
  useEffect(() => { statusRef.current = status; }, [status]);

  const refresh = useCallback(async () => {
    const s = await getStatus();
    setStatus(s);
    return s;
  }, []);

  const onPaid = useCallback(async () => {
    setClientSecret(null);
    setPlan(null);
    setView("overview");
    setActivating(true);
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const s = await getStatus().catch(() => null);
      if (s?.subscribed) { setStatus(s); setActivating(false); return; }
    }
    setActivating(false);
    refresh().catch(() => {});
  }, [refresh]);

  const choosePlan = useCallback(async (planKey: string) => {
    setErr("");
    setBusy(true);
    setPlan(planKey);
    try {
      // Lapsed user with a saved card → charge it directly, no Checkout / no re-entering the card.
      if (statusRef.current?.hasSavedCard) {
        const r = await resubscribe(planKey);
        if (r.status === "active") { setBusy(false); onPaid(); return; }
        // needsCheckout → the saved card can't be charged cleanly; fall through to Stripe Checkout.
      }
      setView("checkout");
      const { clientSecret } = await createCheckoutSession(planKey);
      setClientSecret(clientSecret);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not start checkout");
      setView("plans");
    } finally {
      setBusy(false);
    }
  }, [onPaid]);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      const next = planParam ? `/account?plan=${planParam}` : "/account";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    refresh()
      .then((s) => {
        if (!s.subscribed && cameFromPricing && !autoStarted.current) {
          autoStarted.current = true;
          choosePlan(planParam!);
        }
      })
      .catch((e) => {
        // Only log out on a genuine 401 (token invalid/expired). A network blip or 5xx must NOT
        // sign the user out — otherwise buying/refreshing during a hiccup bounces them to login.
        if ((e as { status?: number })?.status === 401) {
          logout();
          const back = planParam ? `/account?plan=${planParam}` : "/account";
          router.replace(`/login?next=${encodeURIComponent(back)}`);
        } else {
          setErr("Couldn't load your account. Check your connection and try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [router, refresh, planParam, cameFromPricing, choosePlan]);

  // DB-driven plan list — same source the mobile apps use (add a plan in the DB, no deploy).
  useEffect(() => {
    getPlans().then(setPlans).catch(() => {});
  }, []);

  async function onCancel() {
    if (!confirm("Cancel your subscription? You'll keep access until the current period ends.")) return;
    setBusy(true); setErr("");
    try { await cancelSubscription(); await refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Could not cancel"); }
    finally { setBusy(false); }
  }

  async function onResume() {
    setBusy(true); setErr("");
    try { await resumeSubscription(); await refresh(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Could not resume"); }
    finally { setBusy(false); }
  }

  function backFromCheckout() {
    setClientSecret(null);
    if (cameFromPricing) router.push("/pricing");
    else setView("plans");
  }

  if (loading) return <p className="text-slate-400">Loading…</p>;

  // ── Checkout (Stripe Embedded Checkout: address + VAT + 3DS + invoice) ──
  if (view === "checkout") {
    return (
      <div className="w-full max-w-lg">
        <button onClick={backFromCheckout} className="text-sm text-slate-400 hover:text-white">
          {cameFromPricing ? "← Back to plans" : "← Change plan"}
        </button>
        <div className="relative mt-4 min-h-[480px] overflow-hidden rounded-2xl bg-white">
          {clientSecret ? (
            <>
              {/* Spinner sits behind the checkout iframe; Stripe's opaque widget covers it once loaded. */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-sm text-slate-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" />
                Loading secure checkout…
              </div>
              <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret, onComplete: onPaid }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </>
          ) : err ? (
            <p className="p-6 text-sm text-red-600">{err}</p>
          ) : (
            <div className="flex min-h-[480px] items-center justify-center gap-2 text-sm text-slate-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-500" />
              Preparing secure checkout…
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Plans ──────────────────────────────────────────────────────────
  if (view === "plans") {
    return (
      <div className="w-full max-w-lg">
        <button onClick={() => setView("overview")} className="text-sm text-slate-400 hover:text-white">
          ← Back to account
        </button>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Get Premium</h1>
            <Link href="/pricing" className="text-sm text-brand hover:underline">
              See plans &amp; benefits →
            </Link>
          </div>
          {status?.hasSavedCard ? (
            <p className="mt-3 text-xs text-slate-400">
              Your saved {brandLabel(status.savedCardBrand)} •••• {status.savedCardLast4} will be
              charged — no need to re-enter card details.
            </p>
          ) : null}
          <div className="mt-5 space-y-3">
            {plans.map((p) => (
              <button key={p.key} onClick={() => choosePlan(p.key)} disabled={busy}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition-colors hover:border-brand/50 disabled:opacity-50">
                <div>
                  <div className="font-semibold text-white">{p.title}</div>
                  <div className="text-xs text-slate-400">
                    {p.badge ? `${p.perMonth} · ${p.badge.toLowerCase()}` : p.perMonth}
                  </div>
                </div>
                <div className="text-lg font-bold text-white">
                  {p.price}<span className="ml-1 text-xs font-normal text-slate-400">{p.unit}</span>
                </div>
              </button>
            ))}
          </div>
          {err ? <p className="mt-4 text-sm text-red-400">{err}</p> : null}
        </div>
      </div>
    );
  }

  // ── Account dashboard ──────────────────────────────────────────────
  const canManage = status?.platform === "web";
  return (
    <div className="w-full max-w-lg space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <button onClick={() => { logout(); router.replace("/"); }} className="text-sm text-slate-400 hover:text-white">
          Sign Out
        </button>
      </div>

      <Section title="Subscription">
        {activating ? (
          <p className="text-slate-300">Activating your subscription… this takes a few seconds.</p>
        ) : status?.subscribed ? (
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${status.willCancel ? "bg-amber-400" : "bg-mint"}`} />
              <span className="font-semibold text-white">Premium Active</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-300">
                {PLATFORM_LABEL[status.platform ?? ""] ?? status.platform}
              </span>
            </div>
            {status.expiresAt ? (
              status.willCancel ? (
                <p className="mt-2 text-sm text-amber-400/90">
                  Won&apos;t renew — access until{" "}
                  {new Date(status.expiresAt).toLocaleDateString(undefined, { dateStyle: "long" })}
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-400">
                  Renews automatically on{" "}
                  {new Date(status.expiresAt).toLocaleDateString(undefined, { dateStyle: "long" })}
                </p>
              )
            ) : (
              <p className="mt-1 text-sm text-slate-400">Unlimited access to all servers</p>
            )}

            {/* Post-purchase CTA — get the app on every device */}
            <div className="mt-4 rounded-xl border border-brand/25 bg-brand/[0.06] p-4">
              <p className="text-sm font-medium text-white">You&apos;re all set — get the app</p>
              <p className="mt-1 text-xs text-slate-400">
                Download MistyVPN on iPhone, Android, Mac and Android TV, then sign in with your
                account email and password.
              </p>
              <Link
                href="/download"
                className="mt-3 inline-flex rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-white"
              >
                Download the app
              </Link>
            </div>

            {canManage ? (
              status.willCancel ? (
                <button onClick={onResume} disabled={busy}
                  className="mt-4 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink hover:bg-white disabled:opacity-50">
                  Resume Subscription
                </button>
              ) : (
                <button onClick={onCancel} disabled={busy}
                  className="mt-4 rounded-full border border-white/15 px-5 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-50">
                  Cancel Subscription
                </button>
              )
            ) : (
              // Store-bought subs (iOS/Android) can only be cancelled in the store.
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-300">
                  {status.platform === "apple"
                    ? "You subscribed through the App Store on your Apple device."
                    : status.platform === "google"
                    ? "You subscribed through Google Play on your Android device."
                    : "You subscribed through a mobile app store."}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  To change or cancel, manage it where you bought it — it can&apos;t be cancelled here.
                </p>
                {(status.platform === "apple" || status.platform === "google") && (
                  <a
                    href={
                      status.platform === "apple"
                        ? "https://apps.apple.com/account/subscriptions"
                        : "https://play.google.com/store/account/subscriptions"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex rounded-full border border-white/15 px-5 py-2 text-sm text-white hover:bg-white/5"
                  >
                    Manage in {status.platform === "apple" ? "App Store" : "Google Play"} ↗
                  </a>
                )}
              </div>
            )}
            {err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}
          </div>
        ) : (
          <div>
            <p className="font-semibold text-white">Free Plan</p>
            <p className="mt-1 text-sm text-slate-400">Upgrade for unlimited, full-speed access on all your devices.</p>
            <button onClick={() => setView("plans")}
              className="mt-4 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white">
              Upgrade to Premium
            </button>
          </div>
        )}
      </Section>

      <PaymentMethodSection status={status} onChanged={() => refresh().catch(() => {})} />

      <Section title="OpenVPN Credentials">
        <p className="mb-3 text-xs text-slate-500">
          For connecting third-party OpenVPN clients (routers, the OpenVPN app, etc.). You
          don&apos;t need these for the MistyVPN app — just sign in there with your account
          email and password.
        </p>
        <CopyRow label="Username" value={status?.vpnUsername ?? ""} />
        <CopyRow label="Password" value={status?.vpnPassword ?? ""} />
      </Section>

      <AccountActions email={status?.email} onDeleted={() => { logout(); router.replace("/"); }} />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<p className="text-slate-400">Loading…</p>}>
      <AccountInner />
    </Suspense>
  );
}

// ── UI bits ───────────────────────────────────────────────────────────
// "visa" → "Visa", "amex" → "Amex". Falls back to "Card" when the brand is unknown.
function brandLabel(brand?: string | null): string {
  if (!brand) return "Card";
  return brand.charAt(0).toUpperCase() + brand.slice(1);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-white">{value || "—"}</span>
        <button
          onClick={async () => { if (!value) return; await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
          className="text-xs text-brand hover:underline">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// Always-present payment method management — add / change / remove a card in ANY subscription state
// (active, lapsed, expired, or never subscribed). Reads the customer's default card from status.
function PaymentMethodSection({
  status,
  onChanged,
}: {
  status: SubStatus | null;
  onChanged: () => void;
}) {
  const [changing, setChanging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  if (!status) return null;

  const brand = status.savedCardBrand ?? status.cardBrand;
  const last4 = status.savedCardLast4 ?? status.cardLast4;
  const hasCard = !!last4;
  // Can't remove the card an active, auto-renewing subscription depends on.
  const lockedBySub = !!status.subscribed && !status.willCancel;
  const canRemove = hasCard && !lockedBySub;

  async function onRemove() {
    const msg =
      status?.subscribed && !status.willCancel
        ? "Remove your card? Your subscription won't be able to renew without one."
        : "Remove your saved card?";
    if (!confirm(msg)) return;
    setBusy(true);
    setErr("");
    try {
      await removeCard();
      onChanged();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not remove card");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section title="Payment Method">
      {changing ? (
        <ChangeCardForm
          onDone={() => { setChanging(false); onChanged(); }}
          onCancel={() => setChanging(false)}
        />
      ) : (
        <>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-white">
              {hasCard ? `${brandLabel(brand)} •••• ${last4}` : "No card on file"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setChanging(true)}
                disabled={busy}
                className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-50"
              >
                {hasCard ? "Change" : "Add card"}
              </button>
              {canRemove ? (
                <button
                  onClick={onRemove}
                  disabled={busy}
                  className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-sm text-red-400 hover:bg-white/5 disabled:opacity-50"
                >
                  {busy ? "…" : "Remove"}
                </button>
              ) : null}
            </div>
          </div>
          {hasCard && lockedBySub ? (
            <p className="mt-3 text-xs text-slate-500">
              Your card can&apos;t be removed while your subscription is set to renew — turn off
              auto-renewal first.
            </p>
          ) : null}
          {err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}
        </>
      )}
    </Section>
  );
}

function AccountActions({ email, onDeleted }: { email?: string; onDeleted: () => void }) {
  const [pwOpen, setPwOpen] = useState(false);
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function savePw(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    try { await changePassword(cur, next); setMsg("Password updated."); setCur(""); setNext(""); setPwOpen(false); }
    catch (e) { setErr(e instanceof Error ? e.message : "Could not update password"); }
    finally { setBusy(false); }
  }

  async function onDelete() {
    if (!confirm("Delete your account permanently? This cannot be undone.")) return;
    setBusy(true); setErr("");
    try { await deleteAccount(); onDeleted(); }
    catch (e) { setErr(e instanceof Error ? e.message : "Could not delete account"); setBusy(false); }
  }

  return (
    <Section title="Account">
      {email ? (
        <div className="mb-1 flex items-center justify-between gap-4 border-b border-white/5 py-2">
          <span className="text-sm text-slate-400">Email</span>
          <span className="text-sm text-white">{email}</span>
        </div>
      ) : null}
      {!pwOpen ? (
        <button onClick={() => setPwOpen(true)} className="flex w-full items-center justify-between py-2 text-left">
          <span className="text-sm text-white">Change Password</span>
          <span className="text-slate-500">›</span>
        </button>
      ) : (
        <form onSubmit={savePw} className="space-y-3 py-1">
          <input type="password" required value={cur} onChange={(e) => setCur(e.target.value)}
            placeholder="Current password" autoComplete="current-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand" />
          <input type="password" required minLength={8} value={next} onChange={(e) => setNext(e.target.value)}
            placeholder="New password (min 8 chars)" autoComplete="new-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand" />
          {err ? <p className="text-sm text-red-400">{err}</p> : null}
          <div className="flex gap-2">
            <button type="button" onClick={() => setPwOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={busy} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink hover:bg-white disabled:opacity-50">
              {busy ? "Saving…" : "Update Password"}
            </button>
          </div>
        </form>
      )}
      {msg ? <p className="mt-1 text-sm text-mint">{msg}</p> : null}

      <div className="mt-1 border-t border-white/5 pt-1">
        <button onClick={onDelete} disabled={busy} className="flex w-full items-center justify-between py-2 text-left disabled:opacity-50">
          <span className="text-sm text-red-400">{busy ? "Deleting…" : "Delete Account"}</span>
          <span className="text-red-400/50">›</span>
        </button>
      </div>
      {err && !pwOpen ? <p className="mt-1 text-sm text-red-400">{err}</p> : null}
    </Section>
  );
}
