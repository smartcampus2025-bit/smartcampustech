import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { listProjects } from "@/lib/repositories";
import type { ProjectCategory } from "@/lib/models";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { MotionDiv } from "@/components/ui/MotionDiv";

export const metadata: Metadata = createPageMetadata({
  title: "Projects & Portfolio",
  description:
    "Dynamic portfolio of SmartCampusTech projects for students and small businesses, with category filters and featured work."
});

const categoryFilters: { label: string; value: ProjectCategory | "all" }[] = [
  { label: "All projects", value: "all" },
  { label: "Final year (students)", value: "student-final-year" },
  { label: "Mini projects (students)", value: "student-mini" },
  { label: "SME websites", value: "sme-website" },
  { label: "Founder / portfolio", value: "founder-portfolio" }
];

export default async function ProjectsPage() {
  const [featured, all] = await Promise.all([
    listProjects({ featuredOnly: true }),
    listProjects()
  ]);

  return (
    <div className="space-y-10 md:space-y-14">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            A curated look at{" "}
            <span className="bg-gradient-to-r from-brand-200 via-white to-brand-300 bg-clip-text text-transparent">
              SmartCampusTech projects
            </span>
            .
          </h1>
          <p className="mt-3 text-sm text-slate-300 md:text-base">
            Only high-level previews are showcased here—focused on outcomes, UI,
            and stack. Source code is never exposed publicly for any client or
            student work.
          </p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Featured projects
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((project) => (
              <MotionDiv
                key={project._id?.toString() ?? project.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45 }}
              >
                <ProjectCard project={project} />
              </MotionDiv>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            All projects
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {categoryFilters.map((filter) => (
              <span
                key={filter.value}
                className="rounded-full border border-slate-800/70 bg-slate-900/60 px-3 py-1 text-[11px] text-slate-300"
              >
                {filter.label}
              </span>
            ))}
            <span className="text-[11px] text-slate-500">
              (Interactive filtering can be added to a CMS/internal dashboard.)
            </span>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {all.map((project) => (
            <ProjectCard
              key={project._id?.toString() ?? project.slug}
              project={project}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

