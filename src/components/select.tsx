"use client";

import { useEffect, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export function Select({
  name,
  options,
  placeholder = "Izaberite",
  defaultValue = "",
  className,
  onChange,
  testId,
}: {
  name?: string;
  options: SelectOption[];
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
  testId?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
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

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={rootRef} className="relative" data-testid={testId}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={
          className ??
          "flex w-full items-center justify-between gap-2 border border-paper/20 bg-transparent px-3 py-2.5 text-left font-mono text-sm text-paper focus:border-brass focus:outline-none"
        }
      >
        <span className={selected ? "" : "text-paper-dim/60"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          width="11"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
          className="shrink-0"
        >
          <path
            d="M1 1l5 5 5-5"
            stroke="var(--color-brass)"
            strokeWidth="1.4"
          />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full min-w-max overflow-auto border border-paper/15 bg-ink py-1 shadow-lg"
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  setValue(opt.value);
                  setOpen(false);
                  onChange?.(opt.value);
                }}
                className={`block w-full px-3 py-2 text-left font-mono text-sm whitespace-nowrap hover:bg-paper/10 ${
                  opt.value === value ? "text-brass" : "text-paper"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
