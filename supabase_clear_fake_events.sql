-- Funkytown Fit — Clear fake/test events from the community_events table
--
-- INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Paste and run this entire script
--
-- This removes ALL events currently in the community_events table.
-- Going forward, events come exclusively from the Eventbrite API (real events only).
-- If you want to add a specific curated event yourself, use the Supabase Table Editor
-- to insert it directly — just make sure it's a real event.
--
-- SAFE TO RUN — only deletes from community_events and related RSVPs.

-- Step 1: Remove all RSVPs first (foreign key dependency)
delete from event_rsvps;

-- Step 2: Remove all events
delete from community_events;

-- Step 3: Verify
select
  (select count(*) from community_events) as events_remaining,
  (select count(*) from event_rsvps)      as rsvps_remaining;
-- Expected result: events_remaining = 0, rsvps_remaining = 0
