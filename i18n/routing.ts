import { defineRouting } from "next-intl/routing";

// The locales the website ships (mirrors the app's language set). English is the default and lives at
// the root (no /en prefix); every other locale is prefixed (/es, /de, /zh …).
// `fa` (Persian) is the FIRST RTL locale — Iran became the dominant organic market (Sep 2026) and the
// web checkout is the only rail they can pay through, so it had to stop being English-only. Direction
// comes from `rtlLocales` below -> <html dir> in [locale]/layout.tsx; the CSS uses Tailwind LOGICAL
// properties (ms-/me-/ps-/pe-/text-start/start-/end-) so nothing needs per-locale branching.
// ar/ur are still absent here (app-only) — they can be added to `locales` + `rtlLocales` with no other
// code change now that the RTL plumbing exists.
export const locales = [
  "en", // English (default)
  "fa", // Persian / Farsi (RTL)
  "zh", // Chinese (Simplified)
  "hi", // Hindi
  "bn", // Bengali
  "es", // Spanish
  "fr", // French
  "de", // German
  "ru", // Russian
  "pt", // Portuguese (Brazil)
  "it", // Italian
  "tr", // Turkish
  "ja", // Japanese
  "ko", // Korean
  "nl", // Dutch
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Human-readable names for the language switcher (native name shown to the user).
export const localeNames: Record<Locale, string> = {
  en: "English",
  fa: "فارسی",
  zh: "中文",
  hi: "हिन्दी",
  bn: "বাংলা",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ru: "Русский",
  pt: "Português",
  it: "Italiano",
  tr: "Türkçe",
  ja: "日本語",
  ko: "한국어",
  nl: "Nederlands",
};

// A representative flag emoji per language, shown next to the name in the language pickers.
// (Flags map to a country, not a language — these are the conventional choices for each.)
export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  fa: "🇮🇷",
  zh: "🇨🇳",
  hi: "🇮🇳",
  bn: "🇧🇩",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  ru: "🇷🇺",
  pt: "🇧🇷",
  it: "🇮🇹",
  tr: "🇹🇷",
  ja: "🇯🇵",
  ko: "🇰🇷",
  nl: "🇳🇱",
};

// BCP-47 tags for <html lang> / hreflang (a couple differ from the short locale code).
export const htmlLang: Record<Locale, string> = {
  en: "en",
  fa: "fa",
  zh: "zh-Hans",
  hi: "hi",
  bn: "bn",
  es: "es",
  fr: "fr",
  de: "de",
  ru: "ru",
  pt: "pt-BR",
  it: "it",
  tr: "tr",
  ja: "ja",
  ko: "ko",
  nl: "nl",
};

// Locales written right-to-left. Drives <html dir> only — there is no layout mirroring code to write,
// because the stylesheets use logical properties.
export const rtlLocales = new Set<Locale>(["fa"]);

export function isRtl(locale: string): boolean {
  return rtlLocales.has(locale as Locale);
}

export function dirFor(locale: string): "rtl" | "ltr" {
  return isRtl(locale) ? "rtl" : "ltr";
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  // English at "/", others at "/<locale>" — best for SEO (clean canonical English URLs, no redirect churn).
  localePrefix: "as-needed",
  // We drive language via URL only (no auto-redirect by Accept-Language) so canonical URLs stay stable for SEO.
  localeDetection: false,
});
