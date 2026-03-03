"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SecureAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Invalid credentials.");
        return;
      }

      router.push("/secure-admin");
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-800/70 bg-slate-950/80 p-6 shadow-soft-xl">
      <h1 className="text-lg font-semibold tracking-tight text-slate-50">
        SmartCampusTech Admin
      </h1>
      <p className="mt-1 text-xs text-slate-400">
        Restricted area. Only authorized SmartCampusTech admins should sign in.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Email
          </label>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-brand-500/0 transition focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-brand-500/0 transition focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand-600/40 transition hover:from-brand-500 hover:to-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        {error && (
          <p className="text-[11px] text-rose-300" aria-live="polite">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

