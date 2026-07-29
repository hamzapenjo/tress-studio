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

const STEP_LABELS: Record<string, string> = {
  usluga: "Usluga",
  osoblje: "Osoblje",
  datum: "Datum",
  vrijeme: "Vrijeme",
  kontakt: "Kontakt",
};

function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}.`;
}

function BookingSummary({
  service,
  staff,
  date,
  time,
}: {
  service?: Service;
  staff?: Staff;
  date: string;
  time: string;
}) {
  const empty = <span className="text-ink-dim/50">Nije odabrano</span>;

  return (
    <div className="border border-ink/10 bg-ink/[0.02] p-6">
      <p className="mb-5 text-xs tracking-[0.14em] text-brass uppercase">
        Vaša rezervacija
      </p>
      <dl className="flex flex-col gap-4 text-sm">
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-4">
          <dt className="text-ink-dim">Usluga</dt>
          <dd className="text-right font-display italic">
            {service ? service.name : empty}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-4">
          <dt className="text-ink-dim">Osoblje</dt>
          <dd className="text-right font-display italic">
            {staff ? staff.name : <span className="text-ink-dim/50">Bilo koje</span>}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4 pb-1">
          <dt className="text-ink-dim">Termin</dt>
          <dd className="text-right font-display italic">
            {date && time ? `${formatDisplayDate(date)} u ${time}` : empty}
          </dd>
        </div>
      </dl>
      {service && (
        <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-5">
          <span className="text-xs tracking-[0.1em] text-ink-dim uppercase">
            Cijena
          </span>
          <span className="font-display text-2xl italic text-brass">
            {service.price} KM
          </span>
        </div>
      )}
    </div>
  );
}

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
    <div className="grid grid-cols-1 items-start gap-12 sm:grid-cols-[1fr_300px]">
      <form action={formAction} className="flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`h-0.5 flex-1 ${i <= stepIndex ? "bg-brass" : "bg-ink/10"}`}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            {steps.map((s, i) => (
              <span
                key={s}
                className={`text-[10px] tracking-[0.08em] uppercase ${
                  i === stepIndex ? "text-brass" : "text-ink-dim/50"
                }`}
              >
                {STEP_LABELS[s]}
              </span>
            ))}
          </div>
        </div>

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
            variant="light"
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
              variant="light"
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
            variant="light"
          />
        </div>

        <div className={step === "vrijeme" ? "flex flex-col gap-2" : "hidden"}>
          <label className={labelClass}>Vrijeme *</label>
          <TimeInput
            name="time"
            onChange={setTime}
            triggerClassName={timeTriggerClass}
            separatorClassName="text-ink-dim"
            variant="light"
          />
          <p className="text-xs text-ink-dim">Radimo Pon-Pet 09:00-17:00.</p>
        </div>

        <div className={step === "kontakt" ? "flex flex-col gap-6" : "hidden"}>
          <div className="sm:hidden">
            <BookingSummary
              service={selectedService}
              staff={selectedStaff}
              date={date}
              time={time}
            />
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

      <div className="hidden sm:sticky sm:top-24 sm:block">
        <BookingSummary
          service={selectedService}
          staff={selectedStaff}
          date={date}
          time={time}
        />
      </div>
    </div>
  );
}
