import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, listProjects } from "@/lib/repositories";
import { createPageMetadata } from "@/lib/seo";

type Params = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    return createPageMetadata({ title: "Project not found" });
  }

  return createPageMetadata({
    title: project.title,
    description: project.shortDescription
  });
}

export async function generateStaticParams() {
  const projects = await listProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: Params) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const images = project.imageUrls || [];
  const cover = project.coverImageUrl || images[0];

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-start">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            {project.category.replace(/-/g, " ")}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            {project.title}
          </h1>
          <p className="mt-3 text-sm text-slate-300 md:text-base">
            {project.shortDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-slate-500">
            This preview intentionally focuses on visuals and high-level
            description. SmartCampusTech never exposes full source code publicly
            for any client or student projects.
          </p>
        </div>

        {cover && (
          <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-soft-xl">
            <div
              className="aspect-[4/3] bg-cover bg-center"
              style={{ backgroundImage: `url(${cover})` }}
            />
          </div>
        )}
      </section>

      {images.length > 1 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Additional previews
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {images
              .filter((img) => img !== cover)
              .map((img) => (
                <div
                  key={img}
                  className="overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/60"
                >
                  <div
                    className="aspect-[4/3] bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}

