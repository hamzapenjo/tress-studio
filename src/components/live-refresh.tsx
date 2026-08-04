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
    const supabase = createClient();
    const channel = supabase.channel(`live-refresh-${key}`);

    for (const table of tables) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => router.refresh()
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}
