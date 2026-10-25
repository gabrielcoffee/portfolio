import Link from "next/link";
import type { ReactNode } from "react";

interface TextLinkProps {
  href: string;
  children: ReactNode;
  /* Opens in a new tab and carries the ↗. */
  external?: boolean;
}

const classes =
  "underline underline-offset-4 decoration-neutral-200 transition-colors hover:decoration-neutral-300";

export default function TextLink({ href, children, external }: TextLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children} <span>↗</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
