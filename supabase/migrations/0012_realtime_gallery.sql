-- Omogucava Supabase Realtime za sve tabele koje admin uredjuje a koje se
-- prikazuju na javnom sajtu (galerija/frizure/usluge/osoblje), da se javne
-- stranice same osvjeze kad admin nesto promijeni. Idempotentno - sigurno
-- za ponovno pokretanje.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'gallery_images'
  ) then
    alter publication supabase_realtime add table public.gallery_images;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'hairstyle_looks'
  ) then
    alter publication supabase_realtime add table public.hairstyle_looks;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'services'
  ) then
    alter publication supabase_realtime add table public.services;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'staff'
  ) then
    alter publication supabase_realtime add table public.staff;
  end if;
end $$;
