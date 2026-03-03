"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SecureAdminError({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("[SecureAdmin] Uncaught error:", error);
  }, [error]);

  const handleRetry = () => {
    reset();
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-rose-500/40 bg-rose-950/40 p-6 text-xs text-rose-100">
      <h1 className="text-sm font-semibold text-rose-100">
        Something went wrong in the admin panel
      </h1>
      <p className="mt-2 text-[11px] text-rose-200/90">
        The error has been logged in the browser console. You can try again or
        return to the dashboard.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleRetry}
          className="rounded-full bg-rose-500 px-4 py-1.5 text-[11px] font-semibold text-white hover:bg-rose-400"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => router.push("/secure-admin")}
          className="rounded-full border border-rose-500/60 px-4 py-1.5 text-[11px] font-medium text-rose-100 hover:bg-rose-500/10"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
}

