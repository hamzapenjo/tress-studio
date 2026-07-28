-- Recenzije klijenata (prikazuju se javno na naslovnoj).
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "reviews_public_read" on public.reviews
  for select using (true);

create policy "reviews_admin_write" on public.reviews
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Dodatna polja za javni prikaz clanova tima.
alter table public.staff
  add column if not exists role text,
  add column if not exists photo_url text;
