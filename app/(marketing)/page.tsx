import type { Metadata } from "next";
import { Container, SectionHeading, Button, Card, Eyebrow } from "@/components/ui";
import { iconMap } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { features, faqs, stats, steps, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — Private, unblocked, fast on every device`,
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
    description: "Free to start; Premium from $2.50/month.",
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
      <section className="relative pt-20 pb-20 sm:pt-28">
        <Container className="text-center">
          <div className="flex justify-center">
            <Eyebrow>Start free · No card required</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Private internet that{" "}
            <span className="bg-gradient-to-r from-brand via-cyan-300 to-accent bg-clip-text text-transparent">
              actually works
            </span>
            , everywhere.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            MistyVPN keeps you private and unblocked on every device — with
            Stealth Mode that gets past blocks, blazing speed across 40+
            locations, and a strict no-logs promise.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/download" className="px-8">
              Get MistyVPN free
            </Button>
            <Button href="/pricing" variant="secondary">
              See plans
            </Button>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            14-day money-back guarantee
          </p>

          {/* stats */}
          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-center"
              >
                <dt className="text-3xl font-bold text-white">{s.value}</dt>
                <dd className="mt-1 text-xs text-slate-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Spotlight: Stealth + Split Tunneling */}
      <section className="py-16">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="overflow-hidden p-8">
              <Eyebrow>Stealth Mode</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                Invisible by design
              </h2>
              <p className="mt-3 text-slate-300">
                Most VPNs get blocked because the network can <em>see</em> they&apos;re
                a VPN. MistyVPN can&apos;t be spotted that way — Stealth Mode makes
                your connection look like ordinary browsing, so it keeps working
                where everything else fails.
              </p>
              <p className="mt-4 text-sm text-slate-400">On by default. One tap to connect.</p>
            </Card>
            <Card className="overflow-hidden p-8">
              <Eyebrow>Split Tunneling</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                Protect only what you want
              </h2>
              <p className="mt-3 text-slate-300">
                Route your streaming and browsing through the VPN while your bank
                app, local sites and games stay on your normal connection — full
                speed, no compromises.
              </p>
              <p className="mt-4 text-sm text-slate-400">
                You decide, app by app.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      {/* Features grid */}
      <section id="features" className="py-16">
        <Container>
          <SectionHeading
            center
            eyebrow="Everything included"
            title="One app. Everything you need."
            body="No add-ons, no upsells. Every plan comes with the full toolkit."
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
          <div className="mt-10 text-center">
            <Button href="/features" variant="secondary">
              Explore all features
            </Button>
          </div>
        </Container>
      </section>

      {/* Spotlight: Password Manager + Authenticator (a headline differentiator) */}
      <section className="py-8">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/15 via-ink-3 to-accent/15 px-6 py-12 sm:px-10">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <Eyebrow>More than a VPN</Eyebrow>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Password Manager &amp; Authenticator — included free
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-300">
                  A full encrypted password manager and a built-in two-factor
                  authenticator, right inside the app. Save logins, autofill,
                  generate strong passwords and store your 2FA codes — all
                  protected end-to-end. The big VPNs charge extra or lock these
                  behind a pricier tier. With MistyVPN they&apos;re simply
                  included, on every plan.
                </p>
                <div className="mt-7">
                  <Button href="/features" variant="secondary">
                    Explore all features
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: "key",
                    title: "Password Manager",
                    body: "Encrypted vault, autofill and a strong-password generator across your devices.",
                  },
                  {
                    icon: "otp",
                    title: "Authenticator (2FA)",
                    body: "Built-in one-time codes — replace Google Authenticator, kept in the same secure vault.",
                  },
                ].map((c) => {
                  const Icon = iconMap[c.icon as keyof typeof iconMap];
                  return (
                    <div
                      key={c.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.05] p-6"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/20 text-brand">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-white">
                        {c.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {c.body}
                      </p>
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
          <SectionHeading center eyebrow="How it works" title="Protected in three taps" />
          <ol className="mt-14 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-ink">
                  {i + 1}
                </span>
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
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                How does MistyVPN compare?
              </h2>
              <p className="mt-2 max-w-xl text-slate-300">
                A free tier, next-gen anti-block tech, and premium for less than
                the big names. See the side-by-side.
              </p>
            </div>
            <Button href="/compare" className="shrink-0 px-8">
              Compare VPNs
            </Button>
          </Card>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <Container>
          <SectionHeading center eyebrow="FAQ" title="Good questions" />
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
      <section className="py-16">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand/20 via-ink-3 to-accent/20 px-6 py-16 text-center">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your private internet starts now.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Free to try, no card, nothing logged. Premium is backed by a 14-day
              money-back guarantee — be connected in under a minute.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/download" className="px-8">
                Get MistyVPN free
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
