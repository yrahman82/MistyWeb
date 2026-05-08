import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TV Sign In · MistyVPN",
  description: "Sign in to authorize your MistyVPN TV app.",
};

export default function TvLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
