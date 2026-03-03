"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const services = [
  {
    category: "For Final Year Students",
    title: "End-to-end Final Year Web Projects",
    tagline: "Ship a real-world project, not just a college assignment.",
    modules: [
      "Requirements & idea refinement workshop",
      "Information architecture & database design",
      "Next.js frontend with premium UI",
      "Secure Node.js API & MongoDB integration",
      "Authentication, roles & basic analytics",
      "Deployment + walkthrough for viva",
      "Guidance for report & documentation"
    ],
    cta: {
      label: "Share your syllabus & idea",
      href: "/contact"
    }
  },
  {
    category: "For Small Businesses",
    title: "Conversion-focused Business Websites",
    tagline:
      "Modern, fast, and trustworthy websites that convert visitors into leads.",
    modules: [
      "Discovery call & positioning clarity",
      "UX wireframes & content guidance",
      "Responsive marketing site in Next.js",
      "Lead forms, WhatsApp & call-to-action",
      "On-page SEO best practices",
      "Analytics & basic performance monitoring",
      "Maintenance & iteration options"
    ],
    cta: {
      label: "Book a website strategy call",
      href: "https://wa.me/919324998085"
    }
  }
];

export function ServicesPageContent() {
  return (
    <div className="space-y-10 md:space-y-14">
      <section className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Services built around{" "}
          <span className="bg-gradient-to-r from-brand-200 via-white to-brand-300 bg-clip-text text-transparent">
            delivery & clarity
          </span>
          .
        </h1>
        <p className="mt-3 text-sm text-slate-300 md:text-base">
          SmartCampusTech focuses on two strong lanes: rock-solid final year
          projects for students and premium websites for small businesses. No
          templates, no shortcuts—only custom work tuned to your context.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <motion.article
            key={service.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
            className="card-surface-dark flex flex-col rounded-3xl p-5"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-200">
              {service.category}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-50">
              {service.title}
            </h2>
            <p className="mt-1 text-sm text-slate-300">{service.tagline}</p>
            <ul className="mt-4 flex-1 space-y-2 text-xs text-slate-300">
              {service.modules.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-brand-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Built with Next.js, Node.js & MongoDB Atlas.</span>
              <Link
                href={service.cta.href}
                target={service.cta.href.startsWith("http") ? "_blank" : "_self"}
                className="inline-flex items-center gap-1 rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-[11px] font-semibold text-brand-100 hover:border-brand-300 hover:bg-brand-500/20"
              >
                {service.cta.label}
                <span className="text-[10px]">↗</span>
              </Link>
            </div>
          </motion.article>
        ))}
      </section>
    </div>
  );
}

