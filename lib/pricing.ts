// Server-side pricing. Plan *copy* (blurb, feature bullets, CTA) lives in site.ts, but the actual
// *prices* come from the DB paywall — the same source the mobile apps and web checkout use — so the
// marketing prices can never drift from what the customer is actually charged. See /api/config/paywall.

import { plans as staticPlans } from "./site";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://dev-be.mistyvpn.com";

export type PaywallPlan = {
  key: string;
  title: string;
  price: string;
  perMonth: string;
  unit: string;
  badge?: string | null;
};

export type DisplayPlan = (typeof staticPlans)[number];

function cadenceFromUnit(unit: string): string {
  switch (unit) {
    case "/mo":
      return "/ month";
    case "/6mo":
      return "/ 6 months";
    case "/yr":
      return "/ year";
    default:
      return unit || "";
  }
}

// Fetch the DB paywall plans, keyed by plan key. Cached + revalidated hourly (ISR) so marketing
// pages stay static/fast. Returns {} on any failure → callers fall back to the static site.ts prices.
export async function getPaywallPlans(): Promise<Record<string, PaywallPlan>> {
  try {
    const res = await fetch(`${API}/api/config/paywall`, { next: { revalidate: 3600 } });
    if (!res.ok) return {};
    const data = (await res.json()) as { plans?: PaywallPlan[] };
    const map: Record<string, PaywallPlan> = {};
    for (const p of data.plans ?? []) map[p.key] = p;
    return map;
  } catch {
    return {};
  }
}

// Static plan copy merged with live DB prices. The Free tier is marketing-only (not in the paywall)
// so it always keeps its static definition. `perMonth` (e.g. "$2.50/mo") is exposed so localized
// callers can build their own note text ("Just {perMonth}") from the message catalog.
export type PricedPlan = DisplayPlan & { perMonth: string };
export async function getPlans(): Promise<PricedPlan[]> {
  const paywall = await getPaywallPlans();
  return staticPlans.map((plan) => {
    const pw = paywall[plan.key];
    if (!pw) return { ...plan, perMonth: "" }; // free tier, or paywall unavailable → static fallback
    const note =
      plan.key === "monthly"
        ? plan.note
        : plan.highlight
          ? `Just ${pw.perMonth} — best value`
          : `Just ${pw.perMonth}`;
    return { ...plan, price: pw.price, cadence: cadenceFromUnit(pw.unit), note, perMonth: pw.perMonth };
  });
}

// The live monthly price string (e.g. "$3.99"), for the comparison table / hero copy.
// Falls back to the static monthly price if the paywall is unavailable.
export async function getMonthlyPrice(): Promise<string> {
  const paywall = await getPaywallPlans();
  return (
    paywall.monthly?.price ??
    staticPlans.find((p) => p.key === "monthly")?.price ??
    "$3.99"
  );
}

// The live per-month price on the best-value (annual) plan, e.g. "$1.50/mo".
export async function getAnnualPerMonth(): Promise<string> {
  const paywall = await getPaywallPlans();
  return paywall.annual?.perMonth ?? "$1.50/mo";
}
