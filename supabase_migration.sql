-- ─────────────────────────────────────────────────────────────────────────────
-- Funkytown Fit — Supabase Database Migration (idempotent — safe to re-run)
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────


-- ── Profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                  UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name                TEXT,
  age                 INTEGER,
  sex                 TEXT,
  height_cm           REAL,
  weight_kg           REAL,
  goals               JSONB       DEFAULT '[]',
  primary_goal        TEXT,
  training_background TEXT,
  exercise_types      JSONB       DEFAULT '[]',
  equipment           TEXT,
  days_per_week       INTEGER,
  minutes_per_session INTEGER,
  injuries            TEXT,
  music_style         TEXT,
  music_vibe_detail   TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their profile" ON profiles;
CREATE POLICY "Users own their profile"
  ON profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ── Workout Logs ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workout_logs (
  id               TEXT        PRIMARY KEY,
  user_id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date             TEXT        NOT NULL,
  day_label        TEXT,
  exercises        JSONB       DEFAULT '[]',
  duration_minutes INTEGER,
  completed_at     TIMESTAMPTZ,
  synced_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS workout_logs_user_date ON workout_logs(user_id, date DESC);
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their workout logs" ON workout_logs;
CREATE POLICY "Users own their workout logs"
  ON workout_logs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── Food Log ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS food_log (
  id           TEXT        PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date         TEXT        NOT NULL,
  name         TEXT,
  calories     REAL,
  protein_g    REAL,
  carbs_g      REAL,
  fat_g        REAL,
  serving_size TEXT,
  meal         TEXT,
  logged_at    TIMESTAMPTZ,
  synced_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS food_log_user_date ON food_log(user_id, date DESC);
ALTER TABLE food_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their food log" ON food_log;
CREATE POLICY "Users own their food log"
  ON food_log FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── Weight Log ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weight_log (
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date       TEXT        NOT NULL,
  weight_lbs REAL        NOT NULL,
  logged_at  TIMESTAMPTZ,
  synced_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, date)
);

ALTER TABLE weight_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their weight log" ON weight_log;
CREATE POLICY "Users own their weight log"
  ON weight_log FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── Water Log ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS water_log (
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date       TEXT        NOT NULL,
  oz_logged  REAL        DEFAULT 0,
  synced_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, date)
);

ALTER TABLE water_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their water log" ON water_log;
CREATE POLICY "Users own their water log"
  ON water_log FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── Streaks ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS streaks (
  user_id           UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  current           INTEGER     DEFAULT 0,
  longest           INTEGER     DEFAULT 0,
  last_workout_date TEXT,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their streak" ON streaks;
CREATE POLICY "Users own their streak"
  ON streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- Done! All 6 tables created with Row Level Security.
-- Each user can only read and write their own data.
-- ─────────────────────────────────────────────────────────────────────────────
