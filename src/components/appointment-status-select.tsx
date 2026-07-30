"use client";

import { useState } from "react";
import { Select } from "@/components/select";
import { updateAppointmentStatus } from "@/app/admin/(dashboard)/termini/actions";
import type { AppointmentStatus } from "@/lib/database.types";

const dotColor: Record<AppointmentStatus, string> = {
  na_cekanju: "bg-ink-dim",
  potvrdjeno: "bg-brass",
  zavrseno: "bg-good",
  otkazano: "bg-wine",
};

const options = [
  { value: "na_cekanju", label: "na čekanju" },
  { value: "potvrdjeno", label: "potvrđeno" },
  { value: "zavrseno", label: "završeno" },
  { value: "otkazano", label: "otkazano" },
];

const triggerClass =
  "flex items-center gap-1.5 font-mono text-sm text-ink hover:text-brass";

export function AppointmentStatusSelect({
  id,
  status,
}: {
  id: string;
  status: AppointmentStatus;
}) {
  const [value, setValue] = useState(status);

  return (
    <div className="inline-flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor[value]}`} />
      <Select
        defaultValue={value}
        options={options}
        className={triggerClass}
        variant="light"
        onChange={(next) => {
          const status = next as AppointmentStatus;
          setValue(status);
          updateAppointmentStatus(id, status);
        }}
      />
    </div>
  );
}
