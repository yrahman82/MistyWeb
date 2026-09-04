import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Eyebrow } from "@/components/ui";
import { Prose } from "@/components/Prose";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "deleteAccountPage" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/delete-account",
    title: t("metaTitle"),
    description: t("metaDescription", { name: site.name }),
  });
}

const steps = ["step1", "step2", "step3", "step4"] as const;

export default async function DeleteAccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "deleteAccountPage" });

  const deletedItems = t.raw("deleted.items") as string[];

  const deleteMailto = `mailto:${site.email}?subject=${encodeURIComponent(
    "Delete my account",
  )}&body=${encodeURIComponent(
    `Please delete my ${site.name} account and associated data.\n\nAccount email: \n`,
  )}`;

  const strong = (chunks: ReactNode) => <strong>{chunks}</strong>;

  return (
    <section className="pt-20 pb-20">
      <Container>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("h1", { name: site.name })}
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          {t("lastUpdated", { date: t("lastUpdatedDate") })}
        </p>

        <div className="mt-10">
          <Prose>
            <p>{t("intro", { name: site.name })}</p>

            <h2>{t("inApp.heading")}</h2>
            <p>{t("inApp.intro", { name: site.name })}</p>
            <ul>
              {steps.map((k) => (
                <li key={k}>
                  {t.rich(`inApp.${k}`, { name: site.name, b: strong })}
                </li>
              ))}
            </ul>
            <p>{t("inApp.note")}</p>

            <h2>{t("email.heading")}</h2>
            <p>{t.rich("email.p1", { b: strong })}</p>
            <p>
              <a href={deleteMailto}>
                <strong>{t("email.linkText", { email: site.email })}</strong>
              </a>
            </p>

            <h2>{t("deleted.heading")}</h2>
            <p>{t("deleted.intro")}</p>
            <ul>
              {deletedItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p>{t("deleted.note", { name: site.name })}</p>

            <h2>{t("retained.heading")}</h2>
            <ul>
              <li>{t.rich("retained.billing", { b: strong })}</li>
              <li>{t.rich("retained.store", { b: strong })}</li>
            </ul>

            <h2>{t("questions.heading")}</h2>
            <p>
              {t.rich("questions.text", {
                email: site.email,
                link: (chunks) => <a href={`mailto:${site.email}`}>{chunks}</a>,
                privacy: (chunks) => <Link href="/privacy">{chunks}</Link>,
              })}
            </p>
          </Prose>
        </div>
      </Container>
    </section>
  );
}
