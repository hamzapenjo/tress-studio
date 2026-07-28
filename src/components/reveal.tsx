"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "fade",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade" | "mask";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => el.classList.add("reveal-visible");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);

    // Sigurnosna mreza: neki motori (posebno u kombinaciji sa clip-path
    // meta) znaju kasniti/promasiti prvi tacan presjek dok se layout
    // (slike, fontovi) ne stabilizuje. Sadrzaj ne smije ostati trajno
    // skriven zbog toga.
    const fallback = window.setTimeout(reveal, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  const base = variant === "mask" ? "mask-reveal" : "reveal";

  return (
    <div
      ref={ref}
      className={`${base} ${className ?? ""}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}
