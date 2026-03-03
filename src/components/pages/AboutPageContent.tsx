"use client";

import { motion } from "framer-motion";
import { MotionDiv } from "../ui/MotionDiv";

const principles = [
  {
    title: "Production-first mindset",
    description:
      "We treat every student project and SME website like a real startup product—designed for clarity, speed, and maintainability."
  },
  {
    title: "Transparent collaboration",
    description:
      "You always know what is being built, what is shipped, and what is pending. No black-box development."
  },
  {
    title: "Education built-in",
    description:
      "Especially for students, we explain architecture decisions so you can confidently present your work in viva and interviews."
  }
];

export function AboutPageContent() {
  return (
    <div className="space-y-10 md:space-y-14">
      <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            SmartCampusTech is your{" "}
            <span className="bg-gradient-to-r from-brand-200 via-white to-brand-300 bg-clip-text text-transparent">
              dedicated web engineering partner
            </span>
            .
          </h1>
          <p className="mt-3 text-sm text-slate-300 md:text-base">
            We sit at the intersection of campus and industry—helping final year
            students ship serious web projects and helping small businesses get
            a digital presence that actually works.
          </p>
          <p className="mt-3 text-sm text-slate-300 md:text-base">
            Instead of juggling freelancers for design, frontend, backend, and
            deployment, you work with one accountable engineering studio that
            understands the full stack: Next.js, Node.js, and MongoDB Atlas.
          </p>
        </div>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="card-surface-dark rounded-3xl p-5 text-sm text-slate-200"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Brand at a glance
          </p>
          <dl className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Brand name</dt>
              <dd className="font-medium text-slate-100">SmartCampusTech</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Focus</dt>
              <dd className="font-medium text-slate-100 text-right">
                Final year website projects &amp; small business websites
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Stack</dt>
              <dd className="font-medium text-slate-100">
                Next.js · Node.js · MongoDB Atlas
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-400">Contact</dt>
              <dd className="font-medium text-slate-100 text-right">
                +91 9324998085
                <br />
                smartcampus2025@gmail.com
              </dd>
            </div>
          </dl>
        </MotionDiv>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          How SmartCampusTech works
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((principle) => (
            <motion.article
              key={principle.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45 }}
              className="card-surface-dark rounded-3xl p-4 text-xs text-slate-300"
            >
              <h3 className="text-sm font-semibold text-slate-50">
                {principle.title}
              </h3>
              <p className="mt-2">{principle.description}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

