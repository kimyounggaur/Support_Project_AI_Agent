alter table public.grant_documents
  add column if not exists extracted_text text,
  add column if not exists analysis_summary text,
  add column if not exists analysis_json jsonb not null default '{}'::jsonb,
  add column if not exists analysis_error text;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'grant-documents',
  'grant-documents',
  false,
  6291456,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown'
  ]::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can upload own grant document files"
on storage.objects;

create policy "Users can upload own grant document files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'grant-documents'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can view own grant document files"
on storage.objects;

create policy "Users can view own grant document files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'grant-documents'
  and (
    owner_id = (select auth.uid()::text)
    or (storage.foldername(name))[1] = (select auth.uid()::text)
  )
);

drop policy if exists "Users can update own grant document files"
on storage.objects;

create policy "Users can update own grant document files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'grant-documents'
  and (
    owner_id = (select auth.uid()::text)
    or (storage.foldername(name))[1] = (select auth.uid()::text)
  )
)
with check (
  bucket_id = 'grant-documents'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can delete own grant document files"
on storage.objects;

create policy "Users can delete own grant document files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'grant-documents'
  and (
    owner_id = (select auth.uid()::text)
    or (storage.foldername(name))[1] = (select auth.uid()::text)
  )
);
