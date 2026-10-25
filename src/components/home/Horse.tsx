"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { HORSE_COLS, HORSE_FRAMES } from "~/data/horse";

/* Pitch between dot centres, in px. The whole horse scales with it. */
const CELL = 4;
const FPS = 7;
/* Dot scale for sizes 0..3. */
const SCALE = [0, 0.4, 0.68, 0.95];

/* A galloping horse drawn as a grid of real elements: one round <span> per
   cell, resized every frame. Colour is currentColor, so a text-* class
   restyles it. */
export default function Horse({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  // Frame 4 has all four hooves tucked, the best still.
  const [frame, setFrame] = useState(3);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setFrame((f) => (f + 1) % HORSE_FRAMES.length),
      1000 / FPS,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <div
      aria-hidden
      className={`grid ${className ?? ""}`}
      style={{ gridTemplateColumns: `repeat(${HORSE_COLS}, ${CELL}px)` }}
    >
      {Array.from(HORSE_FRAMES[frame], (size, i) => (
        <span
          key={i}
          className="rounded-full bg-current"
          style={{
            width: CELL,
            height: CELL,
            transform: `scale(${SCALE[Number(size)]})`,
          }}
        />
      ))}
    </div>
  );
}
