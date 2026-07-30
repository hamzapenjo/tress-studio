import { createClient } from "@/lib/supabase/client";

const GALLERY_BUCKET = "gallery";

function extensionOf(file: File): string {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.pop()! : "jpg";
}

// Upload direktno iz browsera u Supabase Storage - Vercel serverless funkcije
// imaju tvrd limit velicine tijela zahtjeva (~4.5MB), pa slanje slika kroz
// server akciju otkazuje za bilo koju stvarnu fotografiju. Ovako slika nikad
// ne prolazi kroz nas server, samo kroz Supabase.
export async function uploadImageToGallery(file: File): Promise<string | null> {
  const supabase = createClient();
  const path = `${crypto.randomUUID()}.${extensionOf(file)}`;
  const { error } = await supabase.storage
    .from(GALLERY_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) return null;

  const {
    data: { publicUrl },
  } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path);
  return publicUrl;
}
