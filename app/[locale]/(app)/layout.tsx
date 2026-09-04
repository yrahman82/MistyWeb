import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";

// Account/auth pages: not indexable. Use the same top menu as the marketing site
// (Header is auth-aware — shows "Account" when signed in, "Sign in" otherwise).
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
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <main className="flex flex-1 items-start justify-center px-5 py-12 sm:items-center">
        {children}
      </main>
    </div>
  );
}
