import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface LinkArrowProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

const classes =
  "arrow-reveal group flex items-center text-small text-muted-foreground transition-colors hover:text-foreground";

export default function LinkArrow({
  href,
  children,
  external,
}: LinkArrowProps) {
  const arrow = <ArrowRight className="arrow-icon h-3 w-3" strokeWidth={2.4} />;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      {arrow}
    </Link>
  );
}
