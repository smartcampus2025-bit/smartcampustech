"use client";

import { useState } from "react";

const contactItems = [
  {
    label: "Phone / WhatsApp",
    value: "+91 9324998085",
    href: "tel:+919324998085"
  },
  {
    label: "Email",
    value: "smartcampus2025@gmail.com",
    href: "mailto:smartcampus2025@gmail.com"
  },
  {
    label: "Instagram",
    value: "@smartcampustech",
    href: "https://instagram.com/smartcampustech"
  }
];

type RequirementOption = "final-year-project" | "business-website" | "other";

const initialState = {
  name: "",
  email: "",
  phone: "",
  requirement: "final-year-project" as RequirementOption,
  message: ""
};

export function ContactPageContent() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof initialState, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!form.name || form.name.trim().length < 2) {
      nextErrors.name = "Please enter your full name.";
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!form.phone || form.phone.trim().length < 7) {
      nextErrors.phone = "Please enter a valid phone number.";
    }
    if (!form.message || form.message.trim().length < 10) {
      nextErrors.message =
        "Please share at least 2–3 lines about your requirement.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setStatus("idle");
    setStatusMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = data?.error ?? "Something went wrong. Please try again.";
        setStatus("error");
        setStatusMessage(message);
        return;
      }

      setStatus("success");
      setStatusMessage(
        "Thank you for reaching out. SmartCampusTech will respond on WhatsApp or email shortly."
      );
      setForm(initialState);
      setErrors({});
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setStatus("error");
      setStatusMessage(
        "We could not submit your inquiry due to a network issue. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Start a conversation with{" "}
          <span className="bg-gradient-to-r from-brand-200 via-white to-brand-300 bg-clip-text text-transparent">
            SmartCampusTech
          </span>
          .
        </h1>
        <p className="mt-3 text-sm text-slate-300 md:text-base">
          Share your idea, syllabus, or business requirements. We&apos;ll respond
          with a clear scope, timelines, and investment range—no copy-paste
          proposals.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5 text-xs text-slate-200"
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
                className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-brand-500/0 transition focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-[11px] text-rose-300">{errors.name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-brand-500/0 transition focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-[11px] text-rose-300">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-brand-500/0 transition focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
                placeholder="+91 ..."
              />
              {errors.phone && (
                <p className="text-[11px] text-rose-300">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Requirement
              </label>
              <select
                value={form.requirement}
                onChange={(e) =>
                  setForm({
                    ...form,
                    requirement: e.target.value as RequirementOption
                  })
                }
                className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-brand-500/0 transition focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
              >
                <option value="final-year-project">
                  Final year project (student)
                </option>
                <option value="business-website">
                  Website for small business
                </option>
                <option value="other">Other web requirement</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Message
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-brand-500/0 transition focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
              placeholder="Tell SmartCampusTech about your idea, context, syllabus or business goals..."
            />
            {errors.message && (
              <p className="text-[11px] text-rose-300">{errors.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-brand-600/50 transition hover:from-brand-500 hover:to-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending inquiry..." : "Submit inquiry"}
            </button>
            <p className="text-[11px] text-slate-500">
              Or contact directly on{" "}
              <a
                href="https://wa.me/919324998085"
                target="_blank"
                className="font-medium text-slate-300 hover:text-brand-200"
              >
                WhatsApp
              </a>
              .
            </p>
          </div>

          {status !== "idle" && statusMessage && (
            <div
              className={`mt-1 rounded-xl border px-3 py-2 text-[11px] ${
                status === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-100"
              }`}
            >
              {statusMessage}
            </div>
          )}
        </form>
      </section>

      <section className="card-surface-dark rounded-3xl p-5 text-xs text-slate-200">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Quick project brief
        </p>
        <p className="mt-2 text-xs text-slate-300">
          When you reach out, it helps if you share:
        </p>
        <ul className="mt-3 space-y-2 text-xs text-slate-300">
          <li className="flex gap-2">
            <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-brand-400" />
            <span>
              For students: your course, final year project guidelines, and any
              initial ideas you already have.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-brand-400" />
            <span>
              For small businesses: your industry, location, and what you want
              the website to achieve (leads, appointments, orders, etc.).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-brand-400" />
            <span>
              Any deadlines (college submission date, launch date) we should
              plan around.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}

