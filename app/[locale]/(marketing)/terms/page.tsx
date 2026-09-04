import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Eyebrow } from "@/components/ui";
import { Prose } from "@/components/Prose";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

type Section = { heading: string; paragraphs: string[] };

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
  const t = await getTranslations({ locale, namespace: "termsPage" });

  const sections = t.raw("sections") as Section[];

  return (
    <section className="pt-20 pb-20">
      <Container>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("h1")}
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          {t("lastUpdated", { date: t("lastUpdatedDate") })}
        </p>

        <div className="mt-10">
          <Prose>
            <p>
              {t("intro", {
                name: site.name,
                company: site.company.legalName,
                registeredIn: site.company.registeredIn,
                number: site.company.number,
                office: site.company.registeredOffice,
              })}
            </p>

            {sections.map((s, i) => (
              <div key={s.heading}>
                <h2>{s.heading}</h2>
                {s.paragraphs.map((_, j) => (
                  <p key={j}>
                    {t(`sections.${i}.paragraphs.${j}`, {
                      name: site.name,
                      email: site.email,
                    })}
                  </p>
                ))}
              </div>
            ))}

            <h2>{t("contact.heading")}</h2>
            <p>
              {t.rich("contact.body", {
                email: site.email,
                link: (chunks) => <a href={`mailto:${site.email}`}>{chunks}</a>,
              })}
            </p>
          </Prose>
        </div>
      </Container>
    </section>
  );
}
