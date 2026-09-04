import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

// Org-level structured data, present on every marketing page.
const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  sameAs: [`https://twitter.com/${site.twitter.replace("@", "")}`],
};

export default async function MarketingLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Enable static rendering for this segment: the server-rendered Footer reads translations,
  // so the locale must be set here or next-intl falls back to dynamic rendering for the subtree.
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-ink text-white">
      {/* ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 40rem at 70% -10%, rgba(56,189,248,0.18), transparent 60%)," +
            "radial-gradient(50rem 30rem at 10% 10%, rgba(129,140,248,0.14), transparent 55%)," +
            "linear-gradient(180deg, #0a1628 0%, #060d1a 100%)",
        }}
      />
      <JsonLd data={orgLd} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
