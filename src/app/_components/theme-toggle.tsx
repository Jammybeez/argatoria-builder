"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  // Null until mounted — the real theme was already applied pre-hydration
  // by the inline script in layout.tsx, this just reads it back for the icon.
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage unavailable (private mode, etc.) — theme just won't persist
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light/dark theme"
      title="Toggle light/dark theme"
      className="rounded-md border border-brass/50 bg-leather px-2.5 py-1.5 text-sm hover:bg-leather-light"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
