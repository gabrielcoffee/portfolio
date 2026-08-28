"use client";

export default function Footer() {
  return (
    <footer className="mt-auto overflow-hidden">
      <div className="mx-auto max-w-[40rem] px-6 md:px-0">
        <span
          className="block w-full font-serif text-display font-medium"
          style={{
            background:
              "linear-gradient(to bottom, hsl(var(--foreground) / 0.12), hsl(var(--foreground) / 0))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Gabriel
        </span>
      </div>
    </footer>
  );
}
