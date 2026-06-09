import type { ReactNode } from "react";

// Lightweight prose styling without the @tailwindcss/typography plugin.
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className="max-w-3xl leading-7 text-slate-300
        [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-white
        [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white
        [&_p]:mt-4
        [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2
        [&_strong]:text-white
        [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6
        [&_li]:marker:text-brand"
    >
      {children}
    </div>
  );
}
