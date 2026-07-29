"use client";

import { useActionState } from "react";
import { submitReview, type PublicReviewState } from "@/app/(site)/actions";
import { StarRatingInput } from "@/components/star-rating-input";

const initialState: PublicReviewState = { status: "idle" };

const fieldClass =
  "border border-ink/20 bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim/60 focus:border-brass focus:outline-none";
const labelClass = "text-xs tracking-[0.08em] text-ink-dim uppercase";

export function PublicReviewForm() {
  const [state, formAction, isPending] = useActionState(submitReview, initialState);

  if (state.status === "success") {
    return (
      <div className="border border-brass/40 bg-brass/10 p-6">
        <p className="font-display text-lg italic text-ink">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 border border-ink/10 p-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="author_name" className={labelClass}>
          Vaše ime *
        </label>
        <input id="author_name" name="author_name" type="text" required className={fieldClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass}>Ocjena *</label>
        <StarRatingInput name="rating" defaultValue={5} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="body" className={labelClass}>
          Vaša recenzija *
        </label>
        <textarea id="body" name="body" rows={3} required className={fieldClass} />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-wine">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="self-start bg-brass px-7 py-3 text-sm text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Slanje..." : "Pošaljite recenziju"}
      </button>
    </form>
  );
}
