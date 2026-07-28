-- Javno citanje liste/fajlova iz "gallery" storage bucketa.
-- Upload/brisanje slika radi vlasnica direktno kroz Supabase Studio (Storage UI),
-- koji koristi dashboard-ovu sesiju i ne podlijeze ovoj RLS provjeri.

create policy "gallery_public_read" on storage.objects
  for select using (bucket_id = 'gallery');
