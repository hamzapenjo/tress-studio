-- Katalog frizura (dio Galerije), npr. "High Fade Buzz Cut" - jedna slika
-- po frizuri koja vec sadrzi sva tri ugla (front/back/side kolaz).
create table if not exists public.hairstyle_looks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.hairstyle_looks enable row level security;

create policy "hairstyle_looks_public_read" on public.hairstyle_looks
  for select using (true);

create policy "hairstyle_looks_admin_write" on public.hairstyle_looks
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
