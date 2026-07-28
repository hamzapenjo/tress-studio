"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { isContactRateLimited } from "@/lib/rate-limit";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function sendMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!name || !contact || !body) {
    return { status: "error", message: "Molimo popunite sva polja." };
  }

  if (await isContactRateLimited(contact)) {
    return {
      status: "error",
      message:
        "Poslali ste previše poruka u kratkom vremenu. Molimo pokušajte ponovo za nekoliko minuta.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("messages").insert({ name, contact, body });

  if (error) {
    return { status: "error", message: "Došlo je do greške. Pokušajte ponovo." };
  }

  return {
    status: "success",
    message: "Vaša poruka je poslana. Odgovorićemo Vam u najkraćem roku.",
  };
}
