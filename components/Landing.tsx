import { Container, SectionHeading, Button, Card, Eyebrow } from "@/components/ui";
import { CheckIcon } from "@/components/Icons";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";

export type LandingSection = { h2: string; body: string[] };
export type LandingFaq = { q: string; a: string };

export type LandingProps = {
  slug: string; // e.g. "strict-firewalls"
  crumb: string; // breadcrumb + JSON-LD name
  eyebrow: string;
  h1: string;
  lede: string;
  bullets: string[];
  sections: LandingSection[];
  faqs: LandingFaq[];
};

export function Landing({
  slug,
  crumb,
  eyebrow,
  h1,
  lede,
  bullets,
  sections,
  faqs,
}: LandingProps) {
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: crumb, item: `${site.url}/${slug}` },
    ],
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

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={faqLd} />

      <section className="pt-20 pb-12">
        <Container>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {h1}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{lede}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/download" className="px-8">
              Get MistyVPN free
            </Button>
            <Button href="/features" variant="secondary">
              How it works
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <ul className="grid gap-3 sm:grid-cols-2">
            {bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200"
              >
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-mint" />
                {b}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-12">
        <Container className="max-w-3xl">
          <div className="space-y-12">
            {sections.map((s) => (
              <article key={s.h2}>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {s.h2}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.body.map((p, i) => (
                    <p key={i} className="leading-7 text-slate-300">
                      {p}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading center eyebrow="FAQ" title="Common questions" />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
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

      <section className="py-16">
        <Container>
          <Card className="px-6 py-14 text-center">
            <h2 className="text-3xl font-semibold tracking-tight">
              Ready when you are
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-300">
              Free to start, no credit card, strict no-logs.
            </p>
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
