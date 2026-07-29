-- Katalog frizura sa front/back/side prikazom (dio Galerije), npr. "High Fade
-- Buzz Cut" sa tri ugla. Slike su opcione pojedinacno - admin moze dodati
-- naziv stila prvo, pa fotografije naknadno kad ih dobije.
create table if not exists public.hairstyle_looks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  front_url text,
  back_url text,
  side_url text,
  created_at timestamptz not null default now()
);

alter table public.hairstyle_looks enable row level security;

create policy "hairstyle_looks_public_read" on public.hairstyle_looks
  for select using (true);

create policy "hairstyle_looks_admin_write" on public.hairstyle_looks
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
