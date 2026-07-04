import type { Metadata } from "next";
import { Container, SectionHeading, Button, Eyebrow } from "@/components/ui";
import { CheckIcon, CloseIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { comparison, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "MistyVPN vs NordVPN, ExpressVPN & Surfshark",
  description:
    "See how MistyVPN compares to NordVPN, ExpressVPN and Surfshark — a free tier, next-gen anti-block technology, and premium for less. Honest side-by-side.",
  alternates: { canonical: "/compare" },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Compare", item: `${site.url}/compare` },
  ],
};

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

export default function ComparePage() {
  const { providers, rows } = comparison;

  return (
    <>
      <JsonLd data={breadcrumbLd} />

      <section className="pt-20 pb-10 text-center">
        <Container>
          <div className="flex justify-center">
            <Eyebrow>Compare</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            MistyVPN vs the big names
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            A genuine free tier, next-generation anti-block technology, and
            premium for less than most. Here&apos;s the honest side-by-side.
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
                    Feature
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
            Prices shown are standard <strong>month-to-month</strong> rates — the
            headline prices competitors advertise typically require a 1–2 year
            commitment. Competitor details reflect publicly listed features and
            pricing as of June 2026 and may change — please verify on each
            provider&apos;s own website. Comparisons are provided in good faith
            for general guidance.
          </p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading
            eyebrow="Why people switch"
            title="What actually sets MistyVPN apart"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "A real free tier",
                "Most premium VPNs have no free option at all. MistyVPN lets you start for free and earn free minutes — no card, no commitment.",
              ],
              [
                "Built to beat blocks",
                "Stealth Mode uses next-generation anti-censorship technology, so MistyVPN keeps working on networks where mainstream VPNs are detected and blocked.",
              ],
              [
                "A fraction of the price",
                "Month-to-month, MistyVPN is $3.99 — versus roughly $13–15 the big names charge without a long contract. On the annual plan it's just $1.50/mo.",
              ],
            ].map(([t, b]) => (
              <div
                key={t}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="text-lg font-semibold text-white">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{b}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand/20 via-ink-3 to-accent/20 px-6 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              See the difference yourself
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Free to start — no card, nothing logged.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/#get-started" className="px-8">
                Get MistyVPN free
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
