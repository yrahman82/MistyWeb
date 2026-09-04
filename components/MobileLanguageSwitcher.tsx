"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/routing";

// Mobile language picker: a globe button in the top bar that opens a bottom sheet.
// The sheet is dismissable by the close button, the backdrop, or Esc, and animates in/out.
export default function MobileLanguageSwitcher() {
  const t = useTranslations("nav");
  const current = useLocale() as Locale;
  const pathname = usePathname(); // path without the locale prefix
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false); // drives the slide/fade transition

  const close = useCallback(() => {
    setEntered(false);
    const id = setTimeout(() => setOpen(false), 300); // let the exit transition play
    return () => clearTimeout(id);
  }, []);

  // Trigger the enter transition on the next frame after mounting.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Lock body scroll + close on Esc while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("language")}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 pl-2.5 pr-2 text-white transition-colors hover:bg-white/10"
      >
        <span className="text-base leading-none" aria-hidden>{localeFlags[current]}</span>
        <svg className="h-3.5 w-3.5 text-slate-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label={t("language")}>
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${entered ? "opacity-100" : "opacity-0"}`}
          />
          {/* Sheet */}
          <div
            className={`absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-white/10 bg-ink pb-[env(safe-area-inset-bottom)] shadow-2xl transition-transform duration-300 ease-out ${entered ? "translate-y-0" : "translate-y-full"}`}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3">
              <span className="h-1.5 w-10 rounded-full bg-white/20" />
            </div>
            <div className="flex items-center justify-between px-5 pb-2 pt-3">
              <h2 className="text-base font-semibold text-white">{t("language")}</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <ul className="px-2 pb-4">
              {locales.map((l) => (
                <li key={l}>
                  <Link
                    href={pathname}
                    locale={l}
                    hrefLang={l}
                    onClick={close}
                    aria-current={l === current ? "true" : undefined}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-base transition-colors ${
                      l === current ? "bg-brand/10 text-brand" : "text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl leading-none" aria-hidden>{localeFlags[l]}</span>
                      {localeNames[l]}
                    </span>
                    {l === current ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
