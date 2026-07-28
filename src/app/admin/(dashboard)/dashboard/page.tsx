import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function todayIso(): string {
  return new Date().toLocaleDateString("sv-SE");
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const today = todayIso();

  const [
    { count: todayCount },
    { count: pendingCount },
    { count: servicesCount },
    { count: messagesCount },
    { count: unreadMessagesCount },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("appointment_date", today),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("status", "na_cekanju"),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("messages").select("id", { count: "exact", head: true }),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false),
  ]);

  const cards = [
    {
      label: "Termini danas",
      value: todayCount ?? 0,
      href: "/admin/termini",
    },
    {
      label: "Na čekanju",
      value: pendingCount ?? 0,
      href: "/admin/termini?status=na_cekanju",
      highlight: (pendingCount ?? 0) > 0,
    },
    {
      label: "Usluge",
      value: servicesCount ?? 0,
      href: "/admin/usluge",
    },
    {
      label: "Poruke",
      value: messagesCount ?? 0,
      href: "/admin/poruke",
      badge: unreadMessagesCount ?? 0,
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-display text-2xl italic">Pregled</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`flex flex-col gap-2 border p-6 transition-colors hover:border-brass ${
              card.highlight ? "border-brass/50 bg-brass/5" : "border-paper/10"
            }`}
          >
            <span className="font-mono text-xs tracking-[0.1em] text-paper-dim uppercase">
              {card.label}
            </span>
            <span className="font-display text-4xl italic text-paper">
              {card.value}
              {card.badge ? (
                <span className="ml-2 align-middle font-mono text-xs tracking-[0.08em] text-brass">
                  ({card.badge} novih)
                </span>
              ) : null}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
