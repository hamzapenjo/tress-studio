"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { hasOverlappingAppointment, isWithinWorkingHours } from "@/lib/booking";
import { isBookingRateLimited } from "@/lib/rate-limit";

export interface BookingState {
  status: "idle" | "success" | "error";
  message?: string;
}

const PHONE_REGEX = /^[0-9+\s()-]{6,20}$/;

export async function createAppointment(
  _prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const serviceId = String(formData.get("service_id") ?? "");
  const staffId = String(formData.get("staff_id") ?? "") || null;
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!serviceId || !date || !time || !name || !phone) {
    return { status: "error", message: "Molimo popunite sva obavezna polja." };
  }

  if (!PHONE_REGEX.test(phone)) {
    return { status: "error", message: "Unesite ispravan broj telefona." };
  }

  if (await isBookingRateLimited(phone)) {
    return {
      status: "error",
      message:
        "Poslali ste previše zahtjeva u kratkom vremenu. Molimo pokušajte ponovo za nekoliko minuta.",
    };
  }

  const supabase = createAdminClient();

  const { data: service } = await supabase
    .from("services")
    .select("duration_minutes")
    .eq("id", serviceId)
    .single();

  if (!service) {
    return { status: "error", message: "Odabrana usluga ne postoji." };
  }

  if (!isWithinWorkingHours(date, time, service.duration_minutes)) {
    return {
      status: "error",
      message:
        "Odabrano vrijeme je van radnog vremena (Pon-Pet 09:00-17:00). Izaberite drugi termin.",
    };
  }

  const overlapping = await hasOverlappingAppointment(supabase, {
    date,
    time,
    durationMinutes: service.duration_minutes,
    staffId,
  });

  if (overlapping) {
    return {
      status: "error",
      message: "Odabrani termin je zauzet. Izaberite drugo vrijeme.",
    };
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
      return {
        status: "error",
        message: "Došlo je do greške. Pokušajte ponovo.",
      };
    }
    customerId = newCustomer.id;
  }

  const { error: appointmentError } = await supabase.from("appointments").insert({
    customer_id: customerId,
    service_id: serviceId,
    staff_id: staffId,
    appointment_date: date,
    appointment_time: time,
    status: "na_cekanju",
    seen: false,
  });

  if (appointmentError) {
    // 23505 = unique_violation (netko je u meduvremenu zauzeo isti termin)
    if (appointmentError.code === "23505") {
      return {
        status: "error",
        message: "Odabrani termin je upravo zauzet. Izaberite drugo vrijeme.",
      };
    }
    return {
      status: "error",
      message: "Došlo je do greške. Pokušajte ponovo.",
    };
  }

  revalidatePath("/admin/termini");
  return {
    status: "success",
    message:
      "Vaš zahtjev za termin je poslan. Kontaktiraćemo Vas uskoro radi potvrde.",
  };
}
