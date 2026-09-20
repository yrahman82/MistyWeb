import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";

// Root layout is a pass-through: the real <html>/<body> + per-locale metadata live in app/[locale]/layout.tsx
// (Next.js App Router supports the <html> living in a nested [locale] layout). Only metadataBase is set here.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
};

// `interactiveWidget: "resizes-content"` makes the on-screen keyboard shrink the LAYOUT viewport.
// Without it (the default is "resizes-visual") iOS Safari leaves the layout viewport at full height
// when the keyboard opens, so position:fixed elements — the chat panel — keep their full height and
// end up underneath the keyboard. Everything else here is Next's default viewport.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
