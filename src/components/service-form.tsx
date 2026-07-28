"use client";

import { useActionState } from "react";
import type { ServiceFormState } from "@/app/admin/(dashboard)/usluge/actions";
import type { Database } from "@/lib/database.types";
import {
  fieldClass,
  numberFieldClass,
  labelClass,
  buttonPrimaryClass,
} from "@/components/admin/field-styles";

type Service = Database["public"]["Tables"]["services"]["Row"];

const initialState: ServiceFormState = { status: "idle" };

export function ServiceForm({
  action,
  service,
  submitLabel,
}: {
  action: (
    prevState: ServiceFormState,
    formData: FormData
  ) => Promise<ServiceFormState>;
  service?: Service;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={labelClass}>
          Naziv
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={service?.name}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className={labelClass}>
          Kategorija
        </label>
        <input
          id="category"
          name="category"
          type="text"
          required
          placeholder="Musko, Zensko, Tretmani..."
          defaultValue={service?.category}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="price" className={labelClass}>
          Cijena (KM)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          defaultValue={service?.price}
          className={`w-28 ${numberFieldClass}`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="duration_minutes" className={labelClass}>
          Trajanje (min)
        </label>
        <input
          id="duration_minutes"
          name="duration_minutes"
          type="number"
          min="1"
          step="1"
          required
          defaultValue={service?.duration_minutes}
          className={`w-28 ${numberFieldClass}`}
        />
      </div>

      <button type="submit" disabled={isPending} className={buttonPrimaryClass}>
        {isPending ? "Čuvanje..." : submitLabel}
      </button>

      {state.status === "error" && (
        <p className="w-full font-mono text-sm text-wine">{state.message}</p>
      )}
    </form>
  );
}
