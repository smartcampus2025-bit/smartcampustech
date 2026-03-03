"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lead } from "@/lib/models";

type Toast = {
  id: number;
  message: string;
  variant?: "success" | "error";
} | null;

const statusOptions: { value: Lead["status"]; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in-review", label: "In review" },
  { value: "closed", label: "Closed" }
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (message: string, variant: Toast["variant"] = "success") => {
    const id = Date.now();
    setToast({ id, message, variant });
    setTimeout(() => {
      setToast((current) => (current && current.id === id ? null : current));
    }, 3000);
  };

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load leads");
      }
      const data = (await res.json()) as { leads: Lead[] };
      setLeads(data.leads ?? []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Unable to load leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  const handleStatusChange = async (lead: Lead, status: Lead["status"]) => {
    if (!lead._id) return;
    setUpdatingId(lead._id.toString());
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: lead._id,
          status
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to update lead");
      }
      showToast("Lead status updated.", "success");
      await loadLeads();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      showToast("Unable to update lead. Please try again.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const tableLeads = useMemo(
    () =>
      leads.slice().sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      }),
    [leads]
  );

  return (
    <div className="space-y-5 text-xs text-slate-200">
      <div>
        <h1 className="text-sm font-semibold tracking-tight text-slate-50">
          Leads & inquiries
        </h1>
        <p className="mt-1 text-[11px] text-slate-400">
          Leads submitted from the public contact form. Update their status as you
          review and follow up.
        </p>
      </div>

      {error && (
        <p className="text-[11px] text-rose-300" aria-live="polite">
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-2 space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className="h-10 animate-pulse rounded-xl bg-slate-900/70" />
          ))}
        </div>
      ) : tableLeads.length === 0 ? (
        <p className="mt-2 text-[11px] text-slate-500">
          No leads captured yet. Once visitors submit the contact form, they will
          appear here.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/70 bg-slate-950/70">
          <table className="min-w-full border-collapse text-left text-[11px]">
            <thead className="bg-slate-950/80 text-slate-400">
              <tr>
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Contact</th>
                <th className="px-3 py-2 font-semibold">Requirement</th>
                <th className="px-3 py-2 font-semibold">Message</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Received</th>
              </tr>
            </thead>
            <tbody>
              {tableLeads.map((lead) => {
                const createdAt = lead.createdAt
                  ? new Date(lead.createdAt)
                  : null;
                return (
                  <tr
                    key={lead._id?.toString() ?? lead.email + lead.phone}
                    className="border-t border-slate-800/60 hover:bg-slate-900/60"
                  >
                    <td className="px-3 py-2 text-slate-100">{lead.name}</td>
                    <td className="px-3 py-2 text-slate-300">
                      <div>{lead.email}</div>
                      <div className="text-[10px] text-slate-400">
                        {lead.phone}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {lead.requirement === "final-year-project"
                        ? "Final year project"
                        : lead.requirement === "business-website"
                          ? "Business website"
                          : "Other"}
                    </td>
                    <td className="max-w-xs px-3 py-2 text-slate-300">
                      <p className="line-clamp-3">{lead.message}</p>
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(
                            lead,
                            e.target.value as Lead["status"]
                          )
                        }
                        disabled={updatingId === lead._id?.toString()}
                        className="rounded-full border border-slate-700/70 bg-slate-950/80 px-2 py-1 text-[10px] text-slate-100 outline-none focus:border-brand-400/80 focus:ring-1 focus:ring-brand-500/40"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {createdAt ? (
                        <span>
                          {createdAt.toLocaleDateString()}{" "}
                          <span className="text-[10px] text-slate-500">
                            {createdAt.toLocaleTimeString()}
                          </span>
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`rounded-2xl px-4 py-3 text-xs shadow-lg ${
              toast.variant === "error"
                ? "border border-rose-500/70 bg-rose-500/10 text-rose-100"
                : "border border-emerald-500/70 bg-emerald-500/10 text-emerald-100"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

