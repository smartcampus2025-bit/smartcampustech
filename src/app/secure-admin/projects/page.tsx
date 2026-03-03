"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/models";

type ProjectFormState = {
  slug: string;
  title: string;
  shortDescription: string;
  category: Project["category"];
  clientType: Project["clientType"];
  techStack: string;
  isFeatured: boolean;
  isPublished: boolean;
};

type ToastVariant = "success" | "error";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const [form, setForm] = useState<ProjectFormState>({
    slug: "",
    title: "",
    shortDescription: "",
    category: "student-final-year",
    clientType: "student",
    techStack: "",
    isFeatured: false,
    isPublished: true
  });

  const showToast = (message: string, variant: Toast["variant"] = "success") => {
    const id = Date.now();
    setToast({ id, message, variant });
    setTimeout(() => {
      setToast((current) => (current && current.id === id ? null : current));
    }, 3000);
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/projects", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load projects");
      }
      const data = (await res.json()) as { projects: Project[] };
      setProjects(data.projects ?? []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Unable to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setForm({
      slug: "",
      title: "",
      shortDescription: "",
      category: "student-final-year",
      clientType: "student",
      techStack: "",
      isFeatured: false,
      isPublished: true
    });
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setForm({
      slug: project.slug,
      title: project.title,
      shortDescription: project.shortDescription,
      category: project.category,
      clientType: project.clientType,
      techStack: project.techStack.join(", "),
      isFeatured: project.isFeatured,
      isPublished: project.isPublished !== false
    });
    setModalOpen(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        category: form.category,
        clientType: form.clientType,
        techStack: form.techStack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        isFeatured: form.isFeatured,
        isPublished: form.isPublished
      };

      const url = editingProject
        ? `/api/admin/projects/${editingProject._id}`
        : "/api/admin/projects";
      const method = editingProject ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to save project");
      };

      showToast(
        editingProject ? "Project updated successfully." : "Project created successfully.",
        "success"
      );
      setModalOpen(false);
      setEditingProject(null);
      await loadProjects();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      showToast(
        editingProject
          ? "Unable to update project. Please check the fields and try again."
          : "Unable to create project. Please check the fields and try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!project._id) return;
    const confirmed = window.confirm(
      `Delete project "${project.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/projects/${project._id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to delete project");
      }
      showToast("Project deleted.", "success");
      await loadProjects();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      showToast("Unable to delete project. Please try again.", "error");
    }
  };

  const tableProjects = useMemo(
    () =>
      projects.slice().sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      }),
    [projects]
  );

  return (
    <div className="space-y-5 text-xs text-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-slate-50">
            Projects
          </h1>
          <p className="mt-1 text-[11px] text-slate-400">
            Manage SmartCampusTech portfolio projects shown on the public website,
            including featured and published flags.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-full bg-brand-600 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-brand-600/40 hover:bg-brand-500"
        >
          Create project
        </button>
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
      ) : tableProjects.length === 0 ? (
        <p className="mt-2 text-[11px] text-slate-500">
          No projects found yet. Use &quot;Create project&quot; to add your first
          portfolio item.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/70">
          <table className="min-w-full border-collapse text-left text-[11px]">
            <thead className="bg-slate-950/80 text-slate-400">
              <tr>
                <th className="px-3 py-2 font-semibold">Title</th>
                <th className="px-3 py-2 font-semibold">Category</th>
                <th className="px-3 py-2 font-semibold">Client</th>
                <th className="px-3 py-2 font-semibold">Featured</th>
                <th className="px-3 py-2 font-semibold">Published</th>
                <th className="px-3 py-2 font-semibold">Tech</th>
                <th className="px-3 py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableProjects.map((project) => (
                <tr
                  key={project._id?.toString() ?? project.slug}
                  className="border-t border-slate-800/60 hover:bg-slate-900/60"
                >
                  <td className="px-3 py-2 text-slate-100">{project.title}</td>
                  <td className="px-3 py-2 text-slate-300">{project.category}</td>
                  <td className="px-3 py-2 text-slate-300">{project.clientType}</td>
                  <td className="px-3 py-2">
                    {project.isFeatured ? (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                        Featured
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-200">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {project.isPublished !== false ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-200">
                        Unpublished
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-300">
                    {project.techStack.slice(0, 3).join(", ")}
                    {project.techStack.length > 3 && " +"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(project)}
                        className="rounded-full border border-slate-700/70 px-3 py-1 text-[10px] text-slate-200 hover:border-brand-400/80 hover:text-brand-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project)}
                        className="rounded-full border border-rose-500/70 px-3 py-1 text-[10px] text-rose-200 hover:bg-rose-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800/80 bg-slate-950/95 p-5 text-xs text-slate-200 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-50">
                {editingProject ? "Edit project" : "Create project"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  if (!saving) {
                    setModalOpen(false);
                    setEditingProject(null);
                  }
                }}
                className="text-[11px] text-slate-400 hover:text-slate-100"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
                    placeholder="e.g. student-crm-portal"
                    disabled={!!editingProject}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as Project["category"]
                      })
                    }
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
                  >
                    <option value="student-final-year">Student – final year</option>
                    <option value="student-mini">Student – mini</option>
                    <option value="sme-website">SME website</option>
                    <option value="founder-portfolio">Founder / portfolio</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
                  placeholder="Project title"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Short description
                </label>
                <textarea
                  rows={3}
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm({ ...form, shortDescription: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
                  placeholder="High-level summary as shown on cards."
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Client type
                  </label>
                  <select
                    value={form.clientType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        clientType: e.target.value as Project["clientType"]
                      })
                    }
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
                  >
                    <option value="student">Student</option>
                    <option value="sme">SME</option>
                    <option value="founder">Founder</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Tech stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.techStack}
                    onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                    className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
                    placeholder="Next.js, MongoDB, Tailwind CSS"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-[11px]">
                <label className="inline-flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isFeatured: e.target.checked
                      })
                    }
                    className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-brand-500"
                  />
                  Featured on portfolio
                </label>
                <label className="inline-flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isPublished: e.target.checked
                      })
                    }
                    className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-brand-500"
                  />
                  Published (visible on website)
                </label>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!saving) {
                      setModalOpen(false);
                      setEditingProject(null);
                    }
                  }}
                  className="rounded-full border border-slate-700/70 px-4 py-1.5 text-[11px] text-slate-200 hover:border-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-brand-600 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-brand-600/40 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving
                    ? editingProject
                      ? "Saving..."
                      : "Creating..."
                    : editingProject
                      ? "Save changes"
                      : "Create project"}
                </button>
              </div>
            </form>
          </div>

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
      )}
    </div>
  );
}

