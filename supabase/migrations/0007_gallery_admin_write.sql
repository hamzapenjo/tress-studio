-- Dozvoljava adminu (ulogovanom kroz dashboard) da uploaduje i brise slike
-- iz "gallery" storage bucketa direktno kroz admin panel.
create policy "gallery_admin_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gallery');

create policy "gallery_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gallery');
