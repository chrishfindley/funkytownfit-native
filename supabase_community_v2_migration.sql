-- ============================================================
-- Funkytown Fit — Community v2: Social Graph + Messaging
-- Run AFTER supabase_community_migration.sql
-- Dashboard → SQL Editor → New query
-- ============================================================

-- ─── 1. friendships ──────────────────────────────────────────────────────────
-- Mutual friend requests.  status: 'pending' | 'accepted' | 'declined' | 'blocked'
-- requester_id sends the request; addressee_id receives it.
create table if not exists friendships (
  id             uuid primary key default gen_random_uuid(),
  requester_id   uuid not null references auth.users(id) on delete cascade,
  addressee_id   uuid not null references auth.users(id) on delete cascade,
  status         text not null default 'pending',
  requester_name text,    -- cached for quick display
  addressee_name text,    -- cached for quick display
  created_at     timestamptz default now(),
  updated_at     timestamptz default now(),
  constraint friendships_pair unique (requester_id, addressee_id),
  constraint no_self_friend check (requester_id <> addressee_id)
);

create index if not exists idx_friendships_req  on friendships(requester_id);
create index if not exists idx_friendships_addr on friendships(addressee_id);
create index if not exists idx_friendships_status on friendships(status);

-- ─── 2. fit_partnerships ─────────────────────────────────────────────────────
-- Opt-in data-sharing between two friends.
-- shared_data jsonb: { workouts: true, nutrition: true, weight: true }
-- status: 'pending' | 'active' | 'paused' | 'removed'
create table if not exists fit_partnerships (
  id            uuid primary key default gen_random_uuid(),
  requester_id  uuid not null references auth.users(id) on delete cascade,
  partner_id    uuid not null references auth.users(id) on delete cascade,
  status        text not null default 'pending',
  shared_data   jsonb not null default '{"workouts": true, "nutrition": true, "weight": false}',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  constraint fit_pair unique (requester_id, partner_id),
  constraint no_self_partner check (requester_id <> partner_id)
);

create index if not exists idx_fp_requester on fit_partnerships(requester_id);
create index if not exists idx_fp_partner   on fit_partnerships(partner_id);
create index if not exists idx_fp_status    on fit_partnerships(status);

-- ─── 3. conversations ────────────────────────────────────────────────────────
-- conv_type: 'friend' | 'trainer_client'
-- participant1_id / participant2_id always stored lo-uuid first for uniqueness
create table if not exists conversations (
  id               uuid primary key default gen_random_uuid(),
  conv_type        text not null default 'friend',
  participant1_id  uuid not null references auth.users(id) on delete cascade,
  participant2_id  uuid not null references auth.users(id) on delete cascade,
  participant1_name text,
  participant2_name text,
  last_message     text,
  last_message_at  timestamptz,
  unread_p1        integer not null default 0,  -- unread count for participant1
  unread_p2        integer not null default 0,  -- unread count for participant2
  created_at       timestamptz default now(),
  constraint unique_convo unique (participant1_id, participant2_id),
  constraint no_self_convo check (participant1_id <> participant2_id)
);

create index if not exists idx_convos_p1 on conversations(participant1_id);
create index if not exists idx_convos_p2 on conversations(participant2_id);

-- ─── 4. messages ─────────────────────────────────────────────────────────────
create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id       uuid not null references auth.users(id) on delete cascade,
  sender_name     text,
  content         text not null,
  read_at         timestamptz,    -- null = unread
  created_at      timestamptz default now()
);

create index if not exists idx_msgs_convo  on messages(conversation_id);
create index if not exists idx_msgs_sender on messages(sender_id);
create index if not exists idx_msgs_created on messages(created_at desc);

-- ─── 5. RLS: friendships ─────────────────────────────────────────────────────
alter table friendships enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='friendships' and policyname='friendships_select') then
    execute $p$ create policy "friendships_select" on friendships for select using (auth.uid() = requester_id or auth.uid() = addressee_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='friendships' and policyname='friendships_insert') then
    execute $p$ create policy "friendships_insert" on friendships for insert with check (auth.uid() = requester_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='friendships' and policyname='friendships_update') then
    execute $p$ create policy "friendships_update" on friendships for update using (auth.uid() = requester_id or auth.uid() = addressee_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='friendships' and policyname='friendships_delete') then
    execute $p$ create policy "friendships_delete" on friendships for delete using (auth.uid() = requester_id or auth.uid() = addressee_id); $p$;
  end if;
end $$;

