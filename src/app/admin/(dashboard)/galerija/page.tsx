import { createClient } from "@/lib/supabase/server";
import { GalleryUploadForms } from "@/components/admin/gallery-upload-forms";
import { linkDangerClass } from "@/components/admin/field-styles";
import { SafeImage } from "@/components/safe-image";
import { deleteImage, deleteHairstyleLook } from "./actions";

export default async function AdminGalerijaPage() {
  const supabase = await createClient();
  const [{ data: images }, { data: looks }] = await Promise.all([
    supabase
      .from("gallery_images")
      .select("id, url, category, pair_key, pair_label")
      .order("created_at", { ascending: false }),
    supabase
      .from("hairstyle_looks")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const all = images ?? [];
  const categories = Array.from(new Set(all.map((image) => image.category))).sort();

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-display text-2xl italic">Galerija</h1>

      <GalleryUploadForms categories={categories} />

      <div>
        <h2 className="mb-4 font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
          Sve slike ({all.length})
        </h2>
        {all.length === 0 ? (
          <p className="text-sm text-paper-dim">Galerija je prazna.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {all.map((image) => (
              <div key={image.id} className="flex flex-col gap-2">
                <div className="relative aspect-square">
                  <SafeImage
                    src={image.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {image.pair_label && (
                    <span className="absolute bottom-1 left-1 bg-ink/80 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.08em] text-paper uppercase">
                      {image.pair_label}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] text-paper-dim uppercase">
                  {image.category}
                </span>
                <form action={deleteImage.bind(null, image.id, image.url)}>
                  <button type="submit" className={linkDangerClass + " w-full"}>
                    Obriši
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 font-mono text-xs tracking-[0.14em] text-paper-dim uppercase">
          Frizure ({(looks ?? []).length})
        </h2>
        {(looks ?? []).length === 0 ? (
          <p className="text-sm text-paper-dim">Nema dodanih frizura.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {(looks ?? []).map((look) => (
              <div key={look.id} className="flex flex-col gap-2 border border-paper/10 p-3">
                <div className="relative aspect-[3/4]">
                  <SafeImage src={look.front_url} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative aspect-square">
                    <SafeImage src={look.back_url} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="relative aspect-square">
                    <SafeImage src={look.side_url} alt="" className="h-full w-full object-cover" />
                  </div>
                </div>
                <span className="font-mono text-[10px] text-paper-dim uppercase">
                  {look.title}
                </span>
                <form
                  action={deleteHairstyleLook.bind(null, look.id, [
                    look.front_url,
                    look.back_url,
                    look.side_url,
                  ])}
                >
                  <button type="submit" className={linkDangerClass + " w-full"}>
                    Obriši
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
