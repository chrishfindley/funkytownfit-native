-- ============================================================
-- Funkytown Fit — Community Platform Migration
-- Run this in Supabase: Dashboard → SQL Editor → New query
-- ============================================================

-- ─── 1. community_posts ──────────────────────────────────────────────────────
-- post_type: 'text' | 'achievement' | 'place' | 'playlist' | 'event' | 'question'
create table if not exists community_posts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  author_name     text,                        -- cached for display
  post_type       text not null default 'text',
  content         text,                        -- main text body
  image_url       text,                        -- optional photo
  place_id        text,                        -- FW place id (local data)
  place_name      text,                        -- cached for display
  achievement_tag text,                        -- e.g. 'pr', 'streak', 'goal'
  playlist_name   text,
  playlist_url    text,
  event_id        uuid,                        -- ref to community_events
  like_count      integer not null default 0,
  comment_count   integer not null default 0,
  created_at      timestamptz default now()
);

create index if not exists idx_posts_user    on community_posts(user_id);
create index if not exists idx_posts_created on community_posts(created_at desc);
create index if not exists idx_posts_type    on community_posts(post_type);

-- ─── 2. post_likes ────────────────────────────────────────────────────────────
create table if not exists post_likes (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references community_posts(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(post_id, user_id)
);

create index if not exists idx_likes_post on post_likes(post_id);
create index if not exists idx_likes_user on post_likes(user_id);

-- ─── 3. post_comments ─────────────────────────────────────────────────────────
create table if not exists post_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references community_posts(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  author_name text,
  content    text not null,
  created_at timestamptz default now()
);

create index if not exists idx_comments_post on post_comments(post_id);

-- ─── 4. user_follows ──────────────────────────────────────────────────────────
-- follow_type: 'user' | 'gym' | 'restaurant' | 'place'
create table if not exists user_follows (
  id             uuid primary key default gen_random_uuid(),
  follower_id    uuid not null references auth.users(id) on delete cascade,
  following_id   uuid,                        -- null for non-user follows
  following_type text not null default 'user',
  following_name text,                        -- cached for non-user follows
  created_at     timestamptz default now(),
  unique(follower_id, following_id, following_type)
);

create index if not exists idx_follows_follower  on user_follows(follower_id);
create index if not exists idx_follows_following on user_follows(following_id);

-- ─── 5. community_events ──────────────────────────────────────────────────────
-- event_type: 'fitness' | 'food' | 'fun' | 'community'
create table if not exists community_events (
  id           uuid primary key default gen_random_uuid(),
  created_by   uuid references auth.users(id) on delete set null,
  title        text not null,
  description  text,
  event_type   text not null default 'fun',
  event_date   date not null,
  event_time   text,                          -- e.g. "7:00 AM" or "6:00–8:00 PM"
  location     text,
  address      text,
  lat          double precision,
  lng          double precision,
  image_url    text,
  external_url text,
  rsvp_count   integer not null default 0,
  is_featured  boolean not null default false,
  created_at   timestamptz default now()
);

create index if not exists idx_events_date on community_events(event_date asc);
create index if not exists idx_events_type on community_events(event_type);

-- ─── 6. event_rsvps ───────────────────────────────────────────────────────────
create table if not exists event_rsvps (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references community_events(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(event_id, user_id)
);

create index if not exists idx_rsvps_event on event_rsvps(event_id);
create index if not exists idx_rsvps_user  on event_rsvps(user_id);

-- ─── 7. RLS: community_posts ──────────────────────────────────────────────────
alter table community_posts enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='community_posts' and policyname='posts_select') then
    execute $p$ create policy "posts_select" on community_posts for select using (auth.uid() is not null); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='community_posts' and policyname='posts_insert') then
    execute $p$ create policy "posts_insert" on community_posts for insert with check (auth.uid() = user_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='community_posts' and policyname='posts_update') then
    execute $p$ create policy "posts_update" on community_posts for update using (auth.uid() = user_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='community_posts' and policyname='posts_delete') then
    execute $p$ create policy "posts_delete" on community_posts for delete using (auth.uid() = user_id); $p$;
  end if;
end $$;

-- ─── 8. RLS: post_likes ───────────────────────────────────────────────────────
alter table post_likes enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='post_likes' and policyname='likes_select') then
    execute $p$ create policy "likes_select" on post_likes for select using (auth.uid() is not null); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='post_likes' and policyname='likes_insert') then
    execute $p$ create policy "likes_insert" on post_likes for insert with check (auth.uid() = user_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='post_likes' and policyname='likes_delete') then
    execute $p$ create policy "likes_delete" on post_likes for delete using (auth.uid() = user_id); $p$;
  end if;
end $$;

-- ─── 9. RLS: post_comments ────────────────────────────────────────────────────
alter table post_comments enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='post_comments' and policyname='comments_select') then
    execute $p$ create policy "comments_select" on post_comments for select using (auth.uid() is not null); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='post_comments' and policyname='comments_insert') then
    execute $p$ create policy "comments_insert" on post_comments for insert with check (auth.uid() = user_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='post_comments' and policyname='comments_delete') then
    execute $p$ create policy "comments_delete" on post_comments for delete using (auth.uid() = user_id); $p$;
  end if;
end $$;

-- ─── 10. RLS: user_follows ────────────────────────────────────────────────────
alter table user_follows enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='user_follows' and policyname='follows_select') then
    execute $p$ create policy "follows_select" on user_follows for select using (auth.uid() is not null); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='user_follows' and policyname='follows_insert') then
    execute $p$ create policy "follows_insert" on user_follows for insert with check (auth.uid() = follower_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='user_follows' and policyname='follows_delete') then
    execute $p$ create policy "follows_delete" on user_follows for delete using (auth.uid() = follower_id); $p$;
  end if;
end $$;

-- ─── 11. RLS: community_events ────────────────────────────────────────────────
alter table community_events enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='community_events' and policyname='events_select') then
    execute $p$ create policy "events_select" on community_events for select using (auth.uid() is not null); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='community_events' and policyname='events_insert') then
    execute $p$ create policy "events_insert" on community_events for insert with check (auth.uid() is not null); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='community_events' and policyname='events_update') then
    execute $p$ create policy "events_update" on community_events for update using (auth.uid() = created_by); $p$;
  end if;
end $$;

-- ─── 12. RLS: event_rsvps ─────────────────────────────────────────────────────
alter table event_rsvps enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='event_rsvps' and policyname='rsvps_select') then
    execute $p$ create policy "rsvps_select" on event_rsvps for select using (auth.uid() is not null); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='event_rsvps' and policyname='rsvps_insert') then
    execute $p$ create policy "rsvps_insert" on event_rsvps for insert with check (auth.uid() = user_id); $p$;
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='event_rsvps' and policyname='rsvps_delete') then
    execute $p$ create policy "rsvps_delete" on event_rsvps for delete using (auth.uid() = user_id); $p$;
  end if;
end $$;

-- ─── 13. Events: NO pre-seeded data ──────────────────────────────────────────
-- Events are 100% user-generated.  No placeholder data is inserted here
-- because we refuse to publish unverified event information.
--
-- For real-time Fort Worth event discovery, integrate one of:
--   • Eventbrite API  — https://www.eventbrite.com/platform/api
--   • Ticketmaster Discovery API — https://developer.ticketmaster.com
--   • Google Events (Knowledge Graph) — via Google Search API
--
-- Until an API integration is live, authenticated users can post events
-- themselves via the app's "Create Event" flow.  Each event is tied to
-- the user who created it and can be verified / removed by moderators.
