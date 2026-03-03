"use client";

import { useEffect, useState } from "react";

type Analytics = {
  projects: number;
  leads: number;
  testimonials: number;
};

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        if (res.status === 401) {
          window.location.href = "/secure-admin-login";
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to load analytics");
        }
        const data = (await res.json()) as Analytics;
        setAnalytics(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load admin data.");
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          SmartCampusTech Admin Dashboard
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          High-level overview of projects, leads, testimonials, and content
          health for SmartCampusTech.
        </p>
      </div>

      {error && (
        <p className="text-[11px] text-rose-300" aria-live="polite">
          {error}
        </p>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-4 text-xs text-slate-300">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Projects
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">
            {analytics?.projects ?? "–"}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Total projects in portfolio.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-4 text-xs text-slate-300">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Leads
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">
            {analytics?.leads ?? "–"}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Inquiries captured from contact form.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-4 text-xs text-slate-300">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
            Testimonials
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">
            {analytics?.testimonials ?? "–"}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Social proof across students and SMEs.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-4 text-xs text-slate-200">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Operations
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Use the sidebar to manage projects, leads, testimonials, website
            content, media uploads, and review activity logs.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-4 text-xs text-slate-200">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Security
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Access to this dashboard is protected with JWT-backed cookies and a
            dedicated middleware that redirects unauthorized users to the login
            screen.
          </p>
        </div>
      </section>
    </div>
  );
}

