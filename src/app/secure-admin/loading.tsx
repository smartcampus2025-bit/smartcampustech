export default function SecureAdminLoading() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-64 animate-pulse rounded-full bg-slate-800/60" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="h-32 animate-pulse rounded-3xl bg-slate-900/70"
          />
        ))}
      </div>
    </div>
  );
}

