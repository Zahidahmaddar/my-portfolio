"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Runs before first paint (see layout.tsx) so a saved theme never flashes
export const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||((!t||t==="system")&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})();`;

function readStoredTheme(): Theme {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark" || saved === "system") return saved;
  } catch {
    // Storage can be blocked; follow the system setting
  }
  return "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setThemeState(readStoredTheme());
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const next = theme === "system" ? (mediaQuery.matches ? "dark" : "light") : theme;
      document.documentElement.classList.toggle("dark", next === "dark");
      setResolvedTheme(next);
    };
    apply();
    mediaQuery.addEventListener("change", apply);
    return () => mediaQuery.removeEventListener("change", apply);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // The choice just won't persist
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
