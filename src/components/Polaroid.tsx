"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { MotionProps } from "framer-motion";
import type { Picture } from "~/lib/archive";

const TILT_DEGREES = 6;
const TILT_SPRING = { stiffness: 220, damping: 18, mass: 0.4 };

interface PolaroidProps {
  picture: Picture;
  /* Sizes the photo window; the frame grows with it. */
  className?: string;
  onClick?: () => void;
  /* Hidden while its copy is open in the overlay, so only one is ever seen. */
  hidden?: boolean;
  /* Governs the flight between grid and overlay. The element being animated
     owns it, so the overlay copy carries the opening spring and the grid copy
     the closing one. */
  transition?: MotionProps["transition"];
}

export default function Polaroid({
  picture,
  className,
  onClick,
  hidden,
  transition,
}: PolaroidProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // -0.5 .. 0.5, where the pointer sits within the card.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, TILT_SPRING);
  const sy = useSpring(py, TILT_SPRING);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-TILT_DEGREES, TILT_DEGREES]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [TILT_DEGREES, -TILT_DEGREES]);

  const track = (e: React.PointerEvent) => {
    // Coarse pointers have no hover, and a tap would leave the tilt stuck on.
    if (!onClick || reduceMotion || e.pointerType !== "mouse") return;
    const box = cardRef.current?.getBoundingClientRect();
    if (!box) return;
    px.set((e.clientX - box.left) / box.width - 0.5);
    py.set((e.clientY - box.top) / box.height - 0.5);
  };

  const release = () => {
    px.set(0);
    py.set(0);
  };

  /* Straighten before handing over to the layout animation: framer measures a
     bounding box to fly between, and a tilted box is the wrong one. */
  const handleClick = () => {
    if (!onClick) return;
    release();
    onClick();
  };

  return (
    <motion.div
      ref={cardRef}
      layoutId={picture.src}
      transition={transition}
      onClick={handleClick}
      onPointerMove={track}
      onPointerLeave={release}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        visibility: hidden ? "hidden" : "visible",
      }}
      className={`relative select-none rounded-[2px] bg-[#fdfcf8] p-3 pb-11 shadow-[0_6px_20px_hsl(0_0%_0%/0.45)] ${
        onClick ? "cursor-pointer" : ""
      } ${className ?? ""}`}
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-300">
        <Image
          src={picture.src}
          alt={picture.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover"
          draggable={false}
        />
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-baseline justify-between gap-2 text-neutral-700">
        <span className="truncate font-hand text-medium leading-none">
          {picture.title}
        </span>
        {picture.year && (
          <span className="shrink-0 font-hand text-small leading-none text-neutral-500">
            {picture.year}
          </span>
        )}
      </div>
    </motion.div>
  );
}
