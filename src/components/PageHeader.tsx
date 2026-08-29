import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  /** One line under the title. Omit it and the spacing below stays identical. */
  subtitle?: ReactNode;
  /** Controls pinned to the right of the title row (filters, sort, links). */
  actions?: ReactNode;
}

/* The one place a page title is styled and spaced.
   Pages must not render their own <h1> — that is how `visitors` and `archive`
   drifted apart in the first place. Every knob lives here:

     title -> subtitle   cozy
     header -> content   wide   (the same with or without a subtitle) */
export default function PageHeader({
  title,
  subtitle,
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-wide">
      <div className="flex items-center justify-between gap-base">
        <h1 className="font-serif text-big font-medium">{title}</h1>
        {actions}
      </div>
      {subtitle && (
        <p className="mt-cozy text-small text-muted-foreground">{subtitle}</p>
      )}
    </header>
  );
}
