"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://misty-be-staging.yasar.pk";

type Stage = "form" | "loading" | "success" | "error" | "expired";

function TvLoginInner() {
  const params = useSearchParams();
  const code = params.get("code") ?? "";

  const [stage, setStage] = useState<Stage>(code ? "form" : "expired");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!code) { setStage("expired"); setErrorMsg("No code found. Please scan the QR code again from your TV."); }
  }, [code]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    setStage("loading");

    try {
      // 1. Login to get JWT token
      const loginRes = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setStage("form");
        setErrorMsg(loginData.error ?? "Invalid email or password");
        setSubmitting(false);
        return;
      }

      // 2. Grant TV access using the device code
      const grantRes = await fetch(`${API}/api/auth/tv/grant?code=${encodeURIComponent(code)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginData.token}`,
        },
      });
      const grantData = await grantRes.json();

      if (grantRes.status === 404) {
        setStage("expired");
        setErrorMsg("This code has expired. Please go back to your TV and request a new QR code.");
        return;
      }

      if (!grantRes.ok) {
        setStage("form");
        setErrorMsg(grantData.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setStage("success");
    } catch {
      setStage("form");
      setErrorMsg("Could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-[22px] bg-[#4FC3F7]/10 flex items-center justify-center mb-4 ring-1 ring-[#4FC3F7]/20">
            <svg className="w-9 h-9 text-[#4FC3F7]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">MistyVPN</h1>
          <p className="text-white/40 text-sm mt-1">TV Sign In</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">

          {/* Form */}
          {(stage === "form" || stage === "loading") && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-white font-semibold text-lg">Sign in to your TV</h2>
                <p className="text-white/40 text-sm mt-1">
                  Enter your MistyVPN credentials to authorize your TV.
                </p>
              </div>

              {/* Code badge */}
              <div className="flex items-center gap-2 bg-[#4FC3F7]/8 border border-[#4FC3F7]/20 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-[#4FC3F7] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-white/50 text-xs">Code: </span>
                <span className="text-[#4FC3F7] font-mono font-bold text-sm tracking-widest">{code}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-white/60 text-xs font-medium mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrorMsg(""); }}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#4FC3F7] focus:bg-white/8 transition"
                  />
                </div>

                <div>
                  <label className="text-white/60 text-xs font-medium mb-1.5 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setErrorMsg(""); }}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#4FC3F7] focus:bg-white/8 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs transition"
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-400 text-xs leading-relaxed">{errorMsg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !email || !password}
                className="w-full bg-[#4FC3F7] hover:bg-[#29b6f6] disabled:bg-white/10 disabled:text-white/20 text-[#0A1628] font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  "Sign In & Authorize TV"
                )}
              </button>
            </form>
          )}

          {/* Success */}
          {stage === "success" && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-green-500/15 ring-1 ring-green-500/30 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-lg">TV Signed In!</p>
                <p className="text-white/50 text-sm mt-1 leading-relaxed">
                  Your TV should update automatically in a few seconds. You can close this page.
                </p>
              </div>
            </div>
          )}

          {/* Expired / No Code */}
          {stage === "expired" && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-orange-500/15 ring-1 ring-orange-500/30 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-lg">Code Expired</p>
                <p className="text-white/50 text-sm mt-1 leading-relaxed">
                  {errorMsg || "This QR code has expired. Go back to your TV and select Sign in with QR Code to get a new one."}
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          mistyvpn.com · Secure VPN for all devices
        </p>
      </div>
    </main>
  );
}

export default function TvLoginPage() {
  return (
    <Suspense>
      <TvLoginInner />
    </Suspense>
  );
}
