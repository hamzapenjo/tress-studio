-- Omogucava Supabase Realtime (postgres_changes) za tabele koje admin
-- sidebar prati radi live badge brojaca (nove/nepregledane stavke).
-- Idempotentno - sigurno za ponovno pokretanje.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'appointments'
  ) then
    alter publication supabase_realtime add table public.appointments;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'reviews'
  ) then
    alter publication supabase_realtime add table public.reviews;
  end if;
end $$;
