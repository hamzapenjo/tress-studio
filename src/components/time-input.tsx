"use client";

import { useState } from "react";
import { Select } from "@/components/select";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

const defaultTriggerClass =
  "flex w-20 items-center justify-between gap-2 border border-paper/20 bg-transparent px-3 py-2.5 text-left font-mono text-sm text-paper focus:border-brass focus:outline-none";

export function TimeInput({
  name,
  defaultValue,
  onChange,
  triggerClassName,
  separatorClassName,
  variant = "dark",
}: {
  name: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  triggerClassName?: string;
  separatorClassName?: string;
  variant?: "dark" | "light";
}) {
  const [defaultHour = "", defaultMinute = ""] = (defaultValue ?? "").split(":");
  const [hour, setHour] = useState(defaultHour);
  const [minute, setMinute] = useState(defaultMinute);
  const triggerClass = triggerClassName ?? defaultTriggerClass;

  function update(nextHour: string, nextMinute: string) {
    if (nextHour && nextMinute) onChange?.(`${nextHour}:${nextMinute}`);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="hidden"
        name={name}
        value={hour && minute ? `${hour}:${minute}` : ""}
      />
      <Select
        options={HOURS.map((h) => ({ value: h, label: h }))}
        placeholder="ČČ"
        defaultValue={hour}
        onChange={(v) => {
          setHour(v);
          update(v, minute);
        }}
        className={triggerClass}
        testId="time-hour"
        variant={variant}
      />
      <span className={separatorClassName ?? "text-paper-dim"}>:</span>
      <Select
        options={MINUTES.map((m) => ({ value: m, label: m }))}
        placeholder="MM"
        defaultValue={minute}
        onChange={(v) => {
          setMinute(v);
          update(hour, v);
        }}
        className={triggerClass}
        testId="time-minute"
        variant={variant}
      />
    </div>
  );
}
