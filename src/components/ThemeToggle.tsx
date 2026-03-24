"use client";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const cycle = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };
  const label = theme === "dark" ? "◑ DARK" : theme === "light" ? "○ LIGHT" : "◐ SYS";
  return (
    <button
      onClick={cycle}
      className="cyber-btn rounded px-3 py-1.5 text-[0.6rem] tracking-widest"
      title={`Theme: ${theme}`}
    >
      {label}
    </button>
  );
}
