import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, SectionHeading, Button, Eyebrow } from "@/components/ui";
import { CheckIcon, CloseIcon } from "@/components/Icons";
import Breadcrumbs from "@/components/Breadcrumbs";
import { comparison } from "@/lib/site";
import { getMonthlyPrice, getAnnualPerMonth } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type TableRow = { label: string; values: string[] };

function Cell({ value, isUs }: { value: boolean | string; isUs: boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <CheckIcon className={`mx-auto h-5 w-5 ${isUs ? "text-mint" : "text-slate-300"}`} />
    ) : (
      <CloseIcon className="mx-auto h-5 w-5 text-slate-600" />
    );
  }
  return (
    <span className={`text-sm ${isUs ? "font-semibold text-white" : "text-slate-300"}`}>
      {value}
    </span>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "comparePage" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/compare",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "comparePage" });
  const c = await getTranslations({ locale, namespace: "common" });

  const { providers } = comparison;
  // MistyVPN's monthly price is DB-driven — override the static value so the table can't drift
  // from what checkout charges (see lib/pricing.ts).
  const monthlyPrice = await getMonthlyPrice();
  const annualPerMonth = await getAnnualPerMonth();

  // Booleans + which-column-is-us stay in code (comparison.rows); the translatable label + string
  // cell values come from the catalog, zipped by index onto the code data structure.
  const tRows = t.raw("table.rows") as TableRow[];
  const rows = comparison.rows.map((row, ri) => {
    const tr = tRows[ri];
    const values = row.values.map((v, ci) => (typeof v === "boolean" ? v : tr.values[ci]));
    if (row.label === "Monthly price") values[0] = monthlyPrice;
    return { label: tr.label, values };
  });

  const switchCards = [
    { title: t("switch.cards.freeTier.title"), body: t("switch.cards.freeTier.body") },
    { title: t("switch.cards.vault.title"), body: t("switch.cards.vault.body") },
    { title: t("switch.cards.antiBlock.title"), body: t("switch.cards.antiBlock.body") },
    {
      title: t("switch.cards.price.title"),
      body: t("switch.cards.price.body", { monthlyPrice, annualPerMonth }),
    },
  ];

  return (
    <>
      <Breadcrumbs items={[{ name: t("breadcrumb"), href: "/compare" }]} />

      <section className="pt-20 pb-10 text-center">
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

      <section className="pb-12">
        <Container>
          {/* horizontal scroll on small screens */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
            <table className="w-full min-w-[640px] border-collapse text-center">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-sm font-medium text-slate-400">
                    {t("table.featureHeader")}
                  </th>
                  {providers.map((p, i) => (
                    <th
                      key={p}
                      className={`p-4 text-sm font-semibold ${
                        i === 0 ? "text-brand" : "text-white"
                      }`}
                    >
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr
                    key={row.label}
                    className={ri % 2 ? "bg-white/[0.02]" : ""}
                  >
                    <td className="p-4 text-left text-sm text-slate-300">
                      {row.label}
                    </td>
                    {row.values.map((v, ci) => (
                      <td
                        key={ci}
                        className={`p-4 ${ci === 0 ? "bg-brand/[0.06]" : ""}`}
                      >
                        <Cell value={v} isUs={ci === 0} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            {t.rich("table.footnote", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading
            eyebrow={t("switch.eyebrow")}
            title={t("switch.title")}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {switchCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{card.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand/20 via-ink-3 to-accent/20 px-6 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              {t("ctaBand.title")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              {t("ctaBand.body")}
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/download" className="px-8">
                {c("cta.getFree")}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
