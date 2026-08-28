"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { motion, LayoutGroup, useAnimationControls } from "framer-motion";
import { ThemeSelector } from "~/components/ThemeSelector";

const links = [
  { href: "/", label: "start" },
  { href: "/journal", label: "journal" },
  { href: "/archive", label: "archive" },
  { href: "/visitors", label: "visitors" },
];

const roll = { duration: 0.3, ease: [0.4, 0, 0.2, 1] } as const;

function RollText({ children }: { children: string }) {
  const controls = useAnimationControls();
  const hovered = useRef(false);
  const current = useRef<"idle" | "hover">("idle");
  const running = useRef(false);

  // Plays whole rolls only: never interrupts one mid-flight. When a roll
  // finishes, re-checks the pointer and rolls again if it disagrees.
  const settle = async () => {
    if (running.current) return;
    running.current = true;
    let target: "idle" | "hover";
    while (current.current !== (target = hovered.current ? "hover" : "idle")) {
      await controls.start(target);
      current.current = target;
    }
    running.current = false;
  };

  return (
    <motion.span
      className="relative z-10 flex overflow-hidden"
      initial="idle"
      animate={controls}
      onHoverStart={() => {
        hovered.current = true;
        void settle();
      }}
      onHoverEnd={() => {
        hovered.current = false;
        void settle();
      }}
    >
      {/* Current text — rolls down and out on hover */}
      <motion.span
        className="flex"
        variants={{
          idle: { y: 0 },
          hover: { y: "100%" },
        }}
        transition={roll}
        aria-hidden
      >
        {children}
      </motion.span>
      {/* Clone — enters from top on hover */}
      <motion.span
        className="absolute left-0 flex"
        variants={{
          idle: { y: "-100%" },
          hover: { y: 0 },
        }}
        transition={roll}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <LayoutGroup>
      <aside className="mb-12">
        <nav className="flex flex-row items-center justify-center">
          <div className="flex flex-row gap-1">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-1.5 py-1 text-base sm:px-2"
                  style={{
                    color: isActive
                      ? "hsl(var(--foreground))"
                      : "hsl(var(--muted-foreground))",
                    transitionProperty: "color",
                    transitionDuration: "200ms",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-md"
                      style={{ background: "hsl(var(--foreground) / 0.08)" }}
                      transition={{
                        type: "spring",
                        duration: 0.35,
                        bounce: 0,
                      }}
                    />
                  )}
                  <RollText>{link.label}</RollText>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </LayoutGroup>
  );
}
