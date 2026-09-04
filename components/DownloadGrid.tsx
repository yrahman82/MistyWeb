"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { iconMap } from "@/components/Icons";
import { Button } from "@/components/ui";
import { platforms } from "@/lib/site";
import { trackDownload } from "@/lib/analytics";

// Downloads route through the BE redirect endpoint (counts server-side, then 302s to the store/asset)
// so the numbers survive adblockers + the GFW. GA fires too as a secondary signal.
const API = process.env.NEXT_PUBLIC_API_URL ?? "https://dev-be.mistyvpn.com";

// Map a detected OS to the platform card name(s) it should highlight.
const OS_TO_PLATFORM: Record<string, string[]> = {
  iOS: ["iPhone & iPad"],
  Android: ["Android", "Android TV"],
  Mac: ["Mac"],
  Windows: ["Windows"],
};

export default function DownloadGrid() {
  const t = useTranslations("downloadGrid");
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
  const DlIcon = iconMap.download;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {platforms.map((p) => {
        const Icon = iconMap[p.icon as keyof typeof iconMap];
        // A real store link starts with http:// — until the apps are published the links point at
        // this page, so we render a "Coming soon" state instead of a dead button. Swap in the real
        // App Store / Play Store URLs in lib/site.ts `stores` and the buttons go live automatically.
        const live = p.href.startsWith("http");
        // A setup-guide card links to a sub-page under /download/ (e.g. Router → /download/router).
        // NOTE: a store placeholder like iOS's "/download" points back at THIS page — it is NOT a
        // guide, so match "/download/" (with the trailing slash) to exclude the self-link → those
        // fall through to the "Coming soon" state until the store URL goes live.
        const internal = p.href.startsWith("/download/");
        const isMine = highlighted.includes(p.name);
        return (
          <div
            key={p.name}
            className={`flex flex-col gap-4 rounded-2xl border p-5 transition-colors sm:flex-row sm:items-center sm:justify-between ${
              isMine
                ? "border-brand/50 bg-brand/[0.08]"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="flex min-w-0 items-center gap-4">
              <Icon className="h-8 w-8 shrink-0 text-white" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">{p.name}</div>
                <div className="text-xs text-slate-400">
                  {p.store}
                  {isMine ? (
                    <span className="ml-1.5 font-semibold text-brand">· {t("yourDevice")}</span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex w-full shrink-0 flex-col items-stretch gap-1.5 sm:w-auto sm:items-end">
              {internal ? (
                <Button href={p.href} className="h-10 w-full justify-center px-5 sm:w-auto">
                  {t("setupGuide")}
                </Button>
              ) : live ? (
                <>
                  <Button
                    href={`${API}/api/download/${p.key}`}
                    external
                    className="h-10 w-full justify-center px-5 sm:w-auto"
                    onClick={() => trackDownload(p.key)}
                  >
                    {t("getIt")}
                  </Button>
                  {/* Android + Android TV also offer the SAME universal APK direct (no Google Play — for
                      sideload / China). Tracked apart per surface (android-apk vs tv-apk). A proper
                      secondary button, not a tiny link, so it's easy to see and tap (incl. a TV remote). */}
                  {p.key === "android" || p.key === "tv" ? (
                    <a
                      href={`${API}/api/download/${p.key === "tv" ? "tv-apk" : "android-apk"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackDownload(p.key === "tv" ? "tv-apk" : "android-apk")}
                      className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-4 text-xs font-semibold text-brand transition-colors hover:border-brand/70 hover:bg-brand/20 sm:w-auto"
                    >
                      <DlIcon className="h-4 w-4" />
                      {t("downloadApk")}
                    </a>
                  ) : null}
                </>
              ) : (
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-xs font-medium text-slate-300 sm:text-left">
                  {t("comingSoon")}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
