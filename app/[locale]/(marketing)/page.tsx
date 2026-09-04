import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, SectionHeading, Button, Card, Eyebrow } from "@/components/ui";
import { iconMap } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

type Feature = { title: string; body: string };
type Step = { title: string; body: string };
type Stat = { value: string; label: string };
type Faq = { q: string; a: string };

// Icons stay in code (not translated); order matches common.features in the message catalog.
const featureIcons = [
  "eyeOff", "split", "shield", "bolt", "play", "lock", "key",
  "otp", "devices", "globe", "sparkle", "server", "power", "clock",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return { title: t("metaTitle") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const c = await getTranslations({ locale, namespace: "common" });
  const m = await getTranslations({ locale, namespace: "meta" });

  const stats = c.raw("stats") as Stat[];
  const features = c.raw("features") as Feature[];
  const steps = c.raw("steps") as Step[];
  const faqs = c.raw("faqs") as Faq[];

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "SecurityApplication",
    operatingSystem: "iOS, Android, macOS, Android TV",
    description: m("description"),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "1200" },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const websiteLd = { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url };

  return (
    <>
      <JsonLd data={softwareLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={websiteLd} />

      {/* Hero */}
      <section className="relative pt-10 pb-16 sm:pt-28 sm:pb-20">
        <Container className="text-center">
          <div className="flex justify-center">
            <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {t("hero.titleLead")}{" "}
            <span className="bg-gradient-to-r from-brand via-cyan-300 to-accent bg-clip-text text-transparent">
              {t("hero.titleHighlight")}
            </span>
            {t("hero.titleTrail")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {t("hero.subtitle")}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/download" className="px-8">{c("cta.getFree")}</Button>
            <Button href="/pricing" variant="secondary">{c("cta.seePlans")}</Button>
          </div>
          <p className="mt-4 text-sm text-slate-400">{c("moneyBack")}</p>

          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center">
                <dt className="text-3xl font-bold text-white">{s.value}</dt>
                <dd className="mt-1 text-xs text-slate-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Spotlight: Stealth + Split */}
      <section className="py-16">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="overflow-hidden p-8">
              <Eyebrow>{t("stealth.eyebrow")}</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{t("stealth.title")}</h2>
              <p className="mt-3 text-slate-300">
                {t.rich("stealth.body", { em: (chunks) => <em>{chunks}</em> })}
              </p>
              <p className="mt-4 text-sm text-slate-400">{t("stealth.note")}</p>
            </Card>
            <Card className="overflow-hidden p-8">
              <Eyebrow>{t("split.eyebrow")}</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{t("split.title")}</h2>
              <p className="mt-3 text-slate-300">{t("split.body")}</p>
              <p className="mt-4 text-sm text-slate-400">{t("split.note")}</p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Features grid */}
      <section id="features" className="py-16">
        <Container>
          <SectionHeading center eyebrow={t("features.eyebrow")} title={t("features.title")} body={t("features.body")} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = iconMap[featureIcons[i] as keyof typeof iconMap];
              return (
                <Card key={f.title}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{f.body}</p>
                </Card>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Button href="/features" variant="secondary">{c("cta.exploreFeatures")}</Button>
          </div>
        </Container>
      </section>

      {/* Spotlight: Password Manager + Authenticator */}
      <section className="py-8">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/15 via-ink-3 to-accent/15 px-6 py-12 sm:px-10">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <Eyebrow>{t("vault.eyebrow")}</Eyebrow>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t("vault.title")}</h2>
                <p className="mt-4 text-lg leading-8 text-slate-300">{t("vault.body")}</p>
                <div className="mt-7">
                  <Button href="/features" variant="secondary">{c("cta.exploreFeatures")}</Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: "key", title: t("vault.pmTitle"), body: t("vault.pmBody") },
                  { icon: "otp", title: t("vault.otpTitle"), body: t("vault.otpBody") },
                ].map((cc) => {
                  const Icon = iconMap[cc.icon as keyof typeof iconMap];
                  return (
                    <div key={cc.title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/20 text-brand">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-white">{cc.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{cc.body}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-16">
        <Container>
          <SectionHeading center eyebrow={t("how.eyebrow")} title={t("how.title")} />
          <ol className="mt-14 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-ink">{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Comparison teaser */}
      <section className="py-16">
        <Container>
          <Card className="flex flex-col items-center gap-6 px-6 py-12 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{t("compare.title")}</h2>
              <p className="mt-2 max-w-xl text-slate-300">{t("compare.body")}</p>
            </div>
            <Button href="/compare" className="shrink-0 px-8">{c("cta.compareVpns")}</Button>
          </Card>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <Container>
          <SectionHeading center eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-white">
                  {f.q}
                  <span className="text-brand transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="py-16">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand/20 via-ink-3 to-accent/20 px-6 py-16 text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t("ctaBand.title")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">{t("ctaBand.body")}</p>
            <div className="mt-8 flex justify-center">
              <Button href="/download" className="px-8">{c("cta.getFree")}</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
