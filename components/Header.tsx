"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { auth } from "@/lib/api";
import { Button } from "@/components/ui";
import { MenuIcon, CloseIcon } from "@/components/Icons";
import { Logo } from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileLanguageSwitcher from "@/components/MobileLanguageSwitcher";

// Nav structure lives in code (hrefs never change); labels come from the `nav` message catalog.
type NavEntry = { key: string; href: string; children?: { key: string; href: string }[] };
const navItems: NavEntry[] = [
  { key: "home", href: "/" },
  { key: "features", href: "/features" },
  { key: "pricing", href: "/pricing" },
  { key: "compare", href: "/compare" },
  { key: "noLogs", href: "/no-logs" },
  { key: "download", href: "/download" },
  {
    key: "support",
    href: "/support",
    children: [
      { key: "contactUs", href: "/support" },
      { key: "serverList", href: "/servers" },
    ],
  },
];

export default function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  // usePathname from i18n/navigation returns the path WITHOUT the locale prefix,
  // so these comparisons against "/features" etc. work in every locale.
  const pathname = usePathname();
  const signInHref = `/login?next=${encodeURIComponent(pathname || "/")}`;

  // Highlight the current page in the menu. Home only matches exactly; others match the
  // section (so /features and any /features/* both light up "Features").
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  // Reflect auth state (localStorage). Re-check on navigation so it updates
  // after sign-in/out. Starts false to match SSR, then corrects on mount.
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(auth.isLoggedIn);
  }, [pathname]);

  return (
    <header className="border-b border-white/10 bg-ink/95">
      <nav
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Left group: logo + nav together (keeps them spaced, and left-aligns the nav so long
            translated labels never collide with the logo the way justify-between allowed). */}
        <div className="flex items-center">
        <Link href="/" className="flex items-center gap-2.5 xl:mr-8" aria-label={`${site.name} home`}>
          <Logo className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight text-white">
            {site.name}
          </span>
        </Link>

        {/* Desktop nav (collapses to the hamburger below xl so longer-label languages fit) */}
        <div className="hidden items-center gap-5 xl:flex">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.key} className="group relative">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center gap-1 whitespace-nowrap text-sm font-medium transition-colors ${
                    isActive(item.href) ? "text-brand" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {t(item.key)}
                  <svg className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
                  </svg>
                </Link>
                {/* pt-2 keeps the hover bridge so the menu doesn't close in the gap */}
                <div className="absolute left-1/2 top-full hidden -translate-x-1/2 pt-2 group-hover:block">
                  <div className="min-w-[11rem] rounded-xl border border-white/10 bg-ink py-1.5 shadow-xl shadow-black/40">
                    {item.children.map((c) => (
                      <Link
                        key={c.key}
                        href={c.href}
                        aria-current={isActive(c.href) ? "page" : undefined}
                        className={`block px-4 py-2 text-sm transition-colors hover:bg-white/5 ${
                          isActive(c.href) ? "text-brand" : "text-slate-300 hover:text-white"
                        }`}
                      >
                        {t(c.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  isActive(item.href) ? "text-brand" : "text-slate-300 hover:text-white"
                }`}
              >
                {t(item.key)}
              </Link>
            )
          )}
        </div>
        </div>

        <div className="hidden items-center gap-5 xl:flex">
          <LanguageSwitcher />
          {loggedIn ? (
            <Link
              href="/account"
              aria-current={isActive("/account") ? "page" : undefined}
              className={`text-sm font-medium transition-colors ${
                isActive("/account") ? "text-brand" : "text-slate-300 hover:text-white"
              }`}
            >
              {t("account")}
            </Link>
          ) : (
            <Link
              href={signInHref}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {t("signInUp")}
            </Link>
          )}
          <Button href="/download" variant="primary" className="h-10 px-5">
            {t("getApp")}
          </Button>
        </div>

        {/* Mobile: language picker (bottom sheet) + menu toggle */}
        <div className="flex items-center gap-1 xl:hidden">
          <MobileLanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-white/10 bg-ink xl:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-4 sm:px-6">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.key}>
                  <Link
                    href={item.href}
                    className="rounded-lg px-3 py-3 text-base font-medium text-slate-200 hover:bg-white/5"
                    onClick={() => setOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                  <div className="ml-3 flex flex-col border-l border-white/10 pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.key}
                        href={c.href}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5"
                        onClick={() => setOpen(false)}
                      >
                        {t(c.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-base font-medium text-slate-200 hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              )
            )}
            <Link
              href={loggedIn ? "/account" : signInHref}
              className="rounded-lg px-3 py-3 text-base font-medium text-slate-200 hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              {loggedIn ? t("account") : t("signInUp")}
            </Link>
            <Button href="/download" variant="primary" className="mt-3 w-full">
              {t("getApp")}
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
