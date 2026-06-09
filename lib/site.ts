// Single source of truth for site-wide content + SEO metadata.

export const site = {
  name: "MistyVPN",
  tagline: "Secure. Private. Fast.",
  // Marketing one-liner used as the default meta description.
  description:
    "MistyVPN is a fast, no-logs VPN built to work where others get blocked. Modern censorship-resistant protocols, streaming that just works, and apps for every device.",
  url: "https://mistyvpn.com",
  email: "support@mistyvpn.com",
  twitter: "@mistyvpn",
  // App store links are placeholders until the apps are published.
  stores: {
    ios: "#get-started",
    android: "#get-started",
    mac: "#get-started",
    tv: "#get-started",
  },
} as const;

export type NavItem = { label: string; href: string };

export const nav: NavItem[] = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "No-Logs", href: "/no-logs" },
  { label: "Strict Firewalls", href: "/strict-firewalls" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Product",
    items: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Stream Netflix", href: "/unblock-netflix" },
    ],
  },
  {
    title: "Use cases",
    items: [
      { label: "Strict firewalls", href: "/strict-firewalls" },
      { label: "Streaming", href: "/unblock-netflix" },
      { label: "No-logs privacy", href: "/no-logs" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

// Protocols — universal names, not translated.
export const protocols = [
  {
    name: "VLESS + Reality",
    blurb:
      "Looks identical to a normal HTTPS visit to a major website. Undetectable by deep packet inspection — our strongest option behind the strictest firewalls.",
  },
  {
    name: "Hysteria2",
    blurb:
      "QUIC-based and brutally fast on lossy or throttled networks, with Salamander obfuscation to slip past traffic shaping.",
  },
  {
    name: "WireGuard",
    blurb:
      "The modern, lean, audited tunnel — optionally wrapped in ShadowTLS so it blends into ordinary web traffic.",
  },
];

export const features = [
  {
    icon: "shield",
    title: "Censorship-resistant by design",
    body: "Reality, Hysteria2 and ShadowTLS disguise your traffic as ordinary HTTPS, so it keeps working on networks that block everything else.",
  },
  {
    icon: "eyeOff",
    title: "Strict no-logs",
    body: "We don't record what you do, where you go, or your IP. There's nothing to hand over because there's nothing to keep.",
  },
  {
    icon: "bolt",
    title: "Built for speed",
    body: "Lean modern protocols and a global server fleet mean streaming, calls and downloads stay fast — even on bad connections.",
  },
  {
    icon: "play",
    title: "Streaming that works",
    body: "Reach your shows from anywhere. Split tunneling sends only what you choose through the tunnel, at full speed.",
  },
  {
    icon: "devices",
    title: "Every device",
    body: "iPhone, iPad, Android, Mac, Android TV — one account, simultaneous connections, the same simple app everywhere.",
  },
  {
    icon: "lock",
    title: "Kill switch + split tunneling",
    body: "Block all traffic if the tunnel drops, or route only specific apps and sites. You stay in control.",
  },
  {
    icon: "globe",
    title: "16 languages",
    body: "The app speaks your language — including full right-to-left support for Arabic and Urdu — and we add more without an update.",
  },
  {
    icon: "server",
    title: "A growing global fleet",
    body: "Servers across the Americas, Europe, the Middle East and Asia, with more locations rolling out continually.",
  },
];

export const platforms = [
  { name: "iOS & iPadOS", store: "App Store", href: site.stores.ios, icon: "apple" },
  { name: "Android", store: "Google Play", href: site.stores.android, icon: "android" },
  { name: "macOS", store: "Mac App Store", href: site.stores.mac, icon: "apple" },
  { name: "Android TV", store: "Google Play", href: site.stores.tv, icon: "tv" },
];

export const faqs = [
  {
    q: "Does MistyVPN keep logs?",
    a: "No. MistyVPN is a strict no-logs service — we don't track your browsing, traffic, or IP address. See our No-Logs page for the full detail.",
  },
  {
    q: "Will it work behind strict firewalls?",
    a: "Yes. MistyVPN's VLESS+Reality and Hysteria2 protocols are specifically designed to evade the deep packet inspection and traffic shaping used by the strictest national firewalls and restricted networks.",
  },
  {
    q: "How many devices can I use at once?",
    a: "One subscription covers all your devices — iPhone, Android, Mac and Android TV — with multiple simultaneous connections.",
  },
  {
    q: "Can I stream with MistyVPN?",
    a: "Yes. MistyVPN is built for streaming, and split tunneling lets you send only the apps you choose through the VPN at full speed.",
  },
  {
    q: "How do I subscribe?",
    a: "Subscriptions are handled securely in the app through the App Store or Google Play. There's a free tier to get started — no credit card needed.",
  },
  {
    q: "Which protocols does MistyVPN support?",
    a: "VLESS+Reality, Hysteria2 (with Salamander obfuscation), and WireGuard (optionally wrapped in ShadowTLS). Auto mode picks the best one for your network.",
  },
];

// Pricing is display-only for now — purchases happen inside the apps.
export const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "to try",
    highlight: false,
    blurb: "Get a taste of MistyVPN with free minutes — no account, no card.",
    features: [
      "Free minutes to get started",
      "All protocols",
      "Single device",
      "No credit card",
    ],
    cta: "Get started",
  },
  {
    name: "Premium",
    price: "$2",
    cadence: "/ month",
    highlight: true,
    blurb: "Unlimited, full-speed access on all your devices.",
    features: [
      "Unlimited data & time",
      "All protocols & locations",
      "Up to 10 devices at once",
      "Streaming optimized",
      "Priority support",
    ],
    cta: "Get the app",
  },
  {
    name: "Premium Annual",
    price: "$18",
    cadence: "/ year",
    highlight: false,
    blurb: "The same Premium, billed yearly — the best value.",
    features: [
      "Everything in Premium",
      "Save 25% vs monthly",
      "Up to 10 devices at once",
      "Priority support",
    ],
    cta: "Get the app",
  },
];
