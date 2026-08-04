"use client";

import { useState } from "react";
import { StarRating } from "@/components/star-rating";
import type { Database } from "@/lib/database.types";

type Review = Database["public"]["Tables"]["reviews"]["Row"];

export function ReviewsSpotlight({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const review = reviews[index];

  function goTo(next: number) {
    setIndex((next + reviews.length) % reviews.length);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <StarRating rating={review.rating} size={16} className="text-ink-dim/25" />

      <div className="mt-8 flex w-full items-center gap-4 sm:gap-8">
        {reviews.length > 1 && (
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Prethodna recenzija"
            className="shrink-0 p-2 text-ink-dim transition-colors hover:text-brass"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 3 5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div key={review.id} className="quote-fade-in min-w-0 flex-1">
          <p className="font-display text-2xl leading-snug italic sm:text-3xl">
            &ldquo;{review.body}&rdquo;
          </p>
          <p className="mt-6 text-xs tracking-[0.14em] text-ink-dim uppercase">
            {review.author_name}
          </p>
        </div>

        {reviews.length > 1 && (
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Sljedeća recenzija"
            className="shrink-0 p-2 text-ink-dim transition-colors hover:text-brass"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
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
