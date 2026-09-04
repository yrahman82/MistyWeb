import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Account/utility pages have no SEO value and may carry tokens. The `/*/…`
      // variants cover the same routes under any locale prefix (e.g. /es/login).
      disallow: [
        "/reset-password", "/tv-login", "/login", "/register", "/account",
        "/*/reset-password", "/*/tv-login", "/*/login", "/*/register", "/*/account",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
