import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";

const INFO = [
  { label: "Adresa", value: "Maršala Tita 45, Sarajevo" },
  { label: "Telefon", value: "+387 61 234 567" },
  { label: "Radno vrijeme", value: "Pon - Pet: 09:00 - 17:00\nSub - Ned: Zatvoreno" },
];

export default function KontaktPage() {
  return (
    <main className="flex-1 bg-paper text-ink">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <Reveal>
          <p className="mb-3 text-xs tracking-[0.2em] text-brass uppercase">
            Kontakt
          </p>
          <h1 className="mb-5 font-display text-4xl italic sm:text-5xl">
            Posjetite nas
          </h1>
          <p className="mb-16 max-w-[52ch] text-sm leading-relaxed text-ink-dim">
            Za zakazivanje termina koristite stranicu Zakazivanje. Za sva
            ostala pitanja, slobodno nas kontaktirajte putem forme ispod ili
            telefonom.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
          <Reveal delay={60}>
            <div className="flex flex-col border border-ink/10">
              {INFO.map((item) => (
                <div
                  key={item.label}
                  className="border-b border-ink/10 px-6 py-6 last:border-b-0"
                >
                  <h2 className="mb-2 text-xs tracking-[0.14em] text-ink-dim uppercase">
                    {item.label}
                  </h2>
                  <p className="font-display text-lg whitespace-pre-line italic">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="mb-6 text-xs tracking-[0.14em] text-ink-dim uppercase">
              Pošaljite nam poruku
            </h2>
            <ContactForm />
          </Reveal>
        </div>

        <Reveal delay={160} className="mt-16 block">
          <h2 className="mb-6 text-xs tracking-[0.14em] text-ink-dim uppercase">
            Lokacija
          </h2>
          <div className="aspect-[21/9] w-full overflow-hidden border border-ink/10">
            <iframe
              title="Lokacija - Maršala Tita 45, Sarajevo"
              src="https://www.google.com/maps?q=Mar%C5%A1ala+Tita+45%2C+Sarajevo%2C+Bosna+i+Hercegovina&output=embed"
              className="h-full w-full grayscale"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </main>
  );
}
