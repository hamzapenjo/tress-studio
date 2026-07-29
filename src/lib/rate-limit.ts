import { createAdminClient } from "@/lib/supabase/admin";

const BOOKING_WINDOW_MINUTES = 15;
const BOOKING_MAX_ATTEMPTS = 3;

const CONTACT_WINDOW_MINUTES = 15;
const CONTACT_MAX_ATTEMPTS = 3;

const REVIEW_WINDOW_MINUTES = 15;
const REVIEW_MAX_ATTEMPTS = 3;

function minutesAgoIso(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

// Bazirano na bazi (ne u memoriji) - radi ispravno i na serverless hostingu
// gdje instance procesa ne dijele memoriju izmedju zahtjeva.
export async function isBookingRateLimited(phone: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("appointments")
    .select("id, customers!inner(phone)", { count: "exact", head: true })
    .eq("customers.phone", phone)
    .gte("created_at", minutesAgoIso(BOOKING_WINDOW_MINUTES));

  return (count ?? 0) >= BOOKING_MAX_ATTEMPTS;
}

export async function isContactRateLimited(contact: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("contact", contact)
    .gte("created_at", minutesAgoIso(CONTACT_WINDOW_MINUTES));

  return (count ?? 0) >= CONTACT_MAX_ATTEMPTS;
}

export async function isReviewRateLimited(authorName: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("author_name", authorName)
    .gte("created_at", minutesAgoIso(REVIEW_WINDOW_MINUTES));

  return (count ?? 0) >= REVIEW_MAX_ATTEMPTS;
}
