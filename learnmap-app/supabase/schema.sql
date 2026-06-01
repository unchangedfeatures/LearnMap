-- LearnMap MVP schema (Phase 1)
-- Paste into Supabase SQL editor.

-- Extensions
create extension if not exists "pgcrypto";

-- Enums via CHECK constraints (simple MVP)

-- PROFILES
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  age_group text,
  learning_style text,
  goal text,
  extra_context text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ROADMAPS
create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  topic text not null,
  title text not null,
  description text not null,
  persona jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists roadmaps_user_created_at
  on public.roadmaps(user_id, created_at desc);

-- CHAPTERS
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  roadmap_id uuid not null references public.roadmaps(id) on delete cascade,
  position int not null,
  title text not null,
  description text not null default '',
  status text not null check (status in ('locked','available','ready_for_quiz','complete')),
  created_at timestamptz not null default now()
);

create unique index if not exists chapters_roadmap_position_unique
  on public.chapters(roadmap_id, position);

-- GUIDES
create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  position int not null,
  title text not null,
  status text not null check (status in ('locked','available','complete')),
  content_md text,
  created_at timestamptz not null default now()
);

create unique index if not exists guides_chapter_position_unique
  on public.guides(chapter_id, position);

-- QUIZZES (stub for later phases)
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  status text not null check (status in ('locked','available','complete')),
  payload jsonb,
  created_at timestamptz not null default now()
);

-- One quiz row per chapter (supports caching/upsert)
create unique index if not exists quizzes_chapter_unique
  on public.quizzes(chapter_id);

-- PROGRESS (minimal MVP)
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  guide_id uuid references public.guides(id) on delete cascade,
  status text not null default 'complete',
  xp int not null default 0,
  created_at timestamptz not null default now()
);

-- Prevent duplicate progress rows per guide per user
create unique index if not exists progress_user_guide_unique
  on public.progress(user_id, guide_id);

-- Updated-at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.roadmaps enable row level security;
alter table public.chapters enable row level security;
alter table public.guides enable row level security;
alter table public.quizzes enable row level security;
alter table public.progress enable row level security;

-- PROFILES policies
create policy "profiles_select_own" on public.profiles
for select using (user_id = auth.uid());

create policy "profiles_insert_own" on public.profiles
for insert with check (user_id = auth.uid());

create policy "profiles_update_own" on public.profiles
for update using (user_id = auth.uid());

-- ROADMAPS policies
create policy "roadmaps_select_own" on public.roadmaps
for select using (user_id = auth.uid());

create policy "roadmaps_insert_own" on public.roadmaps
for insert with check (user_id = auth.uid());

create policy "roadmaps_update_own" on public.roadmaps
for update using (user_id = auth.uid());

-- CHAPTERS policies (via roadmap ownership)
create policy "chapters_select_own" on public.chapters
for select using (
  exists (
    select 1 from public.roadmaps r
    where r.id = chapters.roadmap_id and r.user_id = auth.uid()
  )
);

create policy "chapters_insert_own" on public.chapters
for insert with check (
  exists (
    select 1 from public.roadmaps r
    where r.id = chapters.roadmap_id and r.user_id = auth.uid()
  )
);

create policy "chapters_update_own" on public.chapters
for update using (
  exists (
    select 1 from public.roadmaps r
    where r.id = chapters.roadmap_id and r.user_id = auth.uid()
  )
);

-- GUIDES policies (via chapter -> roadmap ownership)
create policy "guides_select_own" on public.guides
for select using (
  exists (
    select 1
    from public.chapters c
    join public.roadmaps r on r.id = c.roadmap_id
    where c.id = guides.chapter_id and r.user_id = auth.uid()
  )
);

create policy "guides_insert_own" on public.guides
for insert with check (
  exists (
    select 1
    from public.chapters c
    join public.roadmaps r on r.id = c.roadmap_id
    where c.id = guides.chapter_id and r.user_id = auth.uid()
  )
);

create policy "guides_update_own" on public.guides
for update using (
  exists (
    select 1
    from public.chapters c
    join public.roadmaps r on r.id = c.roadmap_id
    where c.id = guides.chapter_id and r.user_id = auth.uid()
  )
);

-- QUIZZES policies
create policy "quizzes_select_own" on public.quizzes
for select using (
  exists (
    select 1
    from public.chapters c
    join public.roadmaps r on r.id = c.roadmap_id
    where c.id = quizzes.chapter_id and r.user_id = auth.uid()
  )
);

create policy "quizzes_insert_own" on public.quizzes
for insert with check (
  exists (
    select 1
    from public.chapters c
    join public.roadmaps r on r.id = c.roadmap_id
    where c.id = quizzes.chapter_id and r.user_id = auth.uid()
  )
);

create policy "quizzes_update_own" on public.quizzes
for update using (
  exists (
    select 1
    from public.chapters c
    join public.roadmaps r on r.id = c.roadmap_id
    where c.id = quizzes.chapter_id and r.user_id = auth.uid()
  )
);

-- PROGRESS policies
create policy "progress_select_own" on public.progress
for select using (user_id = auth.uid());

create policy "progress_insert_own" on public.progress
for insert with check (user_id = auth.uid());

create policy "progress_update_own" on public.progress
for update using (user_id = auth.uid());
