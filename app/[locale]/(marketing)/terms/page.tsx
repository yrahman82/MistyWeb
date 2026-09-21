import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/routing";
import TermsBody from "@/components/legal/TermsBody";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termsPage" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/terms",
    title: t("metaTitle"),
    description: t("metaDescription", { name: site.name }),
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <section className="pt-20 pb-20">
      <Container>
        <TermsBody locale={locale} />
      </Container>
    </section>
  );
}
