"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../ui/ThemeToggle";
import { MotionDiv } from "../ui/MotionDiv";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-900/10 bg-slate-950/80 backdrop-blur-md dark:border-slate-800/60">
      <nav className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 shadow-lg shadow-brand-500/40">
            <span className="text-lg font-semibold text-white">S</span>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight text-slate-50">
              SmartCampusTech
            </span>
            <span className="text-xs text-slate-400">
              Web Engineering Studio
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);

              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className="text-slate-300 transition hover:text-white"
                  >
                    {item.label}
                  </Link>

                  {isActive && (
                    <MotionDiv
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-brand-400 to-brand-200"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="https://wa.me/919324998085"
              target="_blank"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/40 transition hover:from-brand-500 hover:to-brand-400"
            >
              <span>Book a Strategy Call</span>
              <span className="text-xs opacity-80">15 mins</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}