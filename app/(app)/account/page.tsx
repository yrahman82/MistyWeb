"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import {
  auth,
  getStatus,
  createSubscription,
  cancelSubscription,
  loadCreds,
  logout,
  type SubStatus,
} from "@/lib/api";

const PAID_PLANS = [
  { key: "monthly", name: "Monthly", price: "$3.99", cadence: "/ month" },
  { key: "sixmonth", name: "6 Months", price: "$14.99", cadence: "/ 6 months", sub: "$2.50/mo" },
  { key: "annual", name: "Annual", price: "$18", cadence: "/ year", sub: "$1.50/mo · best value" },
];

const appearance = {
  theme: "night" as const,
  variables: { colorPrimary: "#38bdf8", colorBackground: "#0f2138", borderRadius: "12px" },
};

export default function AccountPage() {
  const router = useRouter();
  const [status, setStatus] = useState<SubStatus | null>(null);
  const [creds, setCreds] = useState<{ vpnUsername: string; vpnPassword: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setStatus(await getStatus());
    } catch {
      // token invalid → back to login
      logout();
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      router.replace("/login");
      return;
    }
    setCreds(loadCreds());
    refresh().finally(() => setLoading(false));
  }, [router, refresh]);

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

  // Poll status until the webhook marks the subscription active.
  const onPaid = useCallback(async () => {
    setClientSecret(null);
    setPlan(null);
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const s = await getStatus().catch(() => null);
      if (s?.subscribed) {
        setStatus(s);
        return;
      }
    }
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

  if (loading) {
    return <p className="text-slate-400">Loading…</p>;
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <button
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="text-sm text-slate-400 hover:text-white"
        >
          Sign out
        </button>
      </div>

      {/* Subscription status */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400">
          Subscription
        </h2>
        {status?.subscribed ? (
          <div className="mt-3">
            <p className="text-lg font-semibold text-mint">Active</p>
            {status.expiresAt ? (
              <p className="mt-1 text-sm text-slate-400">
                Renews / valid until {new Date(status.expiresAt).toLocaleDateString()}
              </p>
            ) : null}
            <button
              onClick={onCancel}
              disabled={busy}
              className="mt-4 rounded-full border border-white/15 px-5 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-50"
            >
              Cancel subscription
            </button>
          </div>
        ) : (
          <p className="mt-3 text-slate-300">
            You&apos;re on the free tier. Subscribe below for unlimited, full-speed access.
          </p>
        )}
      </section>

      {/* Checkout / plans */}
      {!status?.subscribed ? (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {!clientSecret ? (
            <>
              <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400">
                Choose a plan
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {PAID_PLANS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => choosePlan(p.key)}
                    disabled={busy}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-colors hover:border-brand/50 disabled:opacity-50"
                  >
                    <div className="text-sm font-semibold text-white">{p.name}</div>
                    <div className="mt-1 text-xl font-bold text-white">
                      {p.price}
                      <span className="text-xs font-normal text-slate-400"> {p.cadence}</span>
                    </div>
                    {p.sub ? <div className="mt-1 text-xs text-brand">{p.sub}</div> : null}
                  </button>
                ))}
              </div>
              {err ? <p className="mt-4 text-sm text-red-400">{err}</p> : null}
            </>
          ) : (
            <>
              <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400">
                Payment · {PAID_PLANS.find((p) => p.key === plan)?.name}
              </h2>
              <div className="mt-4">
                <Elements stripe={getStripe()} options={{ clientSecret, appearance }}>
                  <CheckoutForm onPaid={onPaid} onBack={() => setClientSecret(null)} />
                </Elements>
              </div>
            </>
          )}
        </section>
      ) : null}

      {/* VPN credentials */}
      {creds ? (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400">
            VPN credentials
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Used to sign in to the MistyVPN apps. Keep them private.
          </p>
          <dl className="mt-4 space-y-2 font-mono text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Username</dt>
              <dd className="text-white">{creds.vpnUsername}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Password</dt>
              <dd className="text-white">{creds.vpnPassword}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </div>
  );
}

function CheckoutForm({ onPaid, onBack }: { onPaid: () => void; onBack: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [err, setErr] = useState("");
  const [paying, setPaying] = useState(false);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setErr("");
    setPaying(true);
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
    } else {
      setPaying(false);
    }
  }

  return (
    <form onSubmit={pay} className="space-y-4">
      <PaymentElement />
      {err ? <p className="text-sm text-red-400">{err}</p> : null}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white hover:bg-white/5"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || paying}
          className="flex-1 rounded-full bg-brand py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white disabled:opacity-50"
        >
          {paying ? "Processing…" : "Pay & subscribe"}
        </button>
      </div>
    </form>
  );
}
