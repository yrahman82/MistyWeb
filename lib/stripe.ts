import { loadStripe, type Stripe } from "@stripe/stripe-js";

// Singleton — load Stripe.js once.
let promise: Promise<Stripe | null> | null = null;
export function getStripe() {
  if (!promise) {
    promise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");
  }
  return promise;
}

// Locales Stripe's own UI (Checkout Sessions / Elements) can render — its 34 supported languages,
// per https://docs.stripe.com/js/appendix/supported_locales. Our site ships locales Stripe does NOT
// cover (today: fa), where Stripe silently falls back to ENGLISH.
//
// That matters for direction, not just wording: an English payment form inherits `dir` from the page,
// so inside an RTL locale Stripe's English labels, card fields and error text render right-aligned with
// the punctuation flipped. Wrapping the Stripe surface in the direction Stripe is ACTUALLY rendering
// keeps that fallback looking correct.
const STRIPE_UI_LOCALES = new Set([
  "bg","cs","da","de","el","en","es","et","fi","fil","fr","hr","hu","id","it","ja","ko","lt","lv",
  "ms","mt","nb","nl","pl","pt","ro","ru","sk","sl","sv","th","tr","vi","zh",
]);

export function stripeRendersLocale(locale: string): boolean {
  return STRIPE_UI_LOCALES.has(locale);
}

/** `dir` for a Stripe-rendered surface: the page's own direction when Stripe speaks the language,
 *  otherwise "ltr" — because Stripe is showing English. */
export function stripeDir(locale: string, pageDir: "rtl" | "ltr"): "rtl" | "ltr" {
  return stripeRendersLocale(locale) ? pageDir : "ltr";
}
