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
  const [unread, setUnread] = useState(0);
  const cursor = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  // How much of the viewport the on-screen keyboard is covering, and the visible height.
  const [kb, setKb] = useState(0);
  const [vvh, setVvh] = useState(0);

  // Is the relay live? (silent no-op if not)
  useEffect(() => {
    let ok = true;
    fetch("/chat/config")
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d) => ok && setEnabled(!!d.enabled))
      .catch(() => ok && setEnabled(false));
    return () => { ok = false; };
  }, []);

  // iOS Safari does NOT shrink the layout viewport for the on-screen keyboard — only the VISUAL
  // viewport shrinks — so a position:fixed panel keeps its full height and the keyboard covers the
  // bottom of it. dvh can't fix that. Track the visual viewport and lift/shrink the panel by hand.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const sync = () => {
      setKb(Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)));
      setVvh(Math.round(vv.height));
    };
    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => { vv.removeEventListener("resize", sync); vv.removeEventListener("scroll", sync); };
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

  // Short-poll for agent replies. This runs whether or not the panel is open: a visitor who closes
  // the panel must still learn that the agent answered (unread badge on the bubble). Closed polling
  // is slower — the reply is still waiting on the relay, it just doesn't need 3s latency.
  useEffect(() => {
    if (!session) return;
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
          if (!open) setUnread((n) => n + d.messages.length);
          scrollDown();
        }
      } catch { /* ignore transient poll errors */ }
    };
    const id = setInterval(tick, open ? 3000 : 15000);
    tick();
    return () => { ok = false; clearInterval(id); };
  }, [open, session, scrollDown]);

  useEffect(() => { if (open && kb > 0) scrollDown(); }, [open, kb, scrollDown]);

  // While the panel is open, stop the page behind it from scrolling. Beyond the obvious, this is
  // what stops iOS Safari scrolling the document to "reveal" the focused input — that scroll is
  // what drags a position:fixed panel out of view when the keyboard opens.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

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
          onClick={() => { setOpen(true); setUnread(0); }}   // opening it = the visitor has seen them
          aria-label={t("bubble")}
          className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] end-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-indigo-600 text-white shadow-xl shadow-indigo-600/40 ring-1 ring-white/15 transition-transform hover:scale-105"
        >
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
          </svg>
          {/* The agent answered while the panel was closed. Purely visual — no push notifications,
              no permission prompt. The count is language-neutral, so it needs no translation. */}
          {unread > 0 ? (
            <>
              <span aria-hidden className="absolute -end-0.5 -top-0.5 inline-flex h-5 w-5 animate-ping rounded-full bg-rose-500/60" />
              <span className="absolute -end-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-ink">
                {unread > 9 ? "9+" : unread}
              </span>
            </>
          ) : null}
        </button>
      ) : null}

      {/* Panel. On phones it is pinned to both side edges (no 100vw arithmetic — 100vw ignores the
          scrollbar and overflows) and sized in dvh, which tracks the visible area as mobile browser
          chrome shows and hides. Fixed vh units are what pushed the panel off-screen. */}
      {open ? (
        <div
          // With the keyboard up, sit directly on top of it and take the space that is actually
          // visible. With it down, the Tailwind classes below apply unchanged.
          style={kb > 0 ? { bottom: kb + 12, height: Math.max(200, vvh - 24), maxHeight: "none" } : undefined}
          className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 flex h-[70dvh] max-h-[560px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink shadow-2xl shadow-black/50 sm:inset-x-auto sm:bottom-5 sm:end-5 sm:w-[22rem]"
        >
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
