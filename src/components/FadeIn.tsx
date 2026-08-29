"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const STAGGER_STEP = 0.06;
const STAGGER_START = 0.1;

interface FadeInProps {
  index: number;
  as?: "div" | "li";
  className?: string;
  children: ReactNode;
}

/* Plays on mount. Page content remounts on every navigation, so every visit
   gets the entrance; the header lives in the layout and keeps its own. */
export const FadeIn = ({
  index,
  as = "div",
  className,
  children,
}: FadeInProps) => {
  const MotionTag = as === "li" ? motion.li : motion.div;
  const delay = STAGGER_START + index * STAGGER_STEP;

  return (
    <MotionTag
      initial={{ opacity: 0, filter: "blur(4px)", y: 12 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0, -0.02, 0.49, 0.99],
        y: { duration: 0.7, delay, ease: [0.33, 1, 0.68, 1] },
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};
