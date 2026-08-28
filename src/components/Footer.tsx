"use client";

import { ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-20 pb-8">
      <div className="relative flex items-end justify-between">
        {/* Name clipped at half height with gradient fade */}
        <div className="relative w-full overflow-hidden" style={{ height: "0.55em", fontSize: "clamp(5rem, 15vw, 10rem)" }}>
          <span
            className="absolute bottom-0 left-0 w-full font-serif font-medium leading-none"
            style={{
              background: "linear-gradient(to top, hsl(var(--foreground) / 0.06), hsl(var(--foreground) / 0.15))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Gabriel
          </span>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="absolute bottom-0 right-0 mb-1 flex-shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </footer>
  );
}
