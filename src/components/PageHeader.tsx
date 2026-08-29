import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

/* The one place a page title is styled and spaced — pages must not render
   their own <h1>. */
export default function PageHeader({
  title,
  subtitle,
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-big font-medium">{title}</h1>
        {actions}
      </div>
      {subtitle && (
        <p className="mt-3 text-small text-muted-foreground">{subtitle}</p>
      )}
    </header>
  );
}
