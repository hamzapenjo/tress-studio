import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";
import { SafeImage } from "@/components/safe-image";
import { PublicReviewForm } from "@/components/public-review-form";
import { ReviewsSpotlight } from "@/components/reviews-spotlight";
import { LiveRefresh } from "@/components/live-refresh";

// Privremene stock fotografije (Unsplash) dok salon ne nabavi svoje.
// TODO: zamijeniti pravim fotografijama prostora/osoblja prije lansiranja -
// koristenje tudjih stock fotografija kao da su stvarno osoblje/prostor
// salona ne treba ostati na zivom sajtu.
const PHOTOS = {
  heroInterior:
    "https://images.unsplash.com/photo-1781450090585-1a511b7066d9?fm=jpg&q=80&w=3840&auto=format&fit=crop",
  craftsmanship: "/images/zanat.png",
  bookingBg:
    "https://images.unsplash.com/photo-1707812343087-c9ff9e5abb43?fm=jpg&q=70&w=2000&auto=format&fit=crop",
};
const PORTRAIT_FALLBACKS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fm=jpg&q=80&w=800&auto=format&fit=crop",
];

// Slike po nazivu usluge - dodane rucno kad vlasnica otpremi fotografiju za
// tu uslugu. Usluge bez odgovarajuce slike padaju na stock fallback niz.
const SERVICE_IMAGES: Record<string, string> = {
  "Šišanje": "/images/sisanje.png",
  "Tretman kose": "/images/trerman_kose.png",
  Farbanje: "/images/farbanje.png",
  Feniranje: "/images/feniranje.png",
};
const SERVICE_IMAGE_FALLBACKS = [
  "https://images.unsplash.com/photo-1746723375184-5f537d2e6f31?fm=jpg&q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1700760934268-8aa0ef52ce0a?fm=jpg&q=80&w=1400&auto=format&fit=crop",
];

