"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

// Visitor chat widget. Talks to same-origin /chat/* (rewritten to the MistyChat relay), so it's
// reachable whenever the page is — including in China/Russia. Short-polls for agent replies. If the
// relay isn't deployed / disabled, /chat/config fails and the bubble simply never appears.
type Msg = { from: "you" | "agent"; text: string };

export default function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [enabled, setEnabled] = useState<boolean | null>(null); // null = unknown
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const cursor = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Is the relay live? (silent no-op if not)
  useEffect(() => {
    let ok = true;
    fetch("/chat/config")
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d) => ok && setEnabled(!!d.enabled))
      .catch(() => ok && setEnabled(false));
    return () => { ok = false; };
  }, []);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  // Start a session the first time the panel opens.
  useEffect(() => {
    if (!open || session || failed) return;
    let ok = true;
    fetch("/chat/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: locale }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!ok) return;
        if (d?.sessionToken) setSession(d.sessionToken);
        else setFailed(true);
      })
      .catch(() => ok && setFailed(true));
    return () => { ok = false; };
  }, [open, session, failed, locale]);

  // Short-poll for agent replies while the panel is open.
  useEffect(() => {
    if (!open || !session) return;
    let ok = true;
    const tick = async () => {
      try {
        const r = await fetch(`/chat/poll?session=${session}&after=${cursor.current}&wait=0`);
        if (!r.ok) return;
        const d = await r.json();
        if (!ok) return;
        if (Array.isArray(d.messages) && d.messages.length) {
          setMessages((m) => [...m, ...d.messages.map((x: { text: string }) => ({ from: "agent" as const, text: x.text }))]);
          cursor.current = d.cursor;
          scrollDown();
        }
      } catch { /* ignore transient poll errors */ }
    };
    const id = setInterval(tick, 3000);
    tick();
    return () => { ok = false; clearInterval(id); };
  }, [open, session, scrollDown]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || !session || busy) return;
    setBusy(true);
    setInput("");
    setMessages((m) => [...m, { from: "you", text }]);
    scrollDown();
    try {
      await fetch("/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: session, text }),
      });
    } catch { /* message shows locally; poll will bring the reply */ }
    setBusy(false);
  }, [input, session, busy, scrollDown]);

  if (!enabled) return null; // relay disabled or not deployed → no bubble

  return (
    <>
      {/* Launcher bubble */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("bubble")}
          className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand text-ink shadow-xl shadow-black/40 transition-transform hover:scale-105"
        >
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
          </svg>
        </button>
      ) : null}

      {/* Panel */}
      {open ? (
        <div className="fixed bottom-5 right-5 z-40 flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-brand/15 to-accent/15 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">{t("title")}</p>
              <p className="text-xs text-slate-400">{t("subtitle")}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={t("close")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4 text-sm">
            <div className="max-w-[85%] rounded-2xl bg-white/[0.06] px-3.5 py-2 text-slate-200">{t("greeting")}</div>
            {failed ? (
              <div className="max-w-[90%] rounded-2xl bg-white/[0.06] px-3.5 py-2 text-slate-300">{t("unavailable")}</div>
            ) : null}
            {messages.map((m, i) => (
              <div key={i} className={m.from === "you" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 ${m.from === "you" ? "bg-brand text-ink" : "bg-white/[0.06] text-slate-200"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {!failed ? (
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 border-t border-white/10 px-3 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={session ? t("placeholder") : t("connecting")}
                disabled={!session || busy}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-brand/50 focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!session || busy || !input.trim()}
                aria-label={t("send")}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-ink transition-colors disabled:opacity-40"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
