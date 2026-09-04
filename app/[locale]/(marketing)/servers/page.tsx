import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Eyebrow } from "@/components/ui";
import { CheckIcon } from "@/components/Icons";
import Breadcrumbs from "@/components/Breadcrumbs";
import { serverLocations, serverProtocols } from "@/lib/servers";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "serversPage" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/servers",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

const countries = new Set(serverLocations.map((s) => s.country)).size;

export default async function ServersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "serversPage" });

  return (
    <Container className="py-16 sm:py-20">
      <Breadcrumbs
        items={[
          { name: t("breadcrumbSupport"), href: "/support" },
          { name: t("breadcrumbServerList"), href: "/servers" },
        ]}
      />
      <div className="mt-6 max-w-3xl">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-slate-300">
          {t.rich("intro", {
            locations: serverLocations.length,
            countries,
            strong: (chunks) => <strong className="text-white">{chunks}</strong>,
          })}
        </p>
      </div>

      {/* Desktop: full matrix table (horizontal scroll only as a last resort on tablets) */}
      <div className="mt-10 hidden overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] lg:block">
        <table className="w-full min-w-[860px] border-collapse text-center">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-left text-sm font-medium text-slate-400">{t("colLocation")}</th>
              <th className="p-4 text-left text-sm font-medium text-slate-400">{t("colHostname")}</th>
              {serverProtocols.map((p) => (
                <th key={p} className="whitespace-nowrap p-4 text-sm font-medium text-slate-400">
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {serverLocations.map((s) => (
              <tr key={s.host} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="p-4 text-left">
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg leading-none" aria-hidden>{s.flag}</span>
                    <span>
                      <span className="block text-sm font-medium text-white">{s.city}</span>
                      <span className="block text-xs text-slate-400">{s.country}</span>
                    </span>
                  </span>
                </td>
                <td className="p-4 text-left">
                  <code className="rounded bg-white/5 px-2 py-1 text-xs text-slate-200">{s.host}</code>
                </td>
                {serverProtocols.map((p) => (
                  <td key={p} className="p-4">
                    <CheckIcon className="mx-auto h-5 w-5 text-emerald-400" />
                    <span className="sr-only">{t("protocolSupported", { protocol: p })}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: one card per location — no horizontal scroll; protocols as chips */}
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:hidden">
        {serverLocations.map((s) => (
          <div key={s.host} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl leading-none" aria-hidden>{s.flag}</span>
              <div>
                <div className="text-sm font-semibold text-white">{s.city}</div>
                <div className="text-xs text-slate-400">{s.country}</div>
              </div>
            </div>
            <code className="mt-3 block overflow-x-auto rounded bg-white/5 px-2 py-1.5 text-xs text-slate-200">
              {s.host}
            </code>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {serverProtocols.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300"
                >
                  <CheckIcon className="h-3 w-3" />
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {t("footerNote")}
      </p>
    </Container>
  );
}