export default async function Home() {
  const supabase = await createClient();
  // appointments su RLS-zasticeni od anon korisnika (privatnost klijenata),
  // pa za javne agregatne brojeve (samo brojevi, ne pojedinacni podaci)
  // koristimo service-role klijenta.
  const admin = createAdminClient();

  const [
    { data: services },
    { data: staff },
    { data: reviews },
    { count: completedCount },
    { data: completedCustomers },
  ] = await Promise.all([
    supabase.from("services").select("*").order("category").order("name").limit(4),
    supabase.from("staff").select("*").order("name"),
    supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(6),
    admin
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("status", "zavrseno"),
    admin.from("appointments").select("customer_id").eq("status", "zavrseno"),
  ]);

  const happyClients = new Set((completedCustomers ?? []).map((a) => a.customer_id)).size;
  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  return (
    <main className="flex flex-1 flex-col">
      <LiveRefresh tables={["reviews"]} />
      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-ink text-paper">
        <SafeImage
          src={PHOTOS.heroInterior}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/50" />

        <div className="relative w-full px-6 sm:pl-[14%] lg:pl-[22%]">
          <p className="mb-5 text-xs tracking-[0.2em] text-brass uppercase">
            Frizerski salon
          </p>
          <h1 className="mb-6 max-w-[11ch] font-display text-5xl leading-[1.05] italic text-balance sm:text-7xl">
            Umijeće pramena.
          </h1>
          <p className="mb-9 max-w-[42ch] text-base leading-relaxed text-paper-dim">
            Tress Studio je frizerski salon posvećen preciznosti reza i njezi
            kose. Svaka posjeta - izrađena po mjeri.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/zakazivanje"
              className="inline-flex items-center gap-3 bg-brass px-8 py-4 text-sm tracking-[0.02em] text-ink transition-opacity hover:opacity-90"
            >
              Zakažite termin
            </Link>
            <Link
              href="/usluge"
              className="inline-flex items-center gap-3 border border-paper/50 px-8 py-4 text-sm tracking-[0.02em] text-paper transition-colors hover:border-paper"
            >
              Pogledajte usluge
            </Link>
          </div>
        </div>

        {avgRating && (
          <div className="absolute right-6 bottom-10 hidden border border-paper/15 bg-ink/60 px-6 py-4 backdrop-blur-md sm:block">
            <p className="text-brass">
              {"★".repeat(Math.round(avgRating))}
              <span className="text-paper-dim">
                {"★".repeat(5 - Math.round(avgRating))}
              </span>{" "}
              <span className="ml-1 text-paper">{avgRating.toFixed(1)}</span>
            </p>
            <p className="mt-1 text-xs text-paper-dim">
              {happyClients}+ zadovoljnih klijenata
            </p>
          </div>
        )}
      </section>

      {/* Sve ispod hero-a je jedna neprekinuta "paper" cjelina. */}
      <div className="bg-paper text-ink">
        {/* USLUGE - naizmjenicni slika/tekst redovi */}
        <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <Reveal>
            <p className="mb-3 text-xs tracking-[0.2em] text-brass uppercase">
              Usluge
            </p>
            <h2 className="mb-16 max-w-[16ch] font-display text-4xl italic text-balance sm:text-5xl">
              Njega izrađena po mjeri.
            </h2>
          </Reveal>

          <div className="flex flex-col gap-14 sm:gap-16">
            {(services ?? []).map((service, i) => {
              const reversed = i % 2 === 1;
              return (
                <div
                  key={service.id}
                  className={`grid grid-cols-1 items-center gap-8 sm:grid-cols-[1.1fr_1fr] sm:gap-14 ${
                    reversed ? "sm:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <Reveal variant="mask" className="photo-zoom aspect-[3/2] w-full">
                    <SafeImage
                      src={
                        SERVICE_IMAGES[service.name] ??
                        SERVICE_IMAGE_FALLBACKS[i % SERVICE_IMAGE_FALLBACKS.length]
                      }
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </Reveal>
                  <Reveal delay={100}>
                    <p className="mb-2 text-xs tracking-[0.14em] text-brass uppercase">
                      {service.category}
                    </p>
                    <h3 className="mb-4 font-display text-4xl italic">
                      {service.name}
                    </h3>
                    <p className="mb-6 max-w-[34ch] text-sm leading-relaxed text-ink-dim">
                      {service.duration_minutes} minuta posvećenih detaljima
                      koji prave razliku.
                    </p>
                    <div className="mb-6 h-px w-10 bg-brass" />
                    <p className="text-lg text-brass">od {service.price} KM</p>
                  </Reveal>
                </div>
              );
            })}
            {(!services || services.length === 0) && (
              <p className="text-sm text-ink-dim">
                Cjenovnik uskoro -{" "}
                <Link href="/usluge" className="text-brass underline">
                  pogledaj sve usluge
                </Link>
                .
              </p>
            )}
          </div>

          {services && services.length > 0 && (
            <Reveal className="mt-16 block">
              <Link
                href="/usluge"
                className="inline-flex items-center gap-2 border-b border-ink text-sm text-ink transition-colors hover:border-brass hover:text-brass"
              >
                Pogledajte kompletan cjenovnik →
              </Link>
            </Reveal>
          )}
        </section>

        {/* O NAMA */}
        <section className="border-t border-ink/10">
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-6 py-20 sm:grid-cols-2 sm:gap-16 sm:py-28">
            <Reveal variant="mask" className="photo-zoom aspect-[3/2] w-full">
              <SafeImage
                src={PHOTOS.craftsmanship}
                alt=""
                className="h-full w-full object-cover"
              />
            </Reveal>
            <Reveal delay={100}>
              <p className="mb-3 text-xs tracking-[0.2em] text-brass uppercase">
                O nama
              </p>
              <h2 className="mb-6 font-display text-4xl italic text-balance">
                Zanat koji se osjeti u detaljima.
              </h2>
              <p className="max-w-[46ch] text-base leading-relaxed text-ink-dim">
                Bez obzira da li dolazite na šišanje, farbanje ili tretman,
                trudimo se da svaka posjeta bude opuštajuće i kvalitetno
                iskustvo - od prvog dogovora do posljednjeg pramena.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ZASTO MI */}
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
            <Reveal>
              <p className="mb-16 text-xs tracking-[0.2em] text-brass uppercase">
                Zašto mi
              </p>
            </Reveal>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              <Reveal delay={0}>
                <p className="font-display text-5xl italic text-brass">
                  <CountUp value={completedCount ?? 0} suffix="+" />
                </p>
                <p className="mt-2 text-xs tracking-[0.1em] text-ink-dim uppercase">
                  Realizovanih termina
                </p>
              </Reveal>
              <Reveal delay={100}>
                <p className="font-display text-5xl italic text-brass">
                  <CountUp value={happyClients} suffix="+" />
                </p>
                <p className="mt-2 text-xs tracking-[0.1em] text-ink-dim uppercase">
                  Zadovoljnih klijenata
                </p>
              </Reveal>
              <Reveal delay={200}>
                <p className="font-display text-5xl italic text-brass">
                  {avgRating ? avgRating.toFixed(1) : "-"}
                </p>
                <p className="mt-2 text-xs tracking-[0.1em] text-ink-dim uppercase">
                  Prosječna ocjena
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* TIM */}
        {staff && staff.length > 0 && (
          <section className="border-t border-ink/10">
            <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
              <Reveal>
                <p className="mb-16 text-xs tracking-[0.2em] text-brass uppercase">
                  Naš tim
                </p>
              </Reveal>
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
                {staff.map((member, i) => (
                  <Reveal key={member.id} delay={i * 80}>
                    <div className="group relative">
                      <div className="photo-zoom relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
                        <SafeImage
                          src={member.photo_url || PORTRAIT_FALLBACKS[i % PORTRAIT_FALLBACKS.length]}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                        {member.instagram_url && (
                          <a
                            href={member.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center bg-ink/0 text-paper opacity-0 transition-all duration-300 group-hover:bg-ink/40 group-hover:opacity-100"
                          >
                            <span className="border border-paper px-4 py-2 text-xs tracking-[0.1em] uppercase">
                              Instagram
                            </span>
                          </a>
                        )}
                      </div>
                      <p className="mt-4 font-display text-lg italic">
                        {member.name}
                      </p>
                      {member.role && (
                        <p className="mt-1 text-xs text-ink-dim uppercase tracking-[0.08em]">
                          {member.role}
                        </p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* RECENZIJE - spotlight citat */}
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
            <Reveal className="block text-center">
              <p className="mb-16 text-xs tracking-[0.2em] text-brass uppercase">
                Recenzije
              </p>
            </Reveal>
            {reviews && reviews.length > 0 ? (
              <Reveal className="block">
                <ReviewsSpotlight reviews={reviews} />
              </Reveal>
            ) : (
              <p className="text-center text-sm text-ink-dim">Recenzije uskoro.</p>
            )}

            <Reveal className="mx-auto mt-20 block max-w-md">
              <p className="mb-2 font-display text-xl italic">
                Podijelite Vaše iskustvo
              </p>
              <p className="mb-6 text-sm text-ink-dim">
                Vaša recenzija se objavljuje nakon kratkog pregleda.
              </p>
              <PublicReviewForm />
            </Reveal>
          </div>
        </section>
      </div>

      {/* BOOKING CTA - drugi tamni momenat, prije footera */}
      <section className="relative overflow-hidden bg-ink py-24 text-paper sm:py-32">
        <SafeImage
          src={PHOTOS.bookingBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <h2 className="mb-6 font-display text-4xl italic text-balance sm:text-5xl">
              Vrijeme je za promjenu.
            </h2>
            <p className="mb-10 text-base text-paper-dim">
              Zakažite termin za manje od minute.
            </p>
            <Link
              href="/zakazivanje"
              className="inline-flex items-center gap-3 bg-brass px-9 py-4 text-sm tracking-[0.02em] text-ink transition-opacity hover:opacity-90"
            >
              Zakažite termin
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
