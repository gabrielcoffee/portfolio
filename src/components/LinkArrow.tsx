import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ICON, ICON_STROKE } from "~/components/icons";

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
  const arrow = (
    <ArrowUpRight className={`arrow-icon ${ICON}`} strokeWidth={ICON_STROKE} />
  );

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
