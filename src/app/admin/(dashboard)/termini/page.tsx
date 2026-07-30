import { createClient } from "@/lib/supabase/server";
import { AppointmentForm } from "@/components/appointment-form";
import { AppointmentStatusSelect } from "@/components/appointment-status-select";
import { MarkSeenOnView } from "@/components/mark-seen-on-view";
import { fieldClass, linkDangerClass, linkMutedClass } from "@/components/admin/field-styles";
import { deleteAppointment } from "./actions";
import type { AppointmentStatus } from "@/lib/database.types";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  na_cekanju: "Na čekanju",
  potvrdjeno: "Potvrđeno",
  zavrseno: "Završeno",
  otkazano: "Otkazano",
};

export default async function AdminTerminiPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    od?: string;
    do?: string;
    q?: string;
  }>;
}) {
  const { status: rawStatus, od, do: doDatuma, q } = await searchParams;
  const status =
    rawStatus && rawStatus in STATUS_LABELS
      ? (rawStatus as AppointmentStatus)
      : undefined;
  const supabase = await createClient();

  const hasFilters = Boolean(status || od || doDatuma || q);

  let query = supabase
    .from("appointments")
    .select(
      "id, appointment_date, appointment_time, status, seen, customers(name, phone), services(name), staff(name)"
    )
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false })
    .limit(hasFilters ? 300 : 50);

  if (status) query = query.eq("status", status);
  if (od) query = query.gte("appointment_date", od);
  if (doDatuma) query = query.lte("appointment_date", doDatuma);

  const [{ data: rawAppointments }, { data: services }, { data: staff }] =
    await Promise.all([
      query,
      supabase.from("services").select("*").order("name"),
      supabase.from("staff").select("*").order("name"),
    ]);

  const search = q?.trim().toLowerCase();
  const appointments = search
    ? (rawAppointments ?? []).filter(
        (a) =>
          a.customers?.name?.toLowerCase().includes(search) ||
          a.customers?.phone?.toLowerCase().includes(search)
      )
    : rawAppointments ?? [];

  const newCount = appointments.filter((a) => !a.seen).length;

  return (
    <div className="flex flex-col gap-12">
      <MarkSeenOnView />

      <div>
        <h1 className="mb-6 font-display text-2xl italic">Dodaj termin</h1>
        <AppointmentForm services={services ?? []} staff={staff ?? []} />
      </div>

      <div>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-mono text-xs tracking-[0.14em] text-ink-dim uppercase">
            Termini
          </h2>
          {newCount > 0 && (
            <span className="border border-brass/40 bg-brass/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.08em] text-brass uppercase">
              {newCount} {newCount === 1 ? "novi" : "novih"}
            </span>
          )}
          <a
            href={`/admin/termini/export?${new URLSearchParams({
              ...(status ? { status } : {}),
              ...(od ? { od } : {}),
              ...(doDatuma ? { do: doDatuma } : {}),
              ...(q ? { q } : {}),
            }).toString()}`}
            className="ml-auto border border-ink/20 px-3 py-1.5 font-mono text-xs tracking-[0.05em] text-ink-dim uppercase transition-colors hover:border-brass hover:text-brass"
          >
            Izvoz u Excel
          </a>
        </div>

        <form className="mb-5 flex flex-wrap items-end gap-3" method="get">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] tracking-[0.08em] text-ink-dim uppercase">
              Status
            </label>
            <select
              name="status"
              defaultValue={status ?? ""}
              className={fieldClass}
            >
              <option value="">Svi</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] tracking-[0.08em] text-ink-dim uppercase">
              Od datuma
            </label>
            <input type="date" name="od" defaultValue={od ?? ""} className={fieldClass} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] tracking-[0.08em] text-ink-dim uppercase">
              Do datuma
            </label>
            <input
              type="date"
              name="do"
              defaultValue={doDatuma ?? ""}
              className={fieldClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] tracking-[0.08em] text-ink-dim uppercase">
              Pretraga klijenta
            </label>
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Ime ili telefon"
              className={fieldClass}
            />
          </div>
          <button
            type="submit"
            className="border border-brass px-4 py-2.5 font-mono text-xs tracking-[0.1em] text-brass uppercase transition-colors hover:bg-brass hover:text-ink"
          >
            Filtriraj
          </button>
          {hasFilters && (
            <a href="/admin/termini" className={linkMutedClass}>
              Poništi
            </a>
          )}
        </form>
        <div className="max-h-[520px] overflow-auto border border-ink/10">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr>
                <th className="sticky top-0 z-10 border-b border-ink/10 bg-paper px-4 py-3 text-xs tracking-[0.06em] text-ink-dim uppercase">
                  Datum
                </th>
                <th className="sticky top-0 z-10 border-b border-ink/10 bg-paper px-4 py-3 text-xs tracking-[0.06em] text-ink-dim uppercase">
                  Vrijeme
                </th>
                <th className="sticky top-0 z-10 border-b border-ink/10 bg-paper px-4 py-3 text-xs tracking-[0.06em] text-ink-dim uppercase">
                  Klijent
                </th>
                <th className="sticky top-0 z-10 border-b border-ink/10 bg-paper px-4 py-3 text-xs tracking-[0.06em] text-ink-dim uppercase">
                  Usluga
                </th>
                <th className="sticky top-0 z-10 border-b border-ink/10 bg-paper px-4 py-3 text-xs tracking-[0.06em] text-ink-dim uppercase">
                  Frizer
                </th>
                <th className="sticky top-0 z-10 border-b border-ink/10 bg-paper px-4 py-3 text-xs tracking-[0.06em] text-ink-dim uppercase">
                  Status
                </th>
                <th className="sticky top-0 z-10 border-b border-ink/10 bg-paper px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {appointments?.map((appointment) => (
                <tr
                  key={appointment.id}
                  className={`hover:bg-ink/[0.03] ${
                    !appointment.seen ? "bg-brass/[0.06]" : ""
                  }`}
                >
                  <td
                    className={`border-b border-ink/10 px-4 py-3 tabular-nums ${
                      !appointment.seen ? "border-l-2 border-l-brass" : ""
                    }`}
                  >
                    {appointment.appointment_date}
                  </td>
                  <td className="border-b border-ink/10 px-4 py-3 tabular-nums">
                    {appointment.appointment_time}
                  </td>
                  <td className="border-b border-ink/10 px-4 py-3">
                    <div className="flex items-center gap-2">
                      {appointment.customers?.name}
                      {!appointment.seen && (
                        <span className="border border-brass/50 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.05em] text-brass uppercase">
                          Novo
                        </span>
                      )}
                    </div>
                    <div className="text-ink-dim">
                      {appointment.customers?.phone}
                    </div>
                  </td>
                  <td className="border-b border-ink/10 px-4 py-3">
                    {appointment.services?.name}
                  </td>
                  <td className="border-b border-ink/10 px-4 py-3">
                    {appointment.staff?.name ?? "-"}
                  </td>
                  <td className="border-b border-ink/10 px-4 py-3">
                    <AppointmentStatusSelect
                      id={appointment.id}
                      status={appointment.status}
                    />
                  </td>
                  <td className="border-b border-ink/10 px-4 py-3">
                    <form action={deleteAppointment.bind(null, appointment.id)}>
                      <button type="submit" className={linkDangerClass}>
                        Obriši
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!appointments || appointments.length === 0) && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-ink-dim"
                  >
                    Nema zakazanih termina.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
