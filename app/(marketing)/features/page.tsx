import type { Metadata } from "next";
import { Container, SectionHeading, Button, Card, Eyebrow } from "@/components/ui";
import { iconMap } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { features, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Features — Stealth Mode, Split Tunneling, no-logs & more",
  description:
    "Everything in MistyVPN: Stealth Mode that beats blocks, split tunneling, a strict no-logs promise, a kill switch, fast streaming and 30+ locations on every device.",
  alternates: { canonical: "/features" },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Features", item: `${site.url}/features` },
  ],
};

export default function FeaturesPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd} />

      <section className="pt-20 pb-12 text-center">
        <Container>
          <div className="flex justify-center">
            <Eyebrow>Features</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Powerful where it counts. Simple to use.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Every plan — even free — comes with the full toolkit. No add-ons, no
            asterisks.
          </p>
        </Container>
      </section>

      {/* Two hero features */}
      <section className="py-8">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="p-8">
              <Eyebrow>Stealth Mode</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                A VPN no one can see is a VPN
              </h2>
              <p className="mt-3 text-slate-300">
                Networks block VPNs by detecting their tell-tale traffic. Stealth
                Mode disguises your connection as everyday HTTPS, so MistyVPN
                slips through where other VPNs get caught — on public Wi-Fi, at
                work, or behind the strictest national firewalls.
              </p>
              <p className="mt-4 text-sm text-slate-400">
                On by default. Nothing to configure.
              </p>
            </Card>
            <Card className="p-8">
              <Eyebrow>Split Tunneling</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                Your tunnel, your rules
              </h2>
              <p className="mt-3 text-slate-300">
                Send only the apps you choose through the VPN and leave the rest
                on your normal connection. Stream privately while your banking app
                sees your real location and your games stay lag-free.
              </p>
              <p className="mt-4 text-sm text-slate-400">
                Pick apps and sites, app by app.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* All features */}
      <section className="py-14">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = iconMap[f.icon as keyof typeof iconMap];
              return (
                <Card key={f.title}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-white">
                    {f.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{f.body}</p>
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
            <Eyebrow>Under the hood</Eyebrow>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Next-generation protection, made effortless
            </h2>
            <p className="mt-3 max-w-3xl text-slate-300">
              Stealth Mode is powered by the most advanced anti-censorship
              technology available, so your connection blends in instead of
              standing out. Auto mode quietly picks the fastest, most reliable
              option for your network — you just tap connect. The clever part
              stays out of your way.
            </p>
          </Card>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Try it free today
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              The full toolkit, free to start — no credit card.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button href="/download" className="px-8">
                Get MistyVPN free
              </Button>
              <Button href="/pricing" variant="secondary">
                See pricing
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
