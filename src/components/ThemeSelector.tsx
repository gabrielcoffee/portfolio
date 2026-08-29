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

  if (!mounted) return <div className="h-control w-control" />;

  const current = theme ?? "system";
  const Icon = icons[current] ?? Monitor;

  const cycle = () => {
    const idx = themes.indexOf(current as (typeof themes)[number]);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <button
      onClick={cycle}
      className="flex h-control w-control items-center justify-center rounded-md transition-colors hover:bg-accent"
      aria-label={`Theme: ${current}`}
    >
      <Icon className="h-icon w-icon text-muted-foreground" />
    </button>
  );
}
