"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { webRegister, saveCreds, auth } from "@/lib/api";
import { Loader } from "@/components/ui";

function RegisterInner() {
  const t = useTranslations("registerPage");
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";

  // Already signed in? Don't show a "create account" form — go where they were headed.
  useEffect(() => {
    if (auth.isLoggedIn) router.replace(next);
  }, [router, next]);
  const loginHref = `/login?next=${encodeURIComponent(next)}`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await webRegister(email.trim(), password);
      saveCreds(r);
      router.push(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorGeneric"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      <p className="mt-2 text-sm text-slate-400">{t("subtitle")}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-slate-300">{t("emailLabel")}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-slate-300">{t("passwordLabel")}</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-16 text-white outline-none focus:border-brand"
              placeholder={t("passwordPlaceholder")}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              {show ? t("hide") : t("show")}
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-full bg-brand text-sm font-semibold text-ink transition-colors hover:bg-white disabled:opacity-50"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        {t("haveAccount")}{" "}
        <Link href={loginHref} className="text-brand hover:underline">
          {t("signIn")}
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const t = useTranslations("registerPage");
  return (
    <Suspense fallback={<Loader label={t("loading")} />}>
      <RegisterInner />
    </Suspense>
  );
}
