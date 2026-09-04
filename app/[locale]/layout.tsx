import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

// Only these namespaces are consumed by client components (verified by grepping every
// "use client" file's useTranslations call). Server components read the full catalog via
// getTranslations, so we ship ONLY these to the browser — keeping the big server-only
// namespaces (home, common, privacyPage, termsPage, all marketing pages) out of the client
// bundle/HTML and off the hydration path. Add a namespace here if a NEW client component needs it.
const CLIENT_NAMESPACES = [
  "nav", "announce", "payments", "checkout", "crypto", "card", "downloadGrid",
  "notFound", "accountPage", "pricingPage", "loginPage", "registerPage",
  "resetPasswordPage", "tvLoginPage", "chat",
] as const;
import "../globals.css";
import { site } from "@/lib/site";
import Analytics from "@/components/Analytics";
import ChatWidget from "@/components/ChatWidget";
import { GA_ID } from "@/lib/analytics";
import { routing, htmlLang, type Locale } from "@/i18n/routing";
import { localeUrl, alternatesFor } from "@/lib/seo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

// Pre-render all locales at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = `${site.name} — ${t("tagline")}`;
  return {
    title: { default: title, template: `%s · ${site.name}` },
    description: t("description"),
    applicationName: site.name,
    keywords: t("keywords").split(",").map((k) => k.trim()),
    authors: [{ name: site.name }],
    creator: site.name,
    publisher: site.name,
    alternates: alternatesFor(locale as Locale),
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description: t("description"),
      url: localeUrl(locale as Locale),
      locale: htmlLang[locale as Locale]?.replace("-", "_") ?? "en",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: t("description"),
      creator: site.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    category: "technology",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // Ship only the client-needed namespaces to the browser (see CLIENT_NAMESPACES above).
  const allMessages = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in allMessages).map((ns) => [ns, allMessages[ns]]),
  );

  return (
    <html
      lang={htmlLang[locale as Locale]}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={clientMessages}>
          {children}
          <ChatWidget />
        </NextIntlClientProvider>
        {GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: false });
              `}
            </Script>
            <Suspense fallback={null}>
              <Analytics />
            </Suspense>
          </>
        ) : null}
      </body>
    </html>
  );
}
