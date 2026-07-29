const STAR_PATH =
  "M10 1.3l2.47 5.34 5.87.62-4.36 4.03 1.18 5.79L10 14.1l-5.16 2.98 1.18-5.79L1.66 7.26l5.87-.62z";

export function StarRating({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-0.5 ${className ?? ""}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
          <path
            d={STAR_PATH}
            fill={n <= rating ? "var(--color-brass)" : "none"}
            stroke={n <= rating ? "var(--color-brass)" : "currentColor"}
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}
