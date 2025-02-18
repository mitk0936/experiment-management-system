"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Themes = "dark" | "light";

export default function ThemeToggleButton() {
  const [theme, setTheme] = useState<Themes>("light");

  useEffect(() => {
    // Initialize the theme state from localStorage
    const storedTheme = (localStorage.getItem("theme") as Themes) || "light";
    setTheme(storedTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, [theme, setTheme]);

  return (
    <button onClick={toggleTheme} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-md">
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
