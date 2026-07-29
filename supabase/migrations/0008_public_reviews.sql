-- Javne recenzije: klijenti mogu ostaviti recenziju sa sajta, ali ide na
-- odobrenje adminu prije nego postane vidljiva (sprjecava spam/neprimjeren
-- sadrzaj da odmah bude uzivo). Admin dodane recenzije (kroz ReviewForm u
-- panelu) ostaju odmah odobrene (approved = true), postavljeno u aplikaciji.
alter table public.reviews
  add column if not exists approved boolean not null default false;

-- Postojece recenzije (koje je admin vec rucno unio) smatramo odobrenim.
update public.reviews set approved = true;

drop policy if exists "reviews_public_read" on public.reviews;

create policy "reviews_public_read" on public.reviews
  for select using (approved = true or auth.role() = 'authenticated');
