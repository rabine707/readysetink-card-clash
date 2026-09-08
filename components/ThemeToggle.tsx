"use client";

import { useEffect, useState } from "react";

type Theme = "rsi" | "neon";
const THEME_KEY = "card-clash-theme-v1";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("rsi");

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const nextTheme: Theme = savedTheme === "neon" ? "neon" : "rsi";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function chooseTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      <button type="button" aria-pressed={theme === "rsi"} onClick={() => chooseTheme("rsi")}>RSI</button>
      <button type="button" aria-pressed={theme === "neon"} onClick={() => chooseTheme("neon")}>Neon</button>
    </div>
  );
}
