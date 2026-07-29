"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const GALLERY_BUCKET = "gallery";

export interface GalleryFormState {
  status: "idle" | "error";
  message?: string;
}

function extensionOf(file: File): string {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.pop()! : "jpg";
}

async function uploadToBucket(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File
): Promise<string | null> {
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

export async function uploadSingleImage(
  _prevState: GalleryFormState,
  formData: FormData
): Promise<GalleryFormState> {
  const category = String(formData.get("category") ?? "").trim() || "Ostalo";
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return { status: "error", message: "Odaberite sliku." };
  }

  const supabase = await createClient();
  const url = await uploadToBucket(supabase, file);

  if (!url) {
    return { status: "error", message: "Greška prilikom upload-a slike." };
  }

  const { error } = await supabase
    .from("gallery_images")
    .insert({ url, category });

  if (error) {
    return { status: "error", message: "Greška prilikom snimanja slike." };
  }

  revalidatePath("/admin/galerija");
  revalidatePath("/galerija");
  return { status: "idle" };
}

export async function uploadPairImages(
  _prevState: GalleryFormState,
  formData: FormData
): Promise<GalleryFormState> {
  const category = String(formData.get("category") ?? "").trim() || "Ostalo";
  const beforeFile = formData.get("before") as File | null;
  const afterFile = formData.get("after") as File | null;

  if (!beforeFile || beforeFile.size === 0 || !afterFile || afterFile.size === 0) {
    return { status: "error", message: "Odaberite obje slike (prije i poslije)." };
  }

  const supabase = await createClient();
  const [beforeUrl, afterUrl] = await Promise.all([
    uploadToBucket(supabase, beforeFile),
    uploadToBucket(supabase, afterFile),
  ]);

  if (!beforeUrl || !afterUrl) {
    return { status: "error", message: "Greška prilikom upload-a slika." };
  }

  const pairKey = crypto.randomUUID();
  const { error } = await supabase.from("gallery_images").insert([
    { url: beforeUrl, category, pair_key: pairKey, pair_label: "prije" },
    { url: afterUrl, category, pair_key: pairKey, pair_label: "poslije" },
  ]);

  if (error) {
    return { status: "error", message: "Greška prilikom snimanja slika." };
  }

  revalidatePath("/admin/galerija");
  revalidatePath("/galerija");
  return { status: "idle" };
}

export async function deleteImage(id: string, url: string) {
  const supabase = await createClient();
  const path = url.split(`/${GALLERY_BUCKET}/`).pop();

  if (path) {
    await supabase.storage.from(GALLERY_BUCKET).remove([path]);
  }
  await supabase.from("gallery_images").delete().eq("id", id);

  revalidatePath("/admin/galerija");
  revalidatePath("/galerija");
}

export async function createHairstyleLook(
  _prevState: GalleryFormState,
  formData: FormData
): Promise<GalleryFormState> {
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    return { status: "error", message: "Unesite naziv frizure." };
  }

  const supabase = await createClient();

  const image = formData.get("image") as File | null;
  const imageUrl = image && image.size > 0 ? await uploadToBucket(supabase, image) : null;

  const { error } = await supabase.from("hairstyle_looks").insert({
    title,
    image_url: imageUrl,
  });

  if (error) {
    return { status: "error", message: "Greška prilikom snimanja frizure." };
  }

  revalidatePath("/admin/galerija");
  revalidatePath("/galerija");
  return { status: "idle" };
}

export async function deleteHairstyleLook(id: string, url: string | null) {
  const supabase = await createClient();
  const path = url?.split(`/${GALLERY_BUCKET}/`).pop();

  if (path) {
    await supabase.storage.from(GALLERY_BUCKET).remove([path]);
  }
  await supabase.from("hairstyle_looks").delete().eq("id", id);

  revalidatePath("/admin/galerija");
  revalidatePath("/galerija");
}
