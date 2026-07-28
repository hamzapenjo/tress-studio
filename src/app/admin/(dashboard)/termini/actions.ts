"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/lib/database.types";
import { hasOverlappingAppointment } from "@/lib/booking";

export interface AppointmentFormState {
  status: "idle" | "error";
  message?: string;
}

export async function createAppointmentAdmin(
  _prevState: AppointmentFormState,
  formData: FormData
): Promise<AppointmentFormState> {
  const serviceId = String(formData.get("service_id") ?? "");
  const staffId = String(formData.get("staff_id") ?? "") || null;
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!serviceId || !date || !time || !name || !phone) {
    return { status: "error", message: "Popunite sva obavezna polja." };
  }

  const supabase = await createClient();

  const { data: service } = await supabase
    .from("services")
    .select("duration_minutes")
    .eq("id", serviceId)
    .single();

  if (!service) {
    return { status: "error", message: "Odabrana usluga ne postoji." };
  }

  // Napomena: admin (za razliku od javne forme) moze zakazati termin van
  // radnog vremena - to je "dopustenje" koje vlasnica ima kao ulogovan admin.
  const overlapping = await hasOverlappingAppointment(supabase, {
    date,
    time,
    durationMinutes: service.duration_minutes,
    staffId,
  });

  if (overlapping) {
    return { status: "error", message: "Odabrani termin se preklapa sa postojećim." };
  }

  let customerId: string;
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();

  if (existingCustomer) {
    customerId = existingCustomer.id;
  } else {
    const { data: newCustomer, error: customerError } = await supabase
      .from("customers")
      .insert({ name, phone })
      .select("id")
      .single();

    if (customerError || !newCustomer) {
      return { status: "error", message: "Došlo je do greške. Pokušajte ponovo." };
    }
    customerId = newCustomer.id;
  }

  const { error: appointmentError } = await supabase.from("appointments").insert({
    customer_id: customerId,
    service_id: serviceId,
    staff_id: staffId,
    appointment_date: date,
    appointment_time: time,
    status: "potvrdjeno",
    seen: true,
  });

  if (appointmentError) {
    return { status: "error", message: "Došlo je do greške. Pokušajte ponovo." };
  }

  revalidatePath("/admin/termini");
  return { status: "idle" };
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
) {
  const supabase = await createClient();
  await supabase.from("appointments").update({ status }).eq("id", id);
  revalidatePath("/admin/termini");
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient();
  await supabase.from("appointments").delete().eq("id", id);
  revalidatePath("/admin/termini");
}

export async function markAppointmentsSeen() {
  const supabase = await createClient();
  await supabase.from("appointments").update({ seen: true }).eq("seen", false);
}
