// Thin client for the MistyVPN backend. Mirrors the mobile app's calls.

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://dev-be.mistyvpn.com";
const APP_KEY = process.env.NEXT_PUBLIC_APP_KEY ?? "";

const TOKEN_KEY = "mistyvpn.token";

export const auth = {
  get token(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
  get isLoggedIn() {
    return !!this.token;
  },
};

type Opts = { auth?: boolean; appKey?: boolean; body?: unknown; method?: string };

async function req<T>(path: string, opts: Opts = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth && auth.token) headers["Authorization"] = `Bearer ${auth.token}`;
  if (opts.appKey) headers["X-App-Key"] = APP_KEY;

  const res = await fetch(`${API}${path}`, {
    method: opts.method ?? (opts.body ? "POST" : "GET"),
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────
export type AuthResult = {
  token: string;
  vpnUsername: string;
  vpnPassword: string;
  wgPrivateKey?: string;
};

export async function webRegister(email: string, password: string) {
  const r = await req<AuthResult>("/api/auth/web-register", {
    appKey: true,
    body: { email, password },
  });
  auth.set(r.token);
  return r;
}

export async function login(email: string, password: string) {
  const r = await req<AuthResult>("/api/auth/login", { body: { email, password } });
  auth.set(r.token);
  return r;
}

export async function forgotPassword(email: string) {
  return req<{ message: string }>("/api/auth/forgot-password", { body: { email } });
}

// ── Account / subscription ─────────────────────────────────────────────────
export type SubStatus = {
  email: string;
  vpnUsername: string;
  vpnPassword: string;
  subscribed: boolean;
  platform: string | null;
  expiresAt: string | null;
  willCancel: boolean;
  freeMinutes: number;
  cardBrand?: string | null;
  cardLast4?: string | null;
};

export function getStatus() {
  return req<SubStatus>("/api/subscription/status", { auth: true });
}

export function changePassword(currentPassword: string, newPassword: string) {
  return req<{ message: string }>("/api/auth/change-password", {
    auth: true,
    body: { currentPassword, newPassword },
  });
}

export function deleteAccount() {
  return req<Record<string, unknown>>("/api/auth/account", {
    auth: true,
    method: "DELETE",
  });
}

// ── Plans (DB-driven — same source the mobile apps use) ─────────────────────
export type Plan = {
  key: string;
  title: string;
  price: string;
  perMonth: string;
  unit: string;
  badge?: string | null;
};

export async function getPlans(): Promise<Plan[]> {
  const cfg = await req<{ plans?: Plan[] }>("/api/config/paywall");
  return cfg.plans ?? [];
}

export function createCheckoutSession(plan: string) {
  return req<{ clientSecret: string }>("/api/stripe/create-checkout-session", {
    auth: true,
    body: { plan },
  });
}

export function cancelSubscription() {
  return req<{ message: string; expiresAt: string }>("/api/stripe/cancel", {
    auth: true,
    body: {},
  });
}

export function resumeSubscription() {
  return req<{ message: string }>("/api/stripe/resume", { auth: true, body: {} });
}

// ── Change card (Stripe Elements + SetupIntent) ─────────────────────────────
// 1) get a SetupIntent client secret to render the Payment Element
export function createSetupIntent() {
  return req<{ clientSecret: string }>("/api/stripe/setup-intent", {
    auth: true,
    body: {},
  });
}

// 2) after confirming the SetupIntent client-side, send the new payment-method id
export function updatePaymentMethod(paymentMethodId: string) {
  return req<{ cardBrand: string | null; cardLast4: string | null }>(
    "/api/stripe/update-payment-method",
    { auth: true, body: { paymentMethodId } },
  );
}

// VPN credentials come back from login/register; stash for the account page.
const CREDS_KEY = "mistyvpn.creds";
export function saveCreds(r: AuthResult) {
  localStorage.setItem(
    CREDS_KEY,
    JSON.stringify({ vpnUsername: r.vpnUsername, vpnPassword: r.vpnPassword }),
  );
}
export function loadCreds(): { vpnUsername: string; vpnPassword: string } | null {
  if (typeof window === "undefined") return null;
  const s = localStorage.getItem(CREDS_KEY);
  return s ? JSON.parse(s) : null;
}
export function logout() {
  auth.clear();
  localStorage.removeItem(CREDS_KEY);
}
