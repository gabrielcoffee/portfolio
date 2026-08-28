"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

const themes = [
  "system",
  // "light",
  "dark",
] as const;

const icons: Record<string, typeof Sun> = {
  system: Monitor,
  // light: Sun,
  dark: Moon,
};

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-8 w-8" />;

  const current = theme ?? "system";
  const Icon = icons[current] ?? Monitor;

  const cycle = () => {
    const idx = themes.indexOf(current as (typeof themes)[number]);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <button
      onClick={cycle}
      className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent"
      aria-label={`Theme: ${current}`}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
