"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { href: "/usluge", label: "Usluge" },
  { href: "/galerija", label: "Galerija" },
  { href: "/kontakt", label: "Kontakt" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Otvorite meni"
        aria-expanded={open}
        className="flex flex-col gap-1.5 p-2"
      >
        <span className="block h-px w-6 bg-paper" />
        <span className="block h-px w-6 bg-paper" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink px-6 py-5">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="font-display text-xl italic tracking-tight text-paper"
            >
              Tress Studio
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Zatvorite meni"
              className="p-2 text-2xl leading-none text-paper"
            >
              ×
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-start justify-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl italic text-paper transition-colors hover:text-brass"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/zakazivanje"
            onClick={() => setOpen(false)}
            className="border border-brass px-6 py-4 text-center text-sm tracking-[0.02em] text-brass transition-colors hover:bg-brass hover:text-ink"
          >
            Zakažite termin
          </Link>
        </div>
      )}
    </div>
  );
}
