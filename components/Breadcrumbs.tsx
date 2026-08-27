import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";

export type Crumb = { name: string; href: string };

// Visible breadcrumb trail + BreadcrumbList structured data (SEO). "Home" is prepended
// automatically; pass the trail from there, e.g. [{ name: "Pricing", href: "/pricing" }].
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ name: "Home", href: "/" }, ...items];

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${site.url}${c.href === "/" ? "" : c.href}`,
    })),
  };

  return (
    <Container>
      <JsonLd data={ld} />
      <nav aria-label="Breadcrumb" className="pt-6">
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
