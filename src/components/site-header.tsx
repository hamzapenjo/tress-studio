import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";

const links = [
  { href: "/usluge", label: "Usluge" },
  { href: "/galerija", label: "Galerija" },
  { href: "/kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-paper/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-xl italic tracking-tight text-paper"
        >
          Tress Studio
        </Link>
        <nav className="hidden gap-8 text-sm tracking-[0.02em] sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-paper-dim transition-colors hover:text-brass"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/zakazivanje"
          className="hidden border border-brass px-5 py-2 text-sm tracking-[0.02em] text-brass transition-colors hover:bg-brass hover:text-ink sm:inline-block"
        >
          Zakažite termin
        </Link>
        <MobileMenu />
      </div>
    </header>
  );
}
