// Single source of truth for site-wide content + SEO metadata.

export const site = {
  name: "MistyVPN",
  tagline: "Secure. Private. Fast.",
  description:
    "MistyVPN keeps you private and unblocked on every device. Stealth technology that beats blocks, split tunneling, a strict no-logs promise, and 30+ global locations — starting free.",
  url: "https://mistyvpn.com",
  email: "support@mistyvpn.com",
  twitter: "@mistyvpn",
  locations: "30+",
  languages: 16,
  // Store links are placeholders until the apps are published.
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
  { label: "Compare", href: "/compare" },
  { label: "No-Logs", href: "/no-logs" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Product",
    items: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Compare VPNs", href: "/compare" },
      { label: "Unblock anything", href: "/unblock" },
    ],
  },
  {
    title: "Trust",
    items: [
      { label: "No-logs promise", href: "/no-logs" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    title: "Get the app",
    items: [
      { label: "iPhone & iPad", href: "/#get-started" },
      { label: "Android", href: "/#get-started" },
      { label: "Mac", href: "/#get-started" },
      { label: "Android TV", href: "/#get-started" },
    ],
  },
];

// Headline stats for the hero trust strip.
export const stats = [
  { value: "30+", label: "Global locations" },
  { value: "0", label: "Logs kept" },
  { value: "10", label: "Devices at once" },
  { value: "16", label: "Languages" },
];

// Marketing features — benefit-led. Stealth & Split Tunneling lead.
export const features = [
  {
    icon: "eyeOff",
    title: "Stealth Mode",
    body: "Your VPN, invisible. MistyVPN disguises your connection so it looks like ordinary web browsing — so it keeps working even on networks that block other VPNs. One tap, on by default.",
  },
  {
    icon: "split",
    title: "Split Tunneling",
    body: "Protect only what you want. Send chosen apps and sites through the VPN and keep everything else — your bank, local services, gaming — at full local speed.",
  },
  {
    icon: "shield",
    title: "Strict no-logs",
    body: "We keep nothing. No browsing history, no traffic, no IP address. There's nothing to leak and nothing to hand over.",
  },
  {
    icon: "bolt",
    title: "Seriously fast",
    body: "Modern protocols and 30+ optimized locations mean buffer-free streaming, lag-free calls and quick downloads — even on a busy network.",
  },
  {
    icon: "play",
    title: "Stream without borders",
    body: "Watch your shows from anywhere in crisp HD. Pick a location, hit connect, press play.",
  },
  {
    icon: "lock",
    title: "Kill switch",
    body: "If the connection ever drops, MistyVPN instantly blocks traffic so nothing slips out unprotected.",
  },
  {
    icon: "devices",
    title: "All your devices",
    body: "iPhone, iPad, Android, Mac and Android TV. One subscription covers them all, with up to 10 connected at once.",
  },
  {
    icon: "globe",
    title: "In your language",
    body: "Use MistyVPN comfortably in 16 languages — and we add more without you ever needing to update the app.",
  },
  {
    icon: "sparkle",
    title: "Auto mode",
    body: "One tap and MistyVPN picks the fastest, most reliable connection for your network automatically — there's nothing to configure.",
  },
  {
    icon: "server",
    title: "30+ global locations",
    body: "Connect through servers across the Americas, Europe, the Middle East and Asia — appear wherever you need to be.",
  },
  {
    icon: "power",
    title: "Auto-connect",
    body: "Have MistyVPN connect the moment your device starts, so you're protected automatically — never accidentally exposed.",
  },
  {
    icon: "clock",
    title: "Earn free minutes",
    body: "Out of free time? Top up your free minutes any time — no account and no credit card required.",
  },
];

export const platforms = [
  { name: "iPhone & iPad", store: "App Store", href: site.stores.ios, icon: "apple" },
  { name: "Android", store: "Google Play", href: site.stores.android, icon: "android" },
  { name: "Mac", store: "Mac App Store", href: site.stores.mac, icon: "apple" },
  { name: "Android TV", store: "Google Play", href: site.stores.tv, icon: "tv" },
];

// Three simple steps for the "how it works" section.
export const steps = [
  {
    title: "Download & sign up",
    body: "Grab the app for your device and start free in under a minute — no credit card needed.",
  },
  {
    title: "Tap connect",
    body: "Pick a location or let Auto choose the fastest one. Stealth Mode handles the rest.",
  },
  {
    title: "Browse freely",
    body: "Stream, browse and call privately — protected, unblocked and fast.",
  },
];

export const faqs = [
  {
    q: "Is MistyVPN really no-logs?",
    a: "Yes. MistyVPN doesn't record your browsing, your traffic, or your IP address. There's simply nothing stored that could be leaked or handed over.",
  },
  {
    q: "Does it work where other VPNs are blocked?",
    a: "Yes. Stealth Mode disguises your connection as ordinary web traffic, so MistyVPN keeps working on heavily restricted networks where typical VPNs get detected and blocked.",
  },
  {
    q: "How many devices can I use?",
    a: "One subscription covers all your devices — iPhone, Android, Mac and Android TV — with up to 10 connected at the same time.",
  },
  {
    q: "Can I stream with MistyVPN?",
    a: "Absolutely. MistyVPN is tuned for fast HD streaming, and split tunneling lets you route just your streaming apps through the VPN at full speed.",
  },
  {
    q: "Is there a free version?",
    a: "Yes. Start free and earn free minutes as you go — no account or credit card required. Upgrade to Premium any time for unlimited, full-speed access.",
  },
  {
    q: "How do I pay?",
    a: "Subscriptions are handled securely inside the app through the App Store or Google Play. Cancel any time from your store account.",
  },
];

// Pricing — purchases happen inside the apps (no web checkout yet).
export const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "",
    note: "No card needed",
    highlight: false,
    blurb: "Get started for free and earn free minutes as you go.",
    features: [
      "Earn free minutes",
      "All protocols & Stealth Mode",
      "1 device",
      "No account required",
    ],
    cta: "Start free",
  },
  {
    name: "Premium",
    price: "$3.99",
    cadence: "/ month",
    note: "Billed monthly",
    highlight: false,
    blurb: "Unlimited, full-speed protection on all your devices.",
    features: [
      "Unlimited data & speed",
      "All 30+ locations",
      "Stealth Mode & Split Tunneling",
      "Up to 10 devices",
      "Priority support",
    ],
    cta: "Get Premium",
  },
  {
    name: "Premium 6 Months",
    price: "$14.99",
    cadence: "/ 6 months",
    note: "Just $2.50 / month — save 37%",
    highlight: true,
    blurb: "The same Premium, billed every six months — our best value.",
    features: [
      "Everything in Premium",
      "Best value — save 37%",
      "Up to 10 devices",
      "Priority support",
    ],
    cta: "Get 6 months",
  },
];

// Comparison page data. Competitor info reflects publicly listed features as of
// June 2026 and should be verified on each provider's site (note shown on page).
export const comparison = {
  providers: ["MistyVPN", "NordVPN", "ExpressVPN", "Surfshark"],
  rows: [
    { label: "Monthly price", values: ["$3.99", "~$12.99", "~$12.95", "~$15.45"] },
    { label: "Free tier", values: ["Yes — earn free minutes", "No", "No", "No"] },
    { label: "Best rate without a 1–2 yr contract", values: [true, false, false, false] },
    { label: "Next-gen anti-censorship (Reality / Hysteria2)", values: [true, "Limited", "Limited", "Limited"] },
    { label: "Stealth Mode (beats blocks)", values: [true, true, true, true] },
    { label: "Split tunneling", values: [true, true, "Limited", true] },
    { label: "Kill switch", values: [true, true, true, true] },
    { label: "Strict no-logs", values: [true, true, true, true] },
    { label: "App languages", values: ["16", "varies", "varies", "varies"] },
  ] as { label: string; values: (boolean | string)[] }[],
};
