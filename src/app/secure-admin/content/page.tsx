"use client";

import { useEffect, useState } from "react";
import type { WebsiteContent } from "@/lib/models";

type ContentKey = WebsiteContent["key"];

/* -----------------------------
   FIXED TOAST TYPES
------------------------------ */
type ToastVariant = "success" | "error";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

const contentKeys: { value: ContentKey; label: string }[] = [
  { value: "home-hero", label: "Home – hero" },
  { value: "home-offerings", label: "Home – offerings" },
  { value: "services-header", label: "Services – header" },
  { value: "about-intro", label: "About – intro" },
  { value: "contact-intro", label: "Contact – intro" },
  { value: "seo-defaults", label: "SEO defaults" }
];

export default function AdminContentPage() {
  const [selectedKey, setSelectedKey] =
    useState<ContentKey>("home-hero");
  const [rawContent, setRawContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  /* -----------------------------
     FIXED showToast
  ------------------------------ */
  const showToast = (
    message: string,
    variant: ToastVariant = "success"
  ) => {
    const id = Date.now();
    setToast({ id, message, variant });

    setTimeout(() => {
      setToast((current) =>
        current && current.id === id ? null : current
      );
    }, 3000);
  };

  const loadContent = async (key: ContentKey) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/admin/content?key=${encodeURIComponent(key)}`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Failed to load content");

      const data = (await res.json()) as {
        content: unknown | null;
      };

      if (!data.content) {
        setRawContent("{\n  \n}");
      } else {
        setRawContent(
          JSON.stringify(data.content, null, 2)
        );
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load content. Please try again.");
      setRawContent("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContent(selectedKey);
  }, [selectedKey]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      let parsed: unknown = null;

      if (rawContent.trim()) {
        parsed = JSON.parse(rawContent);
      }

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          key: selectedKey,
          content: parsed
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to save content");
      }

      showToast("Content updated successfully.", "success");
    } catch (err) {
      console.error(err);
      showToast(
        "Unable to save content. Ensure valid JSON and try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 text-xs text-slate-200">
      <div>
        <h1 className="text-sm font-semibold tracking-tight text-slate-50">
          Website content
        </h1>
        <p className="mt-1 text-[11px] text-slate-400">
          Edit structured JSON blocks stored in the
          <code className="mx-1 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-100">
            websiteContent
          </code>
          collection.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Content key
          </label>

          <select
            value={selectedKey}
            onChange={(e) =>
              setSelectedKey(e.target.value as ContentKey)
            }
            className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-[11px] text-slate-100 focus:border-brand-400 focus:ring-1 focus:ring-brand-500/40"
          >
            {contentKeys.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {loading && (
            <span className="text-[11px] text-slate-500">
              Loading…
            </span>
          )}
        </div>

        {error && (
          <p className="text-[11px] text-rose-400">
            {error}
          </p>
        )}

        <textarea
          rows={14}
          value={rawContent}
          onChange={(e) => setRawContent(e.target.value)}
          className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-[11px] text-slate-100 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/40"
          spellCheck={false}
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => void loadContent(selectedKey)}
            disabled={loading || saving}
            className="rounded-full border border-slate-700 px-4 py-1.5 text-[11px] text-slate-200 hover:border-slate-500 disabled:opacity-70"
          >
            Reload
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-brand-600 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-brand-500 disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save content"}
          </button>
        </div>
      </form>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`rounded-2xl px-4 py-3 text-xs shadow-lg ${
              toast.variant === "error"
                ? "border border-rose-500 bg-rose-500/10 text-rose-100"
                : "border border-emerald-500 bg-emerald-500/10 text-emerald-100"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}