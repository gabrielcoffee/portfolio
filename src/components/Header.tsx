"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import { ThemeSelector } from "~/components/ThemeSelector";

const links = [
  { href: "/", label: "start" },
  { href: "/journal", label: "journal" },
  { href: "/archive", label: "archive" },
  { href: "/visitors", label: "visitors" },
];

function RollText({ children }: { children: string }) {
  return (
    <motion.span
      className="relative z-10 flex overflow-hidden"
      initial="idle"
      whileHover="hover"
      animate="idle"
    >
      {/* Current text — rolls down and out on hover */}
      <motion.span
        className="flex"
        variants={{
          idle: { y: 0 },
          hover: { y: "100%" },
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
