import type { Metadata } from "next";
import { Landing } from "@/components/Landing";

export const metadata: Metadata = {
  title: "Unblock anything, anywhere — websites, apps & streaming",
  description:
    "MistyVPN's Stealth Mode gets you past blocks and onto the open internet — your sites, your apps, your shows in HD — even on the most restricted networks. Start free.",
  alternates: { canonical: "/unblock" },
};

export default function UnblockPage() {
  return (
    <Landing
      slug="unblock"
      crumb="Unblock"
      eyebrow="Unblock"
      h1="Get the whole internet back"
      lede="Blocked at work, on campus, on hotel Wi-Fi, or behind a national firewall? MistyVPN's Stealth Mode keeps you connected to the sites, apps and shows you want — privately and at full speed."
      bullets={[
        "Stealth Mode gets past blocks other VPNs can't",
        "Stream your shows in crisp HD from anywhere",
        "Split tunneling keeps banking and local apps fast",
        "30+ locations, more added over time",
        "Strict no-logs — your activity stays yours",
        "Start free, no credit card",
      ]}
      sections={[
        {
          h2: "Why things get blocked — and how MistyVPN fixes it",
          body: [
            "Restricted networks don't just block addresses; many detect and shut down VPN traffic the moment they spot it. That's why so many VPNs simply stop working at work, at school, in hotels, or in censored regions.",
            "MistyVPN's Stealth Mode makes your connection look like ordinary, everyday browsing. There's no obvious VPN signature to flag — so you stay connected where other apps get cut off.",
          ],
        },
        {
          h2: "Streaming that doesn't buffer",
          body: [
            "A VPN is only good for streaming if it's fast. MistyVPN runs lean, modern technology across 30+ optimized locations, so high-definition video stays smooth instead of stalling.",
            "Pick a location, hit connect, and press play — it really is that simple.",
          ],
        },
        {
          h2: "Stay fast with split tunneling",
          body: [
            "You don't have to send everything through the VPN. With split tunneling you can route just your streaming and browsing through MistyVPN while your bank app, local services and games stay on your normal connection — full speed, no trade-offs.",
          ],
        },
      ]}
      faqs={[
        {
          q: "Will MistyVPN work where other VPNs are blocked?",
          a: "Yes. Stealth Mode disguises your connection as ordinary web traffic, so MistyVPN keeps working on restricted networks — workplaces, schools, hotels and heavily censored regions — where typical VPNs are detected and blocked.",
        },
        {
          q: "Can I stream in HD?",
          a: "Yes. MistyVPN is tuned for fast, high-definition streaming across 30+ locations, and split tunneling lets you route just your streaming apps through the VPN at full speed.",
        },
        {
          q: "Will it slow down my other apps?",
          a: "Not if you don't want it to. Split tunneling lets you keep banking, local sites and games on your normal connection while only your chosen apps use the VPN.",
        },
        {
          q: "Is there a free way to try it?",
          a: "Yes — start free and earn free minutes, with no account or credit card required.",
        },
      ]}
    />
  );
}
