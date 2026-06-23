create extension if not exists pgcrypto;

create type public.verification_status as enum (
  'needs_review',
  'verified',
  'rejected'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default '웹 기반 음악·악기 교육 플랫폼',
  concept text,
  target_customers text[] not null default array[]::text[],
  problem_hypotheses text[] not null default array[]::text[],
  solution_hypotheses text[] not null default array[]::text[],
  current_stage text,
  verification_status public.verification_status not null default 'needs_review',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.business_profiles enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.business_profiles to authenticated;

create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can view own business profiles"
on public.business_profiles
for select
to authenticated
using (auth.uid() = owner_id);

create policy "Users can insert own business profiles"
on public.business_profiles
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "Users can update own business profiles"
on public.business_profiles
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Users can delete own business profiles"
on public.business_profiles
for delete
to authenticated
using (auth.uid() = owner_id);
