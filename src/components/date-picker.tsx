"use client";

import { useEffect, useRef, useState } from "react";

const WEEKDAYS = ["Po", "Ut", "Sr", "Če", "Pe", "Su", "Ne"];
const MONTHS = [
  "Januar", "Februar", "Mart", "April", "Maj", "Juni",
  "Juli", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar",
];

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplay(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}.`;
}

export function DatePicker({
  name,
  minDate,
  defaultValue,
  onChange,
  triggerClassName,
  mutedClassName,
  variant = "dark",
}: {
  name: string;
  minDate?: Date;
  defaultValue?: string;
  onChange?: (value: string) => void;
  triggerClassName?: string;
  mutedClassName?: string;
  variant?: "dark" | "light";
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() =>
    value ? fromISO(value) : (minDate ?? new Date())
  );
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const min = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    : null;

  return (
    <div ref={rootRef} className="relative" data-testid="date-picker">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={
          triggerClassName ??
          "flex w-full items-center justify-between gap-2 border border-paper/20 bg-transparent px-3 py-2.5 text-left font-mono text-sm text-paper focus:border-brass focus:outline-none"
        }
      >
        <span className={value ? "" : (mutedClassName ?? "text-paper-dim/60")}>
          {value ? formatDisplay(fromISO(value)) : "dd.mm.gggg."}
        </span>
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
        >
          <rect
            x="1.5"
            y="2.5"
            width="13"
            height="12"
            rx="1"
            stroke="var(--color-brass)"
          />
          <path d="M1.5 6h13M4.5 1v3M11.5 1v3" stroke="var(--color-brass)" />
        </svg>
      </button>

      {open && (
        <div
          className={
            variant === "light"
              ? "absolute z-20 mt-1 w-64 border border-ink/15 bg-paper p-3 shadow-lg"
              : "absolute z-20 mt-1 w-64 border border-paper/15 bg-ink p-3 shadow-lg"
          }
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className={
                variant === "light"
                  ? "px-2 py-1 text-ink-dim hover:text-brass"
                  : "px-2 py-1 text-paper-dim hover:text-brass"
              }
            >
              ‹
            </button>
            <span
              className={
                variant === "light"
                  ? "font-mono text-xs tracking-[0.08em] text-ink uppercase"
                  : "font-mono text-xs tracking-[0.08em] text-paper uppercase"
              }
            >
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              data-testid="date-next-month"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className={
                variant === "light"
                  ? "px-2 py-1 text-ink-dim hover:text-brass"
                  : "px-2 py-1 text-paper-dim hover:text-brass"
              }
            >
              ›
            </button>
          </div>
          <div className="mb-1 grid grid-cols-7 gap-1">
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className={
                  variant === "light"
                    ? "text-center font-mono text-[10px] text-ink-dim"
                    : "text-center font-mono text-[10px] text-paper-dim"
                }
              >
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const iso = toISO(d);
              const disabled = min ? d < min : false;
              const selected = iso === value;
              return (
                <button
                  key={i}
                  type="button"
                  data-testid={`date-day-${iso}`}
                  disabled={disabled}
                  onClick={() => {
                    setValue(iso);
                    setOpen(false);
                    onChange?.(iso);
                  }}
                  className={`aspect-square font-mono text-xs ${
                    selected
                      ? "bg-brass text-ink"
                      : disabled
                        ? `cursor-default ${variant === "light" ? "text-ink-dim/30" : "text-paper-dim/30"}`
                        : variant === "light"
                          ? "text-ink hover:bg-ink/5"
                          : "text-paper hover:bg-paper/10"
                  }`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
