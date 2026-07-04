"use client";

import Link from "next/link";
import { useState } from "react";
import { nav, site } from "@/lib/site";
import { Button } from "@/components/ui";
import { MenuIcon, CloseIcon } from "@/components/Icons";
import { Logo } from "@/components/Logo";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
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
        <div className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Sign in
          </Link>
          <Button href="/#get-started" variant="primary" className="h-10 px-5">
            Get MistyVPN
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
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
              href="/login"
              className="rounded-lg px-3 py-3 text-base font-medium text-slate-200 hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
            <Button href="/#get-started" variant="primary" className="mt-3 w-full">
              Get MistyVPN
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
