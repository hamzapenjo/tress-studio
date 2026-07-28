"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface ServiceFormState {
  status: "idle" | "error";
  message?: string;
}

function parseServiceForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price"));
  const duration_minutes = Number(formData.get("duration_minutes"));

  if (!name || !category || !Number.isFinite(price) || price < 0) {
    return { error: "Popunite sva polja ispravno." } as const;
  }
  if (!Number.isFinite(duration_minutes) || duration_minutes <= 0) {
    return { error: "Trajanje mora biti pozitivan broj minuta." } as const;
  }

  return { data: { name, category, price, duration_minutes } } as const;
}

export async function createService(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const parsed = parseServiceForm(formData);
  if ("error" in parsed) return { status: "error", message: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("services").insert(parsed.data);

  if (error) {
    return { status: "error", message: "Došlo je do greške. Pokušajte ponovo." };
  }

  revalidatePath("/admin/usluge");
  revalidatePath("/usluge");
  redirect("/admin/usluge");
}

export async function updateService(
  id: string,
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const parsed = parseServiceForm(formData);
  if ("error" in parsed) return { status: "error", message: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    return { status: "error", message: "Došlo je do greške. Pokušajte ponovo." };
  }

  revalidatePath("/admin/usluge");
  revalidatePath("/usluge");
  redirect("/admin/usluge");
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);

  revalidatePath("/admin/usluge");
  revalidatePath("/usluge");

  if (error) {
    redirect(
      "/admin/usluge?error=" +
        encodeURIComponent("Usluga se ne može obrisati - koristi se u postojećim terminima.")
    );
  }

  redirect("/admin/usluge");
}
