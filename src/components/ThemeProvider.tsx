"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "system", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    const stored = localStorage.getItem("hf-theme") as Theme | null;
    if (stored) setThemeState(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (t: Theme) => {
      if (t === "dark") {
        root.classList.remove("light");
      } else if (t === "light") {
        root.classList.add("light");
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) root.classList.remove("light");
        else root.classList.add("light");
      }
    };
    applyTheme(theme);
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("hf-theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
