import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { Prose } from "@/components/Prose";
import { site } from "@/lib/site";

type Section = { heading: string; paragraphs: string[] };

// The Terms document itself, with no page chrome around it.
//
// It is rendered in TWO places from this one source: the public /terms page (inside the marketing
// layout) and /legal/terms, the stripped copy the APPS link to. Apple guideline 3.1.2(c) requires a
// functional Terms of Use link in the binary, but 3.1.1 forbids pointing users at an external
// purchase path — and the marketing layout carries a header CTA and the announcement bar, which
// advertises payment methods. Sending a reviewer there from the paywall would re-open the exact
// rejection 1.0 already took. Hence one document, two wrappers.
export default async function TermsBody({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "termsPage" });
  const sections = t.raw("sections") as Section[];

  return (
    <>
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
        {t("h1")}
      </h1>
      <p className="mt-3 text-sm text-slate-400">
        {t("lastUpdated", { date: t("lastUpdatedDate") })}
      </p>

      <div className="mt-10">
        <Prose>
          <p>
            {t("intro", {
              name: site.name,
              company: site.company.legalName,
              registeredIn: site.company.registeredIn,
              number: site.company.number,
              office: site.company.registeredOffice,
            })}
          </p>

          {sections.map((s, i) => (
            <div key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((_, j) => (
                <p key={j}>
                  {t(`sections.${i}.paragraphs.${j}`, {
                    name: site.name,
                    email: site.email,
                    // The app-licence section has to name the contracting entity: Apple's
                    // custom-EULA rules require the licence to be between the user and US, with
                    // Apple explicitly not a party.
                    company: site.company.legalName,
                  })}
                </p>
              ))}
            </div>
          ))}

          <h2>{t("contact.heading")}</h2>
          <p>
            {t.rich("contact.body", {
              email: site.email,
              link: (chunks) => <a href={`mailto:${site.email}`}>{chunks}</a>,
            })}
          </p>
        </Prose>
      </div>
    </>
  );
}
