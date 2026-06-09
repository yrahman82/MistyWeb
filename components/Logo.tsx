import type { SVGProps } from "react";

// Misty mark — a layered shield with a soft "mist" sweep.
export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden {...props}>
      <defs>
        <linearGradient id="misty-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="0.55" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <path
        d="M20 3.5l13 4.7v8.3c0 8.4-5.6 14.9-13 17.7-7.4-2.8-13-9.3-13-17.7V8.2L20 3.5z"
        fill="url(#misty-logo-g)"
        opacity="0.18"
      />
      <path
        d="M20 6l10.5 3.8v6.9c0 6.9-4.6 12.3-10.5 14.6C14.1 29 9.5 23.6 9.5 16.7V9.8L20 6z"
        fill="none"
        stroke="url(#misty-logo-g)"
        strokeWidth="2"
      />
      <path
        d="M14 18.5c2 .9 3.2-.9 6-.9s4 1.8 6 .9"
        fill="none"
        stroke="url(#misty-logo-g)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15 14c1.6.7 2.6-.7 5-.7s3.4 1.4 5 .7"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
