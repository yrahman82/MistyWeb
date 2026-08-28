"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";
import ChangeCardForm from "@/components/ChangeCardForm";
import { Spinner, Loader } from "@/components/ui";
import { getStripe } from "@/lib/stripe";
import {
  auth,
  getStatus,
  getPlans,
  createCheckoutSession,
  resubscribe,
  renew,
  cancelSubscription,
  resumeSubscription,
  updatePaymentMethod,
  changePassword,
  deleteAccount,
  logout,
  type SubStatus,
  type Plan,
} from "@/lib/api";

const PLATFORM_LABEL: Record<string, string> = {
  web: "Web", apple: "App Store", google: "Google Play",
};

type View = "overview" | "plans" | "confirm" | "checkout";

function AccountInner() {
  const router = useRouter();
  const params = useSearchParams();
  const planParam = params.get("plan");
  const cameFromPricing = !!planParam;
  // Redirect-based payment methods (PayPal / some 3DS) come back to returnUrl with ?checkout=complete.
  const returnedFromCheckout = params.get("checkout") === "complete";

  const [plans, setPlans] = useState<Plan[]>([]);
  const [status, setStatus] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("overview");
  const [plan, setPlan] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [activating, setActivating] = useState(false);
  const [confirmChanging, setConfirmChanging] = useState(false); // change method inside the confirm view
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

  // Open the full Stripe checkout (enter a payment method) — for users with NO saved method.
  const startCheckout = useCallback(async (planKey: string) => {
    setView("checkout");
    setClientSecret(null);
    try {
      const { clientSecret } = await createCheckoutSession(planKey);
      setClientSecret(clientSecret);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not start checkout");
      setView("plans");
    }
  }, []);

  const choosePlan = useCallback((planKey: string) => {
    setErr("");
    setPlan(planKey);
    // Returning user who already has a payment method on file → CONFIRM charging that method (card or
    // PayPal). We deliberately don't let them enter a NEW method here: an account has one payment
    // method, not one-per-subscription — to use a different one they change it in Payment Method first.
    if (statusRef.current?.savedPaymentType) {
      setView("confirm");
      return;
    }
    startCheckout(planKey);
  }, [startCheckout]);

  // Confirmed → charge the saved method now. Falls back to full checkout if it can't be charged
  // cleanly (declined / SCA / no chargeable method).
  async function confirmResubscribe() {
    if (!plan) return;
    setBusy(true);
    setErr("");
    try {
      const r = await resubscribe(plan);
      if (r.status === "active") { onPaid(); return; }
      await startCheckout(plan);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not complete your subscription");
    } finally {
      setBusy(false);
    }
  }

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
          statusRef.current = s; // prime so choosePlan sees a saved method (confirm vs full checkout)
          choosePlan(planParam!);
          // Strip ?plan so navigating away and back (or the back button) doesn't re-open checkout —
          // the intent is one-time. View state already holds checkout/confirm for this session.
          router.replace("/account");
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

  // Came back from a redirect-based payment (PayPal / 3DS) → poll to Premium Active, then clean the URL.
  const handledReturn = useRef(false);
  useEffect(() => {
    if (returnedFromCheckout && auth.isLoggedIn && !handledReturn.current) {
      handledReturn.current = true;
      onPaid();
      router.replace("/account");
    }
  }, [returnedFromCheckout, onPaid, router]);

  // Finish a redirect-based payment-method UPDATE (e.g. switching to PayPal): Stripe returns to
  // /account?setupreturn=1 with the SetupIntent — retrieve it, set the new method as default, refresh.
  const handledSetupReturn = useRef(false);
  useEffect(() => {
    if (params.get("setupreturn") !== "1" || !auth.isLoggedIn || handledSetupReturn.current) return;
    handledSetupReturn.current = true;
    const secret = params.get("setup_intent_client_secret");
    (async () => {
      try {
        if (secret) {
          const stripe = await getStripe();
          const res = await stripe?.retrieveSetupIntent(secret);
          const pm = res?.setupIntent?.payment_method;
          const pmId = typeof pm === "string" ? pm : pm?.id;
          if (pmId) await updatePaymentMethod(pmId);
        }
        await refresh().catch(() => {});
      } finally {
        router.replace("/account");
      }
    })();
  }, [params, refresh, router]);

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

  async function onRenew() {
    setBusy(true); setErr("");
    try {
      const r = await renew();
      if (r.status === "active") { onPaid(); return; }   // recovered — poll to Premium Active
      if (r.needsCard) setErr("We couldn't charge your saved card — update it below, then try Renew again.");
      else await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not renew");
    } finally {
      setBusy(false);
    }
  }

  function backFromCheckout() {
    setClientSecret(null);
    if (cameFromPricing) router.push("/pricing");
    else setView("plans");
  }

  if (loading) return <Loader label="Loading your account…" />;

  // ── Checkout (Stripe Embedded Checkout: address + VAT + 3DS + invoice) ──
  if (view === "checkout") {
    return (
      <div className="w-full max-w-lg">
        <button onClick={backFromCheckout} className="text-sm text-slate-400 hover:text-white">
          {cameFromPricing ? "← Back to plans" : "← Change plan"}
        </button>
        <div className="mt-4 overflow-hidden rounded-2xl bg-white">
          {clientSecret ? (
            <CheckoutForm
              clientSecret={clientSecret}
              returnUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/account?checkout=complete`}
              priceLabel={plans.find((p) => p.key === plan)?.price ?? undefined}
              onPaid={onPaid}
            />
          ) : err ? (
            <p className="p-6 text-sm text-red-600">{err}</p>
          ) : (
            <Loader tone="dark" minH="min-h-[480px]" label="Preparing secure checkout…" />
          )}
        </div>
      </div>
    );
  }

  // ── Confirm (returning user with a saved method — charge it, don't collect a new one) ──
  if (view === "confirm" && status) {
    const selected = plans.find((p) => p.key === plan);
    return (
      <div className="w-full max-w-lg">
        <button
          onClick={() => {
            if (confirmChanging) { setConfirmChanging(false); return; }
            setView(cameFromPricing ? "overview" : "plans");
          }}
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back
        </button>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h1 className="text-xl font-semibold">Confirm your subscription</h1>
          {confirmChanging ? (
            <div className="mt-5">
              <p className="mb-3 text-sm text-slate-300">
                Choose a new payment method — you&apos;ll confirm the charge after.
              </p>
              <ChangeCardForm
                onDone={() => { setConfirmChanging(false); refresh().catch(() => {}); }}
                onCancel={() => setConfirmChanging(false)}
              />
            </div>
          ) : (
            <>
              <div className="mt-5 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-400">Plan</span>
                  <span className="text-white">
                    {selected?.title ?? "MistyVPN Premium"}
                    {selected ? ` · ${selected.price}${selected.unit}` : ""}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="shrink-0 text-slate-400">Payment</span>
                  <span className="min-w-0 break-words text-right text-white">{savedMethodLabel(status)}</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">
                We&apos;ll charge <span className="font-medium text-white">{savedMethodLabel(status)}</span> now
                and automatically on every renewal.
              </p>
              {err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}
              <div className="mt-5 flex flex-wrap gap-2">
                <button onClick={() => setConfirmChanging(true)} disabled={busy}
                  className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white hover:bg-white/5 disabled:opacity-50">
                  Change method
                </button>
                <button onClick={confirmResubscribe} disabled={busy}
                  className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white disabled:opacity-50">
                  {busy ? "Processing…" : "Confirm & subscribe"}
                </button>
              </div>
            </>
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
          {status?.savedPaymentType ? (
            <p className="mt-3 text-xs text-slate-400">
              We&apos;ll charge your saved {savedMethodLabel(status)} — you&apos;ll confirm before
              anything is charged.
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
          <Spinner label="Activating your subscription… this takes a few seconds." />
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
        ) : status?.pastDue ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="font-semibold text-white">Payment issue</span>
            </div>
            <p className="mt-2 text-sm text-amber-400/90">
              We couldn&apos;t renew your MistyVPN Premium subscription. We&apos;re retrying
              automatically — or renew now to restore access right away.
            </p>
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Plan</span>
                <span className="text-white">
                  MistyVPN Premium{status.amount != null ? ` · ${fmtMoney(status.amount, status.currency)}` : ""}
                </span>
              </div>
              {status.savedPaymentType === "paypal" ? (
                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="text-slate-400">Method</span>
                  <span className="text-white">
                    PayPal{status.savedPaymentLabel ? ` · ${status.savedPaymentLabel}` : ""}
                  </span>
                </div>
              ) : status.savedCardLast4 ?? status.cardLast4 ? (
                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="text-slate-400">Card</span>
                  <span className="text-white">
                    {brandLabel(status.savedCardBrand ?? status.cardBrand)} ••••{" "}
                    {status.savedCardLast4 ?? status.cardLast4}
                  </span>
                </div>
              ) : null}
            </div>
            <div className="mt-4">
              <button
                onClick={onRenew}
                disabled={busy}
                className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink hover:bg-white disabled:opacity-50"
              >
                {busy ? "Retrying…" : "Renew now"}
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              If your card keeps failing, update it below and we&apos;ll retry with the new card.
            </p>
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
    <Suspense fallback={<Loader label="Loading…" />}>
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

// Human label for the customer's saved default method — card ("Visa •••• 4242"), PayPal, or Link.
function savedMethodLabel(s: SubStatus): string {
  if (s.savedPaymentType === "paypal")
    return `PayPal${s.savedPaymentLabel ? ` · ${s.savedPaymentLabel}` : ""}`;
  if (s.savedPaymentType === "link")
    return `Link${s.savedPaymentLabel ? ` · ${s.savedPaymentLabel}` : ""}`;
  const brand = s.savedCardBrand ?? s.cardBrand;
  const last4 = s.savedCardLast4 ?? s.cardLast4;
  return last4 ? `${brandLabel(brand)} •••• ${last4}` : "your saved payment method";
}

// Format a ledger amount + currency, e.g. 3.99 + "usd" → "$3.99".
function fmtMoney(amount?: number | null, currency?: string | null): string {
  if (amount == null) return "";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: (currency || "USD").toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount}`;
  }
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

  if (!status) return null;

  const brand = status.savedCardBrand ?? status.cardBrand;
  const last4 = status.savedCardLast4 ?? status.cardLast4;
  const isPaypal = status.savedPaymentType === "paypal";
  const isLink = status.savedPaymentType === "link";
  const hasCard = !!last4;
  const hasMethod = hasCard || isPaypal || isLink;

  // Show whatever the customer actually pays with — a card ("Visa •••• 4242", also covers Apple/Google
  // Pay), PayPal (+ payer email), or Link. "Change" always collects a card (you can switch to a card
  // any time); to switch back to PayPal, pick it again at your next checkout.
  const label = isPaypal
    ? `PayPal${status.savedPaymentLabel ? ` · ${status.savedPaymentLabel}` : ""}`
    : isLink
    ? `Link${status.savedPaymentLabel ? ` · ${status.savedPaymentLabel}` : ""}`
    : hasCard
    ? `${brandLabel(brand)} •••• ${last4}`
    : "No payment method on file";

  // NOTE: no "Remove" for now — we keep the last payment method on file (like most subscription
  // products) to avoid the "cancel → remove method → re-enable auto-renew = renewing with no method"
  // hole. Removal needs a proper design pass (only when safe, add-another-first, etc.).
  return (
    <Section title="Payment Method">
      {changing ? (
        <ChangeCardForm
          onDone={() => { setChanging(false); onChanged(); }}
          onCancel={() => setChanging(false)}
        />
      ) : (
        <div className="flex items-center justify-between gap-4">
          <p className="min-w-0 break-words text-sm text-white">{label}</p>
          <button
            onClick={() => setChanging(true)}
            className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5"
          >
            {hasMethod ? "Change" : "Add card"}
          </button>
        </div>
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
