"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/login/actions";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/termini", label: "Termini" },
  { href: "/admin/klijenti", label: "Klijenti" },
  { href: "/admin/usluge", label: "Usluge" },
  { href: "/admin/osoblje", label: "Osoblje" },
  { href: "/admin/galerija", label: "Galerija" },
  { href: "/admin/poruke", label: "Poruke" },
  { href: "/admin/recenzije", label: "Recenzije" },
  { href: "/admin/statistika", label: "Statistika" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-paper/10 bg-ink">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <span className="font-display text-lg italic text-paper">
          Tress Studio
        </span>
        <div className="flex flex-wrap gap-6 font-mono text-xs tracking-[0.12em] uppercase">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "border-b border-brass pb-1 text-brass"
                    : "pb-1 text-paper-dim/70 transition-colors hover:text-paper"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="font-mono text-xs tracking-[0.1em] text-paper-dim/70 uppercase transition-colors hover:text-brass"
          >
            Odjava
          </button>
        </form>
      </div>
    </nav>
  );
}
