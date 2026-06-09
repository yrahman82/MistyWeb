import type { Metadata } from "next";
import { Container, SectionHeading, Button, Eyebrow } from "@/components/ui";
import { CheckIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { plans, faqs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing — free tier + Premium from $2/month",
  description:
    "Simple MistyVPN pricing. Start free with daily minutes, or go Premium for unlimited, full-speed access on up to 10 devices. Subscriptions are managed in the app.",
  alternates: { canonical: "/pricing" },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Pricing", item: `${site.url}/pricing` },
  ],
};

// Subscriptions are display-only on the web for now (handled in-app via the
// App Store / Google Play), so every CTA points to the download section.
export default function PricingPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd} />

      <section className="pt-20 pb-10 text-center">
        <Container>
          <div className="flex justify-center">
            <Eyebrow>Pricing</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            One plan. Every device. No surprises.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Try it free, upgrade when you&apos;re ready. Subscriptions are
            purchased securely inside the app through the App Store or Google
            Play.
          </p>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <div className="grid items-stretch gap-6 lg:grid-cols-3">
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
                    Most popular
                  </span>
                ) : null}
                <h2 className="text-lg font-semibold text-white">{plan.name}</h2>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-bold tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className="mb-1 text-sm text-slate-400">
                    {plan.cadence}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-400">{plan.blurb}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-mint" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button
                    href="/#get-started"
                    variant={plan.highlight ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Prices shown in USD. Local pricing and taxes are set by the App Store
            and Google Play at checkout.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading center eyebrow="FAQ" title="Pricing questions" />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
            {faqs
              .filter((f) => f.q.includes("subscribe") || f.q.includes("devices") || f.q.includes("logs"))
              .map((f) => (
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
