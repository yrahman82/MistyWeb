import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { Prose } from "@/components/Prose";
import { site } from "@/lib/site";

type Section = { heading: string; paragraphs: string[] };

// The WEBSITE Terms of Service: the full document covering every purchase rail — card checkout on
// this site, the App Store, Google Play, Telegram Stars and crypto — because a web buyer needs all
// of it. Rendered at /terms inside the marketing layout.
//
// The iOS app does NOT link here. It links /legal/ios/terms, a platform-scoped EULA, because
// naming Google Play (guideline 2.3.10) or web card checkout (guideline 3.1.1) in a document a
// reviewer reaches from the paywall is the kind of thing 1.0 was rejected for. See
// components/legal/AppleEulaBody.tsx.
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
