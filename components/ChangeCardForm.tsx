"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { getStripe } from "@/lib/stripe";
import { createSetupIntent, updatePaymentMethod } from "@/lib/api";

type Card = { cardBrand: string | null; cardLast4: string | null };

// Stable module-level references — Stripe's Payment Element lives in an iframe; if the `options`
// object or the PaymentElement options change identity on a re-render, the iframe re-initializes and
// typing appears to "freeze"/reset. Keep these constant.
const PE_OPTIONS = { layout: "tabs" as const };
const APPEARANCE: StripeElementsOptions["appearance"] = {
  theme: "night",
  variables: { colorPrimary: "#38bdf8", borderRadius: "10px" },
};

// In-app card change: SetupIntent → Payment Element → confirm → tell the backend to make it the
// default (so renewals use it). Themed dark to match the site.
export default function ChangeCardForm({
  onDone,
  onCancel,
}: {
  onDone: (card: Card) => void;
  onCancel: () => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [err, setErr] = useState("");
  // getStripe() is a singleton, but pin the promise once so the `stripe` prop reference never changes.
  const [stripePromise] = useState(() => getStripe());

  useEffect(() => {
    createSetupIntent()
      .then((r) => setClientSecret(r.clientSecret))
      .catch((e) =>
        setErr(e instanceof Error ? e.message : "Could not start card update"),
      );
  }, []);

  // Stable options object — only rebuilt when the client secret actually changes.
  const options = useMemo<StripeElementsOptions | null>(
    () => (clientSecret ? { clientSecret, appearance: APPEARANCE } : null),
    [clientSecret],
  );

  if (err && !clientSecret) return <p className="text-sm text-red-400">{err}</p>;
  if (!options)
    return <p className="text-sm text-slate-500">Loading secure card form…</p>;

  return (
    <Elements stripe={stripePromise} options={options}>
      <Inner onDone={onDone} onCancel={onCancel} />
    </Elements>
  );
}

function Inner({
  onDone,
  onCancel,
}: {
  onDone: (card: Card) => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setErr("");

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErr(error.message || "Card update failed");
      setBusy(false);
      return;
    }

    const pm = setupIntent?.payment_method;
    const pmId = typeof pm === "string" ? pm : pm?.id;
    if (!pmId) {
      setErr("No payment method returned");
      setBusy(false);
      return;
    }

    try {
      const card = await updatePaymentMethod(pmId);
      onDone(card);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Could not save card");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <PaymentElement options={PE_OPTIONS} />
      </div>
      {err ? <p className="text-sm text-red-400">{err}</p> : null}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy || !stripe}
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-ink hover:bg-white disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save card"}
        </button>
      </div>
    </form>
  );
}
