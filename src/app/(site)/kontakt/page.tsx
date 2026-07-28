import { ContactForm } from "@/components/contact-form";

export default function KontaktPage() {
  return (
    <main className="flex-1 bg-paper text-ink">
      <div className="mx-auto w-full max-w-5xl px-6 py-20">
        <p className="mb-3 text-xs tracking-[0.2em] text-brass uppercase">
          Kontakt
        </p>
        <h1 className="mb-14 font-display text-4xl italic">Posjetite nas</h1>

        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="mb-2 text-xs tracking-[0.14em] text-ink-dim uppercase">
                Adresa
              </h2>
              <p className="font-display text-lg italic">
                Maršala Tita 45, Sarajevo
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xs tracking-[0.14em] text-ink-dim uppercase">
                Radno vrijeme
              </h2>
              <p className="font-display text-lg italic">
                Pon - Pet: 09:00 - 17:00
                <br />
                Sub - Ned: Zatvoreno
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xs tracking-[0.14em] text-ink-dim uppercase">
                Telefon
              </h2>
              <p className="font-display text-lg italic">+387 61 234 567</p>
            </section>

            <section>
              <h2 className="mb-2 text-xs tracking-[0.14em] text-ink-dim uppercase">
                Lokacija
              </h2>
              <div className="aspect-video w-full overflow-hidden border border-ink/10">
                <iframe
                  title="Lokacija - Maršala Tita 45, Sarajevo"
                  src="https://www.google.com/maps?q=Mar%C5%A1ala+Tita+45%2C+Sarajevo%2C+Bosna+i+Hercegovina&output=embed"
                  className="h-full w-full grayscale"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </div>

          <div>
            <h2 className="mb-6 text-xs tracking-[0.14em] text-ink-dim uppercase">
              Pošaljite nam poruku
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
