-- ============================================================
-- Funkytown Fit — Trainer Platform Migration
-- Run this in Supabase: Dashboard → SQL Editor → New query
-- ============================================================

-- ─── 1. trainer_client_relationships ────────────────────────
create table if not exists trainer_client_relationships (
  id            uuid primary key default gen_random_uuid(),
  trainer_id    uuid not null references auth.users(id) on delete cascade,
  client_id     uuid references auth.users(id) on delete cascade,  -- null until accepted
  invite_code   text unique not null,
  status        text not null default 'pending',  -- 'pending' | 'active' | 'removed'
  trainer_name  text,    -- cached for quick display
  client_name   text,    -- cached after acceptance
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  constraint unique_pair unique (trainer_id, client_id)
);

-- ─── 2. assigned_workouts ────────────────────────────────────
create table if not exists assigned_workouts (
  id           uuid primary key default gen_random_uuid(),
  trainer_id   uuid not null references auth.users(id) on delete cascade,
  client_id    uuid not null references auth.users(id) on delete cascade,
  title        text not null,
  coach_note   text,
  exercises    jsonb not null default '[]',
  target_date  date,
  status       text not null default 'pending',  -- 'pending' | 'completed' | 'skipped'
  assigned_at  timestamptz default now(),
  completed_at timestamptz
);

-- ─── 3. RLS: trainer_client_relationships ────────────────────
alter table trainer_client_relationships enable row level security;

-- Trainer and client can see their own relationships.
-- Any authenticated user can see PENDING rows with no client yet (to accept by code).
create policy "tcr_select" on trainer_client_relationships
  for select using (
    auth.uid() = trainer_id
    or auth.uid() = client_id
    or (status = 'pending' and client_id is null)
  );

-- Only the trainer can create an invite
create policy "tcr_insert" on trainer_client_relationships
  for insert with check (auth.uid() = trainer_id);

-- Trainer can update anything in their rows.
-- Any authenticated user can accept a pending invite (sets client_id).
create policy "tcr_update" on trainer_client_relationships
  for update using (
    auth.uid() = trainer_id
    or (status = 'pending' and client_id is null)
  );

-- ─── 4. RLS: assigned_workouts ───────────────────────────────
alter table assigned_workouts enable row level security;

create policy "aw_select" on assigned_workouts
  for select using (auth.uid() = trainer_id or auth.uid() = client_id);

create policy "aw_insert" on assigned_workouts
  for insert with check (auth.uid() = trainer_id);

create policy "aw_update" on assigned_workouts
  for update using (auth.uid() = trainer_id or auth.uid() = client_id);

-- ─── 5. Allow trainers to read clients' data ─────────────────
-- NOTE: If these tables already have a "user can read own rows" policy,
-- you may need to DROP the old policy first, then recreate it.
-- Check your existing policies in Dashboard → Authentication → Policies.

-- Profiles: trainers can read active clients' profiles
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename='profiles' and policyname='trainer_read_client_profiles'
  ) then
    execute $policy$
      create policy "trainer_read_client_profiles" on profiles
        for select using (
          auth.uid() = id
          or exists (
            select 1 from trainer_client_relationships tcr
            where tcr.trainer_id = auth.uid()
              and tcr.client_id  = profiles.id
              and tcr.status     = 'active'
          )
        );
    $policy$;
  end if;
end $$;

-- Workout logs: trainers can read active clients' logs
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename='workout_logs' and policyname='trainer_read_client_workout_logs'
  ) then
    execute $policy$
      create policy "trainer_read_client_workout_logs" on workout_logs
        for select using (
          auth.uid() = user_id
          or exists (
            select 1 from trainer_client_relationships tcr
            where tcr.trainer_id = auth.uid()
              and tcr.client_id  = workout_logs.user_id
              and tcr.status     = 'active'
          )
        );
    $policy$;
  end if;
end $$;

-- Food log: trainers can read active clients' nutrition
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename='food_log' and policyname='trainer_read_client_food_log'
  ) then
    execute $policy$
      create policy "trainer_read_client_food_log" on food_log
        for select using (
          auth.uid() = user_id
          or exists (
            select 1 from trainer_client_relationships tcr
            where tcr.trainer_id = auth.uid()
              and tcr.client_id  = food_log.user_id
              and tcr.status     = 'active'
          )
        );
    $policy$;
  end if;
end $$;

-- Weight log: trainers can read active clients' weight history
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename='weight_log' and policyname='trainer_read_client_weight_log'
  ) then
    execute $policy$
      create policy "trainer_read_client_weight_log" on weight_log
        for select using (
          auth.uid() = user_id
          or exists (
            select 1 from trainer_client_relationships tcr
            where tcr.trainer_id = auth.uid()
              and tcr.client_id  = weight_log.user_id
              and tcr.status     = 'active'
          )
        );
    $policy$;
  end if;
end $$;
