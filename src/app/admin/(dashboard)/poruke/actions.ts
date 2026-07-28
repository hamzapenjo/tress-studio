"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  await supabase.from("messages").delete().eq("id", id);
  revalidatePath("/admin/poruke");
}

export async function markMessagesRead() {
  const supabase = await createClient();
  await supabase.from("messages").update({ read: true }).eq("read", false);
}
