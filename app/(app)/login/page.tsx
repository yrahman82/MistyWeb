"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, saveCreds, forgotPassword } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const r = await login(email.trim(), password);
      saveCreds(r);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function onForgot() {
    setError("");
    setNotice("");
    if (!email.trim()) {
      setError("Enter your email first, then tap “Forgot password”.");
      return;
    }
    try {
      await forgotPassword(email.trim());
      setNotice("If that email has an account, a reset link is on its way.");
    } catch {
      setNotice("If that email has an account, a reset link is on its way.");
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-400">Sign in to your MistyVPN account.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-slate-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-brand"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm text-slate-300">Password</label>
            <button
              type="button"
              onClick={onForgot}
              className="text-xs text-brand hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-16 text-white outline-none focus:border-brand"
              placeholder="Your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {notice ? <p className="text-sm text-mint">{notice}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-full bg-brand text-sm font-semibold text-ink transition-colors hover:bg-white disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        New to MistyVPN?{" "}
        <Link href="/register" className="text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
