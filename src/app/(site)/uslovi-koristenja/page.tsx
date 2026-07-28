export const metadata = {
  title: "Uslovi korištenja · Tress Studio",
};

export default function UsloviKoristenjaPage() {
  return (
    <main className="flex-1 bg-paper text-ink">
      <div className="mx-auto w-full max-w-3xl px-6 py-20">
        <p className="mb-3 text-xs tracking-[0.2em] text-brass uppercase">
          Pravne informacije
        </p>
        <h1 className="mb-12 font-display text-4xl italic">
          Uslovi korištenja
        </h1>

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink-dim">
          <p>
            Posljednja izmjena: 28. juli 2026. Korištenjem web stranice Tress
            Studio prihvatate niže navedene uslove. Molimo Vas da ih pažljivo
            pročitate prije zakazivanja termina ili korištenja bilo koje
            funkcionalnosti stranice.
          </p>

          <section>
            <h2 className="mb-2 font-display text-xl italic text-ink">
              1. Zakazivanje termina
            </h2>
            <p>
              Zakazivanjem termina putem naše stranice šaljete zahtjev koji
              podliježe potvrdi od strane osoblja Tress Studio. Termin se
              smatra potvrđenim tek nakon što primite potvrdu. Zadržavamo
              pravo da odbijemo ili otkažemo zahtjev za termin uz prethodno
              obavještenje.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl italic text-ink">
              2. Otkazivanje i kašnjenje
            </h2>
            <p>
              Ukoliko se ne možete odazvati na zakazani termin, molimo Vas da
              nas kontaktirate najkasnije 24 sata unaprijed. Kašnjenje duže od
              15 minuta može rezultirati skraćivanjem ili otkazivanjem
              usluge.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl italic text-ink">
              3. Tačnost podataka
            </h2>
            <p>
              Odgovorni ste za tačnost podataka koje unosite prilikom
              zakazivanja termina ili slanja poruke (ime, telefon, email).
              Netačni podaci mogu onemogućiti potvrdu termina.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl italic text-ink">
              4. Sadržaj stranice
            </h2>
            <p>
              Sav sadržaj objavljen na ovoj stranici (tekstovi, fotografije,
              vizuelni identitet) vlasništvo je Tress Studio i ne smije se
              koristiti bez prethodne pisane saglasnosti.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl italic text-ink">
              5. Izmjene uslova
            </h2>
            <p>
              Zadržavamo pravo izmjene ovih uslova u bilo kojem trenutku.
              Izmjene stupaju na snagu objavom na ovoj stranici.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl italic text-ink">
              6. Kontakt
            </h2>
            <p>
              Za sva pitanja u vezi sa ovim uslovima možete nas kontaktirati
              putem stranice{" "}
              <a href="/kontakt" className="text-brass underline">
                Kontakt
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
