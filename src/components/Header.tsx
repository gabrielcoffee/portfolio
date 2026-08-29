"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { animateAtom } from "~/lib/atoms";
import { FadeIn } from "~/components/FadeIn";
import { ThemeSelector } from "~/components/ThemeSelector";
import { inkCenteringOffset, measureInk } from "~/lib/ink";

const links = [
  { href: "/", label: "start" },
  { href: "/journal", label: "journal" },
  { href: "/archive", label: "archive" },
  { href: "/visitors", label: "visitors" },
];

/* Wordmark backdrop — the knobs live here */
const WORDMARK_SIZE = "clamp(4.25rem, 30vw, 8rem)";
const WORDMARK_BLUR_PX = 5; // resting blur
const WORDMARK_OPACITY = 0.112; // 70% of the 0.16 it sat at before

/* Page swap: the outgoing word blurs away as the incoming one sharpens, the two
   crossing at half opacity — so the peak blur below is what you read at the
   midpoint, where neither word is legible.

   Blur spreads a glyph past its own edges, which alone reads as the word
   swelling. Pulling the scale in over the same beat cancels that: the word
   recedes as it dissolves and comes back out as it sharpens. */
const WORDMARK_SWAP_BLUR_PX = 12;
const WORDMARK_SWAP_SCALE = 0.86;
const WORDMARK_SWAP_DURATION = 0.9;

/* Hand-drawn nav icons. Square by construction — each source PNG is trimmed to
   its ink and centred on one canvas — so a single box size renders all four at
   a matching weight. Roughly the width of the word "start" at text-medium. */
const ICON_SIZE = "2.125rem";
const ICON_IDLE_OPACITY = 0.6; // the current page's icon shows at full strength
const LABEL_IDLE_OPACITY = 0.85;
const HOVER_LIFT = 0.15; // how much brighter icon and label go on hover

/* Lifts the nav off the blurred wordmark behind it. drop-shadow rather than
   box-shadow for the icons: they are transparent PNGs, and box-shadow would
   trace their bounding box instead of the drawing. */
const NAV_SHADOW = "0 1px 2px hsl(0 0% 0% / 0.35)";

const iconStyle = {
  width: ICON_SIZE,
  height: ICON_SIZE,
  filter: `drop-shadow(${NAV_SHADOW})`,
} as const;

/* First path segment, so a new route gets a wordmark without a map here. */
function pageName(pathname: string) {
  return pathname.split("/").filter(Boolean)[0] ?? "start";
}

/* One page's word. Centred on measured type metrics rather than its line box,
   so the nav row sits on the same line on every page — see inkCenteringOffset
   for why each axis is anchored as it is.

   Positioning and animation are split across two elements on purpose: framer
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
      // No ink metrics — leave it on the line box rather than guess.
      setOffset(ink ? inkCenteringOffset(ink, fontSize) : { x: 0, y: 0 });
    };

    measure();
    // WORDMARK_SIZE is fluid, so the size — and the offset — changes on resize.
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
        // On first paint it rises like the rest of the page; on a page swap it
        // only blurs, since sliding two overlapping words would read as noise.
        // The entrance rises and sharpens like the rest of the page, and keeps
        // full scale — only the swap needs the shrink.
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

  // Hovering lifts both by the same step, so the pair brightens together. The
  // active page's icon is already at full strength and simply stays there.
  const lift = hovered ? HOVER_LIFT : 0;
  const iconOpacity = Math.min(1, (active ? 1 : ICON_IDLE_OPACITY) + lift);
  const labelOpacity = Math.min(1, LABEL_IDLE_OPACITY + lift);

  return (
    <Link
      href={href}
      // inline-flex, not the default inline: the label is a flex box, and an
      // inline parent wrapping one drops this padding.
      className="relative inline-flex flex-col items-center gap-tight px-cozy py-snug text-medium sm:px-base"
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
      // Keyboard focus lights it too, so tabbing reads the same as pointing.
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* Two files rather than a CSS filter: the art is hand-drawn, and a
          filter would have to fight the antialiased stroke edges. The label
          already names the link, so the icons are decorative. */}
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
  // True only on the first load of the session, so the entrance plays once and
  // later navigations get the swap instead. Cleared here rather than in the
  // home page's content, because the header is the one thing on every route —
  // landing directly on /journal has to spend the flag too.
  const [shouldAnimate, setShouldAnimate] = useAtom(animateAtom);
  const label = pageName(pathname);

  useEffect(() => {
    if (!shouldAnimate) return;
    const timer = setTimeout(() => setShouldAnimate(false), 2000);
    return () => clearTimeout(timer);
  }, [shouldAnimate, setShouldAnimate]);

  return (
    <aside className="relative mb-loose">
      {/* Both words stay mounted through a swap so they can cross over. */}
      <AnimatePresence>
        <Wordmark key={label} label={label} entrance={shouldAnimate} />
      </AnimatePresence>
      <nav className="relative flex flex-row items-center justify-center">
        {/* No gap: the spacing is padding on the links themselves, so the gaps
            between them are still clickable. */}
        <div className="flex flex-row">
          {links.map((link, i) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <FadeIn key={link.href} index={i} animate={shouldAnimate}>
                <NavLink
                  href={link.href}
                  label={link.label}
                  active={isActive}
                />
              </FadeIn>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
