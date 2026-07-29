import { createClient } from "@/lib/supabase/server";
import { Reveal } from "@/components/reveal";

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
      <div className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
        <Reveal>
          <p className="mb-3 text-xs tracking-[0.2em] text-brass uppercase">
            Cjenovnik
          </p>
          <h1 className="mb-5 font-display text-4xl italic sm:text-5xl">Usluge</h1>
          <p className="mb-16 max-w-[46ch] text-sm leading-relaxed text-ink-dim">
            Svaka usluga se prilagođava Vašoj kosi i željenom rezultatu.
            Ukoliko niste sigurni šta Vam odgovara, naše osoblje će Vas
            posavjetovati prilikom dolaska.
          </p>
        </Reveal>

        {byCategory.size === 0 && (
          <p className="text-sm text-ink-dim">
            Cjenovnik trenutno nije dostupan.
          </p>
        )}

        <div className="flex flex-col gap-16">
          {[...byCategory.entries()].map(([category, items], i) => (
            <Reveal key={category} delay={i * 80}>
              <section>
                <div className="mb-6 flex items-center gap-4">
                  <h2 className="font-display text-2xl italic">{category}</h2>
                  <span className="h-px flex-1 bg-brass/40" />
                </div>
                <ul className="flex flex-col">
                  {items?.map((service) => (
                    <li
                      key={service.id}
                      className="group flex items-center justify-between gap-6 border-b border-ink/10 py-5 transition-colors first:border-t hover:bg-ink/[0.025]"
                    >
                      <div>
                        <p className="font-display text-lg italic transition-colors group-hover:text-brass">
                          {service.name}
                        </p>
                        <p className="mt-1 text-xs tracking-[0.06em] text-ink-dim uppercase">
                          {service.duration_minutes} min
                        </p>
                      </div>
                      <p className="shrink-0 font-display text-lg italic text-brass">
                        {service.price} KM
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
