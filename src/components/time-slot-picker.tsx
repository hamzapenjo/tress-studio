"use client";

import { useEffect, useState } from "react";
import { generateTimeSlots } from "@/lib/booking";
import { getAvailableSlots } from "@/app/(site)/zakazivanje/actions";

export function TimeSlotPicker({
  date,
  durationMinutes,
  staffId,
  value,
  onChange,
}: {
  date: string;
  durationMinutes: number;
  staffId: string | null;
  value: string;
  onChange: (time: string) => void;
}) {
  const requestKey = `${date}|${durationMinutes}|${staffId ?? ""}`;
  const [result, setResult] = useState<{ key: string; slots: string[] } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAvailableSlots(date, durationMinutes, staffId).then((slots) => {
      if (!cancelled) setResult({ key: requestKey, slots });
    });
    return () => {
      cancelled = true;
    };
  }, [date, durationMinutes, staffId, requestKey]);

  const loading = result?.key !== requestKey;
  const available = loading ? null : result.slots;

  const allSlots = generateTimeSlots(date, durationMinutes);

  if (allSlots.length === 0) {
    return (
      <p className="text-sm text-wine">
        Ne radimo na odabrani datum. Molimo izaberite drugi dan.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {allSlots.map((slot) => {
          const isAvailable = loading || (available?.includes(slot) ?? false);
          const isSelected = value === slot;
          return (
            <button
              key={slot}
              type="button"
              disabled={!isAvailable}
              onClick={() => onChange(slot)}
              className={`border py-2.5 text-center text-sm transition-colors ${
                isSelected
                  ? "border-brass bg-brass text-ink"
                  : isAvailable
                    ? "border-ink/20 text-ink hover:border-brass"
                    : "border-ink/10 text-ink-dim/40 line-through"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
      {loading && (
        <p className="mt-2 text-xs text-ink-dim">Provjera dostupnosti...</p>
      )}
    </div>
  );
}
