create type public.grant_notice_status as enum (
  'draft',
  'ready_for_analysis',
  'analyzed',
  'archived'
);

create table public.grant_notices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source_text text,
  source_url text,
  status public.grant_notice_status not null default 'draft',
  source_hash text,
  deadline_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.grant_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  grant_notice_id uuid not null references public.grant_notices(id) on delete cascade,
  storage_path text not null,
  original_filename text not null,
  mime_type text not null,
  size_bytes bigint not null,
  sha256 text,
  openai_file_id text,
  vector_store_id text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.grant_notices enable row level security;
alter table public.grant_documents enable row level security;

grant select, insert, update, delete on public.grant_notices to authenticated;
grant select, insert, update, delete on public.grant_documents to authenticated;

create policy "Users can view own grant notices"
on public.grant_notices
for select
to authenticated
using (auth.uid() = owner_id);

create policy "Users can insert own grant notices"
on public.grant_notices
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "Users can update own grant notices"
on public.grant_notices
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Users can delete own grant notices"
on public.grant_notices
for delete
to authenticated
using (auth.uid() = owner_id);

create policy "Users can view own grant documents"
on public.grant_documents
for select
to authenticated
using (auth.uid() = owner_id);

create policy "Users can insert own grant documents"
on public.grant_documents
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "Users can update own grant documents"
on public.grant_documents
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Users can delete own grant documents"
on public.grant_documents
for delete
to authenticated
using (auth.uid() = owner_id);
