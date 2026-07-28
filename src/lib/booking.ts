import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

// Radno vrijeme salona - drzati u skladu sa tekstom na /kontakt.
// 0 = nedjelja ... 6 = subota (Date.getDay())
export const WORKING_HOURS: Record<number, { start: string; end: string } | null> = {
  0: null,
  1: { start: "09:00", end: "17:00" },
  2: { start: "09:00", end: "17:00" },
  3: { start: "09:00", end: "17:00" },
  4: { start: "09:00", end: "17:00" },
  5: { start: "09:00", end: "17:00" },
  6: null,
};

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function isWithinWorkingHours(
  dateStr: string,
  time: string,
  durationMinutes: number
): boolean {
  const day = new Date(`${dateStr}T00:00:00`).getDay();
  const hours = WORKING_HOURS[day];
  if (!hours) return false;

  const start = toMinutes(time);
  const end = start + durationMinutes;
  return start >= toMinutes(hours.start) && end <= toMinutes(hours.end);
}

export async function hasOverlappingAppointment(
  supabase: SupabaseClient<Database>,
  params: {
    date: string;
    time: string;
    durationMinutes: number;
    staffId: string | null;
  }
): Promise<boolean> {
  const { date, time, durationMinutes, staffId } = params;
  const newStart = toMinutes(time);
  const newEnd = newStart + durationMinutes;

  let query = supabase
    .from("appointments")
    .select("appointment_time, services(duration_minutes)")
    .eq("appointment_date", date)
    .neq("status", "otkazano");

  query = staffId ? query.eq("staff_id", staffId) : query.is("staff_id", null);

  const { data } = await query;

  for (const appointment of data ?? []) {
    const existingStart = toMinutes(appointment.appointment_time);
    const existingEnd = existingStart + (appointment.services?.duration_minutes ?? 0);
    if (newStart < existingEnd && existingStart < newEnd) {
      return true;
    }
  }

  return false;
}
