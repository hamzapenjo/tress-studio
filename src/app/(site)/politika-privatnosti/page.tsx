export const metadata = {
  title: "Politika privatnosti · Tress Studio",
};

export default function PolitikaPrivatnostiPage() {
  return (
    <main className="flex-1 bg-paper text-ink">
      <div className="mx-auto w-full max-w-3xl px-6 py-20">
        <p className="mb-3 text-xs tracking-[0.2em] text-brass uppercase">
          Pravne informacije
        </p>
        <h1 className="mb-12 font-display text-4xl italic">
          Politika privatnosti
        </h1>

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-ink-dim">
          <p>
            Posljednja izmjena: 28. juli 2026. Tress Studio poštuje Vašu
            privatnost. Ova politika objašnjava koje podatke prikupljamo,
            zašto ih prikupljamo i kako ih čuvamo.
          </p>

          <section>
            <h2 className="mb-2 font-display text-xl italic text-ink">
              1. Podaci koje prikupljamo
            </h2>
            <p>
              Prilikom zakazivanja termina ili slanja poruke prikupljamo Vaše
              ime, broj telefona i/ili email adresu, odabranu uslugu i
              eventualnu napomenu koju unesete. Ne prikupljamo podatke o
              plaćanju putem stranice.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl italic text-ink">
              2. Svrha korištenja podataka
            </h2>
            <p>
              Podatke koristimo isključivo radi potvrde i organizacije
              termina, komunikacije s Vama u vezi sa zakazanom uslugom, te
              odgovora na poruke poslane putem kontakt forme. Ne prosljeđujemo
              Vaše podatke trećim licima u marketinške svrhe.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl italic text-ink">
              3. Čuvanje podataka
            </h2>
            <p>
              Podaci se čuvaju na sigurnim serverima uz standardne mjere
              zaštite. Podatke čuvamo onoliko dugo koliko je potrebno za
              svrhu radi koje su prikupljeni, odnosno u skladu sa zakonskim
              obavezama.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl italic text-ink">
              4. Vaša prava
            </h2>
            <p>
              U svakom trenutku možete zatražiti uvid, izmjenu ili brisanje
              Vaših podataka koje čuvamo. Zahtjev možete poslati putem
              stranice{" "}
              <a href="/kontakt" className="text-brass underline">
                Kontakt
              </a>{" "}
              ili telefonom.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl italic text-ink">
              5. Kolačići (cookies)
            </h2>
            <p>
              Stranica koristi isključivo tehnički neophodne kolačiće
              potrebne za njeno ispravno funkcionisanje. Ne koristimo
              kolačiće za praćenje u marketinške svrhe.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl italic text-ink">
              6. Izmjene politike
            </h2>
            <p>
              Zadržavamo pravo izmjene ove politike privatnosti. O eventualnim
              značajnim izmjenama obavijestit ćemo objavom na ovoj stranici.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
