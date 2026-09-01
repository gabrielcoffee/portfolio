"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ICON, ICON_STROKE } from "~/components/icons";
import type { Picture } from "~/lib/archive";

/* THE KNOBS */
const FRAME_HEIGHT = "clamp(11rem, 34vh, 17rem)";
const GAP = "1rem";
const IDLE_OPACITY = 0.4;
const IDLE_SCALE = 0.92;
const DURATION_MS = 160;

interface FilmstripProps {
  pictures: Picture[];
}

/* How many strips are on the page. A page with one — the pictures archive —
   wants the arrow keys to work without aiming first; a page with several (the
   dev gallery) must not step all of them at once. Read inside the handler, so
   it never needs to trigger a render. */
let mounted = 0;

/* A rail of photos scrolling sideways, one of them active. Arrows and the
   left/right keys step the selection; the rail scrolls to follow. No frames,
   no tilt, no springs — the movement is short and linear on purpose. */
export default function Filmstrip({ pictures }: FilmstripProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const step = useCallback(
    (delta: number) => {
      setActive((i) => Math.min(pictures.length - 1, Math.max(0, i + delta)));
    },
    [pictures.length],
  );

  useEffect(() => {
    mounted++;
    return () => {
      mounted--;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const root = rootRef.current;
      if (!root) return;
      // Aim only matters once a second strip exists.
      const aimed =
        mounted === 1 ||
        root.matches(":hover") ||
        root.contains(document.activeElement);
      if (!aimed) return;

      if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  /* Centre the active photo in the rail. scrollIntoView would also scroll the
     page, so the rail's own scrollLeft is set instead. */
  useEffect(() => {
    const rail = railRef.current;
    const item = itemRefs.current[active];
    if (!rail || !item) return;

    rail.scrollTo({
      left: item.offsetLeft - (rail.clientWidth - item.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  // Nothing to show is nothing to say.
  if (pictures.length === 0) return null;

  const current = pictures[active];

  return (
    <div ref={rootRef}>
      <div className="relative">
        {/* The rail bleeds past the 40rem column so photos can run to both
            screen edges, then pads itself back to the column's inner edge. */}
        <ul
          ref={railRef}
          className="-mx-6 flex snap-x snap-mandatory overflow-x-auto px-6 md:mx-[calc(50%-50vw)] md:px-[calc(50vw-50%)]"
          style={{ gap: GAP, scrollbarWidth: "none" }}
        >
          {pictures.map((picture, i) => {
            const isActive = i === active;

            return (
              <li
                key={picture.src}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="shrink-0 snap-center"
                style={{
                  height: FRAME_HEIGHT,
                  opacity: isActive ? 1 : IDLE_OPACITY,
                  transform: `scale(${isActive ? 1 : IDLE_SCALE})`,
                  transition: `opacity ${DURATION_MS}ms ease-out, transform ${DURATION_MS}ms ease-out`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive}
                  aria-label={picture.title}
                  className="block h-full cursor-pointer"
                >
                  <Image
                    src={picture.src}
                    alt={picture.title}
                    width={picture.width}
                    height={picture.height}
                    sizes="60vw"
                    /* w-auto against a fixed height: the real ratio decides the
                       width, so portraits stay narrow, landscapes stay wide,
                       and nothing is cropped or reflows on load. */
                    className="h-full w-auto rounded-sm"
                    draggable={false}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <Arrow side="left" onClick={() => step(-1)} disabled={active === 0} />
        <Arrow
          side="right"
          onClick={() => step(1)}
          disabled={active === pictures.length - 1}
        />
      </div>

      {/* Fixed height so the caption swapping a year in or out never shifts
          the rail above it. */}
      <div className="mt-4 flex h-5 items-baseline justify-between gap-4">
        <span className="truncate text-small">{current.title}</span>
        <span className="shrink-0 text-small text-muted-foreground">
          {current.year ? `${current.year} · ` : ""}
          {active + 1}/{pictures.length}
        </span>
      </div>
    </div>
  );
}

function Arrow({
  side,
  onClick,
  disabled,
}: {
  side: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Previous picture" : "Next picture"}
      className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-1 text-muted-foreground backdrop-blur-sm transition-opacity duration-150 hover:text-foreground disabled:pointer-events-none disabled:opacity-0 ${
        side === "left" ? "-left-2" : "-right-2"
      }`}
    >
      <Icon className={ICON} strokeWidth={ICON_STROKE} />
    </button>
  );
}
