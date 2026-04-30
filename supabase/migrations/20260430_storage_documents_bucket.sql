insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "documents_bucket_public_read" on storage.objects;
create policy "documents_bucket_public_read"
on storage.objects
for select
using (bucket_id = 'documents');

drop policy if exists "documents_bucket_auth_insert" on storage.objects;
create policy "documents_bucket_auth_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'documents');

drop policy if exists "documents_bucket_auth_update" on storage.objects;
create policy "documents_bucket_auth_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'documents')
with check (bucket_id = 'documents');

drop policy if exists "documents_bucket_auth_delete" on storage.objects;
create policy "documents_bucket_auth_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'documents');
