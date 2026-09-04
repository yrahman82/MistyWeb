import type { Metadata } from "next";
import { site } from "@/lib/site";

// Root layout is a pass-through: the real <html>/<body> + per-locale metadata live in app/[locale]/layout.tsx
// (Next.js App Router supports the <html> living in a nested [locale] layout). Only metadataBase is set here.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
