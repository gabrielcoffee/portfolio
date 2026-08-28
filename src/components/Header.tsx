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

export default function Header() {
  const pathname = usePathname();

  return (
    <LayoutGroup>
      <aside className="-ml-2 mb-12">
        <nav className="flex flex-row items-center justify-between">
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
                  className="relative px-1.5 py-1 text-sm sm:px-2 sm:text-base"
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
                  <span
                    className="relative z-10"
                    style={{
                      color: isActive
                        ? "hsl(var(--foreground))"
                        : "hsl(var(--muted-foreground))",
                      transitionProperty: "color",
                      transitionDuration: "200ms",
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
          <ThemeSelector />
        </nav>
      </aside>
    </LayoutGroup>
  );
}
