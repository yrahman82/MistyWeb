"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.mistyvpn.com";

type Stage = "verifying" | "form" | "success" | "error";

function ResetPasswordInner() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [stage, setStage] = useState<Stage>("verifying");
  const [errorMsg, setErrorMsg] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) { setStage("error"); setErrorMsg("No reset token found."); return; }
    fetch(`${API}/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(d => {
        if (d.valid) setStage("form");
        else { setStage("error"); setErrorMsg(d.error ?? "Invalid link."); }
      })
      .catch(() => { setStage("error"); setErrorMsg("Could not reach server. Try again."); });
  }, [token]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setErrorMsg("Passwords don't match."); return; }
    if (password.length < 8) { setErrorMsg("Password must be at least 8 characters."); return; }
    setErrorMsg("");
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const d = await r.json();
      if (r.ok) setStage("success");
      else { setErrorMsg(d.error ?? "Something went wrong."); }
    } catch {
      setErrorMsg("Could not reach server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#0F3460] flex items-center justify-center mb-3">
            <svg className="w-7 h-7 text-[#4FC3F7]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <h1 className="text-white text-xl font-bold">MistyVPN</h1>
        </div>

        {stage === "verifying" && (
          <div className="text-center text-white/60 text-sm">Verifying your link…</div>
        )}

        {stage === "error" && (
          <div className="text-center">
            <div className="text-red-400 text-sm mb-4">{errorMsg}</div>
            <a href="/" className="text-[#4FC3F7] text-sm hover:underline">
              Request a new reset link
            </a>
          </div>
        )}

        {stage === "form" && (
          <form onSubmit={submit} className="space-y-4">
            <h2 className="text-white font-semibold text-lg mb-1">Set new password</h2>
            <p className="text-white/50 text-sm mb-4">Choose a strong password (min. 8 characters).</p>

            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-white/7 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm pr-10 focus:outline-none focus:border-[#4FC3F7]"
              />
              <button type="button" onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs">
                {showPw ? "Hide" : "Show"}
              </button>
            </div>

            <input
              type={showPw ? "text" : "password"}
              placeholder="Confirm password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              className="w-full bg-white/7 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#4FC3F7]"
            />

            {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F3460] hover:bg-[#1a4a8a] text-white font-semibold py-3 rounded-xl text-sm transition disabled:opacity-50"
            >
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}

        {stage === "success" && (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white font-semibold">Password updated!</p>
            <p className="text-white/50 text-sm">You can now sign in with your new password in the MistyVPN app.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  );
}
