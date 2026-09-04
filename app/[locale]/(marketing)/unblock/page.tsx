import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Landing, type LandingSection, type LandingFaq } from "@/components/Landing";
import { pageMetadata } from "@/lib/seo";
import { type Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "unblockPage" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/unblock",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function UnblockPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "unblockPage" });

  return (
    <Landing
      slug="unblock"
      crumb={t("crumb")}
      eyebrow={t("eyebrow")}
      h1={t("h1")}
      lede={t("lede")}
      bullets={t.raw("bullets") as string[]}
      sections={t.raw("sections") as LandingSection[]}
      faqs={t.raw("faqs") as LandingFaq[]}
    />
  );
}
