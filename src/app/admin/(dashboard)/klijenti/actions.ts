"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface CustomerFormState {
  status: "idle" | "error";
  message?: string;
}

export async function updateCustomer(
  id: string,
  _prevState: CustomerFormState,
  formData: FormData
): Promise<CustomerFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name || !phone) {
    return { status: "error", message: "Ime i telefon su obavezni." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({
      name,
      phone,
      email: email || null,
      notes: notes || null,
    })
    .eq("id", id);

  if (error) {
    return { status: "error", message: "Došlo je do greške. Pokušajte ponovo." };
  }

  revalidatePath("/admin/klijenti");
  revalidatePath(`/admin/klijenti/${id}`);
  redirect(`/admin/klijenti/${id}`);
}
