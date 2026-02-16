-- Create the public storage bucket for project images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Allow anyone to read images (public bucket)
create policy "Public read access"
on storage.objects for select
using (bucket_id = 'project-images');

-- Allow anyone to upload images (for member/admin project uploads)
create policy "Public insert access"
on storage.objects for insert
with check (bucket_id = 'project-images');
