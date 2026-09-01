import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ICON, ICON_STROKE } from "~/components/icons";

interface BackButtonProps {
  href: string;
}

/* The arrow alone — where it goes is always one level up, and the page it
   lands on says its own name. */
export default function BackButton({ href }: BackButtonProps) {
  return (
    <Link
      href={href}
      aria-label="Back"
      className="mb-8 -ml-1 flex w-fit items-center p-1 text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className={ICON} strokeWidth={ICON_STROKE} />
    </Link>
  );
}
