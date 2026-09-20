"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { redeemStarsCode } from "@/lib/api";

// "I paid with Telegram Stars — here's my code" form, shown on the account page.
// Twin of CryptoClaim: the purchase happened elsewhere (the pay bot) and this is the only step the
// website owns. Like crypto, a Stars purchase is a ONE-OFF term — nothing here renews, and there is
// deliberately NO refund control: refunds are issued by hand through the bot on request.
export default function StarsRedeem({ onRedeemed }: { onRedeemed?: () => void }) {
  const t = useTranslations("stars");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  async function submit() {
    const c = code.trim();
    if (!c) return;
    setBusy(true);
    setMsg("");
    try {
      await redeemStarsCode(c);
      setOk(true);
      setMsg(t("redeemed"));
      // The CALLER shows the confirmation overlay — it has to survive this form being unmounted
      // when the view switches back to the account overview.
      onRedeemed?.();
    } catch (e) {
      // The backend already returns a human-readable reason (invalid / already used / refunded),
      // so show it as-is rather than flattening every case to one generic line.
      setMsg(e instanceof Error ? e.message : t("errRedeem"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="mb-2 text-xs text-slate-400">{t("pastePrompt")}</p>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder={t("placeholder")}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white outline-none focus:border-brand"
      />
      {msg ? <p className={`mt-2 text-xs ${ok ? "text-mint" : "text-amber-300/90"}`}>{msg}</p> : null}
      <div className="mt-2 flex gap-2">
        <button
          onClick={submit}
          disabled={busy || !code.trim()}
          className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-ink hover:bg-white disabled:opacity-50"
        >
          {busy ? t("checking") : t("redeem")}
        </button>
      </div>
    </div>
  );
}
