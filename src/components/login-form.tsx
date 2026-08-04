"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = { status: "idle" };

// Login stranica ostaje tamna (nema bocni meni kao ostatak admina), pa ne
// koristi dijeljene field-styles klase koje su svijetle za ostatak admina.
const fieldClass =
  "border border-paper/20 bg-transparent px-3 py-2.5 font-mono text-sm text-paper placeholder:text-paper-dim/60 focus:border-brass focus:outline-none";
const labelClass = "font-mono text-xs tracking-[0.1em] text-paper-dim uppercase";
const buttonPrimaryClass =
  "bg-brass px-6 py-2.5 font-mono text-xs tracking-[0.1em] text-ink uppercase transition-opacity hover:opacity-90 disabled:opacity-50";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input id="email" name="email" type="email" required className={fieldClass} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className={labelClass}>
          Lozinka
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className={fieldClass}
        />
      </div>

      {state.status === "error" && (
        <p className="font-mono text-sm text-wine">{state.message}</p>
      )}

      <button type="submit" disabled={isPending} className={`mt-2 ${buttonPrimaryClass}`}>
        {isPending ? "Prijava..." : "Prijavi se"}
      </button>
    </form>
  );
}
