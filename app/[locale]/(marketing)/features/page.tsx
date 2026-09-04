import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Button, Card, Eyebrow } from "@/components/ui";
import { iconMap } from "@/components/Icons";
import Breadcrumbs from "@/components/Breadcrumbs";
import { features } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type GridItem = { title: string; body: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "featuresPage" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/features",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "featuresPage" });
  const c = await getTranslations({ locale, namespace: "common" });

  // Icons/order stay in code (from lib/site); text comes from the translated grid array, zipped by index.
  const grid = t.raw("grid") as GridItem[];

  return (
    <>
      <Breadcrumbs items={[{ name: t("breadcrumb"), href: "/features" }]} />

      <section className="pt-20 pb-12 text-center">
        <Container>
          <div className="flex justify-center">
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {t("hero.subtitle")}
          </p>
        </Container>
      </section>

      {/* Two hero features */}
      <section className="py-8">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="p-8">
              <Eyebrow>{t("stealth.eyebrow")}</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                {t("stealth.title")}
              </h2>
              <p className="mt-3 text-slate-300">
                {t("stealth.body")}
              </p>
              <p className="mt-4 text-sm text-slate-400">
                {t("stealth.note")}
              </p>
            </Card>
            <Card className="p-8">
              <Eyebrow>{t("split.eyebrow")}</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                {t("split.title")}
              </h2>
              <p className="mt-3 text-slate-300">
                {t("split.body")}
              </p>
              <p className="mt-4 text-sm text-slate-400">
                {t("split.note")}
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* All features */}
      <section className="py-14">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = iconMap[f.icon as keyof typeof iconMap];
              const item = grid[i];
              return (
                <Card key={f.icon}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-white">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Under the hood — light credibility, not jargon-heavy */}
      <section className="py-12">
        <Container>
          <Card className="p-8">
            <Eyebrow>{t("underHood.eyebrow")}</Eyebrow>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              {t("underHood.title")}
            </h2>
            <p className="mt-3 max-w-3xl text-slate-300">
              {t("underHood.body")}
            </p>
          </Card>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              {t("cta.body")}
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button href="/download" className="px-8">
                {c("cta.getFree")}
              </Button>
              <Button href="/pricing" variant="secondary">
                {c("cta.seePlans")}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
