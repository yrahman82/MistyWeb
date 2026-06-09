import type { Metadata } from "next";
import { Landing } from "@/components/Landing";

export const metadata: Metadata = {
  title: "Best VPN for China — bypass the Great Firewall",
  description:
    "MistyVPN uses VLESS+Reality and obfuscated Hysteria2 to slip past the Great Firewall's deep packet inspection. A fast, no-logs VPN that keeps working in China.",
  alternates: { canonical: "/vpn-china" },
};

export default function VpnChinaPage() {
  return (
    <Landing
      slug="vpn-china"
      crumb="VPN for China"
      eyebrow="VPN for China"
      h1="A VPN built to beat the Great Firewall"
      lede="China blocks most VPNs by detecting their traffic, not just their servers. MistyVPN disguises your connection as ordinary HTTPS so deep packet inspection has nothing to flag."
      bullets={[
        "VLESS+Reality — indistinguishable from a real HTTPS site",
        "Hysteria2 with Salamander obfuscation for throttled networks",
        "No-logs: nothing recorded to be requested or seized",
        "Runtime server discovery — keeps working as IPs rotate",
        "Works on iOS, Android, Mac and Android TV",
        "16 languages, including 中文",
      ]}
      sections={[
        {
          h2: "Why most VPNs fail in China",
          body: [
            "The Great Firewall doesn't only blacklist server addresses — it inspects the shape of your traffic. Classic VPN protocols like vanilla OpenVPN and IKEv2 have recognizable fingerprints, so the firewall can detect and throttle or drop them even on a fresh IP.",
            "Beating it requires traffic that looks identical to normal, allowed activity — like visiting a major website over HTTPS. That's exactly what MistyVPN's protocols are designed to produce.",
          ],
        },
        {
          h2: "How MistyVPN gets through",
          body: [
            "Our primary protocol, VLESS+Reality, borrows the TLS handshake of a real, popular website. To an observer — and to automated detection — your session is indistinguishable from an ordinary visit to that site. There's no tell-tale VPN signature to block.",
            "When networks are lossy or aggressively shaped, Hysteria2 with Salamander obfuscation maintains fast, stable throughput where other protocols stall. Auto mode tries the best option for your current network automatically.",
            "Because the apps discover working server addresses at runtime, MistyVPN keeps connecting even as individual IPs are rotated — without waiting for an app update.",
          ],
        },
        {
          h2: "Set it up before you travel",
          body: [
            "App stores and websites can be hard to reach once you're inside China, so install MistyVPN and sign in before you arrive. After that, connecting is a single tap, and Auto mode handles protocol selection for you.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Does MistyVPN really work in China?",
          a: "Yes. MistyVPN's VLESS+Reality and obfuscated Hysteria2 protocols are specifically engineered to evade the deep packet inspection used by the Great Firewall, where traditional VPN protocols are detected and blocked.",
        },
        {
          q: "Should I install it before going to China?",
          a: "Yes — install and sign in before you travel, since app stores and many websites are difficult to reach from inside China.",
        },
        {
          q: "Is using a VPN legal in China?",
          a: "This is general information, not legal advice. Rules and enforcement change; review the current local regulations and your own risk tolerance before traveling.",
        },
        {
          q: "Will my browsing be logged?",
          a: "No. MistyVPN is a strict no-logs service — there is no record of your activity or IP to hand over.",
        },
      ]}
    />
  );
}
