"use client";

import { useActionState } from "react";
import type { CustomerFormState } from "@/app/admin/(dashboard)/klijenti/actions";
import type { Database } from "@/lib/database.types";
import { fieldClass, labelClass, buttonPrimaryClass } from "@/components/admin/field-styles";

type Customer = Database["public"]["Tables"]["customers"]["Row"];

const initialState: CustomerFormState = { status: "idle" };

export function CustomerForm({
  action,
  customer,
}: {
  action: (
    prevState: CustomerFormState,
    formData: FormData
  ) => Promise<CustomerFormState>;
  customer: Customer;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={labelClass}>
          Ime
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={customer.name}
          className={fieldClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="phone" className={labelClass}>
          Telefon
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          defaultValue={customer.phone}
          className={fieldClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={customer.email ?? ""}
          className={fieldClass}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="notes" className={labelClass}>
          Napomene
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={customer.notes ?? ""}
          className={fieldClass}
        />
      </div>

      {state.status === "error" && (
        <p className="font-mono text-sm text-wine">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={`self-start ${buttonPrimaryClass}`}
      >
        {isPending ? "Čuvanje..." : "Sačuvaj izmjene"}
      </button>
    </form>
  );
}
