import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, SectionHeading, Button, Eyebrow } from "@/components/ui";
import { CheckIcon } from "@/components/Icons";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPlans } from "@/lib/pricing";
import { pageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import PaymentMethods from "@/components/PaymentMethods";
import TrackEvent from "@/components/TrackEvent";

type Faq = { q: string; a: string };

// Pricing FAQs = the payment/devices/free subset of the shared common.faqs catalog, selected by
// index so the choice is locale-safe (filtering on translated question text would break per locale).
// Maps to "How many devices…", "Is there a free version?", "How do I pay?".
const pricingFaqIndexes = [2, 4, 5];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricingPage" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/pricing",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pricingPage" });
  const c = await getTranslations({ locale, namespace: "common" });

  // Prices come from the DB paywall (same source as the apps + checkout) — see lib/pricing.ts.
  const plans = await getPlans();
  const faqs = c.raw("faqs") as Faq[];
  const pricingFaqs = pricingFaqIndexes.map((i) => faqs[i]);

  return (
    <>
      {/* Funnel: top — "saw prices". */}
      <TrackEvent event="view_pricing" />
      <Breadcrumbs items={[{ name: t("breadcrumb"), href: "/pricing" }]} />

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

      <section className="pb-16">
        <Container>
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-8 ${
                  plan.highlight
                    ? "border-brand/50 bg-gradient-to-b from-brand/15 to-white/[0.03] shadow-[0_20px_60px_-20px_rgba(56,189,248,0.5)]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {plan.highlight ? (
                  <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-ink">
                    {t("bestValue")}
                  </span>
                ) : null}
                <h2 className="text-lg font-semibold text-white">{t(`plans.${plan.key}.name`)}</h2>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-bold tracking-tight text-white">
                    {plan.price}
                  </span>
                  {plan.key !== "free" ? (
                    <span className="mb-1 text-sm text-slate-400">
                      {t(`plans.${plan.key}.cadence`)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs font-medium text-brand">
                  {t(`plans.${plan.key}.note`, {
                    // Swap the DB "/mo" abbreviation for the proper localized month cadence.
                    perMonth: `${plan.perMonth.split("/")[0]}${t("plans.monthly.cadence")}`,
                  })}
                </p>
                <p className="mt-3 text-sm text-slate-400">{t(`plans.${plan.key}.blurb`)}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {(t.raw(`plans.${plan.key}.features`) as string[]).map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-mint" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button
                    href={plan.key === "free" ? "/download" : `/account?plan=${plan.key}`}
                    variant={plan.highlight ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {t(`plans.${plan.key}.cta`)}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {/* Payment methods + one-tap wallets + money-back guarantee */}
          <PaymentMethods />

          <p className="mt-8 text-center text-sm text-slate-500">
            {t("pricesNote")}
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading center eyebrow={t("faqEyebrow")} title={t("faqTitle")} />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
            {pricingFaqs.map((f) => (
              <details key={f.q} className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-white">
                  {f.q}
                  <span className="text-brand transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
