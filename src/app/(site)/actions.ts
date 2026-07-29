"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isReviewRateLimited } from "@/lib/rate-limit";

export interface PublicReviewState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function submitReview(
  _prevState: PublicReviewState,
  formData: FormData
): Promise<PublicReviewState> {
  const author_name = String(formData.get("author_name") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") ?? "").trim();

  if (!author_name || !body) {
    return { status: "error", message: "Molimo popunite sva polja." };
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: "error", message: "Odaberite ocjenu od 1 do 5." };
  }

  if (await isReviewRateLimited(author_name)) {
    return {
      status: "error",
      message:
        "Poslali ste previše recenzija u kratkom vremenu. Molimo pokušajte ponovo za nekoliko minuta.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("reviews")
    .insert({ author_name, rating, body, approved: false });

  if (error) {
    return { status: "error", message: "Došlo je do greške. Pokušajte ponovo." };
  }

  revalidatePath("/");
  return {
    status: "success",
    message: "Hvala Vam na recenziji! Biće objavljena nakon pregleda.",
  };
}
