-- Frizerski salon: pocetna sema (services, staff, customers, appointments)
-- Pokrenuti kroz Supabase CLI (supabase db push) ili zalijepiti u SQL editor.

create extension if not exists pgcrypto;

-- ============================================================
-- services
-- ============================================================
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  category text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- staff
-- ============================================================
create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  working_hours jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- customers
-- ============================================================
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

create unique index if not exists customers_phone_key on public.customers (phone);

-- ============================================================
-- appointments
-- ============================================================
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  service_id uuid not null references public.services (id) on delete restrict,
  staff_id uuid references public.staff (id) on delete set null,
  appointment_date date not null,
  appointment_time time not null,
  status text not null default 'zakazano'
    check (status in ('zakazano', 'zavrseno', 'otkazano')),
  created_at timestamptz not null default now()
);

create index if not exists appointments_date_idx on public.appointments (appointment_date);
create index if not exists appointments_customer_idx on public.appointments (customer_id);

-- Sprijeci dupli termin za istog frizera u isto vrijeme (osim otkazanih).
create unique index if not exists appointments_no_double_booking
  on public.appointments (staff_id, appointment_date, appointment_time)
  where status <> 'otkazano';

-- ============================================================
-- Row Level Security
-- ============================================================
-- Javne stranice citaju usluge/frizere direktno preko anon kljuca.
-- Klijenti i termini se NE otvaraju anonimnim korisnicima - zakazivanje
-- ide kroz server-side rutu koja koristi service-role kljuc (vidi
-- src/lib/supabase/admin.ts), da se izbjegne izlaganje liste klijenata
-- i da se provjera dostupnosti termina radi na serveru.

alter table public.services enable row level security;
alter table public.staff enable row level security;
alter table public.customers enable row level security;
alter table public.appointments enable row level security;

create policy "services_public_read" on public.services
  for select using (true);

create policy "services_admin_write" on public.services
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "staff_public_read" on public.staff
  for select using (true);

create policy "staff_admin_write" on public.staff
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "customers_admin_only" on public.customers
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "appointments_admin_only" on public.appointments
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
