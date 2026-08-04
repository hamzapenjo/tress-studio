import { createClient } from "@/lib/supabase/server";
import { BookingForm } from "@/components/booking-form";
import { LiveRefresh } from "@/components/live-refresh";

export default async function ZakazivanjePage() {
  const supabase = await createClient();

  const [{ data: services }, { data: staff }] = await Promise.all([
    supabase.from("services").select("*").order("category").order("name"),
    supabase.from("staff").select("*").order("name"),
  ]);

  return (
    <main className="flex-1 bg-paper text-ink">
      <LiveRefresh tables={["services", "staff"]} />
      <div className="mx-auto w-full max-w-4xl px-6 py-20">
        <p className="mb-3 text-xs tracking-[0.2em] text-brass uppercase">
          Rezervacija
        </p>
        <h1 className="mb-12 font-display text-4xl italic">Zakažite termin</h1>
        <BookingForm services={services ?? []} staff={staff ?? []} />
      </div>
    </main>
  );
}
