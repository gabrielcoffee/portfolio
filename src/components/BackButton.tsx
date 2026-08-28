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
      className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
      {label}
    </Link>
  );
}
