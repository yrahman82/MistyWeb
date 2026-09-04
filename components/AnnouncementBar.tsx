"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

// Small rounded chip housing a brand mark (kept tiny for the announcement strip).
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-5 items-center justify-center rounded bg-white px-1.5 shadow-sm ring-1 ring-black/10">
      {children}
    </span>
  );
}
function ApplePayMark() {
  return (
    <span className="inline-flex h-5 items-center gap-1 rounded bg-black px-1.5 text-white ring-1 ring-white/15">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
        <path d="M17.05 12.04c-.02-2.05 1.68-3.03 1.75-3.08-.95-1.4-2.44-1.59-2.97-1.61-1.26-.13-2.46.74-3.1.74-.64 0-1.63-.72-2.68-.7-1.38.02-2.65.8-3.36 2.03-1.43 2.49-.37 6.17 1.02 8.19.68.99 1.49 2.1 2.56 2.06 1.03-.04 1.42-.66 2.66-.66 1.24 0 1.59.66 2.68.64 1.11-.02 1.81-1 2.49-1.99.78-1.14 1.1-2.24 1.12-2.3-.02-.01-2.15-.83-2.17-3.29zM15.02 6.6c.56-.68.94-1.62.84-2.56-.81.03-1.79.54-2.37 1.22-.52.6-.97 1.56-.85 2.48.9.07 1.82-.46 2.38-1.14z" />
      </svg>
      <span className="text-[10px] font-semibold">Pay</span>
    </span>
  );
}
function GooglePayMark() {
  return (
    <Chip>
      <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden>
        <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.76-2.11-6.71-4.94H1.29v3.09A12 12 0 0 0 12 24z" />
        <path fill="#FBBC05" d="M5.29 14.31A7.16 7.16 0 0 1 4.91 12c0-.8.14-1.58.38-2.31V6.6H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.4l4-3.09z" />
        <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.6l4 3.09C6.24 6.86 8.88 4.75 12 4.75z" />
      </svg>
      <span className="ml-0.5 text-[10px] font-semibold text-[#3c4043]">Pay</span>
    </Chip>
  );
}
function VisaMark() {
  return <Chip><span className="text-[10px] font-bold italic tracking-tight text-[#1434CB]">VISA</span></Chip>;
}
function MastercardMark() {
  return (
    <Chip>
      <svg viewBox="0 0 40 24" className="h-3.5 w-6" aria-label="Mastercard">
        <circle cx="16" cy="12" r="8" fill="#EB001B" />
        <circle cx="24" cy="12" r="8" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    </Chip>
  );
}
function UsdtMark() {
  return <span className="inline-flex h-5 items-center gap-0.5 rounded bg-[#26A17B] px-1.5 text-white"><span className="text-[10px] font-bold">₮</span><span className="text-[10px] font-semibold">USDT</span></span>;
}
function UsdcMark() {
  return <span className="inline-flex h-5 items-center gap-0.5 rounded bg-[#2775CA] px-1.5 text-white"><span className="text-[10px] font-bold">$</span><span className="text-[10px] font-semibold">USDC</span></span>;
}

// Payment-methods slide: brand marks only (no text) — the icons are recognizable and fit on one
// line, so this slide never needs to scroll. Returned as a fragment so the parent controls layout.
function PaymentsSlide() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <ApplePayMark />
      <GooglePayMark />
      <VisaMark />
      <MastercardMark />
      <UsdtMark />
      <UsdcMark />
    </span>
  );
}

function ShieldGlobe() {
  return (
    <svg className="h-4 w-4 shrink-0 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  );
}
function ClockMark() {
  return (
    <svg className="h-4 w-4 shrink-0 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
    </svg>
  );
}
function PlayMark() {
  return (
    <svg className="h-4 w-4 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9l5 3-5 3V9z" />
    </svg>
  );
}

export default function AnnouncementBar() {
  const t = useTranslations("announce");
  // Order: blocked countries → 90 free minutes → payment methods → streaming.
  const slides = [
    { key: "blocked", node: <><ShieldGlobe /><span>{t("blocked")}</span></> },
    { key: "free", node: <><ClockMark /><span>{t("free")}</span></> },
    { key: "payments", node: <PaymentsSlide /> },
    { key: "streaming", node: <><PlayMark /><span>{t("streaming")}</span></> },
  ];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [shift, setShift] = useState(0); // px the current line overflows the bar (0 = fits)

  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Rotate announcement-by-announcement (whole message swap, never character-by-character).
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Measure whether the current line overflows the bar (re-measured on slide + resize). When it
  // does, we scroll it horizontally so the whole announcement can be read; otherwise it stays static.
  useEffect(() => {
    const vp = viewportRef.current;
    const ct = contentRef.current;
    if (!vp || !ct || reduceMotion) {
      setShift(0);
      return;
    }
    const measure = () => setShift(Math.max(0, Math.ceil(ct.scrollWidth - vp.clientWidth)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [i, reduceMotion]);

  const marquee = !reduceMotion && shift > 0;
  const duration = Math.min(14, Math.max(5, shift / 30)); // longer lines scroll a little longer
  const contentStyle = marquee
    ? ({ "--ann-shift": `-${shift}px`, "--ann-dur": `${duration.toFixed(1)}s`, animationPlayState: paused ? "paused" : "running" } as React.CSSProperties)
    : undefined;

  return (
    <div
      className="border-b border-white/10 bg-gradient-to-r from-brand/15 via-ink to-accent/15 text-slate-200"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Announcements"
    >
      <style>{`@keyframes annFade{from{opacity:0;transform:translateY(2px)}to{opacity:1;transform:none}}.ann-fade{animation:annFade .45s ease}@keyframes annScroll{0%,14%{transform:translateX(0)}50%,64%{transform:translateX(var(--ann-shift))}100%{transform:translateX(0)}}.ann-scroll{animation:annScroll var(--ann-dur) ease-in-out infinite}`}</style>
      <div
        ref={viewportRef}
        className={`mx-auto flex min-h-11 max-w-6xl items-center overflow-hidden px-4 py-2.5 text-[13px] font-medium leading-tight sm:text-sm ${marquee ? "justify-start" : "justify-center text-center"}`}
        aria-live="polite"
      >
        <div
          key={slides[i].key}
          ref={contentRef}
          style={contentStyle}
          className={`inline-flex items-center gap-2 ${
            reduceMotion
              ? "flex-wrap justify-center"
              : "flex-nowrap whitespace-nowrap shrink-0"
          } ${marquee ? "ann-scroll" : "ann-fade"}`}
        >
          {slides[i].node}
        </div>
      </div>
    </div>
  );
}
