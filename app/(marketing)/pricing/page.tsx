import type { Metadata } from "next";
import { Container, SectionHeading, Button, Eyebrow } from "@/components/ui";
import { CheckIcon } from "@/components/Icons";
import Breadcrumbs from "@/components/Breadcrumbs";
import { faqs } from "@/lib/site";
import { getPlans } from "@/lib/pricing";
import PaymentMethods from "@/components/PaymentMethods";

export const metadata: Metadata = {
  title: "Pricing — free to start, Premium from $2.50/mo",
  description:
    "Simple MistyVPN pricing. Start free and earn free minutes, or go Premium from $2.50/month for unlimited speed on up to 10 devices. Manage it all in the app.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  // Prices come from the DB paywall (same source as the apps + checkout) — see lib/pricing.ts.
  const plans = await getPlans();

  return (
    <>
      <Breadcrumbs items={[{ name: "Pricing", href: "/pricing" }]} />

      <section className="pt-20 pb-10 text-center">
        <Container>
          <div className="flex justify-center">
            <Eyebrow>Pricing</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Simple pricing. Everything included.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Start free, upgrade when you&apos;re ready. Every plan includes the
            full feature set — Stealth Mode, split tunneling and all 40+
            locations.
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
                    Best value
                  </span>
                ) : null}
                <h2 className="text-lg font-semibold text-white">{plan.name}</h2>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-bold tracking-tight text-white">
                    {plan.price}
                  </span>
                  {plan.cadence ? (
                    <span className="mb-1 text-sm text-slate-400">
                      {plan.cadence}
                    </span>
                  ) : null}
                </div>
                {plan.note ? (
                  <p className="mt-1 text-xs font-medium text-brand">{plan.note}</p>
                ) : null}
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
                    href={plan.key === "free" ? "/download" : `/account?plan=${plan.key}`}
                    variant={plan.highlight ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {/* Payment methods + one-tap wallets + money-back guarantee */}
          <PaymentMethods />

          <p className="mt-8 text-center text-sm text-slate-500">
            Prices in USD, billed through secure checkout on the web or via the
            App Store / Google Play; taxes and local pricing are applied at
            checkout. Cancel any time.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading center eyebrow="FAQ" title="Pricing questions" />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
            {faqs
              .filter(
                (f) =>
                  f.q.includes("pay") ||
                  f.q.includes("devices") ||
                  f.q.includes("free"),
              )
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
