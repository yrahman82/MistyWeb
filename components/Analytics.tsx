"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview, GA_ID } from "@/lib/analytics";

// Sends a GA4 page_view on the first render and on every client-side route change (Next's <Link>
// navigations don't reload the page, so GA's built-in page_view — which only fires on full loads —
// would miss them). The root gtag config sets send_page_view:false so this is the single source of
// page_view. Must be wrapped in <Suspense> by the caller because it reads useSearchParams().
export default function Analytics() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    const qs = search?.toString();
    pageview(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, search]);

  return null;
}
