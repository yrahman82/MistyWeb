import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { Prose } from "@/components/Prose";
import { site } from "@/lib/site";

type Section = { heading: string; paragraphs: string[] };

// The iOS End User Licence Agreement, served at /legal/ios/terms and linked from inside the app.
//
// PLATFORM-SCOPED ON PURPOSE. The website Terms at /terms cover every rail — web card checkout,
// the App Store, Google Play, Telegram Stars, crypto — because web buyers need all of that. None
// of it belongs in what an App Store reviewer reads:
//   - guideline 2.3.10 forbids referencing other mobile platforms in an app or its metadata, and
//     "Google Play" in an EULA reachable from the paywall is exactly that;
//   - guideline 3.1.1 forbids steering to outside purchase paths, and "buy by card on this
//     website" is a purchase route — the same violation 1.0 was rejected for in September.
// So this document describes the Apple rail only. When Play or web need their own licence, add a
// sibling (/legal/android/terms) rather than widening this one.
//
// It also carries the clauses Apple's minimum terms require of a custom EULA, which the website
// Terms do not: Apple is not a party, owes no support, its refund is its only warranty obligation,
// we carry product-liability / regulatory-conformity / consumer-protection / IP claims, and Apple
// is a third-party beneficiary.
//
// ENGLISH ONLY, unlike every other page on this site. Legal text is the one place where a
// machine translation nobody has had reviewed is worse than no translation: a mistranslated
// limitation-of-liability or warranty clause is a real exposure, not a cosmetic bug. The page is
// noindex and the app links the English URL regardless of its own language, so translating it
// would serve almost nobody today. Locale is pinned to "en" here rather than left to the route.
export default async function AppleEulaBody() {
  const t = await getTranslations({ locale: "en", namespace: "appleEulaPage" });
  const sections = t.raw("sections") as Section[];

  const vals = {
    name: site.name,
    legalName: site.company.legalName,
    registeredIn: site.company.registeredIn,
    companyNumber: site.company.number,
    registeredOffice: site.company.registeredOffice,
    email: site.email,
  };

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
          <p>{t("intro", vals)}</p>

          {sections.map((s, i) => (
            <div key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((_, j) => (
                <p key={j}>{t(`sections.${i}.paragraphs.${j}`, vals)}</p>
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
