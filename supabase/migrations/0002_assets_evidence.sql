create table public.assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  category text not null,
  title text not null,
  url text not null check (url ~ '^https?://'),
  description text not null,
  verification_status public.verification_status not null default 'needs_review',
  is_representative boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.evidence_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete set null,
  label text not null,
  value text not null default '',
  source_type text not null check (
    source_type in ('user_input', 'asset', 'grant_notice', 'document')
  ),
  verification_status public.verification_status not null default 'needs_review',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.assets enable row level security;
alter table public.evidence_items enable row level security;

grant select, insert, update, delete on public.assets to authenticated;
grant select, insert, update, delete on public.evidence_items to authenticated;

create policy "Users can view own assets"
on public.assets
for select
to authenticated
using (auth.uid() = owner_id);

create policy "Users can insert own assets"
on public.assets
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "Users can update own assets"
on public.assets
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Users can delete own assets"
on public.assets
for delete
to authenticated
using (auth.uid() = owner_id);

create policy "Users can view own evidence"
on public.evidence_items
for select
to authenticated
using (auth.uid() = owner_id);

create policy "Users can insert own evidence"
on public.evidence_items
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "Users can update own evidence"
on public.evidence_items
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Users can delete own evidence"
on public.evidence_items
for delete
to authenticated
using (auth.uid() = owner_id);
