"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://misty-be-staging.yasar.pk";

type Stage = "code" | "login" | "granting" | "success" | "expired";

function TvLoginInner() {
  const params = useSearchParams();

  const [stage, setStage] = useState<Stage>("code");
  const [code, setCode] = useState((params.get("code") ?? "").toUpperCase());
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: user confirms the code and taps "Continue"
  function handleCodeContinue(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim().length < 4) { setError("Please enter the code shown on your TV."); return; }
    setError("");
    setStage("login");
  }

  // Step 2: user signs in — on success store JWT and grant TV access
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginRes = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setError(loginData.error ?? "Invalid email or password");
        setLoading(false);
        return;
      }

      const jwt = loginData.token;
      setToken(jwt);
      setStage("granting");

      const grantRes = await fetch(`${API}/api/auth/tv/grant?code=${encodeURIComponent(code.trim())}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${jwt}` },
      });
      const grantData = await grantRes.json();

      if (grantRes.status === 404) {
        setError("This code has expired or is invalid. Go back to your TV and get a new code.");
        setStage("expired");
        return;
      }
      if (!grantRes.ok) {
        setError(grantData.error ?? "Could not authorize the TV. Please try again.");
        setStage("login");
        setLoading(false);
        return;
      }

      setStage("success");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setStage("login");
      setLoading(false);
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

        {/* Step indicator */}
        {(stage === "code" || stage === "login" || stage === "granting") && (
          <div className="flex items-center gap-2 mb-6">
            <StepDot n={1} label="Enter Code" active={stage === "code"} done={stage !== "code"} />
            <div className="flex-1 h-px bg-white/10" />
            <StepDot n={2} label="Sign In" active={stage === "login" || stage === "granting"} done={false} />
          </div>
        )}

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">

          {/* Stage: code */}
          {stage === "code" && (
            <form onSubmit={handleCodeContinue} className="space-y-5">
              <div>
                <h2 className="text-white font-semibold text-lg">Enter TV Code</h2>
                <p className="text-white/40 text-sm mt-1 leading-relaxed">
                  Enter the code shown on your TV screen, or scan the QR code to pre-fill it automatically.
                </p>
              </div>

              <div>
                <label className="text-white/60 text-xs font-medium mb-1.5 block">Code from your TV</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value.toUpperCase()); setError(""); }}
                  placeholder="e.g. FJLX8JYJ"
                  maxLength={12}
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#4FC3F7] placeholder-white/20 text-lg font-mono font-bold tracking-widest focus:outline-none focus:border-[#4FC3F7] focus:bg-white/8 transition text-center uppercase"
                />
              </div>

              {error && <ErrorBox msg={error} />}

              <button
                type="submit"
                disabled={!code.trim()}
                className="w-full bg-[#4FC3F7] hover:bg-[#29b6f6] disabled:bg-white/10 disabled:text-white/20 text-[#0A1628] font-bold py-3.5 rounded-xl text-sm transition"
              >
                Continue
              </button>
            </form>
          )}

          {/* Stage: login */}
          {(stage === "login" || stage === "granting") && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <h2 className="text-white font-semibold text-lg">Sign In</h2>
                <p className="text-white/40 text-sm mt-1">
                  Sign in with your MistyVPN account to authorize code{" "}
                  <span className="text-[#4FC3F7] font-mono font-bold">{code}</span>.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-white/60 text-xs font-medium mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#4FC3F7] transition"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-medium mb-1.5 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#4FC3F7] transition"
                    />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs transition">
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              {error && <ErrorBox msg={error} />}

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-[#4FC3F7] hover:bg-[#29b6f6] disabled:bg-white/10 disabled:text-white/20 text-[#0A1628] font-bold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {stage === "granting" ? "Authorizing TV…" : "Signing in…"}
                  </>
                ) : "Sign In & Authorize TV"}
              </button>

              <button type="button" onClick={() => { setStage("code"); setError(""); }}
                className="w-full text-white/30 hover:text-white/60 text-xs transition py-1">
                ← Change code
              </button>
            </form>
          )}

          {/* Stage: success */}
          {stage === "success" && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-green-500/15 ring-1 ring-green-500/30 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-bold text-lg">TV Signed In!</p>
              <p className="text-white/50 text-sm leading-relaxed">
                Your TV will update automatically in a few seconds. You can close this page.
              </p>
            </div>
          )}

          {/* Stage: expired */}
          {stage === "expired" && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-orange-500/15 ring-1 ring-orange-500/30 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white font-bold text-lg">Code Expired</p>
              <p className="text-white/50 text-sm leading-relaxed">
                {error || "Go back to your TV and get a new code."}
              </p>
              <button onClick={() => { setStage("code"); setError(""); setCode(""); }}
                className="text-[#4FC3F7] text-sm hover:underline">
                Try again
              </button>
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

function StepDot({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
        done ? "bg-green-500 text-white" : active ? "bg-[#4FC3F7] text-[#0A1628]" : "bg-white/10 text-white/30"
      }`}>
        {done ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : n}
      </div>
      <span className={`text-[10px] font-medium ${active ? "text-white/70" : "text-white/25"}`}>{label}</span>
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
      <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-400 text-xs leading-relaxed">{msg}</p>
    </div>
  );
}

export default function TvLoginPage() {
  return <Suspense><TvLoginInner /></Suspense>;
}
