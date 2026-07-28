import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StaffForm } from "@/components/staff-form";
import { linkMutedClass, linkDangerClass } from "@/components/admin/field-styles";
import { createStaff, deleteStaff } from "./actions";

export default async function AdminOsobljePage() {
  const supabase = await createClient();
  const { data: staff } = await supabase.from("staff").select("*").order("name");

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="mb-6 font-display text-2xl italic">Novi član tima</h1>
        <StaffForm action={createStaff} submitLabel="Dodaj" />
      </div>

      <div>
        <h2 className="mb-4 font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
          Osoblje
        </h2>
        <div className="overflow-x-auto border border-paper/10">
          <table className="w-full text-left font-mono text-sm">
            <thead>
              <tr>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Ime
                </th>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Specijalnost
                </th>
                <th className="border-b border-paper/10 px-4 py-3 text-xs tracking-[0.06em] text-paper-dim uppercase">
                  Fotografija
                </th>
                <th className="border-b border-paper/10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {staff?.map((member) => (
                <tr key={member.id} className="hover:bg-paper/[0.03]">
                  <td className="border-b border-paper/10 px-4 py-3">
                    {member.name}
                  </td>
                  <td className="border-b border-paper/10 px-4 py-3">
                    {member.role ?? "-"}
                  </td>
                  <td className="border-b border-paper/10 px-4 py-3 text-paper-dim">
                    {member.photo_url ? "postavljena" : "-"}
                  </td>
                  <td className="border-b border-paper/10 px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/osoblje/${member.id}`}
                        className={linkMutedClass}
                      >
                        Uredi
                      </Link>
                      <form action={deleteStaff.bind(null, member.id)}>
                        <button type="submit" className={linkDangerClass}>
                          Obriši
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(!staff || staff.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-paper-dim">
                    Nema dodanog osoblja.
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
