"use client";

import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-20 pb-8">
      {/* Gradient fade from bottom */}
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative flex items-end justify-between">
        <span className="w-full font-serif text-6xl font-medium tracking-tight text-foreground/10 sm:text-8xl">
          Gabriel
        </span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mb-2 flex-shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </footer>
  );
}
