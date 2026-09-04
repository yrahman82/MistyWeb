"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { claimCrypto } from "@/lib/api";

// Reusable "I paid but it's not showing — verify my transaction" form. Used in TWO places:
//  • the crypto pay screen (scoped to that invoice), and
//  • the account page (no invoiceId → the backend matches the tx to any pending invoice).
// The tx hash is only a hint; the backend re-verifies it on-chain before crediting.
export default function CryptoClaim({
  invoiceId,
  onPaid,
  variant = "inline",
}: {
  invoiceId?: string;
  onPaid?: () => void;
  variant?: "inline" | "section";
}) {
  const t = useTranslations("crypto");
  const [open, setOpen] = useState(variant === "section"); // account page: always open; pay screen: link first
  const [txHash, setTxHash] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  async function submit() {
    const tx = txHash.trim();
    if (!tx) return;
    setBusy(true);
    setMsg("");
    try {
      const r = await claimCrypto(tx, invoiceId);
      if (r.status === "paid") {
        setOk(true);
        setMsg(t("claim.confirmed"));
        onPaid?.();
        return;
      }
      setMsg(r.message ?? t("claim.notFound"));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : t("claim.errVerify"));
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs text-brand hover:underline">
        {t("claim.openLink")}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="mb-2 text-xs text-slate-400">{t("claim.pastePrompt")}</p>
      <input
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        placeholder={t("claim.placeholder")}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white outline-none focus:border-brand"
      />
      {msg ? <p className={`mt-2 text-xs ${ok ? "text-mint" : "text-amber-300/90"}`}>{msg}</p> : null}
      <div className="mt-2 flex gap-2">
        {variant === "inline" ? (
          <button
            onClick={() => setOpen(false)}
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white hover:bg-white/5"
          >
            {t("claim.cancel")}
          </button>
        ) : null}
        <button
          onClick={submit}
          disabled={busy || !txHash.trim()}
          className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-ink hover:bg-white disabled:opacity-50"
        >
          {busy ? t("claim.checking") : t("claim.verify")}
        </button>
      </div>
    </div>
  );
}
