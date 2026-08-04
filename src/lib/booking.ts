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

export async function getBookedIntervals(
  supabase: SupabaseClient<Database>,
  date: string,
  staffId: string | null
): Promise<{ start: number; end: number }[]> {
  let query = supabase
    .from("appointments")
    .select("appointment_time, services(duration_minutes)")
    .eq("appointment_date", date)
    .neq("status", "otkazano");

  query = staffId ? query.eq("staff_id", staffId) : query.is("staff_id", null);

  const { data } = await query;

  return (data ?? []).map((appointment) => {
    const start = toMinutes(appointment.appointment_time);
    return { start, end: start + (appointment.services?.duration_minutes ?? 0) };
  });
}

export function overlapsAny(
  intervals: { start: number; end: number }[],
  start: number,
  end: number
): boolean {
  return intervals.some((interval) => start < interval.end && interval.start < end);
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
  const intervals = await getBookedIntervals(supabase, date, staffId);
  return overlapsAny(intervals, newStart, newEnd);
}

// Sve moguce pocetne tacke termina za dati dan/uslugu, na 15-minutne
// razmake, unutar radnog vremena - bez provjere zauzetosti (to je
// odvojeno, vidi getAvailableSlots server action).
export function generateTimeSlots(
  dateStr: string,
  durationMinutes: number,
  stepMinutes = 15
): string[] {
  const day = new Date(`${dateStr}T00:00:00`).getDay();
  const hours = WORKING_HOURS[day];
  if (!hours || !durationMinutes) return [];

  const startMinutes = toMinutes(hours.start);
  const endMinutes = toMinutes(hours.end);
  const slots: string[] = [];

  for (
    let t = startMinutes;
    t + durationMinutes <= endMinutes;
    t += stepMinutes
  ) {
    const h = String(Math.floor(t / 60)).padStart(2, "0");
    const m = String(t % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }

  return slots;
}
