import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerForm } from "@/components/customer-form";
import { updateCustomer } from "../actions";
import type { AppointmentStatus } from "@/lib/database.types";

const dotColor: Record<AppointmentStatus, string> = {
  na_cekanju: "bg-paper-dim",
  potvrdjeno: "bg-brass",
  zavrseno: "bg-good",
  otkazano: "bg-wine",
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: customer }, { data: appointments }] = await Promise.all([
    supabase.from("customers").select("*").eq("id", id).single(),
    supabase
      .from("appointments")
      .select("id, appointment_date, appointment_time, status, services(name)")
      .eq("customer_id", id)
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false }),
  ]);

  if (!customer) notFound();

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="mb-6 font-display text-2xl italic">{customer.name}</h1>
        <CustomerForm action={updateCustomer.bind(null, id)} customer={customer} />
      </div>

      <div>
        <h2 className="mb-4 font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
          Historija termina
        </h2>
        <div className="overflow-x-auto border border-paper/10">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Datum
                </th>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Vrijeme
                </th>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Usluga
                </th>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments?.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-paper/[0.03]">
                  <td className="border-b border-paper/10 px-4 py-3 tabular-nums">
                    {appointment.appointment_date}
                  </td>
                  <td className="border-b border-paper/10 px-4 py-3 tabular-nums">
                    {appointment.appointment_time}
                  </td>
                  <td className="border-b border-paper/10 px-4 py-3">
                    {appointment.services?.name}
                  </td>
                  <td className="border-b border-paper/10 px-4 py-3">
                    <span
                      className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${dotColor[appointment.status]}`}
                    />
                    {appointment.status}
                  </td>
                </tr>
              ))}
              {(!appointments || appointments.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-paper-dim">
                    Nema termina.
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
