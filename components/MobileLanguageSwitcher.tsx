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
        className="inline-flex h-10 items-center gap-1 rounded-lg px-1.5 text-white"
      >
        <span className="text-lg leading-none" aria-hidden>{localeFlags[current]}</span>
        <svg className="h-5 w-5 text-slate-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM4.06 7.5h2.2c.16-1.35.46-2.55.86-3.5A6.53 6.53 0 0 0 4.06 7.5Zm-.06 2.5c0-.34.03-.68.06-1h2.4a15 15 0 0 0 0 2h-2.4A7.8 7.8 0 0 1 4 10Zm.06 1.5A6.53 6.53 0 0 0 7.12 16c-.4-.95-.7-2.15-.86-3.5h-2.2Zm4.44 0c.19 1.7.6 3 .94 3.68v-3.68H8.5Zm2.5 0v3.68c.34-.67.75-1.98.94-3.68H11Zm2.44 0c-.16 1.35-.46 2.55-.86 3.5a6.53 6.53 0 0 0 3.06-3.5h-2.2Zm2.56-1.5h-2.4a15 15 0 0 0 0-2h2.4c.03.32.06.66.06 1s-.03.68-.06 1Zm-1.5-3.5a6.53 6.53 0 0 0-3.06-3.5c.4.95.7 2.15.86 3.5h2.2Zm-4.44 0V3.82c-.34.67-.75 1.98-.94 3.68H10Zm-2.5 0c.19-1.7.6-3.01.94-3.68V7.5H8.5Zm.03 1.5a13 13 0 0 0 0 2h2.94a13 13 0 0 0 0-2H8.53Z" clipRule="evenodd" />
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
