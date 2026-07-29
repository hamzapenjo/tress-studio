"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/(site)/kontakt/actions";

const initialState: ContactState = { status: "idle" };

const fieldClass =
  "border border-ink/20 bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim/60 focus:border-brass focus:outline-none";
const labelClass = "text-xs tracking-[0.08em] text-ink-dim uppercase";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendMessage, initialState);

  if (state.status === "success") {
    return (
      <div className="border border-brass/40 bg-brass/10 p-6">
        <p className="font-display text-lg italic text-ink">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex h-full flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={labelClass}>
          Ime i prezime *
        </label>
        <input id="name" name="name" type="text" required className={fieldClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact" className={labelClass}>
          Telefon ili email *
        </label>
        <input id="contact" name="contact" type="text" required className={fieldClass} />
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="body" className={labelClass}>
          Poruka *
        </label>
        <textarea
          id="body"
          name="body"
          required
          className={fieldClass + " flex-1 resize-none"}
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-wine">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="self-start bg-brass px-7 py-2.5 text-sm text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Slanje..." : "Pošaljite poruku"}
      </button>
    </form>
  );
}
