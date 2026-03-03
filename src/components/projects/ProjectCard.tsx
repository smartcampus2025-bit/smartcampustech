import Link from "next/link";
import type { Project } from "@/lib/models";

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
  const cover =
    project.coverImageUrl || project.imageUrls?.[0] || "/images/project-fallback.jpg";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-soft-xl transition hover:border-brand-400/50 hover:bg-slate-900"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
        {/* Intentionally only exposing imagery & description, never source code */}
        <div
          className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105 group-hover:opacity-95"
          style={{ backgroundImage: `url(${cover})` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            {project.category.replace(/-/g, " ")}
          </p>
          {project.isFeatured && (
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
              Featured
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-slate-50 md:text-base">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-xs text-slate-300">
          {project.shortDescription}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

