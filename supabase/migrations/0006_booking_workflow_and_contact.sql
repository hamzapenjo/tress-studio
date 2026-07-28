-- Novi status workflow za termine: na_cekanju (default) -> potvrdjeno -> zavrseno,
-- ili otkazano u bilo kojem trenutku. Postojeci "zakazano" termini postaju "potvrdjeno".
alter table public.appointments drop constraint if exists appointments_status_check;

update public.appointments set status = 'potvrdjeno' where status = 'zakazano';

alter table public.appointments
  alter column status set default 'na_cekanju';

alter table public.appointments
  add constraint appointments_status_check
  check (status in ('na_cekanju', 'potvrdjeno', 'zavrseno', 'otkazano'));

-- Poruke sa kontakt forme.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "messages_admin_only" on public.messages
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Slike u galeriji - vodimo ih u bazi (kategorija, prije/poslije parovi)
-- umjesto samo sirovog listinga Storage foldera.
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  category text not null default 'Ostalo',
  pair_key text,
  pair_label text check (pair_label in ('prije', 'poslije')),
  created_at timestamptz not null default now()
);

alter table public.gallery_images enable row level security;

create policy "gallery_images_public_read" on public.gallery_images
  for select using (true);

create policy "gallery_images_admin_write" on public.gallery_images
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Kratak opis/biografija clana tima.
alter table public.staff
  add column if not exists bio text;
