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

function AccountInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  // Only show the plan chooser when the user actively chose to upgrade
  // (via the "Buy" CTA which lands here with ?checkout=1), never on plain sign-in.
  const [showPlans, setShowPlans] = useState(params.get("checkout") === "1");
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
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not start checkout");
    } finally {
      setBusy(false);
    }
  }

  const onPaid = useCallback(async () => {
    setClientSecret(null);
    setPlan(null);
    setShowPlans(false);
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
    try {
      await cancelSubscription();
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not cancel");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="text-slate-400">Loading…</p>;

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <button
          onClick={() => { logout(); router.replace("/login"); }}
          className="text-sm text-slate-400 hover:text-white"
        >
          Sign out
        </button>
      </div>

      {status?.subscribed ? (
        // ── Subscribed ──────────────────────────────────────────────
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-mint" />
            <h2 className="text-lg font-semibold text-white">Premium active</h2>
          </div>
          {status.expiresAt ? (
            <p className="mt-2 text-sm text-slate-400">
              Valid until {new Date(status.expiresAt).toLocaleDateString(undefined, { dateStyle: "long" })}
            </p>
          ) : null}
          <button
            onClick={onCancel}
            disabled={busy}
            className="mt-5 rounded-full border border-white/15 px-5 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-50"
          >
            Cancel subscription
          </button>
          {err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}
        </section>
      ) : activating ? (
        // ── Just paid, waiting for webhook ──────────────────────────
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
          <p className="text-lg font-semibold text-white">Activating your subscription…</p>
          <p className="mt-2 text-sm text-slate-400">This takes a few seconds. Hang tight.</p>
        </section>
      ) : clientSecret ? (
        // ── Payment ─────────────────────────────────────────────────
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <button
            onClick={() => { setClientSecret(null); setPlan(null); }}
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Change plan
          </button>
          <div className="mt-4 flex items-baseline justify-between border-b border-white/10 pb-4">
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
        </section>
      ) : showPlans ? (
        // ── Choose a plan ───────────────────────────────────────────
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-semibold text-white">Choose your plan</h2>
          <p className="mt-1 text-sm text-slate-400">Cancel anytime.</p>
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
        </section>
      ) : (
        // ── Overview (free tier) ────────────────────────────────────
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400">Subscription</h2>
          <p className="mt-2 text-white">You&apos;re on the <span className="font-semibold">Free</span> tier.</p>
          <p className="mt-1 text-sm text-slate-400">
            Upgrade for unlimited, full-speed access on all your devices.
          </p>
          <button
            onClick={() => setShowPlans(true)}
            className="mt-5 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white"
          >
            Upgrade to Premium
          </button>
        </section>
      )}
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
