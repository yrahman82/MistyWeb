import type { Metadata } from "next";
import { Landing } from "@/components/Landing";

export const metadata: Metadata = {
  title: "VPN for strict firewalls & restricted networks",
  description:
    "MistyVPN uses VLESS+Reality and obfuscated Hysteria2 to slip past deep packet inspection. A fast, no-logs VPN that keeps working behind the strictest firewalls.",
  alternates: { canonical: "/strict-firewalls" },
};

export default function StrictFirewallsPage() {
  return (
    <Landing
      slug="strict-firewalls"
      crumb="Strict Firewalls"
      eyebrow="Restricted networks"
      h1="A VPN built to beat strict firewalls"
      lede="The toughest networks don't just blacklist servers — they inspect the shape of your traffic. MistyVPN disguises your connection as ordinary HTTPS, so deep packet inspection has nothing to flag."
      bullets={[
        "VLESS+Reality — indistinguishable from a real HTTPS site",
        "Hysteria2 with Salamander obfuscation for throttled networks",
        "No-logs: nothing recorded to be requested or seized",
        "Runtime server discovery — keeps working as IPs rotate",
        "Auto mode picks the best protocol for your network",
        "Works on iOS, Android, Mac and Android TV",
      ]}
      sections={[
        {
          h2: "Why most VPNs get blocked",
          body: [
            "Restrictive networks and national firewalls don't only blacklist server addresses — they inspect the shape of your traffic. Classic VPN protocols like vanilla OpenVPN and IKEv2 have recognizable fingerprints, so they can be detected and throttled or dropped even on a fresh IP.",
            "Getting through requires traffic that looks identical to normal, allowed activity — like visiting a major website over HTTPS. That's exactly what MistyVPN's protocols are designed to produce.",
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
          h2: "Set it up ahead of time",
          body: [
            "On heavily filtered networks, app stores and websites can be hard to reach. Install MistyVPN and sign in while you have an open connection. After that, connecting is a single tap, and Auto mode handles protocol selection for you.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Does MistyVPN work behind strict firewalls?",
          a: "Yes. MistyVPN's VLESS+Reality and obfuscated Hysteria2 protocols are specifically engineered to evade the deep packet inspection used by the strictest firewalls, where traditional VPN protocols are detected and blocked.",
        },
        {
          q: "Should I install it in advance?",
          a: "Yes — install and sign in while you have an open connection, since app stores and many websites can be difficult to reach on heavily restricted networks.",
        },
        {
          q: "What makes it harder to block than other VPNs?",
          a: "MistyVPN disguises traffic as ordinary HTTPS and discovers working server addresses at runtime, so there's no fixed signature or single server to block.",
        },
        {
          q: "Will my browsing be logged?",
          a: "No. MistyVPN is a strict no-logs service — there is no record of your activity or IP to hand over.",
        },
      ]}
    />
  );
}
