"use client";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4 text-xs text-slate-200">
      <h1 className="text-sm font-semibold tracking-tight text-slate-50">
        Settings
      </h1>
      <p className="text-[11px] text-slate-400">
        Core security settings such as JWT cookies, middleware, and API
        protections are enforced server-side. This screen is reserved for future
        SaaS-style configuration such as notification preferences or additional
        admin accounts.
      </p>
    </div>
  );
}

