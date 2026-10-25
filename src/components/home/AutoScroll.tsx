"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* Pixels per second: slow enough to read as a drift, not a carousel. */
const SPEED = 12;

/* A horizontal scroller that, on touch screens, drifts its content to the
   left so the strip reads as scrollable. The first touch, drag or wheel on
   it hands control to the user for good. It only moves while on screen and
   stays still for reduced motion. */
export default function AutoScroll({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      !matchMedia("(hover: none)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    // Browsers round scrollLeft, so the position is kept here as a float.
    let pos = el.scrollLeft;
    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      if (last) {
        pos += (SPEED * (now - last)) / 1000;
        el.scrollLeft = pos;
      }
      last = now;
      if (pos >= el.scrollWidth - el.clientWidth) return stop();
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      last = 0;
      if (entry?.isIntersecting) frame = requestAnimationFrame(tick);
    });

    const events = ["touchstart", "pointerdown", "wheel"] as const;
    function stop() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      events.forEach((e) => el!.removeEventListener(e, stop));
    }

    observer.observe(el);
    events.forEach((e) => el.addEventListener(e, stop, { passive: true }));
    return stop;
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
