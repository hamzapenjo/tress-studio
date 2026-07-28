"use client";

import { useActionState } from "react";
import type { StaffFormState } from "@/app/admin/(dashboard)/osoblje/actions";
import type { Database } from "@/lib/database.types";
import { fieldClass, labelClass, buttonPrimaryClass } from "@/components/admin/field-styles";

type Staff = Database["public"]["Tables"]["staff"]["Row"];

const initialState: StaffFormState = { status: "idle" };

export function StaffForm({
  action,
  staff,
  submitLabel,
}: {
  action: (
    prevState: StaffFormState,
    formData: FormData
  ) => Promise<StaffFormState>;
  staff?: Staff;
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
          Ime
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={staff?.name}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="role" className={labelClass}>
          Specijalnost / titula
        </label>
        <input
          id="role"
          name="role"
          type="text"
          placeholder="npr. Stilista kose"
          defaultValue={staff?.role ?? ""}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="photo_url" className={labelClass}>
          URL fotografije
        </label>
        <input
          id="photo_url"
          name="photo_url"
          type="url"
          placeholder="https://..."
          defaultValue={staff?.photo_url ?? ""}
          className={`w-64 ${fieldClass}`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="instagram_url" className={labelClass}>
          Instagram link
        </label>
        <input
          id="instagram_url"
          name="instagram_url"
          type="url"
          placeholder="https://instagram.com/..."
          defaultValue={staff?.instagram_url ?? ""}
          className={`w-64 ${fieldClass}`}
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
