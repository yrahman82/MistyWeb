import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { site } from "@/lib/site";
import AppleEulaBody from "@/components/legal/AppleEulaBody";

// noindex: this is a licence document for people who already have the app, not a landing page.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "appleEulaPage" });
  return {
    title: t("metaTitle", { name: site.name }),
    robots: { index: false, follow: false },
  };
}

export default async function IosTermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AppleEulaBody />;
}
