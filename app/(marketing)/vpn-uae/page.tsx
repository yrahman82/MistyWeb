import type { Metadata } from "next";
import { Landing } from "@/components/Landing";

export const metadata: Metadata = {
  title: "Best VPN for the UAE — Dubai & Abu Dhabi",
  description:
    "MistyVPN works reliably across the UAE with censorship-resistant protocols and fast streaming. A no-logs VPN for residents and travelers in Dubai and Abu Dhabi.",
  alternates: { canonical: "/vpn-uae" },
};

export default function VpnUaePage() {
  return (
    <Landing
      slug="vpn-uae"
      crumb="VPN for the UAE"
      eyebrow="VPN for the UAE"
      h1="A fast, reliable VPN for the UAE"
      lede="From Dubai to Abu Dhabi, MistyVPN keeps you connected with protocols that blend into normal web traffic — and streaming that actually works."
      bullets={[
        "Censorship-resistant VLESS+Reality and Hysteria2",
        "Fast streaming with split tunneling",
        "Strict no-logs privacy",
        "Apps for iOS, Android, Mac and Android TV",
        "Arabic interface with full right-to-left support",
        "One subscription across all your devices",
      ]}
      sections={[
        {
          h2: "Built for restricted networks",
          body: [
            "Networks in the UAE filter a range of services and inspect traffic patterns. MistyVPN's protocols disguise your connection as an ordinary HTTPS session, so it stays stable where simpler VPNs get detected and blocked.",
            "Auto mode selects the best-performing protocol for your current network — you don't need to fiddle with settings to stay connected.",
          ],
        },
        {
          h2: "Stream and call at full speed",
          body: [
            "MistyVPN is tuned for everyday use: video, voice and browsing stay quick. Split tunneling lets you route only the apps you choose through the VPN, keeping local services fast and direct.",
            "The app is fully localized in Arabic with proper right-to-left layout, alongside 15 other languages.",
          ],
        },
        {
          h2: "Privacy you can trust",
          body: [
            "MistyVPN keeps no activity logs and never records your IP address. Your browsing stays your business.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Does MistyVPN work in the UAE?",
          a: "Yes. MistyVPN uses censorship-resistant protocols (VLESS+Reality, obfuscated Hysteria2) designed to remain reliable on filtered networks across the UAE.",
        },
        {
          q: "Is the app available in Arabic?",
          a: "Yes — MistyVPN is fully localized in Arabic with proper right-to-left layout, plus 15 other languages.",
        },
        {
          q: "Is using a VPN legal in the UAE?",
          a: "This is general information, not legal advice. Local regulations on VPN use exist and can change — review the current rules and your own risk tolerance.",
        },
        {
          q: "Can I use one account on multiple devices?",
          a: "Yes. A single MistyVPN subscription covers all your devices with multiple simultaneous connections.",
        },
      ]}
    />
  );
}
