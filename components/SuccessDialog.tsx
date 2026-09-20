"use client";

import { useEffect } from "react";

// A confirmation the user cannot miss.
//
// The activation forms live far down long pages (the account page, the crypto pay screen), and on a
// phone the keyboard has usually scrolled the field to the middle of the view. An inline success
// line under the input is then literally off-screen: people pressed Verify, the page jumped, and
// they had no idea whether it had worked. A fixed overlay is visible wherever the page happens to
// be scrolled, which is the whole point of using one here.
export default function SuccessDialog({
  title,
  body,
  cta,
  onClose,
}: {
  title: string;
  body: string;
  cta: string;
  onClose: () => void;
}) {
  // Escape closes, and the page behind must not scroll while this is up (on iOS a scrollable body
  // under a fixed overlay drags the overlay around with it).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0F1E30] p-6 text-center shadow-2xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint/15">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-mint" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
        <button
          onClick={onClose}
          autoFocus
          className="mt-5 w-full rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
