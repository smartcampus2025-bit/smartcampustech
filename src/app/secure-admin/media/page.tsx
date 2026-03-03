"use client";

import { useState } from "react";

type UploadRecord = {
  id: string;
  fileName: string;
  target: "project-images" | "client-assets" | "documents";
  webViewLink?: string | null;
  webContentLink?: string | null;
};

type Toast = {
  id: number;
  message: string;
  variant?: "success" | "error";
} | null;

export default function AdminMediaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState<UploadRecord["target"]>("project-images");
  const [projectId, setProjectId] = useState("");
  const [asCover, setAsCover] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (message: string, variant: Toast["variant"] = "success") => {
    const id = Date.now();
    setToast({ id, message, variant });
    setTimeout(() => {
      setToast((current) => (current && current.id === id ? null : current));
    }, 3000);
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      showToast("Please choose a file to upload.", "error");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target", target);
      if (projectId.trim()) {
        formData.append("projectId", projectId.trim());
        formData.append("asCover", asCover ? "true" : "false");
      }

      const res = await fetch("/api/uploads/drive", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to upload file");
      }

      const data = (await res.json()) as {
        fileId: string;
        webViewLink?: string;
        webContentLink?: string;
      };

      const record: UploadRecord = {
        id: data.fileId,
        fileName: file.name,
        target,
        webViewLink: data.webViewLink,
        webContentLink: data.webContentLink
      };

      setUploads((prev) => [record, ...prev]);
      setFile(null);
      setProjectId("");
      setAsCover(false);
      showToast("File uploaded successfully.", "success");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      showToast("Unable to upload file. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 text-xs text-slate-200">
      <div>
        <h1 className="text-sm font-semibold tracking-tight text-slate-50">
          Media Library
        </h1>
        <p className="mt-1 text-[11px] text-slate-400">
          Upload assets to Google Drive and optionally attach them to projects as
          cover or gallery images. Recent uploads in this session are shown below.
        </p>
      </div>

      <form
        onSubmit={handleUpload}
        className="space-y-3 rounded-3xl border border-slate-800/70 bg-slate-950/80 p-4"
      >
        <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              File
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-[11px] text-slate-200 file:mr-3 file:rounded-full file:border-0 file:bg-slate-800/80 file:px-3 file:py-1.5 file:text-[11px] file:font-medium file:text-slate-100 hover:file:bg-slate-700/80"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Target folder
            </label>
            <select
              value={target}
              onChange={(e) =>
                setTarget(
                  e.target.value as "project-images" | "client-assets" | "documents"
                )
              }
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
            >
              <option value="project-images">Project images</option>
              <option value="client-assets">Client assets</option>
              <option value="documents">Documents</option>
            </select>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Attach to project (optional)
            </label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-brand-400/80 focus:ring-2 focus:ring-brand-500/40"
              placeholder="MongoDB ObjectId of project"
            />
            <p className="text-[10px] text-slate-500">
              When provided, the uploaded file will be linked to the project and
              stored in its imageUrls array.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-5 text-[11px]">
            <label className="inline-flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={asCover}
                onChange={(e) => setAsCover(e.target.checked)}
                className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-brand-500"
              />
              Set as cover image
            </label>
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={uploading}
            className="rounded-full bg-brand-600 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-brand-600/40 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {uploading ? "Uploading..." : "Upload file"}
          </button>
        </div>
      </form>

      {uploads.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Recent uploads (this session)
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800/70 bg-slate-950/70">
            <table className="min-w-full border-collapse text-left text-[11px]">
              <thead className="bg-slate-950/80 text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-semibold">File</th>
                  <th className="px-3 py-2 font-semibold">Target</th>
                  <th className="px-3 py-2 font-semibold">Preview</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload) => (
                  <tr
                    key={upload.id}
                    className="border-t border-slate-800/60 hover:bg-slate-900/60"
                  >
                    <td className="px-3 py-2 text-slate-100">{upload.fileName}</td>
                    <td className="px-3 py-2 text-slate-300">{upload.target}</td>
                    <td className="px-3 py-2 text-slate-300">
                      {upload.webViewLink || upload.webContentLink ? (
                        <a
                          href={upload.webViewLink ?? upload.webContentLink ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-200 hover:text-brand-100"
                        >
                          Open in Drive
                        </a>
                      ) : (
                        <span className="text-slate-500">Link not available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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


