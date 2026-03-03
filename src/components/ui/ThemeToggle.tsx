"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      type="button"
      onClick={() =>
        setTheme(currentTheme === "dark" ? "light" : "dark")
      }
      className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-700/70 bg-slate-900/60 text-slate-200 shadow-md shadow-slate-950/40 transition hover:border-slate-500 hover:bg-slate-900"
      aria-label="Toggle dark mode"
    >
      <AnimatePresence mode="wait" initial={false}>
        {currentTheme === "dark" ? (
          <motion.span
            key="sun"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="text-lg"
          >
            ☀️
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="text-lg"
          >
            🌙
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

