"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { Spinner, Loader } from "@/components/ui";
import CryptoClaim from "@/components/CryptoClaim";
import { Usdt, Usdc, NetworkBadge } from "@/components/PayBrands";
import {
  getCryptoAssets,
  createCryptoInvoice,
  getCryptoInvoice,
  type CryptoAsset,
  type CryptoInvoice,
} from "@/lib/api";

// Display metadata per chain. NO fee ranking — the send fee depends entirely on where the customer
// pays FROM (a wallet vs an exchange like Binance give very different fees, sometimes opposite), so
// we don't claim a "cheapest". Order is by how common the network is.
const NETWORKS: Record<string, { label: string; order: number }> = {
  tron: { label: "TRON (TRC-20)", order: 0 },
  bsc: { label: "BNB Smart Chain (BEP-20)", order: 1 },
  ethereum: { label: "Ethereum (ERC-20)", order: 2 },
};

const netLabel = (chain: string) => NETWORKS[chain]?.label ?? chain;

export default function CryptoCheckout({
  plan,
  planLabel,
  onPaid,
  onBack,
}: {
  plan: string;
  planLabel?: string;
  onPaid: () => void;
  onBack: () => void;
}) {
  const t = useTranslations("crypto");
  const [assets, setAssets] = useState<CryptoAsset[] | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [invoice, setInvoice] = useState<CryptoInvoice | null>(null);
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState("");

  // Load the coin/chain menu.
  useEffect(() => {
    getCryptoAssets()
      .then((c) => {
        setEnabled(c.enabled);
        setAssets(
          [...c.assets].sort(
            (a, b) =>
              (NETWORKS[a.chain]?.order ?? 9) - (NETWORKS[b.chain]?.order ?? 9) ||
              (a.coin === "USDT" ? 0 : 1) - (b.coin === "USDT" ? 0 : 1), // USDT first (more common)
          ),
        );
      })
      .catch(() => setErr(t("errors.loadOptions")));
  }, [t]);

  const pick = useCallback(
    async (coin: string, chain: string) => {
      setCreating(true);
      setErr("");
      try {
        setInvoice(await createCryptoInvoice(plan, coin, chain));
      } catch (e) {
        setErr(e instanceof Error ? e.message : t("errors.startPayment"));
      } finally {
        setCreating(false);
      }
    },
    [plan, t],
  );

  if (invoice) {
    return (
      <CryptoPay
        invoice={invoice}
        onPaid={onPaid}
        onStartOver={() => {
          setInvoice(null);
          setErr("");
        }}
      />
    );
  }

  // ── Coin / chain picker ──────────────────────────────────────────────────
  return (
    <div className="w-full max-w-lg">
      <button onClick={onBack} className="text-sm text-slate-400 hover:text-white">
        {t("backToMethods")}
      </button>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {planLabel ? `${planLabel} · ` : ""}{t("chooseCoinNetwork")}
        </p>

        {!assets ? (
          <Loader label={t("loadingOptions")} className="mt-6" />
        ) : !enabled ? (
          <p className="mt-6 text-sm text-slate-400">{t("notAvailable")}</p>
        ) : creating ? (
          <Loader label={t("preparingAddress")} className="mt-6" />
        ) : (
          <div className="mt-5">
            <p className="mb-3 text-xs text-slate-500">
              {t("pickNetworkHint")}
            </p>
            <div className="space-y-3">
              {assets.map((a) => (
                <button
                  key={`${a.coin}-${a.chain}`}
                  onClick={() => pick(a.coin, a.chain)}
                  className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition-colors hover:border-brand/50 hover:bg-white/[0.05]"
                >
                  <span className="flex items-center gap-3">
                    {a.coin === "USDT" ? <Usdt /> : <Usdc />}
                    <NetworkBadge chain={a.chain} />
                    <span className="text-sm font-medium text-white">{netLabel(a.chain)}</span>
                  </span>
                  <span className="text-slate-500 transition-colors group-hover:text-white">›</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {err ? <p className="mt-4 text-sm text-red-400">{err}</p> : null}
      </div>
    </div>
  );
}

// ── Pay screen: address + QR + live status ───────────────────────────────────
function CryptoPay({
  invoice,
  onPaid,
  onStartOver,
}: {
  invoice: CryptoInvoice;
  onPaid: () => void;
  onStartOver: () => void;
}) {
  const t = useTranslations("crypto");
  const [inv, setInv] = useState<CryptoInvoice>(invoice);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());
  const paidFired = useRef(false);

  const firePaid = useCallback(() => {
    if (paidFired.current) return;
    paidFired.current = true;
    onPaid();
  }, [onPaid]);

  // Poll status (READ-ONLY; the backend does the crediting on-chain).
  useEffect(() => {
    if (inv.status === "paid") {
      firePaid();
      return;
    }
    const id = setInterval(async () => {
      const fresh = await getCryptoInvoice(inv.invoiceId).catch(() => null);
      if (fresh) {
        setInv(fresh);
        if (fresh.status === "paid") {
          clearInterval(id);
          firePaid();
        }
      }
    }, 5000);
    return () => clearInterval(id);
  }, [inv.invoiceId, inv.status, firePaid]);

  // 1s tick for the countdown.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);


  const msLeft = new Date(inv.expiresAt).getTime() - now;
  const expired = msLeft <= 0;
  const mm = Math.max(0, Math.floor(msLeft / 60000));
  const ss = Math.max(0, Math.floor((msLeft % 60000) / 1000));

  const amount = inv.amount.toFixed(2);

  return (
    <div className="w-full max-w-lg">
      <button onClick={onStartOver} className="text-sm text-slate-400 hover:text-white">
        {t("changeCoin")}
      </button>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        {/* Amount + selected coin/network — big, iconic, bold so it can't be misread */}
        <div className="text-center">
          <p className="text-sm text-slate-400">{t("sendExactly")}</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-white">
            {amount} <span className="text-brand">{inv.coin}</span>
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {inv.coin === "USDT" ? <Usdt /> : <Usdc />}
            <span className="text-sm text-slate-400">{t("on")}</span>
            <NetworkBadge chain={inv.chain} />
            <span className="text-sm font-semibold text-white">{netLabel(inv.chain)}</span>
          </div>
        </div>

        {/* Critical wrong-coin/network warning — bold names */}
        <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/[0.08] p-3 text-center text-xs text-amber-200">
          {t.rich("warning", {
            coin: inv.coin,
            network: netLabel(inv.chain),
            b: (chunks) => <b className="text-white">{chunks}</b>,
          })}
        </div>

        {/* QR — client-side render; the address never leaves the browser to a 3rd party */}
        <div className="mt-5 flex justify-center">
          <div className="rounded-2xl bg-white p-3">
            <QRCodeSVG value={inv.paymentUri} size={196} includeMargin={false} />
          </div>
        </div>

        {/* Address + copy */}
        <div className="mt-5">
          <p className="mb-1 text-xs text-slate-400">{t("paymentAddress")}</p>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <span className="min-w-0 flex-1 break-all font-mono text-xs text-white">{inv.address}</span>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(inv.address);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
              className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white hover:bg-white/5"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
          {inv.status === "paid" ? (
            <p className="text-sm font-medium text-mint">{t("paidActivating")}</p>
          ) : inv.confirmations > 0 ? (
            <Spinner label={t("confirming", { confirmations: inv.confirmations })} className="justify-center" />
          ) : expired ? (
            <p className="text-sm text-slate-300">
              {t("expiredNotice")}
            </p>
          ) : (
            <div>
              <Spinner label={t("waiting")} className="justify-center" />
              <p className="mt-2 text-xs text-slate-500">
                {t("window", { time: `${mm}:${ss.toString().padStart(2, "0")}` })}
              </p>
            </div>
          )}
        </div>

        {/* Recovery — same component as the account page (paste tx hash → backend re-verifies on-chain) */}
        <div className="mt-4">
          <CryptoClaim invoiceId={inv.invoiceId} onPaid={firePaid} variant="inline" />
        </div>

        {expired ? (
          <button
            onClick={onStartOver}
            className="mt-4 w-full rounded-full border border-white/15 px-5 py-2.5 text-sm text-white hover:bg-white/5"
          >
            {t("startOver")}
          </button>
        ) : null}
      </div>
    </div>
  );
}
