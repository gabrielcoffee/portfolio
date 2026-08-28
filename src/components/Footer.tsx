"use client";

export default function Footer() {
  return (
    <footer className="mt-auto overflow-hidden">
      <div className="mx-auto max-w-[40rem] px-6 md:px-0">
        <span
          className="block w-full font-serif font-medium leading-[0.75]"
          style={{
            fontSize: "clamp(5rem, 18vw, 10rem)",
            background:
              "linear-gradient(to bottom, hsl(var(--foreground) / 0.12), hsl(var(--foreground) / 0))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            paddingBottom: 0,
          }}
        >
          Gabriel
        </span>
      </div>
    </footer>
  );
}
