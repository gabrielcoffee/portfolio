import type { ReactNode } from "react";
import { FadeIn } from "~/components/FadeIn";

interface SectionProps {
  title: ReactNode;
  /* Sits at the far right of the heading — a "More" toggle, an "Older" link. */
  action?: ReactNode;
  /* Stagger slot for the heading. Omit on pages that don't stagger. */
  index?: number;
  /* The last section on a page ends at the page's own padding. */
  last?: boolean;
  className?: string;
  children: ReactNode;
}

/* Heading plus rows, holding the page's vertical rhythm in one place.

   Every row carries its own py-3 — previews and plain links alike — so the
   drop from a heading to its first row is the same in every section, and the
   component needs no knob to say which kind of rows it was handed. */
export default function Section({
  title,
  action,
  index,
  last = false,
  className,
  children,
}: SectionProps) {
  const heading = (
    <h2 className="flex items-center justify-between pb-1 text-medium text-muted-foreground">
      {title}
      {action}
    </h2>
  );

  return (
    <section className={last ? undefined : "pb-[3.25rem]"}>
      {index === undefined ? heading : <FadeIn index={index}>{heading}</FadeIn>}
      <div className={className}>{children}</div>
    </section>
  );
}
