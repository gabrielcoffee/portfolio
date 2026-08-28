import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";

interface LinkArrowProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export default function LinkArrow({
  href,
  children,
  className,
  external,
}: LinkArrowProps) {
  const classes = cn(
    "arrow-reveal group flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground",
    className
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
        <ArrowRight className="arrow-icon h-3 w-3" strokeWidth={2.4} />
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      <ArrowRight className="arrow-icon h-3 w-3" strokeWidth={2.4} />
    </Link>
  );
}
