import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Same-domain proxy for the live chat: visitors hit mistyvpn.com/chat/* so the chat inherits the
  // site's reachability (incl. China/Russia); it rewrites to the MistyChat relay. Only active when
  // CHAT_RELAY_URL is set (before the relay is deployed, the widget's /chat/config just 404s → hidden).
  async rewrites() {
    const relay = process.env.CHAT_RELAY_URL?.replace(/\/+$/, "");
    return relay ? [{ source: "/chat/:path*", destination: `${relay}/:path*` }] : [];
  },
};

export default withNextIntl(nextConfig);
