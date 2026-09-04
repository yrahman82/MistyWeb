import { defineRouting } from "next-intl/routing";

// The 14 LTR locales the website ships (mirrors the app's language set, minus ar/ur — we deliberately
// skip the two RTL languages to avoid RTL layout complexity on the marketing site). English is the
// default and lives at the root (no /en prefix); every other locale is prefixed (/es, /de, /zh …).
export const locales = [
  "en", // English (default)
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

// BCP-47 tags for <html lang> / hreflang (a couple differ from the short locale code).
export const htmlLang: Record<Locale, string> = {
  en: "en",
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

export const routing = defineRouting({
  locales,
  defaultLocale,
  // English at "/", others at "/<locale>" — best for SEO (clean canonical English URLs, no redirect churn).
  localePrefix: "as-needed",
  // We drive language via URL only (no auto-redirect by Accept-Language) so canonical URLs stay stable for SEO.
  localeDetection: false,
});
