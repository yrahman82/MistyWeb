import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container, Eyebrow, Button } from "@/components/ui";
import Breadcrumbs from "@/components/Breadcrumbs";
import { iconMap } from "@/components/Icons";
import { routers, prereqs, UDP_PROFILE_PATH, TCP_PROFILE_PATH } from "@/lib/routers";
import { pageMetadata } from "@/lib/seo";
import { type Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "routerPage" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/download/router",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function RouterLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "routerPage" });

  return (
    <Container className="py-14 sm:py-20">
      <Breadcrumbs
        items={[
          { name: t("crumbDownload"), href: "/download" },
          { name: t("crumbRouter"), href: "/download/router" },
        ]}
      />

      <div className="mt-6 max-w-3xl">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {t("h1")}
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-300">
          {t.rich("lede", {
            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
          })}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={UDP_PROFILE_PATH} variant="secondary" className="px-6">{t("udpProfile")}</Button>
          <Button href={TCP_PROFILE_PATH} variant="secondary" className="px-6">{t("tcpProfile")}</Button>
          <Button href="/servers" variant="secondary" className="px-6">{t("serverList")}</Button>
        </div>
      </div>

      {/* Before you start — one line + its own link per card */}
      <div className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t("beforeYouStart")}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {prereqs.map((p, i) => {
            const Icon = iconMap[p.icon as keyof typeof iconMap];
            return (
              <div key={p.title} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-sm font-semibold text-white">
                    <span className="text-slate-500">{i + 1}.</span> {p.title}
                  </h3>
                </div>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{p.detail}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {p.links.map((l) => (
                    <Link key={l.href} href={l.href} className="text-sm font-medium text-brand hover:underline">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Router picker */}
      <div className="mt-14">
        <h2 className="text-xl font-semibold text-white">{t("chooseYourRouter")}</h2>
        <p className="mt-2 text-slate-400">{t("chooseYourRouterBody")}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {routers.map((r) => (
            <Link
              key={r.slug}
              href={`/download/router/${r.slug}`}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-brand/50 hover:bg-brand/[0.06]"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-base font-bold"
                  style={{ backgroundColor: `${r.color}22`, color: r.color }}
                >
                  {r.mono}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-white">{r.name}</div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">{r.badge}</div>
                </div>
              </div>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{r.summary}</p>
              <span className="mt-4 text-sm font-medium text-brand group-hover:underline">{t("viewGuide")}</span>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
