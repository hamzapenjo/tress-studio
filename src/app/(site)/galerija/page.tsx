import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SafeImage } from "@/components/safe-image";

type GalleryImage = {
  id: string;
  url: string;
  category: string;
  pair_key: string | null;
  pair_label: "prije" | "poslije" | null;
};

type GalleryItem =
  | { kind: "single"; image: GalleryImage }
  | { kind: "pair"; before: GalleryImage; after: GalleryImage };

function groupImages(images: GalleryImage[]): GalleryItem[] {
  const items: GalleryItem[] = [];
  const seenPairKeys = new Set<string>();

  for (const image of images) {
    if (image.pair_key) {
      if (seenPairKeys.has(image.pair_key)) continue;
      const before = images.find(
        (candidate) =>
          candidate.pair_key === image.pair_key &&
          candidate.pair_label === "prije",
      );
      const after = images.find(
        (candidate) =>
          candidate.pair_key === image.pair_key &&
          candidate.pair_label === "poslije",
      );
      if (before && after) {
        seenPairKeys.add(image.pair_key);
        items.push({ kind: "pair", before, after });
        continue;
      }
    }
    items.push({ kind: "single", image });
  }

  return items;
}

export default async function GalerijaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorija?: string }>;
}) {
  const { kategorija } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("id, url, category, pair_key, pair_label")
    .order("created_at", { ascending: false });

  const images = data ?? [];
  const categories = Array.from(
    new Set(images.map((image) => image.category)),
  ).sort();

  const filtered = kategorija
    ? images.filter((image) => image.category === kategorija)
    : images;

  const items = groupImages(filtered);

  return (
    <main className="flex-1 bg-paper text-ink">
      <div className="mx-auto w-full max-w-5xl px-6 py-20">
        <p className="mb-3 text-xs tracking-[0.2em] text-brass uppercase">
          Galerija
        </p>
        <h1 className="mb-8 font-display text-4xl italic">Radovi</h1>

        {categories.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-3 text-xs tracking-[0.08em] uppercase">
            <Link
              href="/galerija"
              className={
                !kategorija
                  ? "border border-brass bg-brass px-4 py-2 text-ink"
                  : "border border-ink/20 px-4 py-2 text-ink-dim transition-colors hover:border-brass hover:text-ink"
              }
            >
              Sve
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/galerija?kategorija=${encodeURIComponent(category)}`}
                className={
                  kategorija === category
                    ? "border border-brass bg-brass px-4 py-2 text-ink"
                    : "border border-ink/20 px-4 py-2 text-ink-dim transition-colors hover:border-brass hover:text-ink"
                }
              >
                {category}
              </Link>
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <p className="text-sm text-ink-dim">
            Galerija trenutno nema slika u ovoj kategoriji.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) =>
              item.kind === "single" ? (
                <SafeImage
                  key={item.image.id}
                  src={item.image.url}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div
                  key={item.before.pair_key}
                  className="col-span-2 grid grid-cols-2 gap-1"
                >
                  <div className="relative aspect-square">
                    <SafeImage
                      src={item.before.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-ink/80 px-2 py-1 text-[10px] tracking-[0.1em] text-paper uppercase">
                      Prije
                    </span>
                  </div>
                  <div className="relative aspect-square">
                    <SafeImage
                      src={item.after.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-brass px-2 py-1 text-[10px] tracking-[0.1em] text-ink uppercase">
                      Poslije
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </main>
  );
}
