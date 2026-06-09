import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Canonical, indexable routes only. Utility pages (reset-password, tv-login)
// are intentionally excluded from the sitemap.
const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/features", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/strict-firewalls", priority: 0.8, changeFrequency: "monthly" },
  { path: "/unblock-netflix", priority: 0.8, changeFrequency: "monthly" },
  { path: "/no-logs", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-06-09");
  return routes.map((r) => ({
    url: `${site.url}${r.path === "/" ? "" : r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
