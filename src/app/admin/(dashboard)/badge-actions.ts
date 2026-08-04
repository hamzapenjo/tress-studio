"use server";

import { createClient } from "@/lib/supabase/server";

export interface AdminBadgeCounts {
  termini: number;
  poruke: number;
  recenzije: number;
}

export async function getAdminBadgeCounts(): Promise<AdminBadgeCounts> {
  const supabase = await createClient();

  const [{ count: termini }, { count: poruke }, { count: recenzije }] =
    await Promise.all([
      supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("seen", false),
      supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("read", false),
      supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("approved", false),
    ]);

  return {
    termini: termini ?? 0,
    poruke: poruke ?? 0,
    recenzije: recenzije ?? 0,
  };
}
