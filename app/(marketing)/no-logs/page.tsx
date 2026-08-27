import type { Metadata } from "next";
import { Container, SectionHeading, Button, Card, Eyebrow } from "@/components/ui";
import { EyeOffIcon, LockIcon, ServerIcon } from "@/components/Icons";
import Breadcrumbs from "@/components/Breadcrumbs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "No-Logs Policy — what we don't collect",
  description:
    "MistyVPN is a strict no-logs VPN. We don't record your browsing, traffic, or IP address. Here's exactly what that means and how the architecture enforces it.",
  alternates: { canonical: "/no-logs" },
};

const points = [
  {
    icon: EyeOffIcon,
    title: "No activity logs",
    body: "We never record the sites you visit, the apps you use, or your DNS queries. Your browsing isn't ours to keep.",
  },
  {
    icon: LockIcon,
    title: "No connection logs",
    body: "We don't store your real IP address or a timeline of when you connected. There's no profile to build.",
  },
  {
    icon: ServerIcon,
    title: "Enforced by design",
    body: "Crash reporting is privacy-scrubbed of tokens, credentials and IPs, and our servers are configured to keep nothing they don't need to route your traffic.",
  },
];

export default function NoLogsPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "No-Logs", href: "/no-logs" }]} />

      <section className="pt-20 pb-10 text-center">
        <Container>
          <div className="flex justify-center">
            <Eyebrow>Privacy</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Strict no-logs. Nothing to hand over.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            The best way to protect your data is to never collect it. {site.name}{" "}
            is built so that there&apos;s simply no record of what you do.
          </p>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {points.map((p) => (
              <Card key={p.title}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <p.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-white">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{p.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading
            eyebrow="What we keep"
            title="The minimum to run the service"
            body="A no-logs policy doesn't mean zero data exists anywhere — it means none of it ties activity to you."
          />
          <div className="mt-8 max-w-3xl space-y-4 leading-7 text-slate-300">
            <p>
              To operate accounts and subscriptions we store the essentials: an
              account identifier and your subscription status (from the App Store
              or Google Play). We do not link this to any record of your traffic,
              because no such record exists.
            </p>
            <p>
              Aggregate, non-identifying metrics (such as total server load) help
              us keep the network fast. Crash reports are stripped of anything
              sensitive — tokens, passwords, keys and IP addresses are never sent.
            </p>
            <p className="text-sm text-slate-500">
              This page is a plain-language summary. See the{" "}
              <a href="/privacy" className="text-brand underline underline-offset-2">
                Privacy Policy
              </a>{" "}
              for the full detail.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <Card className="px-6 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Privacy you don&apos;t have to take on faith
            </h2>
            <div className="mt-8 flex justify-center">
              <Button href="/download" className="px-8">
                Get MistyVPN free
              </Button>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
