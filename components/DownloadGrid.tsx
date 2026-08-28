"use client";

import { useEffect, useState } from "react";
import { iconMap } from "@/components/Icons";
import { Button } from "@/components/ui";
import { platforms } from "@/lib/site";

// Map a detected OS to the platform card name(s) it should highlight.
const OS_TO_PLATFORM: Record<string, string[]> = {
  iOS: ["iPhone & iPad"],
  Android: ["Android", "Android TV"],
  Mac: ["Mac"],
  Windows: ["Windows"],
};

export default function DownloadGrid() {
  // null until mounted → SSR and first client render match (no highlight), then we detect.
  const [os, setOs] = useState<string | null>(null);

  useEffect(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    if (/iPhone|iPad|iPod/i.test(ua)) setOs("iOS");
    else if (/Android/i.test(ua)) setOs("Android");
    else if (/Macintosh|Mac OS X/i.test(ua)) setOs("Mac");
    else if (/Windows/i.test(ua)) setOs("Windows");
    else setOs("other");
  }, []);

  const highlighted = os ? (OS_TO_PLATFORM[os] ?? []) : [];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {platforms.map((p) => {
        const Icon = iconMap[p.icon as keyof typeof iconMap];
        // A real store link starts with http:// — until the apps are published the links point at
        // this page, so we render a "Coming soon" state instead of a dead button. Swap in the real
        // App Store / Play Store URLs in lib/site.ts `stores` and the buttons go live automatically.
        const live = p.href.startsWith("http");
        const isMine = highlighted.includes(p.name);
        return (
          <div
            key={p.name}
            className={`flex items-center justify-between gap-4 rounded-2xl border p-5 transition-colors ${
              isMine
                ? "border-brand/50 bg-brand/[0.08]"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-4">
              <Icon className="h-8 w-8 text-white" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{p.name}</span>
                  {isMine ? (
                    <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                      Your device
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-slate-400">{p.store}</div>
              </div>
            </div>
            {live ? (
              <Button href={p.href} external className="h-10 px-5">
                Get it
              </Button>
            ) : (
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300">
                Coming soon
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
