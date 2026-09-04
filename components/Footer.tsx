import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { Logo } from "@/components/Logo";

// Footer nav structure lives in code (hrefs never change); labels come from the `nav` catalog.
const footerCols: { titleKey: string; items: { key: string; href: string }[] }[] = [
  {
    titleKey: "footer.product",
    items: [
      { key: "features", href: "/features" },
      { key: "pricing", href: "/pricing" },
      { key: "footer.compareVpns", href: "/compare" },
      { key: "footer.unblock", href: "/unblock" },
    ],
  },
  {
    titleKey: "footer.trust",
    items: [
      { key: "footer.noLogsPromise", href: "/no-logs" },
      { key: "footer.privacy", href: "/privacy" },
      { key: "footer.terms", href: "/terms" },
      { key: "footer.helpSupport", href: "/support" },
    ],
  },
  {
    titleKey: "footer.getAppTitle",
    items: [
      { key: "download", href: "/download" },
      { key: "footer.iphone", href: "/download" },
      { key: "footer.android", href: "/download" },
      { key: "footer.mac", href: "/download" },
      { key: "footer.windows", href: "/download" },
      { key: "footer.tv", href: "/download" },
    ],
  },
];

export default function Footer() {
  const t = useTranslations("nav");
  const year = 2026;
  const companyNo = site.company.number ? ` (company no. ${site.company.number})` : "";
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
              <Logo className="h-8 w-8" />
              <span className="text-lg font-semibold tracking-tight text-white">
                {site.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              {t("footer.blurb")}
            </p>
          </div>

          {footerCols.map((col) => (
            <div key={col.titleKey}>
              <h3 className="text-sm font-semibold text-white">{t(col.titleKey)}</h3>
              <ul className="mt-4 space-y-3">
                {col.items.map((item) => (
                  <li key={`${col.titleKey}-${item.key}`}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. {t("footer.rights")}
          </p>
          <p>
            <a
              href={`mailto:${site.email}`}
              className="text-slate-400 transition-colors hover:text-white"
            >
              {site.email}
            </a>
          </p>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          {t("footer.legal", {
            name: site.name,
            legalName: site.company.legalName,
            registeredIn: site.company.registeredIn,
            companyNo,
            office: site.company.registeredOffice,
          })}
        </p>
      </div>
    </footer>
  );
}
