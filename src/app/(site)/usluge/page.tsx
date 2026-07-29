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
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
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

        <div className="flex flex-col gap-6">
          {[...byCategory.entries()].map(([category, items], i) => (
            <Reveal key={category} delay={i * 60}>
              <details open className="group border border-ink/10 bg-paper">
                <summary className="flex cursor-pointer items-center justify-between gap-4 bg-ink px-6 py-4 text-paper marker:content-none">
                  <span className="font-display text-xl italic">{category}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-xs tracking-[0.1em] text-paper-dim uppercase">
                      {items?.length} {items?.length === 1 ? "usluga" : "usluge"}
                    </span>
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0 text-brass transition-transform group-open:rotate-180"
                    >
                      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                </summary>

                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-ink/10 bg-ink/[0.03]">
                      <th className="px-4 py-3 text-xs tracking-[0.1em] text-ink-dim uppercase sm:px-6">
                        Usluga
                      </th>
                      <th className="px-4 py-3 text-xs tracking-[0.1em] text-ink-dim uppercase sm:px-6">
                        Trajanje
                      </th>
                      <th className="px-4 py-3 text-right text-xs tracking-[0.1em] text-ink-dim uppercase sm:px-6">
                        Cijena
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items?.map((service) => (
                      <tr
                        key={service.id}
                        className="group/row border-b border-ink/10 transition-colors last:border-b-0 hover:bg-ink/[0.025]"
                      >
                        <td className="px-4 py-4 font-display text-lg italic transition-colors group-hover/row:text-brass sm:px-6">
                          {service.name}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap text-ink-dim tabular-nums sm:px-6">
                          {service.duration_minutes} min
                        </td>
                        <td className="px-4 py-4 text-right font-display text-lg whitespace-nowrap italic text-brass tabular-nums sm:px-6">
                          {service.price} KM
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </Reveal>
          ))}
        </div>

        {byCategory.size > 0 && (
          <Reveal delay={byCategory.size * 60}>
            <p className="mt-12 max-w-[60ch] text-xs leading-relaxed text-ink-dim italic">
              Napomena: cijena i trajanje usluge mogu se razlikovati u
              zavisnosti od dužine i gustoće kose. Osoblje će Vas o tome
              obavijestiti prije početka usluge.
            </p>
          </Reveal>
        )}
      </div>
    </main>
  );
}
