import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({ href, label = "Back" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="mb-section flex items-center gap-snug text-small text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-icon w-icon" strokeWidth={2} />
      {label}
    </Link>
  );
}
