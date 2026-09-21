import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";

// Deliberately BARE: no header, no announcement bar, no footer — nothing that could carry a user
// towards a purchase.
//
// These pages exist only so the apps can satisfy Apple guideline 3.1.2(c), which requires working
// Terms of Use and Privacy Policy links inside the binary. Pointing those links at the public
// /terms and /privacy pages would land a reviewer on the marketing layout, whose header has a
// pricing CTA and whose announcement bar advertises payment methods — i.e. an external purchase
// path reachable from the paywall, which is what got 1.0 rejected under 3.1.1. The documents are
// identical (same translation namespaces, same body components); only the chrome is gone.
export default async function LegalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="min-h-screen bg-ink text-white">
      <main className="mx-auto w-full max-w-3xl px-5 pt-12 pb-20">{children}</main>
    </div>
  );
}
