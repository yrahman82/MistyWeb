"use client";

import { useEffect, useState, type ReactNode } from "react";
import { site } from "@/lib/site";

const PHONE = site.whatsapp.number;
const PREFILL = "Hi MistyVPN support, I need help with ";

/**
 * A WhatsApp deep-link that resolves correctly per device:
 *  - mobile  → wa.me/<number>  (opens the WhatsApp app)
 *  - desktop → web.whatsapp.com/send (opens WhatsApp Web)
 *
 * SSR / no-JS falls back to wa.me, which already opens the app on phones and
 * redirects to WhatsApp Web on desktop — so the link always works; the effect
 * just makes the desktop path explicit.
 */
function hrefFor(isMobile: boolean) {
  const text = encodeURIComponent(PREFILL);
  return isMobile
    ? `https://wa.me/${PHONE}?text=${text}`
    : `https://web.whatsapp.com/send?phone=${PHONE}&text=${text}`;
}

export default function WhatsAppButton({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [href, setHref] = useState(
    `https://wa.me/${PHONE}?text=${encodeURIComponent(PREFILL)}`,
  );

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isMobile = /iphone|ipad|ipod|android|mobile/i.test(ua);
    setHref(hrefFor(isMobile));
  }, []);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
