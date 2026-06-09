import type { Metadata } from "next";
import { Landing } from "@/components/Landing";

export const metadata: Metadata = {
  title: "Stream from anywhere — a VPN for Netflix & more",
  description:
    "Watch your shows wherever you are. MistyVPN delivers fast, buffer-free streaming with split tunneling and a global server fleet. Start free, no card needed.",
  alternates: { canonical: "/unblock-netflix" },
};

export default function UnblockNetflixPage() {
  return (
    <Landing
      slug="unblock-netflix"
      crumb="Streaming"
      eyebrow="Streaming"
      h1="Your shows, wherever you are"
      lede="Travel without losing your watchlist. MistyVPN keeps streaming fast and smooth, and split tunneling lets you send just the apps you choose through the tunnel."
      bullets={[
        "Full-speed, buffer-free streaming",
        "Split tunneling — route only what you want",
        "Global server fleet, more locations weekly",
        "Works on Android TV and mobile",
        "Strict no-logs",
        "Start free, no credit card",
      ]}
      sections={[
        {
          h2: "Streaming that doesn't buffer",
          body: [
            "A VPN is only good for streaming if it's fast. MistyVPN runs lean, modern protocols across a global server fleet, so high-bitrate video stays smooth instead of stalling.",
            "Pick a server close to where you want to appear and start watching — the apps make connecting a one-tap affair.",
          ],
        },
        {
          h2: "Split tunneling keeps everything snappy",
          body: [
            "You don't have to route your whole device through the VPN. With split tunneling you can send just your streaming app through the tunnel while everything else — banking, local sites, fast downloads — goes direct.",
            "It's the best of both worlds: the content you want, without slowing down the rest of your device.",
          ],
        },
        {
          h2: "On the big screen too",
          body: [
            "MistyVPN runs natively on Android TV, so you can set it up right on your living-room screen — sign in with a QR code and you're connected.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Will streaming be fast on MistyVPN?",
          a: "Yes — MistyVPN uses lean modern protocols and a global server fleet tuned for high-bitrate video, so streaming stays smooth.",
        },
        {
          q: "What is split tunneling?",
          a: "Split tunneling lets you choose which apps or sites go through the VPN and which connect directly — so you can route only your streaming app while keeping everything else local and fast.",
        },
        {
          q: "Does it work on Android TV?",
          a: "Yes. MistyVPN has a native Android TV app with QR-code sign-in.",
        },
        {
          q: "Is there a free option?",
          a: "Yes — start free with daily minutes and no credit card, then upgrade to Premium for unlimited streaming.",
        },
      ]}
    />
  );
}
