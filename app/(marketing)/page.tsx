import type { Metadata } from "next";
import { Container, SectionHeading, Button, Card, Eyebrow } from "@/components/ui";
import { iconMap } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { features, protocols, platforms, faqs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  applicationCategory: "SecurityApplication",
  operatingSystem: "iOS, Android, macOS, Android TV",
  description: site.description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier available; Premium from $2/month.",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1200",
  },
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

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={softwareLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={websiteLd} />

      {/* Hero */}
      <section className="relative pt-20 pb-24 sm:pt-28">
        <Container className="text-center">
          <div className="flex justify-center">
            <Eyebrow>Works where other VPNs get blocked</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            The VPN that stays{" "}
            <span className="bg-gradient-to-r from-brand via-cyan-300 to-accent bg-clip-text text-transparent">
              invisible
            </span>{" "}
            and fast.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            {site.name} disguises your connection as everyday web traffic with
            modern censorship-resistant protocols — so streaming, browsing and
            calls keep working, privately, on every device.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/#get-started" className="px-8">
              Get MistyVPN free
            </Button>
            <Button href="/features" variant="secondary">
              Explore features
            </Button>
          </div>
          <p className="mt-5 text-sm text-slate-400">
            Free to start · No credit card · Strict no-logs
          </p>
        </Container>

        {/* trust strip */}
        <Container className="mt-16">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["No-logs", "Nothing recorded, ever"],
              ["16 languages", "Including RTL"],
              ["All devices", "One subscription"],
              ["Global fleet", "More locations weekly"],
            ].map(([t, s]) => (
              <div
                key={t}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center"
              >
                <div className="text-base font-semibold text-white">{t}</div>
                <div className="mt-1 text-xs text-slate-400">{s}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Why MistyVPN"
            title="Everything you need to stay private and unblocked"
            body="Built for the toughest networks in the world — and pleasant to use on every other one."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = iconMap[f.icon as keyof typeof iconMap];
              return (
                <Card key={f.title}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{f.body}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Protocols */}
      <section className="py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Protocols"
              title="Disguised as ordinary HTTPS"
              body="Deep packet inspection sees a normal visit to a major website. Auto mode picks the fastest protocol that gets through on your network — you never have to think about it."
            />
            <div className="space-y-4">
              {protocols.map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <h3 className="font-mono text-sm font-semibold text-brand">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{p.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Markets / streaming split */}
      <section className="py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="p-8">
              <Eyebrow>Restricted networks</Eyebrow>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                Built for the strictest firewalls
              </h3>
              <p className="mt-3 text-slate-300">
                Reality and Salamander-obfuscated Hysteria2 are engineered to
                defeat the deep packet inspection and traffic shaping used by the
                world&apos;s most restrictive networks.
              </p>
              <div className="mt-6">
                <Button
                  href="/strict-firewalls"
                  variant="secondary"
                  className="h-10 px-5"
                >
                  Beat strict firewalls →
                </Button>
              </div>
            </Card>
            <Card className="p-8">
              <Eyebrow>Streaming</Eyebrow>
              <h3 className="mt-4 text-2xl font-semibold text-white">
                Your shows, wherever you are
              </h3>
              <p className="mt-3 text-slate-300">
                Full-speed streaming with split tunneling — route only the apps
                you choose through the tunnel and keep everything else local.
              </p>
              <div className="mt-6">
                <Button
                  href="/unblock-netflix"
                  variant="secondary"
                  className="h-10 px-5"
                >
                  Unblock streaming →
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Get started / platforms */}
      <section id="get-started" className="scroll-mt-24 py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Get started"
            title="One account. Every device."
            body="Download MistyVPN and connect in a couple of taps. Apps are rolling out across all major platforms."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platforms.map((p) => {
              const Icon = iconMap[p.icon as keyof typeof iconMap];
              return (
                <a
                  key={p.name}
                  href={p.href}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-brand/40 hover:bg-white/[0.07]"
                >
                  <Icon className="h-8 w-8 text-white" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {p.name}
                    </div>
                    <div className="text-xs text-slate-400">{p.store}</div>
                  </div>
                </a>
              );
            })}
          </div>
          <p className="mt-6 text-center text-sm text-slate-400">
            Coming soon to the App Store and Google Play.
          </p>
        </Container>
      </section>

      {/* FAQ — native <details> so it's crawlable and works without JS */}
      <section id="faq" className="py-20">
        <Container>
          <SectionHeading center eyebrow="FAQ" title="Questions, answered" />
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
            {faqs.map((f) => (
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

      {/* CTA band */}
      <section className="py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand/20 via-ink-3 to-accent/20 px-6 py-16 text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Take back your private internet.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Start free in under a minute — no card, no logs, no fuss.
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
