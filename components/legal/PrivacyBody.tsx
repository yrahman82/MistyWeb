import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui";
import { Prose } from "@/components/Prose";
import { site } from "@/lib/site";

// The privacy policy is a linear legal document, so the translated body is modelled as an ordered
// array of typed blocks (headings, paragraphs, lists). Paragraph + list-item text is rendered with
// t.rich so inline emphasis (<b>) and the support-email link (<mail>) survive translation, while
// the href stays in code.
type Block =
  | { kind: "h2" | "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

// Chrome-free, shared by the public /privacy page and the app-facing /legal/privacy copy.
// See TermsBody for why the apps must not link into the marketing layout.
export default async function PrivacyBody({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "privacyPage" });
  const sections = t.raw("sections") as Block[];

  const richValues = {
    name: site.name,
    legalName: site.company.legalName,
    registeredIn: site.company.registeredIn,
    companyNumber: site.company.number,
    registeredOffice: site.company.registeredOffice,
    email: site.email,
    b: (chunks: ReactNode) => <strong>{chunks}</strong>,
    mail: (chunks: ReactNode) => <a href={`mailto:${site.email}`}>{chunks}</a>,
  };

  return (
    <>
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-3 text-sm text-slate-400">
        {t("lastUpdated", { date: t("updatedDate") })}
      </p>

      <div className="mt-10">
        <Prose>
          {sections.map((block, i) => {
            if (block.kind === "h2") return <h2 key={i}>{block.text}</h2>;
            if (block.kind === "h3") return <h3 key={i}>{block.text}</h3>;
            if (block.kind === "ul") {
              return (
                <ul key={i}>
                  {block.items.map((_, j) => (
                    <li key={j}>
                      {t.rich(`sections.${i}.items.${j}`, richValues)}
                    </li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{t.rich(`sections.${i}.text`, richValues)}</p>;
          })}
        </Prose>
      </div>
    </>
  );
}
