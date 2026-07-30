"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const GALLERY_BUCKET = "gallery";

export interface GalleryFormState {
  status: "idle" | "error";
  message?: string;
}

// Slike se sad uploaduju direktno iz browsera u Supabase Storage (vidi
// src/lib/gallery-upload.ts) prije nego sto se pozovu ove akcije - Vercel
// serverless funkcije imaju tvrd limit velicine zahtjeva (~4.5MB) koji bi
// odbio bilo koju stvarnu fotografiju da prolazi kroz server akciju.
// Akcije ovdje samo primaju vec gotove URL-ove i upisuju ih u bazu.

export async function uploadSingleImage(
  _prevState: GalleryFormState,
  payload: { urls: string[]; category: string }
): Promise<GalleryFormState> {
  const category = payload.category.trim() || "Ostalo";
  const urls = payload.urls.filter(Boolean);

  if (urls.length === 0) {
    return { status: "error", message: "Odaberite bar jednu sliku." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("gallery_images")
    .insert(urls.map((url) => ({ url, category })));

  if (error) {
    return { status: "error", message: "Greška prilikom snimanja slika." };
  }

  revalidatePath("/admin/galerija");
  revalidatePath("/galerija");
  return { status: "idle" };
}

export async function uploadPairImages(
  _prevState: GalleryFormState,
  payload: { beforeUrl: string | null; afterUrl: string | null; category: string }
): Promise<GalleryFormState> {
  const category = payload.category.trim() || "Ostalo";

  if (!payload.beforeUrl || !payload.afterUrl) {
    return { status: "error", message: "Odaberite obje slike (prije i poslije)." };
  }

  const supabase = await createClient();
  const pairKey = crypto.randomUUID();
  const { error } = await supabase.from("gallery_images").insert([
    { url: payload.beforeUrl, category, pair_key: pairKey, pair_label: "prije" },
    { url: payload.afterUrl, category, pair_key: pairKey, pair_label: "poslije" },
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
  payload: { title: string; imageUrl: string | null }
): Promise<GalleryFormState> {
  const title = payload.title.trim();

  if (!title) {
    return { status: "error", message: "Unesite naziv frizure." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("hairstyle_looks").insert({
    title,
    image_url: payload.imageUrl,
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
