"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader } from "@/components/ui";
import StarsRedeem from "@/components/StarsRedeem";
import { getStarsConfig, type StarsConfig } from "@/lib/api";

// The Telegram Stars rail. Unlike card and crypto, the money does NOT move on our site — Telegram's
// own payment sheet takes it inside the pay bot. So this screen is a hand-off: it tells the buyer
// what the plan costs in Stars, sends them into the bot ALREADY on the invoice for that plan
// (t.me/<bot>?start=<plan> — no second plan menu), and takes the code they come back with.
//
// Why a code round-trip at all: the payer is a Telegram account and we have no trustworthy mapping
// from a Telegram id to a MistyVPN account. The code is what ties the two together, and it is also
// what makes a purchase work for someone who finds the bot with no website session at all.
//
// The buyer does not need Stars beforehand — if their balance is short, Telegram offers a top-up
// inside the same payment sheet.

const TELEGRAM_LOGO = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
    <path d="M21.8 4.2 18.6 19c-.24 1.06-.87 1.32-1.77.82l-4.9-3.6-2.36 2.27c-.26.26-.48.48-.98.48l.35-4.98 9.06-8.19c.4-.35-.08-.54-.6-.2L6.2 12.06l-4.83-1.5c-1.05-.33-1.07-1.05.22-1.56l18.9-7.28c.87-.32 1.64.2 1.31 2.48z" />
  </svg>
);

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white">
        {n}
      </span>
      <span className="text-sm leading-6 text-slate-300">{children}</span>
    </li>
  );
}

export default function StarsCheckout({
  plan,
  planLabel,
  onRedeemed,
  onBack,
}: {
  plan: string;
  planLabel?: string;
  onRedeemed: () => void;
  onBack: () => void;
}) {
  const t = useTranslations("stars");
  const [cfg, setCfg] = useState<StarsConfig | null>(null);
  const [failed, setFailed] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    getStarsConfig().then(setCfg).catch(() => setFailed(true));
  }, []);

  // Prices arrive keyed by the same plan slugs the rest of the site uses ("monthly" | "sixmonth" |
  // "annual"), so the chosen plan indexes straight into the config.
  const stars = cfg ? (cfg as unknown as Record<string, number>)[plan] : undefined;
  const payUrl = cfg?.bot ? `https://t.me/${cfg.bot}?start=${encodeURIComponent(plan)}` : null;

  return (
    <div className="w-full max-w-lg">
      <button onClick={onBack} className="text-sm text-slate-400 hover:text-white">
        {t("backToMethods")}
      </button>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h1 className="text-xl font-semibold">{t("checkoutTitle")}</h1>
        {planLabel ? <p className="mt-1 text-sm text-slate-400">{planLabel}</p> : null}

        {!cfg && !failed ? (
          <Loader label={t("loading")} className="mt-6" />
        ) : failed || !cfg?.enabled || !stars || !payUrl ? (
          <p className="mt-6 text-sm text-slate-400">{t("notAvailable")}</p>
        ) : (
          <>
            {/* The price, in the unit they are about to pay in — big enough that it can't be misread */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
              <p className="text-sm text-slate-400">{t("priceLabel")}</p>
              <p className="mt-1 text-4xl font-bold tracking-tight text-white">
                {stars} <span className="text-brand">⭐</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">{t("topUpHint")}</p>
            </div>

            <ol className="mt-5 space-y-3">
              <Step n={1}>{t("step1")}</Step>
              <Step n={2}>{t("step2")}</Step>
              <Step n={3}>{t("step3")}</Step>
            </ol>

            {/* rel=noopener: this opens Telegram Web in a new tab on desktop, the app on mobile */}
            <a
              href={payUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpened(true)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#2AABEE] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#229ED9]"
            >
              {TELEGRAM_LOGO}
              {t("openTelegram")}
            </a>

            {/* The code box is always here, not hidden behind "I've paid" — a buyer who pays on their
                phone and comes back to a desktop tab needs somewhere obvious to put the code. */}
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="mb-2 text-sm font-medium text-white">
                {opened ? t("afterPayingOpened") : t("afterPaying")}
              </p>
              <StarsRedeem onRedeemed={onRedeemed} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
