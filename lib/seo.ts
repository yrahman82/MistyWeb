import type { Metadata } from "next";
import { routing, htmlLang, defaultLocale, type Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

// Absolute URL for a locale + path. English lives at the root (no /en prefix); every other
// locale is prefixed. `path` starts with "/" (or "" for the home page).
export function localeUrl(locale: Locale, path = ""): string {
  const clean = path === "/" ? "" : path;
  const base = locale === defaultLocale ? site.url : `${site.url}/${locale}`;
  return `${base}${clean}`;
}

// hreflang alternates for one path: every locale cross-linked + x-default → English.
export function languageAlternates(path = ""): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const l of routing.locales) langs[htmlLang[l]] = localeUrl(l, path);
  langs["x-default"] = localeUrl(defaultLocale, path);
  return langs;
}

// Per-page canonical + hreflang block. Every page passes its own path so search engines
// see a correct canonical + full language map for THAT page (not the site root).
export function alternatesFor(locale: Locale, path = ""): NonNullable<Metadata["alternates"]> {
  return { canonical: localeUrl(locale, path), languages: languageAlternates(path) };
}

// Convenience: a full page Metadata with localized title/description + SEO alternates + OG/Twitter.
export function pageMetadata(opts: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const { locale, path = "", title, description } = opts;
  const url = localeUrl(locale, path);
  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url,
      locale: htmlLang[locale].replace("-", "_"),
    },
    twitter: { card: "summary_large_image", title, description, creator: site.twitter },
  };
}
