// Google Analytics 4 (gtag.js) helpers.
//
// GA4 captures geography (country/region/city), traffic source/medium/campaign, device and the
// referrer automatically — no code needed for those. This file adds (a) SPA-safe page_view on every
// client-side route change and (b) the purchase funnel events: view_pricing → begin_checkout → purchase.
//
// Enable by setting NEXT_PUBLIC_GA_ID (e.g. "G-XXXXXXXXXX") in the environment (Vercel → Project →
// Settings → Environment Variables). With it unset, every helper is a no-op and no script loads, so
// preview/local builds stay clean.

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

type Params = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// True only in the browser with gtag loaded and a GA id configured.
function ready(): boolean {
  return !!GA_ID && typeof window !== "undefined" && typeof window.gtag === "function";
}

/** Send a GA4 page_view for a client-side navigation (config uses send_page_view:false). */
export function pageview(url: string) {
  if (!ready()) return;
  window.gtag!("event", "page_view", {
    page_path: url,
    page_location: window.location.href,
    page_title: typeof document !== "undefined" ? document.title : undefined,
  });
}

/** Send an arbitrary GA4 event. Safe no-op when GA is not configured. */
export function gaEvent(name: string, params: Params = {}) {
  if (!ready()) return;
  window.gtag!("event", name, params);
}

// ── Purchase funnel ─────────────────────────────────────────────────────────
// "$3.99 / month" → 3.99 (best-effort; GA `value` is optional and only used for reporting).
function priceToNumber(price?: string | null): number | undefined {
  if (!price) return undefined;
  const m = price.replace(/,/g, "").match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : undefined;
}

/** Fired when the pricing table is shown — top of the funnel ("saw prices"). */
export function trackViewPricing() {
  gaEvent("view_pricing");
}

/** Fired when the user starts a checkout for a plan ("tried buying"). */
export function trackBeginCheckout(plan: string, price?: string | null) {
  gaEvent("begin_checkout", {
    currency: "USD",
    value: priceToNumber(price),
    items: [{ item_id: plan, item_name: plan }],
    plan,
  });
}

/** Fired once when a subscription is successfully activated ("purchase successful"). */
export function trackPurchase(plan: string | null, price?: string | null, transactionId?: string) {
  gaEvent("purchase", {
    transaction_id: transactionId ?? `${plan ?? "sub"}-${Date.now()}`,
    currency: "USD",
    value: priceToNumber(price),
    items: plan ? [{ item_id: plan, item_name: plan }] : undefined,
    plan,
  });
}
