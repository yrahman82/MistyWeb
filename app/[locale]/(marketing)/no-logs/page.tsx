import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, SectionHeading, Button, Card, Eyebrow } from "@/components/ui";
import { EyeOffIcon, LockIcon, ServerIcon } from "@/components/Icons";
import { Link } from "@/i18n/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

type Point = { title: string; body: string };

// Icons stay in code (not translated); order matches noLogsPage.points in the message catalog.
const pointIcons = [EyeOffIcon, LockIcon, ServerIcon];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "noLogsPage" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/no-logs",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function NoLogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "noLogsPage" });
  const c = await getTranslations({ locale, namespace: "common" });

  const points = t.raw("points") as Point[];

  return (
    <>
      <Breadcrumbs items={[{ name: t("breadcrumb"), href: "/no-logs" }]} />

      <section className="pt-20 pb-10 text-center">
        <Container>
          <div className="flex justify-center">
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            {t("hero.subtitle", { brand: site.name })}
          </p>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {points.map((p, i) => {
              const Icon = pointIcons[i];
              return (
                <Card key={p.title}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-white">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{p.body}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading
            eyebrow={t("keep.eyebrow")}
            title={t("keep.title")}
            body={t("keep.body")}
          />
          <div className="mt-8 max-w-3xl space-y-4 leading-7 text-slate-300">
            <p>{t("keep.p1")}</p>
            <p>{t("keep.p2")}</p>
            <p className="text-sm text-slate-500">
              {t.rich("keep.p3", {
                link: (chunks) => (
                  <Link href="/privacy" className="text-brand underline underline-offset-2">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Card className="px-6 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              {t("cta.title")}
            </h2>
            <div className="mt-8 flex justify-center">
              <Button href="/download" className="px-8">
                {c("cta.getFree")}
              </Button>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
