"use client";

import { motion } from "framer-motion";
import { MotionDiv } from "../ui/MotionDiv";
import Link from "next/link";

const heroStats = [
  { label: "Projects Delivered", value: "70+" },
  { label: "Student Teams Guided", value: "120+" },
  { label: "Avg. Turnaround", value: "2–4 weeks" }
];

const offerings = [
  {
    title: "Final Year Website Projects",
    badge: "For Students",
    description:
      "End-to-end engineering support for your final year project—from idea to deployment. Clean code, clear documentation, and viva-ready demos.",
    highlights: [
      "Next.js, Node.js & MongoDB architecture",
      "Project report & documentation guidance",
      "Deployment on Vercel / custom hosting"
    ]
  },
  {
    title: "Websites for Small Businesses",
    badge: "For SMEs & Founders",
    description:
      "Conversion-focused business websites that load fast, look premium, and actually help you get more calls and leads.",
    highlights: [
      "Strategy-first UX & copywriting support",
      "SEO-ready, mobile-first implementation",
      "WhatsApp & lead capture integrations"
    ]
  }
];

export function HomePageContent() {
  return (
    <div className="space-y-16 md:space-y-20">
      <section className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
        <div>
          <MotionDiv
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200 shadow-sm shadow-emerald-500/30"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Available for{" "}
            <span className="font-semibold">2025 project & website slots</span>
          </MotionDiv>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.55 }}
            className="mt-5 text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl"
          >
            Premium{" "}
            <span className="bg-gradient-to-r from-brand-200 via-white to-brand-300 bg-clip-text text-transparent">
              web experiences
            </span>{" "}
            for students & small businesses.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base"
          >
            SmartCampusTech is a boutique web engineering studio based in India.
            We design, build, and ship production-grade web projects using
            Next.js, Node.js, and MongoDB—without the typical “student project”
            look.
          </motion.p>

          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/50 transition hover:from-brand-500 hover:to-brand-400"
            >
              <span>Discuss your project</span>
              <span className="text-xs opacity-80 group-hover:translate-x-0.5 transition">
                ↗
              </span>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 rounded-full border border-slate-700/70 bg-slate-900/60 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
            >
              View sample project ideas
            </Link>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45 }}
            className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4 text-xs text-slate-300 sm:text-sm"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-sm font-semibold text-slate-50 sm:text-base">
                  {stat.value}
                </p>
                <p className="text-[11px] text-slate-400 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </MotionDiv>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-4 text-[11px] text-slate-500"
          >
            Official contact:{" "}
            <a href="tel:+919324998085" className="font-medium text-slate-300">
              +91 9324998085
            </a>{" "}
            ·{" "}
            <a
              href="mailto:smartcampus2025@gmail.com"
              className="font-medium text-slate-300"
            >
              smartcampus2025@gmail.com
            </a>{" "}
            ·{" "}
            <a
              href="https://instagram.com/smartcampustech"
              target="_blank"
              className="font-medium text-slate-300"
            >
              @smartcampustech
            </a>
          </motion.p>
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.6 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-soft-xl">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/10 text-brand-300">
                  SCT
                </span>
                <span className="font-medium">SmartCampusTech Delivery Flow</span>
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                Next.js · Node.js · MongoDB
              </span>
            </div>

            <div className="grid gap-3 text-xs text-slate-200">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Step 01
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-50">
                  Strategy & Architecture
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Requirement workshop, feature scope, tech stack, and project
                  milestones—clarified upfront so there is zero surprise later.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Step 02
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">
                    Design & Frontend
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    High-conversion UI with Tailwind, Framer Motion powered
                    micro-interactions, and responsive layouts.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Step 03
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">
                    Backend & Launch
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    REST APIs on Next.js, MongoDB Atlas integrations, and
                    deployment with analytics & basic SEO baked in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </MotionDiv>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-50 md:text-xl">
              Where SmartCampusTech creates impact
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              Whether you are a final year student or a small business owner, we
              help you ship something that looks and feels like a real startup
              product.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-300 hover:text-brand-200"
          >
            Explore detailed services
            <span className="text-[11px]">↗</span>
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {offerings.map((offering) => (
            <motion.article
              key={offering.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
              className="card-surface-dark relative overflow-hidden rounded-3xl p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="inline-flex rounded-full bg-brand-500/10 px-2 py-0.5 text-[11px] font-medium text-brand-200">
                    {offering.badge}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-slate-50 md:text-lg">
                    {offering.title}
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-300">
                {offering.description}
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                {offering.highlights.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-brand-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

