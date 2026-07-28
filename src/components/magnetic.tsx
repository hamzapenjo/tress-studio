"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

const STRENGTH = 0.25;
const MAX_OFFSET = 8;

export function Magnetic({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const offsetX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, x * STRENGTH));
    const offsetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, y * STRENGTH));
    el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`inline-block transition-transform duration-200 ease-out ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
