import { createClient } from "@/lib/supabase/server";

export default async function UslugePage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("category")
    .order("name");

  const byCategory = new Map<string, typeof services>();
  for (const service of services ?? []) {
    const list = byCategory.get(service.category) ?? [];
    list.push(service);
    byCategory.set(service.category, list);
  }

  return (
    <main className="flex-1 bg-paper text-ink">
      <div className="mx-auto w-full max-w-2xl px-6 py-20">
        <p className="mb-3 text-xs tracking-[0.2em] text-brass uppercase">
          Cjenovnik
        </p>
        <h1 className="mb-14 font-display text-4xl italic">Usluge</h1>

        {byCategory.size === 0 && (
          <p className="text-sm text-ink-dim">
            Cjenovnik trenutno nije dostupan.
          </p>
        )}

        <div className="flex flex-col gap-12">
          {[...byCategory.entries()].map(([category, items]) => (
            <section key={category}>
              <h2 className="mb-4 text-xs tracking-[0.14em] text-ink-dim uppercase">
                {category}
              </h2>
              <ul className="divide-y divide-ink/10">
                {items?.map((service) => (
                  <li
                    key={service.id}
                    className="flex items-center justify-between py-4"
                  >
                    <div>
                      <p className="font-display text-lg italic">
                        {service.name}
                      </p>
                      <p className="mt-1 text-xs text-ink-dim">
                        {service.duration_minutes} min
                      </p>
                    </div>
                    <p className="text-brass">{service.price} KM</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
