"use client";

import { useEffect, useMemo, useState } from "react";

type AdminActivityLog = {
  _id?: string;
  adminEmail: string;
  action: string;
  details?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
  createdAt?: string | Date;
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/logs", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load logs");
      }
      const data = (await res.json()) as { logs: AdminActivityLog[] };
      setLogs(data.logs ?? []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError("Unable to load activity logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLogs();
  }, []);

  const tableLogs = useMemo(
    () =>
      logs.slice().sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      }),
    [logs]
  );

  return (
    <div className="space-y-5 text-xs text-slate-200">
      <div>
        <h1 className="text-sm font-semibold tracking-tight text-slate-50">
          Activity logs
        </h1>
        <p className="mt-1 text-[11px] text-slate-400">
          Recent admin actions such as login attempts and CRUD operations. This
          helps you audit how the panel is being used.
        </p>
      </div>

      {error && (
        <p className="text-[11px] text-rose-300" aria-live="polite">
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-2 space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className="h-10 animate-pulse rounded-xl bg-slate-900/70" />
          ))}
        </div>
      ) : tableLogs.length === 0 ? (
        <p className="mt-2 text-[11px] text-slate-500">
          No activity logs recorded yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/70 bg-slate-950/70">
          <table className="min-w-full border-collapse text-left text-[11px]">
            <thead className="bg-slate-950/80 text-slate-400">
              <tr>
                <th className="px-3 py-2 font-semibold">Time</th>
                <th className="px-3 py-2 font-semibold">Admin</th>
                <th className="px-3 py-2 font-semibold">Action</th>
                <th className="px-3 py-2 font-semibold">Details</th>
                <th className="px-3 py-2 font-semibold">IP / User agent</th>
              </tr>
            </thead>
            <tbody>
              {tableLogs.map((log) => {
                const createdAt = log.createdAt
                  ? new Date(log.createdAt)
                  : null;
                return (
                  <tr
                    key={log._id?.toString() ?? log.adminEmail + log.action}
                    className="border-t border-slate-800/60 hover:bg-slate-900/60"
                  >
                    <td className="px-3 py-2 text-slate-300">
                      {createdAt ? (
                        <>
                          {createdAt.toLocaleDateString()}{" "}
                          <span className="text-[10px] text-slate-500">
                            {createdAt.toLocaleTimeString()}
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-100">
                      {log.adminEmail}
                    </td>
                    <td className="px-3 py-2 text-slate-300">{log.action}</td>
                    <td className="max-w-xs px-3 py-2 text-slate-300">
                      <code className="line-clamp-3 break-all rounded bg-slate-900/80 px-2 py-1 text-[10px]">
                        {log.details
                          ? JSON.stringify(log.details)
                          : JSON.stringify({})}
                      </code>
                    </td>
                    <td className="max-w-xs px-3 py-2 text-slate-300">
                      <div>{log.ip ?? "-"}</div>
                      <div className="line-clamp-2 text-[10px] text-slate-500">
                        {log.userAgent ?? ""}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

