-- Oznacava da li je vlasnica salona vec vidjela termin u admin panelu
-- (koristi se za "NOVO" oznaku na terminima kreiranim preko javne stranice).
alter table public.appointments
  add column if not exists seen boolean not null default true;
