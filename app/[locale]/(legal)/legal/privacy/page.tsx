import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PrivacyBody from "@/components/legal/PrivacyBody";

// noindex: this is the same document as /privacy, which is the canonical, indexed one. Keeping the
// app copy out of the index avoids duplicate content and keeps it off search results entirely.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage" });
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

export default async function AppPrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyBody locale={locale} />;
}
