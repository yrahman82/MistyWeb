import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Button, Eyebrow, Card } from "@/components/ui";
import { iconMap } from "@/components/Icons";
import Breadcrumbs from "@/components/Breadcrumbs";
import DownloadGrid from "@/components/DownloadGrid";
import { pageMetadata } from "@/lib/seo";
import { type Locale } from "@/i18n/routing";

type Trust = { title: string; body: string };

// Icons stay in code (not translated); order matches downloadPage.trust in the message catalog.
const trustIcons = ["clock", "key", "check"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "downloadPage" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/download",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "downloadPage" });

  const trust = t.raw("trust") as Trust[];

  return (
    <>
      <Breadcrumbs items={[{ name: t("breadcrumb"), href: "/download" }]} />

      <section className="pt-20 pb-10 text-center">
        <Container>
          <div className="flex justify-center">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {t("subtitle")}
          </p>
        </Container>
      </section>

      <section className="pb-8">
        <Container className="max-w-3xl">
          <DownloadGrid />
          <p className="mt-6 text-center text-sm text-slate-400">
            {t.rich("storeNote", {
              manage: (chunks) => (
                <a href="/account" className="text-brand hover:underline">
                  {chunks}
                </a>
              ),
            })}
          </p>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="py-14">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {trust.map((item, i) => {
              const Icon = iconMap[trustIcons[i] as keyof typeof iconMap];
              return (
                <Card key={item.title}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-base font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand/20 via-ink-3 to-accent/20 px-6 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              {t("ctaBody")}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/register" className="px-8">
                {t("ctaCreate")}
              </Button>
              <Button href="/pricing" variant="secondary">
                {t("ctaPricing")}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
