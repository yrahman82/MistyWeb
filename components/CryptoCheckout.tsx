"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Spinner, Loader } from "@/components/ui";
import CryptoClaim from "@/components/CryptoClaim";
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
              a.coin.localeCompare(b.coin),
          ),
        );
      })
      .catch(() => setErr("Couldn't load crypto options. Please try again."));
  }, []);

  const pick = useCallback(
    async (coin: string, chain: string) => {
      setCreating(true);
      setErr("");
      try {
        setInvoice(await createCryptoInvoice(plan, coin, chain));
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Couldn't start the payment.");
      } finally {
        setCreating(false);
      }
    },
    [plan],
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
        ← Choose a different payment method
      </button>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h1 className="text-xl font-semibold">Pay with crypto</h1>
        <p className="mt-1 text-sm text-slate-400">
          {planLabel ? `${planLabel} · ` : ""}Choose the coin and network you&apos;ll pay from.
        </p>

        {!assets ? (
          <Loader label="Loading options…" className="mt-6" />
        ) : !enabled ? (
          <p className="mt-6 text-sm text-slate-400">Crypto payments aren&apos;t available right now.</p>
        ) : creating ? (
          <Loader label="Preparing your payment address…" className="mt-6" />
        ) : (
          <div className="mt-5">
            <p className="mb-3 text-xs text-slate-500">
              Pick the network your wallet or exchange supports — network fees vary by where you send from.
            </p>
            <div className="space-y-3">
              {assets.map((a) => (
                <button
                  key={`${a.coin}-${a.chain}`}
                  onClick={() => pick(a.coin, a.chain)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition-colors hover:border-brand/50"
                >
                  <span className="font-semibold text-white">
                    {a.coin} <span className="text-slate-400">on</span> {netLabel(a.chain)}
                  </span>
                  <span className="text-slate-500">›</span>
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
        ← Change coin
      </button>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        {/* Amount + network */}
        <div className="text-center">
          <p className="text-sm text-slate-400">Send exactly</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {amount} <span className="text-brand">{inv.coin}</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">on {netLabel(inv.chain)}</p>
        </div>

        {/* Critical wrong-network warning */}
        <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-3 text-center text-xs text-amber-300/90">
          Only send <b>{inv.coin}</b> on the <b>{netLabel(inv.chain)}</b> network to this address.
          Sending a different coin or network will be lost.
        </div>

        {/* QR — client-side render; the address never leaves the browser to a 3rd party */}
        <div className="mt-5 flex justify-center">
          <div className="rounded-2xl bg-white p-3">
            <QRCodeSVG value={inv.paymentUri} size={196} includeMargin={false} />
          </div>
        </div>

        {/* Address + copy */}
        <div className="mt-5">
          <p className="mb-1 text-xs text-slate-400">Payment address</p>
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
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
          {inv.status === "paid" ? (
            <p className="text-sm font-medium text-mint">Payment received — activating…</p>
          ) : inv.confirmations > 0 ? (
            <Spinner label={`Payment detected — confirming (${inv.confirmations})…`} className="justify-center" />
          ) : expired ? (
            <p className="text-sm text-slate-300">
              This window timed out. If you already sent it, it can still complete — use
              &ldquo;I&apos;ve already sent it&rdquo; below, or start over.
            </p>
          ) : (
            <div>
              <Spinner label="Waiting for your payment…" className="justify-center" />
              <p className="mt-2 text-xs text-slate-500">
                Window: {mm}:{ss.toString().padStart(2, "0")}
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
            Start over
          </button>
        ) : null}
      </div>
    </div>
  );
}
