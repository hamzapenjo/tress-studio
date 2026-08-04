"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Osluskuje Supabase Realtime promjene na navedenim tabelama i poziva
 * router.refresh() kad god se nesto promijeni - tako se server-rendered
 * sadrzaj na trenutnoj stranici automatski osvjezi bez rucnog reload-a,
 * cak i kad je promjena nastala iz druge sesije/taba (npr. admin odobri
 * recenziju dok posjetilac vec ima otvorenu pocetnu stranicu).
 */
export function LiveRefresh({ tables }: { tables: string[] }) {
  const router = useRouter();
  const key = tables.join(",");

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;

    // Realtime mora dobiti korisnikov JWT eksplicitno - kolacici nose
    // sesiju za obicne upite, ali ne i za realtime socket, pa bez ovoga
    // RLS sakriva redove koji zahtijevaju "authenticated" (npr. neodobrene
    // recenzije) od admin sesija koje koriste ovaj hook.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session) supabase.realtime.setAuth(session.access_token);

      channel = supabase.channel(`live-refresh-${key}`);
      for (const table of tables) {
        channel.on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          () => router.refresh()
        );
      }
      channel.subscribe();
    });

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}
