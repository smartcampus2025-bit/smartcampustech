"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function FloatingWhatsAppButton() {
  const pathname = usePathname();

  if (pathname?.startsWith("/secure-admin")) return null;
  if (pathname === "/secure-admin-login") return null;

  return (
    <motion.a
      href="https://wa.me/919324998085"
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/40 ring-1 ring-emerald-300/40 hover:bg-emerald-400 md:bottom-6 md:right-6"
    >
      <span className="text-lg">💬</span>
      <span className="hidden md:inline">Chat on WhatsApp</span>
    </motion.a>
  );
}

