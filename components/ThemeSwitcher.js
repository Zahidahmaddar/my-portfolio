// components/ThemeSwitcher.js
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      {theme === "dark" ? "Dark ☀️" : "Light 🌙"}
    </button>
  );
}
