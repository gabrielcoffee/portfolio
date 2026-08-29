import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "~/lib/date";

interface PostPreviewProps {
  title: string;
  description: string;
  date?: string;
  slug: string;
  showDate?: boolean;
  basePath?: string;
}

export default function PostPreview({
  title,
  description,
  date,
  slug,
  showDate = false,
  basePath = "/journal",
}: PostPreviewProps) {
  const formattedDate = date
    ? formatDate(date, { month: "2-digit", year: "numeric" })
    : null;

  return (
    <Link
      href={`${basePath}/${slug}`}
      className="arrow-reveal group flex w-full cursor-pointer items-center justify-between py-cozy"
    >
      <div className="flex flex-col gap-hair">
        <div className="flex items-center transition-colors duration-150 group-hover:text-muted-foreground">
          {title}
          <ArrowRight className="arrow-icon h-icon w-icon" strokeWidth={2.4} />
        </div>
        <p className="text-small text-muted-foreground">{description}</p>
      </div>
      {showDate && formattedDate && (
        <span className="hidden text-small text-muted-foreground md:block">
          {formattedDate}
        </span>
      )}
    </Link>
  );
}
