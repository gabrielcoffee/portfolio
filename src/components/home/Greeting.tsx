"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const GREETINGS = [
  { text: "Hello", lang: "en" },
  { text: "Hola", lang: "es" },
  { text: "Bonjour", lang: "fr" },
  { text: "Ciao", lang: "it" },
  { text: "こんにちは", lang: "ja" },
];

const INTERVAL_MS = 2500;
const LETTER_STEP = 0.04;

const hidden = { opacity: 0, filter: "blur(4px)", y: 5, rotateX: 90 };
const shown = { opacity: 1, filter: "blur(0px)", y: 0, rotateX: 0 };

export default function Greeting() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % GREETINGS.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  // Modulo keeps a stale index valid if the list shrinks during a hot reload.
  const { text, lang } = GREETINGS[index % GREETINGS.length];

  return (
    // Fixed height: letters leaving and arriving never nudge the page.
    <h2 className="h-[1.375em] font-title text-[18px] font-bold text-black" aria-label="Hello">
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          lang={lang}
          aria-hidden
          className="inline-block whitespace-pre"
        >
          {/* Array.from keeps Japanese and Korean glyphs whole. */}
          {Array.from(text).map((letter, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={hidden}
              animate={shown}
              exit={hidden}
              transition={{ duration: 0.3, delay: i * LETTER_STEP }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </h2>
  );
}
