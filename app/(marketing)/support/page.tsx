import type { Metadata } from "next";
import { Container, Eyebrow, Card, Button } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import WhatsAppButton from "@/components/WhatsAppButton";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Help & Support — talk to a human, fast",
  description:
    "Get help with MistyVPN. Message us on WhatsApp or email support@mistyvpn.com — real people, fast replies, 24/7. Quick fixes and answers to common questions.",
  alternates: { canonical: "/support" },
};

const faqs = [
  {
    q: "I can't connect — what should I try first?",
    a: "Switch the protocol to Auto (Settings → Protocol), pick a nearby server, and make sure Stealth Mode is on. On strict networks, Stealth disguises your connection as normal HTTPS so it gets through. If it still won't connect, message us and we'll sort it in minutes.",
  },
  {
    q: "How do I manage or cancel my subscription?",
    a: "Subscriptions are billed through your Apple ID or Google account. Manage or cancel anytime in your device's account settings — Apple: Settings → your name → Subscriptions; Google: Play Store → Subscriptions. Your access continues until the end of the paid period.",
  },
  {
    q: "How do refunds work?",
    a: "Because billing is handled by Apple and Google, refunds are issued through them. We're happy to help you through it — just reach out and we'll point you to the fastest route.",
  },
  {
    q: "Do you keep logs of what I do?",
    a: "No. MistyVPN is strictly no-logs — we don't record your browsing, traffic, or activity. We literally can't hand over what we never collect. See our no-logs promise for the full detail.",
  },
  {
    q: "Which server is best for streaming?",
    a: "Choose a server in the country whose content you want, then connect. If a service doesn't load, try another city in the same country or toggle Stealth Mode. Ask us for the current best pick — we keep tabs on it.",
  },
  {
    q: "Does it work on restricted or public Wi-Fi?",
    a: "Yes. Stealth Mode is built for exactly that — cafes, hotels, airports, offices, and heavily filtered networks. It's on by default, with nothing to configure.",
  },
];

const quickFixes = [
  "Update to the latest version of the app.",
  "Set Protocol to Auto and pick a nearby server.",
  "Make sure Stealth Mode is enabled.",
  "Toggle the VPN off and on, or restart the app.",
  "Check your internet works with the VPN disconnected.",
];

const trust = [
  { label: "Replies in under 2 hours", sub: "typical response time" },
  { label: "Real people, no bots", sub: "human support" },
  { label: "Available 24/7", sub: "every day" },
  { label: "Strict no-logs", sub: "we can't see your activity" },
];

// Rich FAQ structured data — helps search engines + adds trust signals.
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
    </svg>
  );
}

function MailGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function CheckGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function SupportPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Support", href: "/support" }]} />
      <JsonLd data={faqLd} />

      {/* Hero */}
      <section className="pt-20 pb-10 text-center">
        <Container>
          <div className="flex justify-center">
            <Eyebrow>Support</Eyebrow>
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            We&apos;re here to help — around the clock.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Real people, fast replies. Reach us on WhatsApp or by email and
            we&apos;ll get you connected again.
          </p>
        </Container>
      </section>

      {/* Contact cards */}
      <section className="py-6">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {/* WhatsApp */}
            <Card className="relative overflow-hidden p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
                style={{ background: "radial-gradient(closest-side, rgba(37,211,102,0.25), transparent)" }}
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
                <WhatsAppGlyph className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-white">Chat on WhatsApp</h2>
              <p className="mt-3 text-slate-300">
                The fastest way to reach us. Opens WhatsApp on your phone, or
                WhatsApp Web on your computer.
              </p>
              <p className="mt-4 font-mono text-lg text-white">{site.whatsapp.display}</p>
              <div className="mt-6">
                <WhatsAppButton className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-[#052e16] shadow-[0_8px_30px_-8px_rgba(37,211,102,0.6)] transition-all duration-200 hover:brightness-110">
                  <WhatsAppGlyph className="h-5 w-5" />
                  Message us on WhatsApp
                </WhatsAppButton>
              </div>
            </Card>

            {/* Email */}
            <Card className="relative overflow-hidden p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
                style={{ background: "radial-gradient(closest-side, rgba(56,189,248,0.25), transparent)" }}
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <MailGlyph className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-white">Email us</h2>
              <p className="mt-3 text-slate-300">
                Prefer email? Write to us anytime and we&apos;ll reply within a
                few hours with a real answer — no ticket runaround.
              </p>
              <p className="mt-4 font-mono text-lg text-white">{site.email}</p>
              <div className="mt-6">
                <Button href={`mailto:${site.email}?subject=MistyVPN%20Support`} external>
                  <MailGlyph className="h-5 w-5" />
                  Email support
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="py-8">
        <Container>
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2 lg:grid-cols-4">
            {trust.map((t) => (
              <div key={t.label} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand/15 text-brand">
                  <CheckGlyph className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.label}</p>
                  <p className="text-xs text-slate-400">{t.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Quick fixes */}
      <section className="py-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow>Before you reach out</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                60-second fixes
              </h2>
              <p className="mt-3 text-slate-300">
                Most hiccups clear up with one of these. Still stuck after trying
                them? We&apos;re one message away.
              </p>
            </div>
            <Card className="p-6 sm:p-8">
              <ul className="space-y-4">
                {quickFixes.map((fix) => (
                  <li key={fix} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand/15 text-brand">
                      <CheckGlyph className="h-4 w-4" />
                    </div>
                    <span className="text-slate-200">{fix}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-10">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center">
              <Eyebrow>Answers</Eyebrow>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Common questions
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {faqs.map((f) => (
              <Card key={f.q} className="p-6">
                <h3 className="text-lg font-semibold text-white">{f.q}</h3>
                <p className="mt-3 text-slate-300">{f.a}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="py-14">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{ background: "radial-gradient(40rem 20rem at 50% -20%, rgba(56,189,248,0.18), transparent 60%)" }}
            />
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Still stuck? Let&apos;s fix it together.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Send us a message and a real person will help you get connected —
              usually in under two hours.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <WhatsAppButton className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-[#052e16] shadow-[0_8px_30px_-8px_rgba(37,211,102,0.6)] transition-all duration-200 hover:brightness-110">
                <WhatsAppGlyph className="h-5 w-5" />
                WhatsApp us
              </WhatsAppButton>
              <Button href={`mailto:${site.email}?subject=MistyVPN%20Support`} external variant="secondary">
                <MailGlyph className="h-5 w-5" />
                {site.email}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
