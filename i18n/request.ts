import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

// Deep-merge a locale catalog OVER English. next-intl loads exactly one catalog per request, so a key
// present in en.json but missing from <locale>.json used to render the raw key path in the UI. Merging
// means a partially-translated (or newly-extended) catalog degrades to English for just the missing
// strings instead of leaking "pricingPage.plans.annual.cta" onto the page.
function deepMerge(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [k, v] of Object.entries(override)) {
    const b = out[k];
    out[k] =
      b && v && typeof b === "object" && typeof v === "object" && !Array.isArray(b) && !Array.isArray(v)
        ? deepMerge(b as Messages, v as Messages)
        : v;
  }
  return out;
}

// Loads the per-request locale + its message catalog. Falls back to the default locale for any
// unknown/unsupported locale. Messages live in /messages/<locale>.json (file-based — no DB).
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const en = (await import(`../messages/${routing.defaultLocale}.json`)).default as Messages;
  if (locale === routing.defaultLocale) return { locale, messages: en };

  const localeMessages = (await import(`../messages/${locale}.json`)).default as Messages;
  return { locale, messages: deepMerge(en, localeMessages) };
});
