"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";
import { fieldClass, labelClass, buttonPrimaryClass } from "@/components/admin/field-styles";

const initialState: LoginState = { status: "idle" };

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
