import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StaffForm } from "@/components/staff-form";
import { updateStaff } from "../actions";

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: staff } = await supabase
    .from("staff")
    .select("*")
    .eq("id", id)
    .single();

  if (!staff) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl italic">Uredi člana tima</h1>
      <StaffForm action={updateStaff.bind(null, id)} staff={staff} submitLabel="Sačuvaj izmjene" />
    </div>
  );
}
