"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};

type AdminUserInfo = {
  email: string;
};

type ToastVariant = "success" | "error";

type ToastState = {
  id: number;
  message: string;
  variant: ToastVariant;
};

const sidebarItems = [
  { label: "Dashboard", href: "/secure-admin" },
  { label: "Projects (CRUD)", href: "/secure-admin/projects" },
  { label: "Leads", href: "/secure-admin/leads" },
  { label: "Testimonials", href: "/secure-admin/testimonials" },
  { label: "Website Content", href: "/secure-admin/content" },
  { label: "Media Library", href: "/secure-admin/media" },
  { label: "Activity Logs", href: "/secure-admin/logs" },
  { label: "Settings", href: "/secure-admin/settings" }
] as const;

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUserInfo | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        if (!res.ok) {
          setAdmin(null);
          return;
        }
        const data = (await res.json()) as AdminUserInfo;
        setAdmin(data);
      } catch {
        setAdmin(null);
      } finally {
        setLoadingUser(false);
      }
    };
    loadUser();
  }, []);

  const showToast = (message: string, variant: ToastState["variant"] = "success") => {
    setToast({
      id: Date.now(),
      message,
      variant
    });
    setTimeout(() => {
      setToast((current) => (current && current.id === toast?.id ? null : current));
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      showToast("Logged out successfully", "success");
    } catch {
      showToast("Unable to log out. Please try again.", "error");
    } finally {
      router.push("/secure-admin-login");
    }
  };

  const handleSidebarLogout = async () => {
    await handleLogout();
  };

  const isActive = (href: string) => {
    if (href === "/secure-admin") {
      return pathname === "/secure-admin";
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <aside className="hidden w-60 flex-col border-r border-slate-800/60 bg-slate-950/95 px-4 py-5 md:flex">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 shadow-lg shadow-brand-500/40">
              <span className="text-sm font-semibold text-white">S</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-slate-50">
                SmartCampusTech
              </span>
              <span className="text-[11px] text-slate-400">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 text-xs">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${
                isActive(item.href)
                  ? "bg-brand-600/90 text-white shadow-sm shadow-brand-500/40"
                  : "text-slate-300 hover:bg-slate-900/70 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
            </Link>
          ))}

          <button
            type="button"
            onClick={handleSidebarLogout}
            className="mt-2 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs text-rose-200 transition hover:bg-rose-500/10 hover:text-rose-100"
          >
            <span>Logout</span>
          </button>
        </nav>

        <div className="mt-4 border-t border-slate-800/60 pt-3 text-[11px] text-slate-500">
          <p>Keep this panel private. Avoid shared devices.</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-slate-800/60 bg-slate-950/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Admin
              </span>
              <span className="text-sm font-semibold text-slate-50">
                SmartCampusTech Control Center
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden flex-col text-right text-[11px] text-slate-400 sm:flex">
                <span className="text-slate-500">Signed in as</span>
                <span className="font-medium text-slate-200">
                  {loadingUser ? "Loading..." : admin?.email ?? "Unknown admin"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-700/70 bg-slate-950 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:border-rose-400/70 hover:text-rose-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-slate-950/95 px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
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
  );
}

