"use client";

import { useEffect } from "react";
import { gaEvent } from "@/lib/analytics";

// Fires a single GA4 event once when mounted. Lets server components (which can't call gtag) emit an
// event by dropping this in. Example: <TrackEvent event="view_pricing" /> on the pricing page.
export default function TrackEvent({ event, params }: { event: string; params?: Record<string, unknown> }) {
  useEffect(() => {
    gaEvent(event, params ?? {});
    // Fire once per mount — deliberately not re-firing on param identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
