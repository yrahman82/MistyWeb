// Single source of truth for the payment-method brand badges we support, so the pricing band
// (PaymentMethods) and the checkout rail selector never drift. To add/remove a method (e.g. PayPal
// when it goes live in Stripe), change it HERE and both places update.
//
// NOTE: PayPal is intentionally absent — it isn't enabled in Stripe yet (verification + recurring
// approval pending). Add a <PayPal/> badge here + include it in WALLETS when it's live.

import type { ReactNode } from "react";

export function ApplePay() {
  return (
    <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-black px-3 text-white shadow-sm ring-1 ring-white/10">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M17.05 12.04c-.02-2.05 1.68-3.03 1.75-3.08-.95-1.4-2.44-1.59-2.97-1.61-1.26-.13-2.46.74-3.1.74-.64 0-1.63-.72-2.68-.7-1.38.02-2.65.8-3.36 2.03-1.43 2.49-.37 6.17 1.02 8.19.68.99 1.49 2.1 2.56 2.06 1.03-.04 1.42-.66 2.66-.66 1.24 0 1.59.66 2.68.64 1.11-.02 1.81-1 2.49-1.99.78-1.14 1.1-2.24 1.12-2.3-.02-.01-2.15-.83-2.17-3.29zM15.02 6.6c.56-.68.94-1.62.84-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.97 1.56-.85 2.48.9.07 1.82-.46 2.38-1.14z" />
      </svg>
      <span className="text-[13px] font-medium">Pay</span>
    </span>
  );
}

export function GooglePay() {
  return (
    <span className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-[#3c4043] shadow-sm ring-1 ring-black/10">
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.76-2.11-6.71-4.94H1.29v3.09A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.29 14.31A7.16 7.16 0 0 1 4.91 12c0-.8.14-1.58.38-2.31V6.6H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.4l4-3.09z" />
        <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.6l4 3.09C6.24 6.86 8.88 4.75 12 4.75z" />
      </svg>
      <span className="text-[13px] font-medium">Pay</span>
    </span>
  );
}

function CardChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-9 min-w-[46px] items-center justify-center rounded-lg bg-white px-2 shadow-sm ring-1 ring-black/10">
      {children}
    </span>
  );
}

export function Visa() {
  return (
    <CardChip>
      <span className="text-[13px] font-bold italic tracking-tight text-[#1434CB]">VISA</span>
    </CardChip>
  );
}

export function Mastercard() {
  return (
    <CardChip>
      <svg viewBox="0 0 40 24" className="h-5 w-8" aria-label="Mastercard">
        <circle cx="16" cy="12" r="8" fill="#EB001B" />
        <circle cx="24" cy="12" r="8" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    </CardChip>
  );
}

export function Amex() {
  return (
    <span className="inline-flex h-9 items-center justify-center rounded-lg bg-[#006FCF] px-2.5 shadow-sm ring-1 ring-black/10">
      <span className="text-[11px] font-bold tracking-wide text-white">AMEX</span>
    </span>
  );
}

// The full supported card/wallet set, in one row — used by the checkout rail selector.
export function SupportedBrandsRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <ApplePay />
      <GooglePay />
      <Visa />
      <Mastercard />
      <Amex />
    </div>
  );
}

// Supported stablecoins (brand colours). Central so the selector + anywhere else stay in sync.
export function Usdt() {
  return (
    <span className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#26A17B] px-2.5 text-white shadow-sm">
      <span className="text-[13px] font-bold">₮</span>
      <span className="text-[12px] font-semibold">USDT</span>
    </span>
  );
}

export function Usdc() {
  return (
    <span className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#2775CA] px-2.5 text-white shadow-sm">
      <span className="text-[13px] font-bold">$</span>
      <span className="text-[12px] font-semibold">USDC</span>
    </span>
  );
}

// Small network badge (brand colours) for the crypto coin picker.
export function NetworkBadge({ chain }: { chain: string }) {
  const m: Record<string, { label: string; cls: string }> = {
    tron: { label: "TRON", cls: "bg-[#EB0029] text-white" },
    bsc: { label: "BNB", cls: "bg-[#F0B90B] text-black" },
    ethereum: { label: "ETH", cls: "bg-[#627EEA] text-white" },
  };
  const n = m[chain] ?? { label: chain.toUpperCase(), cls: "bg-white/10 text-white" };
  return (
    <span className={`inline-flex h-6 items-center justify-center rounded-md px-2 text-[11px] font-bold ${n.cls}`}>
      {n.label}
    </span>
  );
}
