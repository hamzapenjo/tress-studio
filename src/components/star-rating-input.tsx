"use client";

import { useState } from "react";

export function StarRatingInput({
  name,
  defaultValue = 5,
}: {
  name: string;
  defaultValue?: number;
}) {
  const [rating, setRating] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? rating;

  return (
    <div className="flex items-center gap-1">
      <input type="hidden" name={name} value={rating} />
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => setRating(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          aria-label={`${n} od 5 zvjezdica`}
          className="p-0.5 text-2xl leading-none"
        >
          <span className={n <= display ? "text-brass" : "text-ink-dim/30"}>★</span>
        </button>
      ))}
    </div>
  );
}
