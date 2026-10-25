"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Picture } from "~/lib/archive";

/* THE KNOBS */
const FRAME_HEIGHT = "clamp(13rem, 44vh, 24rem)"; // width follows at 4:3
const GAP_REM = 1.25;
const HOVER_SCALE = 1.07;
const DURATION_MS = 140;
const EASE = "cubic-bezier(0.2, 0, 0, 1)";

interface FilmstripProps {
  pictures: Picture[];
}

/* A rail of 4:3 photos that never ends: the list is laid out several times in
   a row and the scroll position is wrapped back into the second copy, so the
   seam is never reachable. Nothing fades — hover is the only state, and it
   only ever changes size. */
export default function Filmstrip({ pictures }: FilmstripProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLUListElement>(null);
  // Width of one copy of the list, gap included. Measured, never guessed.
  const setWidth = useRef(0);
  const [copies, setCopies] = useState(3);

  /* One copy has to be at least as wide as the viewport, otherwise wrapping
     into the second copy would leave bare rail on the right. */
  const measure = useCallback(() => {
    const rail = railRef.current;
    const set = setRef.current;
    if (!rail || !set) return;

    const gap = GAP_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const width = set.getBoundingClientRect().width + gap;
    if (width <= 0) return;

    setWidth.current = width;
    setCopies(Math.max(3, Math.ceil(rail.clientWidth / width) + 2));

    // Park in the second copy so there is room to scroll either way.
    if (rail.scrollLeft < width) rail.scrollLeft = width;
  }, []);

  useLayoutEffect(() => {
    measure();
    const set = setRef.current;
    if (!set) return;

    // Photos arriving late change the set's width; re-measure when they do.
    const observer = new ResizeObserver(measure);
    observer.observe(set);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  /* The wrap. Both copies show identical pixels at the moment of the jump, so
     it is invisible — as long as it is not animated. */
  const onScroll = useCallback(() => {
    const rail = railRef.current;
    const width = setWidth.current;
    if (!rail || width <= 0) return;

    if (rail.scrollLeft >= width * 2) rail.scrollLeft -= width;
    else if (rail.scrollLeft < width) rail.scrollLeft += width;
  }, []);

  /* A wheel with no horizontal axis — a mouse — still has to be able to move
     the rail, since the page itself does not scroll here. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      rail.scrollLeft += e.deltaY;
    };

    rail.addEventListener("wheel", onWheel, { passive: false });
    return () => rail.removeEventListener("wheel", onWheel);
  }, []);

  // Nothing to show is nothing to say.
  if (pictures.length === 0) return null;

  return (
    <div
      ref={railRef}
      onScroll={onScroll}
      tabIndex={0}
      aria-label="Pictures"
      className="w-full overflow-x-auto overflow-y-hidden overscroll-x-contain focus:outline-none"
      style={{ scrollbarWidth: "none" }}
    >
      {/* Vertical padding is headroom: a hovered frame grows, and the rail
          clips anything that leaves it. */}
      <div className="flex w-max py-4" style={{ gap: `${GAP_REM}rem` }}>
        {Array.from({ length: copies }, (_, copy) => (
          <ul
            key={copy}
            // Only the first copy is measured; the rest are its clones.
            ref={copy === 0 ? setRef : undefined}
            className="flex w-max"
            style={{ gap: `${GAP_REM}rem` }}
            aria-hidden={copy > 0}
          >
            {pictures.map((picture) => (
              <Frame key={picture.src} picture={picture} />
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Frame({ picture }: { picture: Picture }) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className="group shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative overflow-hidden bg-muted"
        style={{
          height: FRAME_HEIGHT,
          aspectRatio: "4 / 3",
          transformOrigin: "center",
          transform: `scale(${hovered ? HOVER_SCALE : 1})`,
          transition: `transform ${DURATION_MS}ms ${EASE}`,
        }}
      >
        <Image
          src={picture.src}
          alt={picture.title}
          fill
          sizes="(max-width: 768px) 80vw, 40vw"
          // Every photo is the same box, so the ratio mismatch is cropped.
          className="object-cover"
          draggable={false}
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="min-w-0 truncate text-small text-muted-foreground transition-colors duration-150 group-hover:text-foreground">
          {picture.title}
        </span>
        {picture.year ? (
          <span className="shrink-0 text-small text-muted-foreground">
            {picture.year}
          </span>
        ) : null}
      </div>
    </li>
  );
}
