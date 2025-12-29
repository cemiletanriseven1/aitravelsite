"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:ring-2 ring-orange-500 transition-all shadow-sm"
      aria-label="Temayı Değiştir"
    >
      {theme === "dark" ? (
        <Sun className="text-orange-500 w-5 h-5" />
      ) : (
        <Moon className="text-neutral-700 w-5 h-5" />
      )}
    </button>
  );
};