import Link from "next/link";
import { footerNav, site } from "@/lib/site";
import { Logo } from "@/components/Logo";

export default function Footer() {
  const year = 2026;
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
              {site.tagline} A no-logs VPN built to work where others get blocked.
            </p>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
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
      </div>
    </footer>
  );
}