-- ─── 6. RLS: fit_partnerships ────────────────────────────────────────────────
alter table fit_partnerships enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='fit_partnerships' and policyname='fp_select') then
    execute $p$ create policy "fp_select" on fit_partnerships for select using (auth.uid() = requester_id or auth.uid() = partner_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='fit_partnerships' and policyname='fp_insert') then
    execute $p$ create policy "fp_insert" on fit_partnerships for insert with check (auth.uid() = requester_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='fit_partnerships' and policyname='fp_update') then
    execute $p$ create policy "fp_update" on fit_partnerships for update using (auth.uid() = requester_id or auth.uid() = partner_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='fit_partnerships' and policyname='fp_delete') then
    execute $p$ create policy "fp_delete" on fit_partnerships for delete using (auth.uid() = requester_id or auth.uid() = partner_id); $p$;
  end if;
end $$;

-- ─── 7. RLS: conversations ───────────────────────────────────────────────────
alter table conversations enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='conversations' and policyname='convos_select') then
    execute $p$ create policy "convos_select" on conversations for select using (auth.uid() = participant1_id or auth.uid() = participant2_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='conversations' and policyname='convos_insert') then
    execute $p$ create policy "convos_insert" on conversations for insert with check (auth.uid() = participant1_id or auth.uid() = participant2_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='conversations' and policyname='convos_update') then
    execute $p$ create policy "convos_update" on conversations for update using (auth.uid() = participant1_id or auth.uid() = participant2_id); $p$;
  end if;
end $$;

-- ─── 8. RLS: messages ────────────────────────────────────────────────────────
alter table messages enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='messages' and policyname='msgs_select') then
    execute $p$ create policy "msgs_select" on messages for select using (
      exists (
        select 1 from conversations c
        where c.id = messages.conversation_id
          and (c.participant1_id = auth.uid() or c.participant2_id = auth.uid())
      )
    ); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='messages' and policyname='msgs_insert') then
    execute $p$ create policy "msgs_insert" on messages for insert with check (auth.uid() = sender_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='messages' and policyname='msgs_update') then
    execute $p$ create policy "msgs_update" on messages for update using (auth.uid() = sender_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='messages' and policyname='msgs_delete') then
    execute $p$ create policy "msgs_delete" on messages for delete using (auth.uid() = sender_id); $p$;
  end if;
end $$;

-- ─── 9. Fit-partner data access: extend existing RLS ─────────────────────────
-- Allow fit partners to read each other's workout_logs, food_log, weight_log.
-- These are wrapped in DO blocks so they're safe to re-run.

-- Workout logs: fit partners can read each other's logs
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename='workout_logs' and policyname='fit_partner_read_workout_logs'
  ) then
    execute $policy$
      create policy "fit_partner_read_workout_logs" on workout_logs
        for select using (
          auth.uid() = user_id
          or exists (
            select 1 from fit_partnerships fp
            where fp.status = 'active'
              and (fp.shared_data->>'workouts')::boolean = true
              and (
                (fp.requester_id = auth.uid() and fp.partner_id = workout_logs.user_id)
                or (fp.partner_id = auth.uid() and fp.requester_id = workout_logs.user_id)
              )
          )
        );
    $policy$;
  end if;
end $$;

-- Food log: fit partners can read each other's nutrition (if opted in)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename='food_log' and policyname='fit_partner_read_food_log'
  ) then
    execute $policy$
      create policy "fit_partner_read_food_log" on food_log
        for select using (
          auth.uid() = user_id
          or exists (
            select 1 from fit_partnerships fp
            where fp.status = 'active'
              and (fp.shared_data->>'nutrition')::boolean = true
              and (
                (fp.requester_id = auth.uid() and fp.partner_id = food_log.user_id)
                or (fp.partner_id = auth.uid() and fp.requester_id = food_log.user_id)
              )
          )
        );
    $policy$;
  end if;
end $$;

-- Weight log: fit partners can read each other's weight (if opted in)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename='weight_log' and policyname='fit_partner_read_weight_log'
  ) then
    execute $policy$
      create policy "fit_partner_read_weight_log" on weight_log
        for select using (
          auth.uid() = user_id
          or exists (
            select 1 from fit_partnerships fp
            where fp.status = 'active'
              and (fp.shared_data->>'weight')::boolean = true
              and (
                (fp.requester_id = auth.uid() and fp.partner_id = weight_log.user_id)
                or (fp.partner_id = auth.uid() and fp.requester_id = weight_log.user_id)
              )
          )
        );
    $policy$;
  end if;
end $$;
