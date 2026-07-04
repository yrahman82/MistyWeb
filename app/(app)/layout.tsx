import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site } from "@/lib/site";

// Account/auth pages: not indexable, minimal chrome.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50rem 32rem at 70% -10%, rgba(56,189,248,0.16), transparent 60%), linear-gradient(180deg, #0a1628 0%, #060d1a 100%)",
        }}
      />
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
            <Logo className="h-8 w-8" />
            <span className="text-lg font-semibold tracking-tight">{site.name}</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-5 py-12 sm:items-center">
        {children}
      </main>
    </div>
  );
}
