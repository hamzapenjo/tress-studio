"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface StaffFormState {
  status: "idle" | "error";
  message?: string;
}

function parseStaffForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const photo_url = String(formData.get("photo_url") ?? "").trim();
  const instagram_url = String(formData.get("instagram_url") ?? "").trim();

  if (!name) {
    return { error: "Ime je obavezno." } as const;
  }

  return {
    data: {
      name,
      role: role || null,
      photo_url: photo_url || null,
      instagram_url: instagram_url || null,
    },
  } as const;
}

export async function createStaff(
  _prevState: StaffFormState,
  formData: FormData
): Promise<StaffFormState> {
  const parsed = parseStaffForm(formData);
  if ("error" in parsed) return { status: "error", message: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("staff").insert(parsed.data);

  if (error) {
    return { status: "error", message: "Došlo je do greške. Pokušajte ponovo." };
  }

  revalidatePath("/admin/osoblje");
  revalidatePath("/");
  redirect("/admin/osoblje");
}

export async function updateStaff(
  id: string,
  _prevState: StaffFormState,
  formData: FormData
): Promise<StaffFormState> {
  const parsed = parseStaffForm(formData);
  if ("error" in parsed) return { status: "error", message: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("staff").update(parsed.data).eq("id", id);

  if (error) {
    return { status: "error", message: "Došlo je do greške. Pokušajte ponovo." };
  }

  revalidatePath("/admin/osoblje");
  revalidatePath("/");
  redirect("/admin/osoblje");
}

export async function deleteStaff(id: string) {
  const supabase = await createClient();
  await supabase.from("staff").delete().eq("id", id);

  revalidatePath("/admin/osoblje");
  revalidatePath("/");
  redirect("/admin/osoblje");
}
