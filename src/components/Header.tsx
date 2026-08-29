"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "~/components/FadeIn";
import { inkCenteringOffset, measureInk } from "~/lib/ink";

const links = [
  { href: "/", label: "start" },
  { href: "/journal", label: "journal" },
  { href: "/archive", label: "archive" },
  { href: "/visitors", label: "visitors" },
];

/* WORDMARK */
const WORDMARK_SIZE = "clamp(4.25rem, 16vw, 8rem)";
const WORDMARK_BLUR_PX = 5;
const WORDMARK_OPACITY = 0.112;
const WORDMARK_SWAP_BLUR_PX = 12;
const WORDMARK_SWAP_SCALE = 0.86;
const WORDMARK_SWAP_DURATION = 1.2;

/* NAV */
const ICON_SIZE = "2.125rem";
const ICON_IDLE_OPACITY = 0.6;
const LABEL_IDLE_OPACITY = 0.85;
const HOVER_LIFT = 0.15;
const NAV_SHADOW = "0 1px 2px hsl(0 0% 0% / 0.35)";

const iconStyle = {
  width: ICON_SIZE,
  height: ICON_SIZE,
  filter: `drop-shadow(${NAV_SHADOW})`,
} as const;

/* Module state, not component state: the entrance belongs to the page load,
   not to a render. Only ever written from an effect, so the server never sees
   it flipped. */
let entered = false;

function pageName(pathname: string) {
  return pathname.split("/").filter(Boolean)[0] ?? "start";
}

/* Positioning and animation are split across two elements on purpose: framer
   writes `transform` when it animates `y`, which would clobber the centring
   translate if both lived on the same span. */
function Wordmark({ label, entrance }: { label: string; entrance: boolean }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      const style = getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize);
      const ink = measureInk(label, {
        fontSize,
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        letterSpacing: style.letterSpacing,
      });
      setOffset(ink ? inkCenteringOffset(ink, fontSize) : { x: 0, y: 0 });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [label]);

  const blurred = {
    opacity: 0,
    filter: `blur(${WORDMARK_SWAP_BLUR_PX}px)`,
    scale: WORDMARK_SWAP_SCALE,
  };

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 select-none whitespace-nowrap"
      style={{
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
      }}
    >
      <motion.span
        ref={textRef}
        className="block font-serif font-medium"
        style={{
          fontSize: WORDMARK_SIZE,
          lineHeight: 1,
          color: `hsl(var(--foreground) / ${WORDMARK_OPACITY})`,
        }}
        initial={entrance ? { ...blurred, scale: 1, y: 12 } : blurred}
        animate={{
          opacity: 1,
          filter: `blur(${WORDMARK_BLUR_PX}px)`,
          scale: 1,
          y: 0,
        }}
        exit={blurred}
        transition={
          entrance
            ? {
                duration: 0.3,
                delay: 0.1,
                ease: [0, -0.02, 0.49, 0.99],
                y: { duration: 0.7, delay: 0.1, ease: [0.33, 1, 0.68, 1] },
              }
            : { duration: WORDMARK_SWAP_DURATION, ease: [0.4, 0, 0.2, 1] }
        }
      >
        {label}
      </motion.span>
    </span>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const lift = hovered ? HOVER_LIFT : 0;
  const iconOpacity = Math.min(1, (active ? 1 : ICON_IDLE_OPACITY) + lift);
  const labelOpacity = Math.min(1, LABEL_IDLE_OPACITY + lift);

  return (
    <Link
      href={href}
      className="relative inline-flex flex-col items-center gap-1 px-3 py-2 text-medium sm:px-4"
      style={{
        color: active
          ? "hsl(var(--foreground))"
          : "hsl(var(--muted-foreground))",
        textShadow: NAV_SHADOW,
        transitionProperty: "color",
        transitionDuration: "200ms",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <img
        src={`/icons/${label}-light.png`}
        alt=""
        aria-hidden
        className="transition-opacity duration-200 dark:hidden"
        style={{ ...iconStyle, opacity: iconOpacity }}
      />
      <img
        src={`/icons/${label}-dark.png`}
        alt=""
        aria-hidden
        className="hidden transition-opacity duration-200 dark:block"
        style={{ ...iconStyle, opacity: iconOpacity }}
      />
      <span
        className="transition-opacity duration-200"
        style={{ opacity: labelOpacity }}
      >
        {label}
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  // The header never unmounts, so this is true only on the session's first
  // paint — later renders are page swaps, which blur across instead.
  const entrance = !entered;
  const label = pageName(pathname);

  useEffect(() => {
    entered = true;
  }, []);

  return (
    <aside className="relative mb-12">
      {/* Both words stay mounted through a swap so they can cross over. */}
      <AnimatePresence>
        <Wordmark key={label} label={label} entrance={entrance} />
      </AnimatePresence>
      {/* No gap: spacing is padding on the links, so the gaps stay clickable. */}
      <nav className="relative flex flex-row items-center justify-center">
        <div className="flex flex-row">
          {links.map((link, i) => (
            <FadeIn key={link.href} index={i}>
              <NavLink
                href={link.href}
                label={link.label}
                active={
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href)
                }
              />
            </FadeIn>
          ))}
        </div>
      </nav>
    </aside>
  );
}
