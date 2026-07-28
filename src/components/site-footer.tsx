import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-paper/10 bg-ink px-6 py-10 text-sm text-paper-dim">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>Maršala Tita 45, Sarajevo · +387 61 234 567</p>
        <nav className="flex gap-5 text-xs tracking-[0.02em]">
          <Link href="/uslovi-koristenja" className="transition-colors hover:text-brass">
            Uslovi korištenja
          </Link>
          <Link href="/politika-privatnosti" className="transition-colors hover:text-brass">
            Politika privatnosti
          </Link>
        </nav>
        <p>
          &copy; {new Date().getFullYear()} Tress Studio ·{" "}
          <span className="text-paper-dim/60">Made by loopteq</span>
        </p>
      </div>
    </footer>
  );
}
