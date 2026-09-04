"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, localeNames, type Locale } from "@/i18n/routing";

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
        <svg className="h-4 w-4 opacity-80" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM4.06 7.5h2.2c.16-1.35.46-2.55.86-3.5A6.53 6.53 0 0 0 4.06 7.5Zm-.06 2.5c0-.34.03-.68.06-1h2.4a15 15 0 0 0 0 2h-2.4A7.8 7.8 0 0 1 4 10Zm.06 1.5A6.53 6.53 0 0 0 7.12 16c-.4-.95-.7-2.15-.86-3.5h-2.2Zm4.44 0c.19 1.7.6 3 .94 3.68v-3.68H8.5Zm2.5 0v3.68c.34-.67.75-1.98.94-3.68H11Zm2.44 0c-.16 1.35-.46 2.55-.86 3.5a6.53 6.53 0 0 0 3.06-3.5h-2.2Zm2.56-1.5h-2.4a15 15 0 0 0 0-2h2.4c.03.32.06.66.06 1s-.03.68-.06 1Zm-1.5-3.5a6.53 6.53 0 0 0-3.06-3.5c.4.95.7 2.15.86 3.5h2.2Zm-4.44 0V3.82c-.34.67-.75 1.98-.94 3.68H10Zm-2.5 0c.19-1.7.6-3.01.94-3.68V7.5H8.5Zm.03 1.5a13 13 0 0 0 0 2h2.94a13 13 0 0 0 0-2H8.53Z" clipRule="evenodd" />
        </svg>
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
            className={`block px-4 py-2 text-sm transition-colors hover:bg-white/5 ${
              l === current ? "text-brand" : "text-slate-300 hover:text-white"
            }`}
          >
            {localeNames[l]}
          </Link>
        ))}
      </div>
    </details>
  );
}
