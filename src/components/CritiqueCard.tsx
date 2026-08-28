import Link from "next/link";
import StarRating from "~/components/StarRating";

interface CritiqueCardProps {
  title: string;
  type: string;
  creator: string;
  image: string;
  rating: number;
  slug: string;
}

export default function CritiqueCard({
  title,
  type,
  creator,
  image,
  rating,
  slug,
}: CritiqueCardProps) {
  return (
    <Link href={`/critiques/${slug}`} className="group flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-md bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-95"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="line-clamp-2 text-small">{title}</p>
        <p className="text-small text-muted-foreground">
          {creator}
        </p>
        <div className="flex items-center gap-2">
          <StarRating rating={rating} />
          <span className="text-small capitalize text-muted-foreground">
            {type}
          </span>
        </div>
      </div>
    </Link>
  );
}
