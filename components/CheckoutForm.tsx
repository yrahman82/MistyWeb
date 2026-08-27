"use client";

import { useState } from "react";
import {
  CheckoutElementsProvider,
  useCheckoutElements,
  PaymentElement,
  ExpressCheckoutElement,
} from "@stripe/react-stripe-js/checkout";
import type {
  StripeCheckoutElementsSdkOptions,
  StripeExpressCheckoutElementConfirmEvent,
  StripeExpressCheckoutElementReadyEvent,
  StripeCheckoutConfirmResult,
} from "@stripe/stripe-js";
import { getStripe } from "@/lib/stripe";
import { Spinner } from "@/components/ui";

// Custom (Elements-based) Checkout Session — renders on OUR page instead of Stripe's iframe:
// Express Checkout Element (Apple Pay / Google Pay / PayPal express buttons) + Payment Element (cards).
// Native look, and Google Pay renders as a real express button (the embedded-iframe checkout suppressed
// it with Stripe Tax on). Confirmation is client-side via checkout.confirm() — Stripe.js handles 3DS.

const APPEARANCE: NonNullable<
  NonNullable<StripeCheckoutElementsSdkOptions["elementsOptions"]>["appearance"]
> = {
  theme: "stripe",
  variables: { colorPrimary: "#0074d4", borderRadius: "10px" },
};

export default function CheckoutForm({
  clientSecret,
  returnUrl,
  priceLabel,
  onPaid,
}: {
  clientSecret: string;
  returnUrl: string;
  priceLabel?: string;
  onPaid: () => void;
}) {
  // Pin the Stripe promise + options once so the provider never re-initializes (avoids field jank).
  const [stripePromise] = useState(() => getStripe());
  const [options] = useState<StripeCheckoutElementsSdkOptions>(() => ({
    clientSecret,
    elementsOptions: { appearance: APPEARANCE },
  }));

  return (
    <CheckoutElementsProvider stripe={stripePromise} options={options}>
      <Inner returnUrl={returnUrl} priceLabel={priceLabel} onPaid={onPaid} />
    </CheckoutElementsProvider>
  );
}

function Inner({
  returnUrl,
  priceLabel,
  onPaid,
}: {
  returnUrl: string;
  priceLabel?: string;
  onPaid: () => void;
}) {
  const result = useCheckoutElements();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false); // Payment Element fields loaded
  const [hasWallet, setHasWallet] = useState(false); // any express wallet available

  if (result.type === "loading") {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Spinner tone="dark" label="Loading secure checkout…" />
      </div>
    );
  }
  if (result.type === "error") {
    return <p className="p-6 text-sm text-red-600">{result.error.message}</p>;
  }

  const checkout = result.checkout;

  function handleResult(r: StripeCheckoutConfirmResult) {
    if (r.type === "error") {
      setErr(r.error.message || "Payment failed. Please try again.");
      setBusy(false);
      return;
    }
    // With redirect:"if_required", a success result means the payment completed inline (card / wallet).
    // Redirect-based methods (PayPal / some 3DS) leave the page and return via returnUrl instead.
    onPaid();
  }

  // Card form submit.
  async function payWithCard() {
    setBusy(true);
    setErr("");
    const r = await checkout.confirm({ returnUrl, redirect: "if_required" });
    handleResult(r);
  }

  // Wallet (Apple Pay / Google Pay / PayPal) express-button confirm.
  async function payWithWallet(event: StripeExpressCheckoutElementConfirmEvent) {
    setErr("");
    const r = await checkout.confirm({
      expressCheckoutConfirmEvent: event,
      returnUrl,
      redirect: "if_required",
    });
    handleResult(r);
  }

  function onWalletReady(e: StripeExpressCheckoutElementReadyEvent) {
    setHasWallet(!!e.availablePaymentMethods);
  }

  return (
    <div className="p-5 sm:p-6">
      {/* One-tap wallets (only renders buttons the browser actually supports) */}
      <ExpressCheckoutElement onReady={onWalletReady} onConfirm={payWithWallet} />

      {hasWallet ? (
        <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or pay by card
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      ) : null}

      {/* Card form — hidden behind a spinner until its fields load */}
      <div className="relative min-h-[220px]">
        {!ready ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner tone="dark" label="Loading secure card form…" />
          </div>
        ) : null}
        <div className={ready ? "" : "pointer-events-none opacity-0"}>
          <PaymentElement onReady={() => setReady(true)} />
        </div>
      </div>

      {err ? <p className="mt-4 text-sm text-red-600">{err}</p> : null}

      <button
        onClick={payWithCard}
        disabled={busy || !ready}
        className="mt-5 w-full rounded-xl bg-[#0074d4] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0063b8] disabled:opacity-50"
      >
        {busy ? "Processing…" : ready ? `Subscribe${priceLabel ? ` · ${priceLabel}` : ""}` : "Loading…"}
      </button>

      <p className="mt-3 text-center text-xs text-slate-400">
        Secured by Stripe · cancel anytime · 14-day money-back guarantee
      </p>
    </div>
  );
}
