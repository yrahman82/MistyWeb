import { moneyBack } from "@/lib/site";

// Prominent "how you pay" trust band for the pricing page. The point users care about:
// they can check out in one tap with Apple Pay / Google Pay and NEVER type card details on our
// site — and if they'd rather use a card, we take all the major ones. Then the 14-day guarantee.

function ApplePay() {
  return (
    <span className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-black px-4 text-white shadow-sm ring-1 ring-white/10">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M17.05 12.04c-.02-2.05 1.68-3.03 1.75-3.08-.95-1.4-2.44-1.59-2.97-1.61-1.26-.13-2.46.74-3.1.74-.64 0-1.63-.72-2.68-.7-1.38.02-2.65.8-3.36 2.03-1.43 2.49-.37 6.17 1.02 8.19.68.99 1.49 2.1 2.56 2.06 1.03-.04 1.42-.66 2.66-.66 1.24 0 1.59.66 2.68.64 1.11-.02 1.81-1 2.49-1.99.78-1.14 1.1-2.24 1.12-2.3-.02-.01-2.15-.83-2.17-3.29zM15.02 6.6c.56-.68.94-1.62.84-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.97 1.56-.85 2.48.9.07 1.82-.46 2.38-1.14z" />
      </svg>
      <span className="text-[15px] font-medium">Pay</span>
    </span>
  );
}

function GooglePay() {
  return (
    <span className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-white px-4 text-[#3c4043] shadow-sm ring-1 ring-black/10">
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.76-2.11-6.71-4.94H1.29v3.09A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.29 14.31A7.16 7.16 0 0 1 4.91 12c0-.8.14-1.58.38-2.31V6.6H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.4l4-3.09z" />
        <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.6l4 3.09C6.24 6.86 8.88 4.75 12 4.75z" />
      </svg>
      <span className="text-[15px] font-medium">Pay</span>
    </span>
  );
}

// NOTE: PayPal badge intentionally removed from the pricing band until PayPal is live in Stripe
// (verification + recurring approval pending). Re-add <PayPal /> to the wallets row when it's enabled.

function BrandChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-9 min-w-[52px] items-center justify-center rounded-lg bg-white px-2.5 shadow-sm ring-1 ring-black/10">
      {children}
    </span>
  );
}

function Visa() {
  return (
    <BrandChip>
      <span className="text-[15px] font-bold italic tracking-tight text-[#1434CB]">VISA</span>
    </BrandChip>
  );
}

function Mastercard() {
  return (
    <BrandChip>
      <svg viewBox="0 0 40 24" className="h-6 w-9" aria-label="Mastercard">
        <circle cx="16" cy="12" r="8" fill="#EB001B" />
        <circle cx="24" cy="12" r="8" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    </BrandChip>
  );
}

function Amex() {
  return (
    <span className="inline-flex h-9 items-center justify-center rounded-lg bg-[#006FCF] px-2.5 shadow-sm ring-1 ring-black/10">
      <span className="text-[12px] font-bold tracking-wide text-white">AMEX</span>
    </span>
  );
}

export default function PaymentMethods() {
  return (
    <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
      <h2 className="text-xl font-semibold text-white sm:text-2xl">
        Check out in one tap — no card typing
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-300">
        Pay in a single tap with <span className="font-medium text-white">Apple&nbsp;Pay</span> or{" "}
        <span className="font-medium text-white">Google&nbsp;Pay</span> — your card details never
        touch our site. Prefer a card? We accept all major cards, on secure Stripe checkout.
      </p>

      {/* Wallets — the prominent, one-tap options */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <ApplePay />
        <GooglePay />
      </div>

      {/* Cards */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          or pay by card
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <Visa />
          <Mastercard />
          <Amex />
          <span className="text-sm text-slate-400">&amp; more</span>
        </div>
      </div>

      {/* Trust line */}
      <div className="mt-8 flex flex-col items-center justify-center gap-2 border-t border-white/10 pt-6 text-sm sm:flex-row sm:gap-3">
        <span className="inline-flex items-center gap-2 font-medium text-mint">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
          {moneyBack.headline}
        </span>
      </div>
      <p className="mx-auto mt-2 max-w-lg text-xs leading-6 text-slate-500">
        Not happy in your first {moneyBack.days} days? Email us for a full refund — no questions
        asked.
      </p>
    </div>
  );
}
