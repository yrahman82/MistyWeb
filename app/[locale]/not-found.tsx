"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/Logo";

// Branded, localized 404. Rendered inside app/[locale]/layout (fonts + NextIntlClientProvider),
// so useTranslations/useLocale work here. Any unknown path under a locale lands on this.
export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-white">
      {/* ambient glows to match the marketing look */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55rem 38rem at 70% -10%, rgba(56,189,248,0.20), transparent 60%)," +
            "radial-gradient(45rem 30rem at 10% 10%, rgba(129,140,248,0.16), transparent 55%)," +
            "linear-gradient(180deg, #0a1628 0%, #060d1a 100%)",
        }}
      />

      <Link href="/" className="mb-10 inline-flex items-center gap-2.5" aria-label="MistyVPN home">
        <Logo className="h-8 w-8" />
        <span className="text-lg font-semibold tracking-tight">MistyVPN</span>
      </Link>

      <p className="bg-gradient-to-r from-brand via-cyan-300 to-accent bg-clip-text text-7xl font-bold tracking-tight text-transparent sm:text-8xl">
        {t("code")}
      </p>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">{t("heading")}</h1>
      <p className="mx-auto mt-4 max-w-md text-slate-300">{t("message")}</p>

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-sm font-semibold text-ink transition-transform hover:scale-[1.02]"
        >
          {t("home")}
        </Link>
        <Link
          href="/pricing"
          className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          {t("pricing")}
        </Link>
      </div>
    </div>
  );
}
