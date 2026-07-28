import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/lib/database.types";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  na_cekanju: "Na čekanju",
  potvrdjeno: "Potvrđeno",
  zavrseno: "Završeno",
  otkazano: "Otkazano",
};

function todayIso(): string {
  return new Date().toLocaleDateString("sv-SE");
}

function monthStartIso(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString("sv-SE");
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const today = todayIso();
  const monthStart = monthStartIso();

  const [
    { count: todayCount },
    { count: pendingCount },
    { count: servicesCount },
    { count: customersCount },
    { count: messagesCount },
    { count: unreadMessagesCount },
    { count: monthCount },
    { data: finishedThisMonth },
    { data: allFinished },
    { data: upcoming },
    { data: recentMessages },
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
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("messages").select("id", { count: "exact", head: true }),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .gte("appointment_date", monthStart)
      .neq("status", "otkazano"),
    supabase
      .from("appointments")
      .select("services(price)")
      .eq("status", "zavrseno")
      .gte("appointment_date", monthStart),
    supabase.from("appointments").select("services(name)").eq("status", "zavrseno"),
    supabase
      .from("appointments")
      .select("id, appointment_date, appointment_time, status, customers(name), services(name)")
      .gte("appointment_date", today)
      .neq("status", "otkazano")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })
      .limit(5),
    supabase
      .from("messages")
      .select("id, name, body, read, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const monthlyRevenue = (finishedThisMonth ?? []).reduce(
    (sum, appointment) => sum + (appointment.services?.price ?? 0),
    0
  );

  const serviceCounts = new Map<string, number>();
  for (const appointment of allFinished ?? []) {
    const name = appointment.services?.name;
    if (!name) continue;
    serviceCounts.set(name, (serviceCounts.get(name) ?? 0) + 1);
  }
  const topServices = [...serviceCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  const cards = [
    { label: "Termini danas", value: todayCount ?? 0, href: "/admin/termini" },
    {
      label: "Na čekanju",
      value: pendingCount ?? 0,
      href: "/admin/termini?status=na_cekanju",
      highlight: (pendingCount ?? 0) > 0,
    },
    { label: "Termini ovog mjeseca", value: monthCount ?? 0, href: "/admin/termini" },
    {
      label: "Prihod ovog mjeseca",
      value: `${monthlyRevenue.toFixed(2)} KM`,
      href: "/admin/statistika",
      accent: true,
    },
    { label: "Klijenti", value: customersCount ?? 0, href: "/admin/klijenti" },
    { label: "Usluge", value: servicesCount ?? 0, href: "/admin/usluge" },
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
            <span
              className={`font-display text-3xl italic sm:text-4xl ${
                card.accent ? "text-brass" : "text-paper"
              }`}
            >
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

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
              Sljedeći termini
            </h2>
            <Link
              href="/admin/termini"
              className="font-mono text-xs tracking-[0.08em] text-paper-dim/70 uppercase transition-colors hover:text-brass"
            >
              Svi termini →
            </Link>
          </div>
          {(upcoming ?? []).length === 0 ? (
            <p className="font-mono text-sm text-paper-dim">Nema nadolazećih termina.</p>
          ) : (
            <ol className="flex flex-col">
              {(upcoming ?? []).map((appointment) => (
                <li
                  key={appointment.id}
                  className="flex items-center justify-between border-b border-paper/10 py-3 first:border-t"
                >
                  <div>
                    <p className="font-display italic">
                      {appointment.customers?.name ?? "-"}
                    </p>
                    <p className="font-mono text-xs text-paper-dim">
                      {appointment.services?.name ?? "-"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm tabular-nums">
                      {appointment.appointment_date} {appointment.appointment_time}
                    </p>
                    <p className="font-mono text-xs text-paper-dim">
                      {STATUS_LABELS[appointment.status]}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex flex-col gap-10">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
                Najtraženije usluge
              </h2>
              <Link
                href="/admin/statistika"
                className="font-mono text-xs tracking-[0.08em] text-paper-dim/70 uppercase transition-colors hover:text-brass"
              >
                Sva statistika →
              </Link>
            </div>
            {topServices.length === 0 ? (
              <p className="font-mono text-sm text-paper-dim">Nema dovoljno podataka.</p>
            ) : (
              <ol className="flex flex-col">
                {topServices.map(([name, count]) => (
                  <li
                    key={name}
                    className="flex items-center justify-between border-b border-paper/10 py-3 first:border-t"
                  >
                    <span className="font-display italic">{name}</span>
                    <span className="font-mono text-sm text-paper-dim tabular-nums">
                      {count}x
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
                Nedavne poruke
              </h2>
              <Link
                href="/admin/poruke"
                className="font-mono text-xs tracking-[0.08em] text-paper-dim/70 uppercase transition-colors hover:text-brass"
              >
                Sve poruke →
              </Link>
            </div>
            {(recentMessages ?? []).length === 0 ? (
              <p className="font-mono text-sm text-paper-dim">Nema poruka.</p>
            ) : (
              <ol className="flex flex-col">
                {(recentMessages ?? []).map((message) => (
                  <li
                    key={message.id}
                    className="flex items-start justify-between gap-4 border-b border-paper/10 py-3 first:border-t"
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-display italic">
                        {message.name}
                        {!message.read && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                        )}
                      </p>
                      <p className="truncate font-mono text-xs text-paper-dim">
                        {message.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
