import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ServiceForm } from "@/components/service-form";
import { linkMutedClass, linkDangerClass } from "@/components/admin/field-styles";
import { createService, deleteService } from "./actions";

export default async function AdminUslugePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("category")
    .order("name");

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="mb-6 font-display text-2xl italic">Nova usluga</h1>
        <ServiceForm action={createService} submitLabel="Dodaj uslugu" />
      </div>

      {error && <p className="font-mono text-sm text-wine">{error}</p>}

      <div>
        <h2 className="mb-4 font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
          Usluge i cijene
        </h2>
        <div className="overflow-x-auto border border-paper/10">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Naziv
                </th>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Kategorija
                </th>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Cijena
                </th>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Trajanje
                </th>
                <th className="border-b border-paper/10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {services?.map((service) => (
                <tr key={service.id} className="hover:bg-paper/[0.03]">
                  <td className="border-b border-paper/10 px-4 py-3">
                    {service.name}
                  </td>
                  <td className="border-b border-paper/10 px-4 py-3">
                    {service.category}
                  </td>
                  <td className="border-b border-paper/10 px-4 py-3 tabular-nums text-brass">
                    {service.price} KM
                  </td>
                  <td className="border-b border-paper/10 px-4 py-3 tabular-nums">
                    {service.duration_minutes} min
                  </td>
                  <td className="border-b border-paper/10 px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/usluge/${service.id}`}
                        className={linkMutedClass}
                      >
                        Uredi
                      </Link>
                      <form action={deleteService.bind(null, service.id)}>
                        <button type="submit" className={linkDangerClass}>
                          Obriši
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(!services || services.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-paper-dim">
                    Nema usluga.
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
