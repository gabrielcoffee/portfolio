"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Polaroid from "~/components/Polaroid";
import { scatterOf } from "~/lib/scatter";
import type { Picture } from "~/lib/archive";

/* Slow and bouncy going up, quick coming back down. */
const OPEN = {
  type: "spring",
  stiffness: 120,
  damping: 12,
  mass: 0.9,
} as const;
const CLOSE = { type: "spring", stiffness: 320, damping: 18 } as const;

interface PolaroidWallProps {
  pictures: Picture[];
}

export default function PolaroidWall({ pictures }: PolaroidWallProps) {
  const [open, setOpen] = useState<Picture | null>(null);
  // Which photo is away from the wall. Outlives `open` by one animation: the
  // gap has to stay empty until the overlay has finished flying back into it.
  const [lifted, setLifted] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const pick = (picture: Picture) => {
    setLifted(picture.src);
    setOpen(picture);
  };

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  if (pictures.length === 0) {
    return (
      <p className="text-small text-muted-foreground">
        Drop images in{" "}
        <code className="text-small">public/archive/pictures/</code> — filenames
        become titles (dashes for spaces, an optional{" "}
        <code className="text-small">2019-</code> prefix for the year).
      </p>
    );
  }

  return (
    <>
      <div
        className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8"
        style={{ perspective: 900 }}
      >
        {pictures.map((picture) => {
          const scatter = scatterOf(picture.src);
          const away = lifted === picture.src;

          return (
            /* The scatter lives out here, not on the card: framer measures a
               bounding box to fly between, and a rotated box is the wrong one.
               Flat while the photo is away, and springing back into its tilt as
               it lands — which is what makes it read as dropped into place. */
            <motion.div
              key={picture.src}
              initial={false}
              animate={
                away
                  ? { rotate: 0, x: 0, y: 0 }
                  : { rotate: scatter.rotate, x: scatter.x, y: scatter.y }
              }
              transition={reduceMotion ? { duration: 0 } : CLOSE}
            >
              <Polaroid
                picture={picture}
                hidden={away}
                onClick={() => pick(picture)}
                transition={reduceMotion ? { duration: 0 } : CLOSE}
              />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence onExitComplete={() => setLifted(null)}>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={() => setOpen(null)}
          >
            <Polaroid
              picture={open}
              className="w-[min(78vw,30rem)]"
              transition={reduceMotion ? { duration: 0 } : OPEN}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
