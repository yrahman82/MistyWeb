import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { localeUrl, languageAlternates } from "@/lib/seo";

// Canonical, indexable routes only. Utility/auth pages (reset-password, tv-login,
// login, register, account) are intentionally excluded from the sitemap.
const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/features", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/compare", priority: 0.8, changeFrequency: "monthly" },
  { path: "/unblock", priority: 0.8, changeFrequency: "monthly" },
  { path: "/download", priority: 0.8, changeFrequency: "monthly" },
  { path: "/no-logs", priority: 0.7, changeFrequency: "monthly" },
  { path: "/support", priority: 0.6, changeFrequency: "monthly" },
  { path: "/servers", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
  { path: "/delete-account", priority: 0.3, changeFrequency: "yearly" },
];

// One entry per (locale, path), each carrying the full hreflang alternates map, so every
// localized URL is discoverable and cross-linked for international SEO.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-04");
  const entries: MetadataRoute.Sitemap = [];
  for (const r of routes) {
    const languages = languageAlternates(r.path);
    for (const locale of locales) {
      entries.push({
        url: localeUrl(locale, r.path),
        lastModified,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
        alternates: { languages },
      });
    }
  }
  return entries;
}
