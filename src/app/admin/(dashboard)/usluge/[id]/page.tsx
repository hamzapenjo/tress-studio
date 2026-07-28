import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ServiceForm } from "@/components/service-form";
import { updateService } from "../actions";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (!service) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl italic">Uredi uslugu</h1>
      <ServiceForm
        action={updateService.bind(null, id)}
        service={service}
        submitLabel="Sačuvaj izmjene"
      />
    </div>
  );
}
