"use client";

import { useState } from "react";
import { StarRating } from "@/components/star-rating";
import type { Database } from "@/lib/database.types";

type Review = Database["public"]["Tables"]["reviews"]["Row"];

export function ReviewsSpotlight({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const review = reviews[index];

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <StarRating rating={review.rating} size={16} className="text-ink-dim/25" />

      <div key={review.id} className="quote-fade-in">
        <p className="mt-8 font-display text-2xl leading-snug italic sm:text-3xl">
          &ldquo;{review.body}&rdquo;
        </p>
        <p className="mt-6 text-xs tracking-[0.14em] text-ink-dim uppercase">
          {review.author_name}
        </p>
      </div>

      {reviews.length > 1 && (
        <div className="mt-10 flex items-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Recenzija ${i + 1} od ${reviews.length}`}
              aria-current={i === index}
              className="p-1.5"
            >
              <span
                className={`block h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? "bg-brass" : "bg-ink/15"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
