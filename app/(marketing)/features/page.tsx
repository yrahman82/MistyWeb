import type { Metadata } from "next";
import { Container, SectionHeading, Button, Card, Eyebrow } from "@/components/ui";
import { iconMap } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { features, protocols, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Features — protocols, no-logs, split tunneling & more",
  description:
    "MistyVPN features: censorship-resistant VLESS+Reality, Hysteria2 and WireGuard, strict no-logs, kill switch, split tunneling, streaming, and apps for every device.",
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
            Privacy and speed, without compromise
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Every feature in {site.name} exists for one of two reasons: to keep
            you private, or to keep you connected when the network is working
            against you.
          </p>
        </Container>
      </section>

      <section className="py-12">
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

      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="The protocol layer"
            title="Three ways through any firewall"
            body="MistyVPN ships the protocols that actually beat modern censorship — and Auto mode chooses the right one for your network in real time."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {protocols.map((p) => (
              <Card key={p.name}>
                <h3 className="font-mono text-sm font-semibold text-brand">
                  {p.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{p.blurb}</p>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Protocol and brand names (VLESS, Reality, Hysteria2, WireGuard,
            ShadowTLS) are shown untranslated — they&apos;re universal.
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              See it in action
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Start on the free tier and connect in seconds.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button href="/#get-started" className="px-8">
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
