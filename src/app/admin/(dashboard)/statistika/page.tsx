import { createClient } from "@/lib/supabase/server";

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // ponedjeljak = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDateString(date: Date) {
  return date.toISOString().split("T")[0];
}

export default async function AdminStatistikaPage() {
  const supabase = await createClient();

  const now = new Date();
  const weekStart = toDateString(startOfWeek(now));
  const monthStart = toDateString(new Date(now.getFullYear(), now.getMonth(), 1));

  const [{ count: weekCount }, { count: monthCount }, { data: finishedThisMonth }, { data: allFinished }] =
    await Promise.all([
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .gte("appointment_date", weekStart)
        .neq("status", "otkazano"),
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
      supabase
        .from("appointments")
        .select("services(name)")
        .eq("status", "zavrseno"),
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
  const topServices = [...serviceCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-display text-2xl italic">Statistika</h1>

      <div className="grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-3">
        <div className="bg-paper p-5">
          <p className="font-mono text-xs tracking-[0.08em] text-ink-dim uppercase">
            Termini ove sedmice
          </p>
          <p className="mt-1.5 font-mono text-2xl tabular-nums">{weekCount ?? 0}</p>
        </div>
        <div className="bg-paper p-5">
          <p className="font-mono text-xs tracking-[0.08em] text-ink-dim uppercase">
            Termini ovog mjeseca
          </p>
          <p className="mt-1.5 font-mono text-2xl tabular-nums">{monthCount ?? 0}</p>
        </div>
        <div className="bg-paper p-5">
          <p className="font-mono text-xs tracking-[0.08em] text-ink-dim uppercase">
            Prihod ovog mjeseca (završeni)
          </p>
          <p className="mt-1.5 font-mono text-2xl tabular-nums text-brass">
            {monthlyRevenue.toFixed(2)} KM
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-mono text-xs tracking-[0.14em] text-ink-dim uppercase">
          Najtraženije usluge
        </h2>
        {topServices.length === 0 ? (
          <p className="font-mono text-sm text-ink-dim">
            Nema dovoljno podataka.
          </p>
        ) : (
          <ol className="flex flex-col">
            {topServices.map(([name, count]) => (
              <li
                key={name}
                className="flex items-center justify-between border-b border-ink/10 py-3 first:border-t"
              >
                <span className="font-display italic">{name}</span>
                <span className="font-mono text-sm text-ink-dim tabular-nums">
                  {count}x
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
