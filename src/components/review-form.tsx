"use client";

import { useActionState, useRef, useEffect } from "react";
import { createReview, type ReviewFormState } from "@/app/admin/(dashboard)/recenzije/actions";
import { Select } from "@/components/select";
import { fieldClass, selectTriggerClass, labelClass, buttonPrimaryClass } from "@/components/admin/field-styles";

const initialState: ReviewFormState = { status: "idle" };

const ratingOptions = [
  { value: "5", label: "5 - Odlično" },
  { value: "4", label: "4 - Vrlo dobro" },
  { value: "3", label: "3 - Dobro" },
  { value: "2", label: "2 - Osrednje" },
  { value: "1", label: "1 - Loše" },
];

export function ReviewForm() {
  const [state, formAction, isPending] = useActionState(createReview, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && state.status === "idle") {
      formRef.current?.reset();
    }
    wasPending.current = isPending;
  }, [isPending, state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="author_name" className={labelClass}>
          Ime klijenta
        </label>
        <input id="author_name" name="author_name" type="text" required className={fieldClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass}>Ocjena</label>
        <Select
          name="rating"
          defaultValue="5"
          options={ratingOptions}
          className={selectTriggerClass}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="body" className={labelClass}>
          Tekst recenzije
        </label>
        <input id="body" name="body" type="text" required className={fieldClass} />
      </div>

      <button type="submit" disabled={isPending} className={buttonPrimaryClass}>
        {isPending ? "Dodavanje..." : "Dodaj recenziju"}
      </button>

      {state.status === "error" && (
        <p className="w-full font-mono text-sm text-wine">{state.message}</p>
      )}
    </form>
  );
}
