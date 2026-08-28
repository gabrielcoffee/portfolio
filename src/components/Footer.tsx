"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

/* Wordmark geometry — the knobs live here.
   The SVG is drawn at BASE_FONT_PX user units, then the viewBox is snapped to
   the word's own ink, so `width: 100%` scales it to exactly the content width
   whatever the font metrics turn out to be. */
const BASE_FONT_PX = 100;
const TRACKING_PX = -0.02 * BASE_FONT_PX; // -0.02em, in SVG user units
const VISIBLE_FRACTION = 0.6; // top 60% shows; the bottom 40% runs off the page
const FONT_FAMILY = "Georgia, serif";
const FONT_WEIGHT = 500;

/* First path segment, so a new route gets a wordmark without a map here. */
function pageName(pathname: string) {
  return pathname.split("/").filter(Boolean)[0] ?? "start";
}

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/* Ink extents, not the layout box: side bearings and the trailing letter-spacing
   gap would push the word off-centre and leave it short of the edges. */
function measureInk(label: string): Box | null {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;

  ctx.font = `${FONT_WEIGHT} ${BASE_FONT_PX}px ${FONT_FAMILY}`;
  // Unsupported in older Safari; the metrics below just fall back to no tracking.
  ctx.letterSpacing = `${TRACKING_PX}px`;

  const m = ctx.measureText(label);
  const { actualBoundingBoxLeft, actualBoundingBoxRight } = m;
  const { actualBoundingBoxAscent, actualBoundingBoxDescent } = m;
  if (actualBoundingBoxRight === undefined) return null;

  return {
    x: -actualBoundingBoxLeft,
    y: -actualBoundingBoxAscent,
    width: actualBoundingBoxLeft + actualBoundingBoxRight,
    height: actualBoundingBoxAscent + actualBoundingBoxDescent,
  };
}

export default function Footer() {
  const label = pageName(usePathname());
  const textRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState<Box | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      // getBBox is the layout box, so it is only the fallback.
      const fallback = textRef.current?.getBBox();
      setBox(measureInk(label) ?? fallback ?? null);
    };

    measure();
    // Georgia is a system font, but a fallback swap would change the metrics.
    document.fonts?.ready.then(measure).catch(() => undefined);
  }, [label]);

  return (
    <footer className="mt-auto overflow-hidden">
      <div className="mx-auto max-w-[40rem] px-6 md:px-0">
        <svg
          className="block w-full"
          // Cropping the viewBox — not the rendered box — keeps the aspect ratio
          // honest, so the element's own height is the visible 60%.
          viewBox={
            box
              ? `${box.x} ${box.y} ${box.width} ${box.height * VISIBLE_FRACTION}`
              : undefined
          }
          // Hidden until measured so the unsized first paint never flashes.
          style={{ opacity: box ? 1 : 0 }}
          aria-hidden="true"
        >
          <defs>
            {/* Spans the full glyph box, cropped part included, so the fade
                still has depth left where the page cuts it off. */}
            <linearGradient id="footer-wordmark-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.12" />
              <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <text
            ref={textRef}
            x="0"
            y="0"
            fontFamily={FONT_FAMILY}
            fontSize={BASE_FONT_PX}
            fontWeight={FONT_WEIGHT}
            letterSpacing={TRACKING_PX}
            fill="url(#footer-wordmark-fade)"
          >
            {label}
          </text>
        </svg>
      </div>
    </footer>
  );
}
