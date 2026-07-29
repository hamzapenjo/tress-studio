"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ReviewFormState {
  status: "idle" | "error";
  message?: string;
}

export async function createReview(
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const author_name = String(formData.get("author_name") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") ?? "").trim();

  if (!author_name || !body) {
    return { status: "error", message: "Popunite sva polja." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: "error", message: "Ocjena mora biti od 1 do 5." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .insert({ author_name, rating, body, approved: true });

  if (error) {
    return { status: "error", message: "Došlo je do greške. Pokušajte ponovo." };
  }

  revalidatePath("/admin/recenzije");
  revalidatePath("/");
  return { status: "idle" };
}

export async function approveReview(id: string) {
  const supabase = await createClient();
  await supabase.from("reviews").update({ approved: true }).eq("id", id);
  revalidatePath("/admin/recenzije");
  revalidatePath("/");
}

export async function deleteReview(id: string) {
  const supabase = await createClient();
  await supabase.from("reviews").delete().eq("id", id);
  revalidatePath("/admin/recenzije");
  revalidatePath("/");
}
