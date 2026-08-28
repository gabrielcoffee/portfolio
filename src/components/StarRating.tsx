interface StarRatingProps {
  rating: number;
  max?: number;
}

export default function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;

        return (
          <svg
            key={i}
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {half ? (
              <>
                <defs>
                  <clipPath id={`half-${i}`}>
                    <rect x="0" y="0" width="10" height="20" />
                  </clipPath>
                </defs>
                <path
                  d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32L2.27 6.62l5.34-.78L10 1z"
                  className="fill-yellow-200 stroke-yellow-500"
                  strokeWidth="1"
                  clipPath={`url(#half-${i})`}
                />
                <path
                  d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32L2.27 6.62l5.34-.78L10 1z"
                  className="stroke-yellow-500"
                  strokeWidth="1"
                  fill="none"
                />
              </>
            ) : (
              <path
                d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32L2.27 6.62l5.34-.78L10 1z"
                className={
                  filled
                    ? "fill-yellow-200 stroke-yellow-500"
                    : "stroke-muted-foreground"
                }
                strokeWidth="1"
                fill={filled ? undefined : "none"}
              />
            )}
          </svg>
        );
      })}
    </div>
  );
}
