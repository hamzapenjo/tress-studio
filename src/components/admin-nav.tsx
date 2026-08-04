"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/login/actions";
import { getAdminBadgeCounts, type AdminBadgeCounts } from "@/app/admin/(dashboard)/badge-actions";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/termini", label: "Termini", badgeKey: "termini" as const },
  { href: "/admin/klijenti", label: "Klijenti" },
  { href: "/admin/usluge", label: "Usluge" },
  { href: "/admin/osoblje", label: "Osoblje" },
  { href: "/admin/galerija", label: "Galerija" },
  { href: "/admin/poruke", label: "Poruke", badgeKey: "poruke" as const },
  { href: "/admin/recenzije", label: "Recenzije", badgeKey: "recenzije" as const },
  { href: "/admin/statistika", label: "Statistika" },
];

const BADGE_POLL_MS = 15000;

function useAdminBadgeCounts(): AdminBadgeCounts {
  const pathname = usePathname();
  const [counts, setCounts] = useState<AdminBadgeCounts>({
    termini: 0,
    poruke: 0,
    recenzije: 0,
  });

  useEffect(() => {
    let cancelled = false;

    function refresh() {
      getAdminBadgeCounts().then((next) => {
        if (!cancelled) setCounts(next);
      });
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") refresh();
    }

    refresh();
    const interval = setInterval(refresh, BADGE_POLL_MS);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pathname]);

  return counts;
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const counts = useAdminBadgeCounts();

  return (
    <div className="flex flex-col gap-1 font-mono text-xs tracking-[0.12em] uppercase">
      {links.map((link) => {
        const active = pathname.startsWith(link.href);
        const count = link.badgeKey ? counts[link.badgeKey] : 0;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={
              active
                ? "flex items-center justify-between px-7 py-2.5 text-left text-brass"
                : "flex items-center justify-between px-7 py-2.5 text-left text-paper-dim/70 transition-colors hover:text-paper"
            }
          >
            {link.label}
            {count > 0 && (
              <span className="ml-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brass px-1 font-mono text-[10px] text-ink normal-case">
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function AdminNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Desktop: lijevi sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-paper/10 bg-ink sm:flex">
        <div className="px-6 py-5 text-center">
          <span className="font-display text-lg italic text-paper">
            Tress Studio
          </span>
        </div>
        <nav className="flex flex-1 flex-col justify-between py-2">
          <NavLinks />
          <form
            action={logout}
            className="border-t border-paper/10 px-4 py-4 text-center"
          >
            <button
              type="submit"
              className="font-mono text-xs tracking-[0.1em] text-paper-dim/70 uppercase transition-colors hover:text-brass"
            >
              Odjava
            </button>
          </form>
        </nav>
      </aside>

      {/* Mobile: gornja traka + hamburger */}
      <div className="border-b border-paper/10 bg-ink sm:hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <span className="font-display text-lg italic text-paper">
            Tress Studio
          </span>
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
        </div>

        {open && (
          <div className="fixed inset-0 z-[60] flex flex-col bg-ink px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg italic text-paper">
                Tress Studio
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Zatvorite meni"
                className="p-2 text-2xl leading-none text-paper"
              >
                ×
              </button>
            </div>
            <div className="mt-8 flex flex-1 flex-col justify-between">
              <NavLinks onNavigate={() => setOpen(false)} />
              <form action={logout} className="px-4 py-4">
                <button
                  type="submit"
                  className="font-mono text-xs tracking-[0.1em] text-paper-dim/70 uppercase transition-colors hover:text-brass"
                >
                  Odjava
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
