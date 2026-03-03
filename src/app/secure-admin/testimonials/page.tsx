"use client";

import { useEffect, useMemo, useState } from "react";
import type { Testimonial } from "@/lib/models";

type ToastVariant = "success" | "error";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type TestimonialFormState = {
  name: string;
  roleOrCourse: string;
  context: Testimonial["context"];
  quote: string;
  projectSlug: string;
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TestimonialFormState>({
    name: "",
    roleOrCourse: "",
    context: "student",
    quote: "",
    projectSlug: ""
  });
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, variant: Toast["variant"] = "success") => {
    const id = Date.now();
    setToast({ id, message, variant });
    setTimeout(() => {
      setToast((current) => (current && current.id === id ? null : current));
    }, 3000);
  };

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/testimonials", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load testimonials");
      }
      const data = (await res.json()) as { testimonials: Testimonial[] };
      setTestimonials(data.testimonials ?? []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Unable to load testimonials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTestimonials();
  }, []);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        roleOrCourse: form.roleOrCourse.trim(),
        context: form.context,
        quote: form.quote.trim(),
        projectSlug: form.projectSlug.trim() || undefined
      };

      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to create testimonial");
      }

      showToast("Testimonial created successfully.", "success");
      setForm({
        name: "",
        roleOrCourse: "",
        context: "student",
        quote: "",
        projectSlug: ""
      });
      await loadTestimonials();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      showToast(
        "Unable to create testimonial. Please verify fields and try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const tableTestimonials = useMemo(
    () =>
      testimonials.slice().sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      }),
    [testimonials]
  );

  return (
    <div className="space-y-6 text-xs text-slate-200">
      <div>
        <h1 className="text-sm font-semibold tracking-tight text-slate-50">
          Testimonials
        </h1>
        <p className="mt-1 text-[11px] text-slate-400">
          Manage social proof from students and SME clients. New testimonials are
          created via the form below.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="space-y-3 rounded-3xl border border-slate-800/70 bg-slate-950/80 p-4"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
              placeholder="Student or client name"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Role / Course
            </label>
            <input
              type="text"
              value={form.roleOrCourse}
              onChange={(e) => setForm({ ...form, roleOrCourse: e.target.value })}
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
              placeholder="e.g. BE – Computer Engineering, SME Founder"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Quote
            </label>
            <textarea
              rows={3}
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
              placeholder="Short, specific feedback about working with SmartCampusTech."
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Context
            </label>
            <select
              value={form.context}
              onChange={(e) =>
                setForm({
                  ...form,
                  context: e.target.value as Testimonial["context"]
                })
              }
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
            >
              <option value="student">Student</option>
              <option value="sme">SME</option>
              <option value="founder">Founder</option>
            </select>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Linked project slug (optional)
              </label>
              <input
                type="text"
                value={form.projectSlug}
                onChange={(e) => setForm({ ...form, projectSlug: e.target.value })}
                className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
                placeholder="project-slug"
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-brand-600 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-brand-600/40 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : "Add testimonial"}
          </button>
        </div>
      </form>

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
      ) : tableTestimonials.length === 0 ? (
        <p className="mt-2 text-[11px] text-slate-500">
          No testimonials recorded yet. Use the form above to capture your best
          student and SME feedback.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/70">
          <table className="min-w-full border-collapse text-left text-[11px]">
            <thead className="bg-slate-950/80 text-slate-400">
              <tr>
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Context</th>
                <th className="px-3 py-2 font-semibold">Quote</th>
                <th className="px-3 py-2 font-semibold">Linked project</th>
              </tr>
            </thead>
            <tbody>
              {tableTestimonials.map((t) => (
                <tr
                  key={t._id?.toString() ?? t.name + t.quote.slice(0, 10)}
                  className="border-t border-slate-800/60 hover:bg-slate-900/60"
                >
                  <td className="px-3 py-2 text-slate-100">
                    <div>{t.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {t.roleOrCourse}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {t.context === "student"
                      ? "Student"
                      : t.context === "sme"
                        ? "SME"
                        : "Founder"}
                  </td>
                  <td className="max-w-xs px-3 py-2 text-slate-300">
                    <p className="line-clamp-3">&ldquo;{t.quote}&rdquo;</p>
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {t.projectSlug || <span className="text-slate-500">—</span>}
                  </td>
                </tr>
              ))}
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

