"use client";

import { useActionState, useRef, useEffect, useState } from "react";
import {
  createAppointmentAdmin,
  type AppointmentFormState,
} from "@/app/admin/(dashboard)/termini/actions";
import type { Database } from "@/lib/database.types";
import {
  fieldClass,
  selectTriggerClass,
  labelClass,
  buttonPrimaryClass,
} from "@/components/admin/field-styles";
import { Select } from "@/components/select";
import { TimeInput } from "@/components/time-input";
import { DatePicker } from "@/components/date-picker";

type Service = Database["public"]["Tables"]["services"]["Row"];
type Staff = Database["public"]["Tables"]["staff"]["Row"];

const initialState: AppointmentFormState = { status: "idle" };

export function AppointmentForm({
  services,
  staff,
}: {
  services: Service[];
  staff: Staff[];
}) {
  const [state, formAction, isPending] = useActionState(
    createAppointmentAdmin,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (wasPending.current && !isPending && state.status === "idle") {
      formRef.current?.reset();
      setResetKey((k) => k + 1);
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
        <label className={labelClass}>Usluga</label>
        <Select
          key={`service-${resetKey}`}
          name="service_id"
          placeholder="Izaberite"
          className={selectTriggerClass}
          options={services.map((service) => ({
            value: service.id,
            label: service.name,
          }))}
        />
      </div>

      {staff.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Frizer</label>
          <Select
            key={`staff-${resetKey}`}
            name="staff_id"
            placeholder="Bilo koji"
            className={selectTriggerClass}
            options={staff.map((member) => ({
              value: member.id,
              label: member.name,
            }))}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className={labelClass}>Datum</label>
        <DatePicker key={`date-${resetKey}`} name="date" />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass}>Vrijeme</label>
        <TimeInput key={`time-${resetKey}`} name="time" />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="a_name" className={labelClass}>
          Ime klijenta
        </label>
        <input id="a_name" name="name" type="text" required className={fieldClass} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="a_phone" className={labelClass}>
          Telefon
        </label>
        <input id="a_phone" name="phone" type="tel" required className={fieldClass} />
      </div>

      <button type="submit" disabled={isPending} className={buttonPrimaryClass}>
        {isPending ? "Dodavanje..." : "Dodaj termin"}
      </button>

      {state.status === "error" && (
        <p className="w-full font-mono text-sm text-wine">{state.message}</p>
      )}
    </form>
  );
}
