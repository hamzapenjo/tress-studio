import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { fieldClass } from "@/components/admin/field-styles";

export default async function AdminKlijentiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("customers").select("*").order("name").limit(100);
  if (q) {
    query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`);
  }
  const { data: customers } = await query;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl italic">Klijenti</h1>
        <form className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Pretraga po imenu ili telefonu"
            className={`w-64 ${fieldClass}`}
          />
          <button
            type="submit"
            className="border border-paper/20 px-4 py-2.5 font-mono text-xs tracking-[0.08em] text-paper-dim uppercase hover:text-paper"
          >
            Pretraži
          </button>
        </form>
      </div>

      <div className="overflow-x-auto border border-paper/10">
        <table className="w-full text-left font-mono text-sm">
          <thead>
            <tr>
              <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                Ime
              </th>
              <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                Telefon
              </th>
              <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((customer) => (
              <tr key={customer.id} className="hover:bg-paper/[0.03]">
                <td className="border-b border-paper/10 px-4 py-3">
                  <Link
                    href={`/admin/klijenti/${customer.id}`}
                    className="text-paper underline decoration-paper/30 underline-offset-2 hover:text-brass"
                  >
                    {customer.name}
                  </Link>
                </td>
                <td className="border-b border-paper/10 px-4 py-3 tabular-nums">
                  {customer.phone}
                </td>
                <td className="border-b border-paper/10 px-4 py-3">
                  {customer.email ?? "-"}
                </td>
              </tr>
            ))}
            {(!customers || customers.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-paper-dim">
                  Nema klijenata.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
