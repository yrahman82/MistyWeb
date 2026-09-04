import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import JsonLd from "@/components/JsonLd";
import { Container } from "@/components/ui";
import { localeUrl } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export type Crumb = { name: string; href: string };

// Visible breadcrumb trail + BreadcrumbList structured data (SEO). "Home" is prepended
// automatically (localized); pass the trail from there, e.g. [{ name: "Pricing", href: "/pricing" }].
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const trail: Crumb[] = [{ name: t("home"), href: "/" }, ...items];

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: localeUrl(locale, c.href),
    })),
  };

  return (
    <Container>
      <JsonLd data={ld} />
      <nav aria-label={t("breadcrumb")} className="pt-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-2">
                {i > 0 ? <span className="text-slate-600">/</span> : null}
                {last ? (
                  <span className="text-slate-300" aria-current="page">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.href} className="transition-colors hover:text-white">
                    {c.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </Container>
  );
}
