"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/routing";

// Language picker. Each entry is a real locale-aware <Link> to the SAME path in that
// locale (crawlable + preserves the current page), so switching keeps you where you are.
export default function LanguageSwitcher() {
  const t = useTranslations("nav");
  const current = useLocale() as Locale;
  const pathname = usePathname(); // path without the locale prefix

  return (
    <details className="group relative">
      <summary
        className="flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-white"
        aria-label={t("language")}
      >
        <span className="text-base leading-none" aria-hidden>{localeFlags[current]}</span>
        <span>{localeNames[current]}</span>
        <svg className="h-3.5 w-3.5 opacity-70 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
        </svg>
      </summary>
      <div className="absolute right-0 top-full z-50 mt-2 max-h-80 w-44 overflow-y-auto rounded-xl border border-white/10 bg-ink py-1.5 shadow-xl shadow-black/40">
        {locales.map((l) => (
          <Link
            key={l}
            href={pathname}
            locale={l}
            hrefLang={l}
            aria-current={l === current ? "true" : undefined}
            className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-white/5 ${
              l === current ? "text-brand" : "text-slate-300 hover:text-white"
            }`}
          >
            <span className="text-base leading-none" aria-hidden>{localeFlags[l]}</span>
            {localeNames[l]}
          </Link>
        ))}
      </div>
    </details>
  );
}
