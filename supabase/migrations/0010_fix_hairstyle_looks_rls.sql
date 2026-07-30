-- Popravka: javno citanje frizura nije radilo (anon upiti su vracali 0
-- redova iako su redovi postojali) - vjerovatno "create policy" nije
-- prosao pri prvom pokretanju 0009. Ponovo postavljamo politike na siguran,
-- idempotentan nacin.
alter table public.hairstyle_looks enable row level security;

drop policy if exists "hairstyle_looks_public_read" on public.hairstyle_looks;
drop policy if exists "hairstyle_looks_admin_write" on public.hairstyle_looks;

create policy "hairstyle_looks_public_read" on public.hairstyle_looks
  for select using (true);

create policy "hairstyle_looks_admin_write" on public.hairstyle_looks
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
