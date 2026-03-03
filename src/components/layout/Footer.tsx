import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950">
      <div className="container py-8 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-100">
              SmartCampusTech
            </p>
            <p className="mt-1 max-w-md text-xs text-slate-400">
              Premium web engineering studio for final year students and growing
              small businesses across India.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-300">
            <div className="flex flex-col">
              <span className="font-semibold text-slate-200">Contact</span>
              <a href="tel:+919324998085" className="mt-1 hover:text-white">
                +91 9324998085
              </a>
              <a
                href="mailto:smartcampus2025@gmail.com"
                className="hover:text-white"
              >
                smartcampus2025@gmail.com
              </a>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-200">Social</span>
              <Link
                href="https://instagram.com/smartcampustech"
                target="_blank"
                className="mt-1 hover:text-white"
              >
                Instagram
              </Link>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-200">Services</span>
              <Link href="/services" className="mt-1 hover:text-white">
                Final Year Projects
              </Link>
              <Link href="/services" className="hover:text-white">
                Websites for SMEs
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-slate-900/60 pt-4 text-[11px] text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} SmartCampusTech. All rights reserved.
          </p>
          <p>
            Crafted with Next.js, TypeScript, Tailwind CSS & Framer Motion.
          </p>
        </div>
      </div>
    </footer>
  );
}

