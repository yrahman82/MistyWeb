"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import {
  auth,
  getStatus,
  createSubscription,
  cancelSubscription,
  changePassword,
  deleteAccount,
  logout,
  type SubStatus,
} from "@/lib/api";

const PAID_PLANS = [
  { key: "monthly", name: "Monthly", price: "$3.99", cadence: "billed monthly", per: "$3.99/mo", unit: "/mo" },
  { key: "sixmonth", name: "6 Months", price: "$14.99", cadence: "billed every 6 months", per: "$2.50/mo", unit: "/6mo" },
  { key: "annual", name: "Annual", price: "$18", cadence: "billed yearly", per: "$1.50/mo · best value", unit: "/yr" },
];

const appearance = {
  theme: "night" as const,
  variables: { colorPrimary: "#38bdf8", colorBackground: "#0f2138", borderRadius: "12px" },
};

const PLATFORM_LABEL: Record<string, string> = {
  web: "Web (card)",
  apple: "App Store",
  google: "Google Play",
};

type View = "overview" | "plans" | "payment";

function AccountInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>(params.get("checkout") === "1" ? "plans" : "overview");
  const [plan, setPlan] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [activating, setActivating] = useState(false);

  const selected = PAID_PLANS.find((p) => p.key === plan);

  const refresh = useCallback(async () => {
    try {
      setStatus(await getStatus());
    } catch {
      logout();
      router.replace("/login?next=/account");
    }
  }, [router]);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      const next = params.get("checkout") === "1" ? "/account?checkout=1" : "/account";
      router.replace(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    refresh().finally(() => setLoading(false));
  }, [router, refresh, params]);

  async function choosePlan(planKey: string) {
    setErr("");
    setBusy(true);
    try {
      const { clientSecret } = await createSubscription(planKey);
      setPlan(planKey);
      setClientSecret(clientSecret);
      setView("payment");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not start checkout");
    } finally {
      setBusy(false);
    }
  }

  const onPaid = useCallback(async () => {
    setClientSecret(null);
    setPlan(null);
    setView("overview");
    setActivating(true);
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const s = await getStatus().catch(() => null);
      if (s?.subscribed) {
        setStatus(s);
        setActivating(false);
        return;
      }
    }
    setActivating(false);
    refresh();
  }, [refresh]);

  async function onCancel() {
    if (!confirm("Cancel your subscription? You'll keep access until the current period ends.")) return;
    setBusy(true);
    setErr("");
    try {
      await cancelSubscription();
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not cancel");
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    logout();
    router.replace("/");
  }

  if (loading) return <p className="text-slate-400">Loading…</p>;

  // ── Focused checkout sub-flow ──────────────────────────────────────
  if (view === "plans") {
    return (
      <div className="w-full max-w-lg">
        <button onClick={() => setView("overview")} className="text-sm text-slate-400 hover:text-white">
          ← Back to account
        </button>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h1 className="text-xl font-semibold">Go Premium</h1>
          <p className="mt-1 text-sm text-slate-400">Unlimited, full-speed access. Cancel anytime.</p>
          <div className="mt-5 space-y-3">
            {PAID_PLANS.map((p) => (
              <button
                key={p.key}
                onClick={() => choosePlan(p.key)}
                disabled={busy}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition-colors hover:border-brand/50 disabled:opacity-50"
              >
                <div>
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.per}</div>
                </div>
                <div className="text-lg font-bold text-white">
                  {p.price}
                  <span className="ml-1 text-xs font-normal text-slate-400">{p.unit}</span>
                </div>
              </button>
            ))}
          </div>
          {busy ? <p className="mt-4 text-sm text-slate-400">Preparing checkout…</p> : null}
          {err ? <p className="mt-4 text-sm text-red-400">{err}</p> : null}
        </div>
      </div>
    );
  }

  if (view === "payment" && clientSecret) {
    return (
      <div className="w-full max-w-lg">
        <button onClick={() => { setClientSecret(null); setView("plans"); }} className="text-sm text-slate-400 hover:text-white">
          ← Change plan
        </button>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
            <div>
              <div className="font-semibold text-white">MistyVPN Premium · {selected?.name}</div>
              <div className="text-xs text-slate-400">{selected?.cadence}</div>
            </div>
            <div className="text-xl font-bold text-white">{selected?.price}</div>
          </div>
          <div className="mt-5">
            <Elements stripe={getStripe()} options={{ clientSecret, appearance }}>
              <CheckoutForm onPaid={onPaid} />
            </Elements>
          </div>
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
        <button onClick={signOut} className="text-sm text-slate-400 hover:text-white">
          Sign out
        </button>
      </div>

      {/* Profile */}
      <Section title="Profile">
        <Row label="Email" value={status?.email ?? "—"} />
      </Section>

      {/* Subscription */}
      <Section title="Subscription">
        {activating ? (
          <p className="text-slate-300">Activating your subscription… this takes a few seconds.</p>
        ) : status?.subscribed ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-mint" />
              <span className="font-semibold text-white">Premium</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-300">
                {PLATFORM_LABEL[status.platform ?? ""] ?? status.platform}
              </span>
            </div>
            {status.expiresAt ? (
              <p className="mt-2 text-sm text-slate-400">
                Valid until {new Date(status.expiresAt).toLocaleDateString(undefined, { dateStyle: "long" })}
              </p>
            ) : null}
            {canManage ? (
              <button
                onClick={onCancel}
                disabled={busy}
                className="mt-4 rounded-full border border-white/15 px-5 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-50"
              >
                Cancel subscription
              </button>
            ) : (
              <p className="mt-3 text-xs text-slate-500">
                Manage this subscription in {PLATFORM_LABEL[status.platform ?? ""] ?? "the store where you bought it"}.
              </p>
            )}
            {err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}
          </div>
        ) : (
          <div>
            <p className="text-white">You&apos;re on the <span className="font-semibold">Free</span> tier.</p>
            <p className="mt-1 text-sm text-slate-400">Upgrade for unlimited, full-speed access on all your devices.</p>
            <button
              onClick={() => setView("plans")}
              className="mt-4 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white"
            >
              Upgrade to Premium
            </button>
          </div>
        )}
      </Section>

      {/* VPN credentials */}
      <Section title="VPN credentials">
        <p className="mb-3 text-xs text-slate-500">Use these to sign in to the MistyVPN apps.</p>
        <CopyRow label="Username" value={status?.vpnUsername ?? ""} />
        <CopyRow label="Password" value={status?.vpnPassword ?? ""} />
      </Section>

      {/* Security */}
      <ChangePasswordSection />

      {/* Danger */}
      <DeleteAccountSection onDeleted={() => { logout(); router.replace("/"); }} />
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
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
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
          onClick={async () => {
            if (!value) return;
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          className="text-xs text-brand hover:underline"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function ChangePasswordSection() {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    try {
      await changePassword(cur, next);
      setMsg("Password updated.");
      setCur(""); setNext(""); setOpen(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section title="Security">
      {!open ? (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Password</span>
          <button onClick={() => setOpen(true)} className="text-sm text-brand hover:underline">
            Change
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password" required value={cur} onChange={(e) => setCur(e.target.value)}
            placeholder="Current password" autoComplete="current-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
          />
          <input
            type="password" required minLength={8} value={next} onChange={(e) => setNext(e.target.value)}
            placeholder="New password (min 8 chars)" autoComplete="new-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-brand"
          />
          {err ? <p className="text-sm text-red-400">{err}</p> : null}
          <div className="flex gap-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink hover:bg-white disabled:opacity-50">
              {busy ? "Saving…" : "Update password"}
            </button>
          </div>
        </form>
      )}
      {msg ? <p className="mt-2 text-sm text-mint">{msg}</p> : null}
    </Section>
  );
}

function DeleteAccountSection({ onDeleted }: { onDeleted: () => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function onDelete() {
    if (!confirm("Delete your account permanently? This cannot be undone.")) return;
    setBusy(true); setErr("");
    try {
      await deleteAccount();
      onDeleted();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not delete account");
      setBusy(false);
    }
  }
  return (
    <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6">
      <h2 className="text-xs font-medium uppercase tracking-wider text-red-400/80">Danger zone</h2>
      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="text-sm text-slate-300">Delete account</span>
        <button onClick={onDelete} disabled={busy} className="rounded-full border border-red-500/40 px-5 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50">
          {busy ? "Deleting…" : "Delete"}
        </button>
      </div>
      {err ? <p className="mt-2 text-sm text-red-400">{err}</p> : null}
    </section>
  );
}

function CheckoutForm({ onPaid }: { onPaid: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setErr("");
    setPaying(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/account` },
        redirect: "if_required",
      });
      if (error) {
        setErr(error.message ?? "Payment failed");
        setPaying(false);
        return;
      }
      if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
        onPaid();
        return;
      }
      setPaying(false);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Payment could not be completed");
      setPaying(false);
    }
  }

  return (
    <form onSubmit={pay} className="space-y-4">
      <PaymentElement
        onReady={() => setReady(true)}
        onLoadError={() => setErr("Couldn't load the payment form. Please refresh and try again.")}
      />
      {err ? <p className="text-sm text-red-400">{err}</p> : null}
      <button
        type="submit"
        disabled={!stripe || !ready || paying}
        className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-ink transition-colors hover:bg-white disabled:opacity-50"
      >
        {paying ? "Processing…" : "Subscribe"}
      </button>
    </form>
  );
}
