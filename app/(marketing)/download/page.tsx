import type { Metadata } from "next";
import { Container, Button, Eyebrow, Card } from "@/components/ui";
import { iconMap } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import DownloadGrid from "@/components/DownloadGrid";
import { site, moneyBack } from "@/lib/site";

export const metadata: Metadata = {
  title: "Download MistyVPN — iPhone, Android, Mac & Android TV",
  description:
    "Get MistyVPN on all your devices. One account covers iPhone, iPad, Android, Mac and Android TV — start free, no card required, with a 14-day money-back guarantee on Premium.",
  alternates: { canonical: "/download" },
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    { "@type": "ListItem", position: 2, name: "Download", item: `${site.url}/download` },
  ],
};

const trust = [
  {
    icon: "clock",
    title: "Start free",
    body: "No credit card. Earn free minutes and try the full app before you pay a penny.",
  },
  {
    icon: "key",
    title: "Password manager & 2FA included",
    body: "A full encrypted password manager and authenticator come free on every plan.",
  },
  {
    icon: "check",
    title: moneyBack.short,
    body: "Go Premium risk-free — full refund within 14 days, no questions asked.",
  },
];

export default function DownloadPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd} />

      <section className="pt-20 pb-10 text-center">
        <Container>
          <div className="flex justify-center">
            <Eyebrow>Download</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Get MistyVPN on every device
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            One account covers iPhone, iPad, Android, Mac and Android TV — up to
            10 devices at once. Pick your platform below and connect in seconds.
          </p>
        </Container>
      </section>

      <section className="pb-8">
        <Container className="max-w-3xl">
          <DownloadGrid />
          <p className="mt-6 text-center text-sm text-slate-400">
            Apps are rolling out to the App Store and Google Play. Already have an
            account?{" "}
            <a href="/account" className="text-brand hover:underline">
              Manage it here
            </a>
            .
          </p>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="py-14">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {trust.map((t) => {
              const Icon = iconMap[t.icon as keyof typeof iconMap];
              return (
                <Card key={t.title}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-base font-semibold text-white">{t.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{t.body}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Container>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand/20 via-ink-3 to-accent/20 px-6 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              New to MistyVPN?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Create a free account now — your subscription and settings sync to
              every device the moment you install the app.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/register" className="px-8">
                Create free account
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
