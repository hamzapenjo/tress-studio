import { createClient } from "@/lib/supabase/server";
import { MarkMessagesRead } from "@/components/mark-messages-read";
import { linkDangerClass } from "@/components/admin/field-styles";
import { deleteMessage } from "./actions";

export default async function AdminPorukePage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <MarkMessagesRead />
      <h1 className="font-display text-2xl italic">Poruke</h1>

      <div className="flex flex-col gap-3">
        {(messages ?? []).map((message) => (
          <div
            key={message.id}
            className={`flex flex-col gap-2 border p-5 ${
              message.read ? "border-ink/10" : "border-brass/40 bg-brass/[0.06]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-ink">{message.name}</span>
                <span className="text-ink-dim">· {message.contact}</span>
                {!message.read && (
                  <span className="border border-brass/50 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.05em] text-brass uppercase">
                    Novo
                  </span>
                )}
              </div>
              <span className="font-mono text-xs text-ink-dim">
                {new Date(message.created_at).toLocaleString("bs-BA")}
              </span>
            </div>
            <p className="text-sm text-ink-dim whitespace-pre-wrap">
              {message.body}
            </p>
            <form action={deleteMessage.bind(null, message.id)}>
              <button type="submit" className={linkDangerClass}>
                Obriši
              </button>
            </form>
          </div>
        ))}
        {(!messages || messages.length === 0) && (
          <p className="text-sm text-ink-dim">Nema poruka.</p>
        )}
      </div>
    </div>
  );
}
