create type public.ai_run_status as enum (
  'started',
  'succeeded',
  'failed'
);

create table public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  task_name text not null,
  prompt_version text not null,
  model text not null,
  status public.ai_run_status not null default 'started',
  source_hash text,
  input_hash text,
  output_hash text,
  token_input integer,
  token_output integer,
  latency_ms integer,
  safety_error text,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.ai_citations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  ai_run_id uuid references public.ai_runs(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  source_type text not null,
  source_id uuid,
  source_label text,
  locator text,
  quote text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.ai_runs enable row level security;
alter table public.ai_citations enable row level security;

grant select, insert, update on public.ai_runs to authenticated;
grant select, insert on public.ai_citations to authenticated;

create policy "Users can view own AI runs"
on public.ai_runs
for select
to authenticated
using (auth.uid() = owner_id);

create policy "Users can insert own AI runs"
on public.ai_runs
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "Users can update own AI runs"
on public.ai_runs
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Users can view own AI citations"
on public.ai_citations
for select
to authenticated
using (auth.uid() = owner_id);

create policy "Users can insert own AI citations"
on public.ai_citations
for insert
to authenticated
with check (auth.uid() = owner_id);
