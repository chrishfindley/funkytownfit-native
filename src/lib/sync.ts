/**
 * Funkytown Fit — Cloud Sync
 *
 * Strategy: local-first. AsyncStorage is the source of truth for the UI.
 * Supabase is the backup / multi-device / social layer.
 *
 * pushToCloud  — called after important writes (workout done, food logged, weight logged)
 * pullFromCloud — called on login to restore data on a new device
 */

import { supabase } from './supabase';
import {
  getWorkoutLog, getFoodLog, getWeightLog, getStreak,
  getProfile, saveProfile,
  addWorkoutLog, addFoodEntry, addWeightEntry, updateStreak,
  WorkoutLogEntry, FoodLogEntry, WeightEntry,
} from './storage';

// ─── Push ─────────────────────────────────────────────────────────────────────

export async function pushToCloud(userId: string): Promise<void> {
  try {
    await Promise.all([
      pushProfile(userId),
      pushWorkoutLogs(userId),
      pushFoodLog(userId),
      pushWeightLog(userId),
      pushStreak(userId),
    ]);
  } catch (e) {
    // Silent — sync failures never block the UI
    console.warn('[sync] pushToCloud error:', e);
  }
}

async function pushProfile(userId: string) {
  const profile = await getProfile();
  if (!profile) return;
  await supabase.from('profiles').upsert({
    id: userId,
    name: profile.name,
    age: profile.age,
    sex: profile.sex,
    height_cm: profile.heightCm,
    weight_kg: profile.weightKg,
    goals: profile.goals,
    primary_goal: profile.primaryGoal,
    training_background: profile.trainingBackground,
    exercise_types: profile.exerciseTypes,
    equipment: profile.equipment,
    days_per_week: profile.daysPerWeek,
    minutes_per_session: profile.minutesPerSession,
    injuries: profile.injuries ?? null,
    music_style: profile.musicStyle ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });
}

async function pushWorkoutLogs(userId: string) {
  const logs = await getWorkoutLog();
  if (!logs.length) return;
  const rows = logs.map(l => ({
    id: l.id,
    user_id: userId,
    date: l.date,
    day_label: l.dayLabel,
    exercises: l.exercises,
    duration_minutes: l.durationMinutes,
    completed_at: l.completedAt,
  }));
  await supabase.from('workout_logs').upsert(rows, { onConflict: 'id' });
}

async function pushFoodLog(userId: string) {
  // Get all food entries across all dates (no date filter = all)
  const all = await getFoodLog();
  if (!all.length) return;
  const rows = all.map(e => ({
    id: e.id,
    user_id: userId,
    date: e.date,
    name: e.name,
    calories: e.calories,
    protein_g: e.proteinG,
    carbs_g: e.carbsG,
    fat_g: e.fatG,
    serving_size: e.servingSize ?? null,
    meal: e.meal ?? null,
    logged_at: e.loggedAt,
  }));
  await supabase.from('food_log').upsert(rows, { onConflict: 'id' });
}

async function pushWeightLog(userId: string) {
  const entries = await getWeightLog();
  if (!entries.length) return;
  const rows = entries.map(e => ({
    user_id: userId,
    date: e.date,
    weight_lbs: e.weightLbs,
    logged_at: e.loggedAt,
  }));
  await supabase.from('weight_log').upsert(rows, { onConflict: 'user_id,date' });
}

async function pushStreak(userId: string) {
  const streak = await getStreak();
  await supabase.from('streaks').upsert({
    user_id: userId,
    current: streak.current,
    longest: streak.longest,
    last_workout_date: streak.lastWorkoutDate,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

// ─── Pull ─────────────────────────────────────────────────────────────────────

export async function pullFromCloud(userId: string): Promise<void> {
  try {
    await Promise.all([
      pullProfile(userId),
      pullWorkoutLogs(userId),
      pullFoodLog(userId),
      pullWeightLog(userId),
      pullStreak(userId),
    ]);
  } catch (e) {
    console.warn('[sync] pullFromCloud error:', e);
  }
}

async function pullProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (!data) return;

  const existing = await getProfile();
  await saveProfile({
    ...(existing ?? {}),
    id: data.id,
    name: data.name,
    age: data.age,
    sex: data.sex,
    heightCm: data.height_cm,
    weightKg: data.weight_kg,
    goals: data.goals ?? [],
    primaryGoal: data.primary_goal,
    trainingBackground: data.training_background,
    exerciseTypes: data.exercise_types ?? [],
    equipment: data.equipment,
    daysPerWeek: data.days_per_week,
    minutesPerSession: data.minutes_per_session,
    injuries: data.injuries,
    musicStyle: data.music_style,
    updatedAt: data.updated_at,
    createdAt: existing?.createdAt ?? data.updated_at,
  } as any);
}

async function pullWorkoutLogs(userId: string) {
  const { data } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(365);
  if (!data?.length) return;

  const localLogs = await getWorkoutLog();
  const localIds = new Set(localLogs.map(l => l.id));

  // Only pull entries not already in local storage
  for (const row of data) {
    if (!localIds.has(row.id)) {
      const entry: WorkoutLogEntry = {
        id: row.id,
        date: row.date,
        dayLabel: row.day_label,
        exercises: row.exercises,
        durationMinutes: row.duration_minutes,
        completedAt: row.completed_at,
      };
      await addWorkoutLog(entry);
    }
  }
}

async function pullFoodLog(userId: string) {
  const { data } = await supabase
    .from('food_log')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
    .limit(1000);
  if (!data?.length) return;

  const localAll = await getFoodLog();
  const localIds = new Set(localAll.map(e => e.id));

  for (const row of data) {
    if (!localIds.has(row.id)) {
      const entry: FoodLogEntry = {
        id: row.id,
        date: row.date,
        name: row.name,
        calories: row.calories,
        proteinG: row.protein_g,
        carbsG: row.carbs_g,
        fatG: row.fat_g,
        servingSize: row.serving_size,
        meal: row.meal,
        loggedAt: row.logged_at,
      };
      await addFoodEntry(entry);
    }
  }
}

async function pullWeightLog(userId: string) {
  const { data } = await supabase
    .from('weight_log')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (!data?.length) return;

  const localEntries = await getWeightLog();
  const localDates = new Set(localEntries.map(e => e.date));

  for (const row of data) {
    if (!localDates.has(row.date)) {
      const entry: WeightEntry = {
        date: row.date,
        weightLbs: row.weight_lbs,
        loggedAt: row.logged_at,
      };
      await addWeightEntry(entry);
    }
  }
}

async function pullStreak(userId: string) {
  const { data } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (!data) return;

  const local = await getStreak();
  // Keep whichever streak is longer
  if (data.longest > local.longest || data.current > local.current) {
    await updateStreak(); // This won't help much — just ensures local is initialized
    // Directly write to async storage with cloud values if cloud is better
    const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
    const merged = {
      current: Math.max(data.current, local.current),
      longest: Math.max(data.longest, local.longest),
      lastWorkoutDate: data.last_workout_date ?? local.lastWorkoutDate,
    };
    await AsyncStorage.setItem('ftf_streak', JSON.stringify(merged));
  }
}
