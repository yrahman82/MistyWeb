"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { auth } from "@/lib/api";
import { Button } from "@/components/ui";
import { MenuIcon, CloseIcon } from "@/components/Icons";
import { Logo } from "@/components/Logo";

export default function Header() {
  const [open, setOpen] = useState(false);
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95">
      <nav
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
          <Logo className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight text-white">
            {site.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-sm font-medium transition-colors ${
                isActive(item.href) ? "text-brand" : "text-slate-300 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          {loggedIn ? (
            <Link
              href="/account"
              aria-current={isActive("/account") ? "page" : undefined}
              className={`text-sm font-medium transition-colors ${
                isActive("/account") ? "text-brand" : "text-slate-300 hover:text-white"
              }`}
            >
              Account
            </Link>
          ) : (
            <Link
              href={signInHref}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Sign in
            </Link>
          )}
          <Button href="/download" variant="primary" className="h-10 px-5">
            Get MistyVPN
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-white/10 bg-ink md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-4 sm:px-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-slate-200 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={loggedIn ? "/account" : signInHref}
              className="rounded-lg px-3 py-3 text-base font-medium text-slate-200 hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              {loggedIn ? "Account" : "Sign in"}
            </Link>
            <Button href="/download" variant="primary" className="mt-3 w-full">
              Get MistyVPN
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
