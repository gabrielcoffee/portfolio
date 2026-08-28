"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const STAGGER_STEP = 0.06;
const STAGGER_START = 0.1;
const staggerDelay = (index: number) => STAGGER_START + index * STAGGER_STEP;

interface FadeInProps {
  index: number;
  animate: boolean;
  as?: "div" | "li";
  className?: string;
  children: ReactNode;
}

export const FadeIn = ({
  index,
  animate,
  as = "div",
  className,
  children,
}: FadeInProps) => {
  const MotionTag = as === "li" ? motion.li : motion.div;
  return (
    <MotionTag
      initial={animate ? { opacity: 0, filter: "blur(4px)", y: 12 } : false}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{
        duration: 0.3,
        delay: animate ? staggerDelay(index) : 0,
        ease: [0, -0.02, 0.49, 0.99],
        y: {
          duration: 0.7,
          delay: animate ? staggerDelay(index) : 0,
          ease: [0.33, 1, 0.68, 1],
        },
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};
