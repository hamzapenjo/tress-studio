"use client";

import { useActionState, useMemo, useState } from "react";
import { createAppointment, type BookingState } from "@/app/(site)/zakazivanje/actions";
import type { Database } from "@/lib/database.types";
import { Select } from "@/components/select";
import { TimeInput } from "@/components/time-input";
import { DatePicker } from "@/components/date-picker";

type Service = Database["public"]["Tables"]["services"]["Row"];
type Staff = Database["public"]["Tables"]["staff"]["Row"];

const initialState: BookingState = { status: "idle" };

const fieldClass =
  "border border-ink/20 bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-ink-dim/60 focus:border-brass focus:outline-none";
const selectTriggerClass =
  "flex w-full items-center justify-between gap-2 border border-ink/20 bg-transparent px-3 py-2.5 text-left text-sm text-ink focus:border-brass focus:outline-none";
const timeTriggerClass =
  "flex w-20 items-center justify-between gap-2 border border-ink/20 bg-transparent px-3 py-2.5 text-left text-sm text-ink focus:border-brass focus:outline-none";
const dateMutedClass = "text-ink-dim/60";
const labelClass = "text-xs tracking-[0.08em] text-ink-dim uppercase";

export function BookingForm({
  services,
  staff,
}: {
  services: Service[];
  staff: Staff[];
}) {
  const [state, formAction, isPending] = useActionState(
    createAppointment,
    initialState
  );

  const steps = useMemo(
    () => ["usluga", ...(staff.length > 0 ? ["osoblje"] : []), "datum", "vrijeme", "kontakt"],
    [staff.length]
  );
  const [stepIndex, setStepIndex] = useState(0);

  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const selectedService = services.find((s) => s.id === serviceId);
  const selectedStaff = staff.find((s) => s.id === staffId);

  if (state.status === "success") {
    return (
      <div className="border border-brass/40 bg-brass/10 p-6">
        <p className="font-display text-lg italic text-ink">{state.message}</p>
      </div>
    );
  }

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`h-0.5 flex-1 ${i <= stepIndex ? "bg-brass" : "bg-ink/10"}`}
          />
        ))}
      </div>
      <p className="-mt-4 text-xs text-ink-dim">
        Korak {stepIndex + 1} od {steps.length}
      </p>

      <div className={step === "usluga" ? "flex flex-col gap-2" : "hidden"}>
        <label className={labelClass}>Usluga *</label>
        <Select
          name="service_id"
          placeholder="Izaberite uslugu"
          className={selectTriggerClass}
          options={services.map((service) => ({
            value: service.id,
            label: `${service.name} (${service.price} KM, ${service.duration_minutes} min)`,
          }))}
          onChange={setServiceId}
          testId="service-select"
        />
      </div>

      {staff.length > 0 && (
        <div className={step === "osoblje" ? "flex flex-col gap-2" : "hidden"}>
          <label className={labelClass}>Osoblje</label>
          <Select
            name="staff_id"
            placeholder="Bilo koje osoblje"
            className={selectTriggerClass}
            options={staff.map((member) => ({
              value: member.id,
              label: member.name,
            }))}
            onChange={setStaffId}
          />
        </div>
      )}

      <div className={step === "datum" ? "flex flex-col gap-2" : "hidden"}>
        <label className={labelClass}>Datum *</label>
        <DatePicker
          name="date"
          minDate={new Date()}
          onChange={setDate}
          triggerClassName={fieldClass + " flex items-center justify-between gap-2"}
          mutedClassName={dateMutedClass}
        />
      </div>

      <div className={step === "vrijeme" ? "flex flex-col gap-2" : "hidden"}>
        <label className={labelClass}>Vrijeme *</label>
        <TimeInput
          name="time"
          onChange={setTime}
          triggerClassName={timeTriggerClass}
          separatorClassName="text-ink-dim"
        />
        <p className="text-xs text-ink-dim">Radimo Pon-Pet 09:00-17:00.</p>
      </div>

      <div className={step === "kontakt" ? "flex flex-col gap-6" : "hidden"}>
        <div className="border border-ink/10 p-4 text-sm text-ink-dim">
          <p className="mb-1 text-ink">
            {selectedService?.name ?? "-"}
            {selectedStaff ? ` · ${selectedStaff.name}` : ""}
          </p>
          <p>
            {date || "-"} u {time || "-"}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelClass}>
            Ime i prezime *
          </label>
          <input id="name" name="name" type="text" required className={fieldClass} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className={labelClass}>
            Broj telefona *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+387 6X XXX XXX"
            className={fieldClass}
          />
        </div>
      </div>

      {state.status === "error" && (
        <p className="text-sm text-wine">{state.message}</p>
      )}

      <div className="flex justify-between">
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={() => setStepIndex((i) => i - 1)}
            className="border border-ink/20 px-6 py-3 text-sm text-ink-dim transition-colors hover:text-ink"
          >
            Nazad
          </button>
        ) : (
          <span />
        )}

        {isLastStep ? (
          <button
            type="submit"
            disabled={isPending}
            className="bg-brass px-7 py-3 text-sm text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Zakazivanje..." : "Potvrdite termin"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStepIndex((i) => i + 1)}
            className="bg-ink px-7 py-3 text-sm text-white transition-opacity hover:opacity-90"
          >
            Dalje
          </button>
        )}
      </div>
    </form>
  );
}
