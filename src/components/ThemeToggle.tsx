"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * A small fixed switch, present on every page. Defers to the blocking
 * script in layout.tsx for the first paint — this only takes over once
 * mounted, reading whatever `data-theme` that script (or the system
 * preference) already landed on.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = document.documentElement.getAttribute("data-theme");
    setTheme(stored === "dark" ? "dark" : stored === "light" ? "light" : systemPrefersDark() ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  if (!theme) return null;

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "☀︎" : "☾"}
    </button>
  );
}
