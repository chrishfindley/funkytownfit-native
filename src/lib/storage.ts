import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from './types';
import { NutritionTargets, calculateNutritionTargets } from './nutrition';

const KEYS = {
  PROFILE: 'ftf_profile',
  ONBOARDED: 'ftf_onboarded',
  WORKOUT_LOG: 'ftf_workout_log',
  FOOD_LOG: 'ftf_food_log',
  WATER_LOG: 'ftf_water_log',
  STREAK: 'ftf_streak',
};

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export async function isOnboarded(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.ONBOARDED);
  return val === 'true';
}

export async function setOnboarded(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDED, 'true');
}

export async function getNutritionTargets(): Promise<NutritionTargets | null> {
  const profile = await getProfile();
  if (!profile) return null;
  return calculateNutritionTargets(profile);
}

export interface CompletedSet { reps: number; weightKg: number; rpe?: number; }
export interface CompletedExercise { name: string; sets: CompletedSet[]; muscleGroups: string[]; }
export interface WorkoutLogEntry {
  id: string; date: string; dayLabel: string;
  exercises: CompletedExercise[]; durationMinutes: number; completedAt: string;
}

export async function getWorkoutLog(): Promise<WorkoutLogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.WORKOUT_LOG);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function addWorkoutLog(entry: WorkoutLogEntry): Promise<void> {
  const log = await getWorkoutLog();
  log.unshift(entry);
  await AsyncStorage.setItem(KEYS.WORKOUT_LOG, JSON.stringify(log.slice(0, 365)));
}

export interface FoodLogEntry {
  id: string; date: string; name: string;
  calories: number; proteinG: number; carbsG: number; fatG: number;
  servingSize?: string; meal?: 'breakfast' | 'lunch' | 'dinner' | 'snack'; loggedAt: string;
}

export async function getFoodLog(date?: string): Promise<FoodLogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.FOOD_LOG);
    const all: FoodLogEntry[] = raw ? JSON.parse(raw) : [];
    if (!date) return all;
    return all.filter(e => e.date === date);
  } catch { return []; }
}

export async function addFoodEntry(entry: FoodLogEntry): Promise<void> {
  const log = await getFoodLog();
  log.unshift(entry);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  await AsyncStorage.setItem(KEYS.FOOD_LOG, JSON.stringify(log.filter(e => new Date(e.date) >= cutoff)));
}

export async function deleteFoodEntry(id: string): Promise<void> {
  const log = await getFoodLog();
  await AsyncStorage.setItem(KEYS.FOOD_LOG, JSON.stringify(log.filter(e => e.id !== id)));
}

export interface WaterLog { date: string; ozLogged: number; }

export async function getWaterLog(date: string): Promise<WaterLog> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.WATER_LOG);
    const all: WaterLog[] = raw ? JSON.parse(raw) : [];
    return all.find(w => w.date === date) ?? { date, ozLogged: 0 };
  } catch { return { date, ozLogged: 0 }; }
}

export async function updateWaterLog(date: string, ozLogged: number): Promise<void> {
  const raw = await AsyncStorage.getItem(KEYS.WATER_LOG);
  const all: WaterLog[] = raw ? JSON.parse(raw) : [];
  const idx = all.findIndex(w => w.date === date);
  if (idx >= 0) all[idx].ozLogged = ozLogged;
  else all.unshift({ date, ozLogged });
  await AsyncStorage.setItem(KEYS.WATER_LOG, JSON.stringify(all.slice(0, 90)));
}

export interface StreakData { current: number; longest: number; lastWorkoutDate: string | null; }

export async function getStreak(): Promise<StreakData> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.STREAK);
    return raw ? JSON.parse(raw) : { current: 0, longest: 0, lastWorkoutDate: null };
  } catch { return { current: 0, longest: 0, lastWorkoutDate: null }; }
}

export async function updateStreak(): Promise<StreakData> {
  const streak = await getStreak();
  const today = todayStr();
  if (streak.lastWorkoutDate === today) return streak;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const newCurrent = streak.lastWorkoutDate === yesterday.toISOString().split('T')[0] ? streak.current + 1 : 1;
  const updated: StreakData = { current: newCurrent, longest: Math.max(newCurrent, streak.longest), lastWorkoutDate: today };
  await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(updated));
  return updated;
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}

// Recent Foods Feature
const RECENT_FOODS_KEY = 'ftf_recent_foods';

export async function getRecentFoods(): Promise<FoodLogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_FOODS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function addToRecentFoods(entry: FoodLogEntry): Promise<void> {
  try {
    const existing = await getRecentFoods();
    // Deduplicate by food name, keep most recent, cap at 10
    const filtered = existing.filter(e => e.name !== entry.name);
    const updated = [entry, ...filtered].slice(0, 10);
    await AsyncStorage.setItem(RECENT_FOODS_KEY, JSON.stringify(updated));
  } catch {}
}

// Meal Templates Feature
const MEAL_TEMPLATES_KEY = 'ftf_meal_templates';

export interface MealTemplate {
  id: string;
  name: string;
  emoji: string;
  foods: Array<{
    foodName: string;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    amountG: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  createdAt: string;
}

export async function getMealTemplates(): Promise<MealTemplate[]> {
  try {
    const raw = await AsyncStorage.getItem(MEAL_TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export async function saveMealTemplate(template: MealTemplate): Promise<void> {
  try {
    const existing = await getMealTemplates();
    const filtered = existing.filter(t => t.id !== template.id);
    await AsyncStorage.setItem(MEAL_TEMPLATES_KEY, JSON.stringify([...filtered, template]));
  } catch {}
}

export async function deleteMealTemplate(id: string): Promise<void> {
  try {
    const existing = await getMealTemplates();
    await AsyncStorage.setItem(MEAL_TEMPLATES_KEY, JSON.stringify(existing.filter(t => t.id !== id)));
  } catch {}
}

// ── Daily Coaching / Micro-commitments ───────────────────────────────────────
const COACHING_KEY = 'ftf_daily_coaching';

export interface DailyCoaching {
  date: string;                  // YYYY-MM-DD
  intention: string;             // user's own typed commitment
  intentionDone: boolean;
  coachingDismissed: boolean;    // dismissed coaching card today
}

export async function getDailyCoaching(date: string): Promise<DailyCoaching> {
  try {
    const raw = await AsyncStorage.getItem(COACHING_KEY);
    const all: DailyCoaching[] = raw ? JSON.parse(raw) : [];
    return all.find(c => c.date === date) ?? {
      date, intention: '', intentionDone: false, coachingDismissed: false,
    };
  } catch {
    return { date, intention: '', intentionDone: false, coachingDismissed: false };
  }
}

export async function saveDailyCoaching(entry: DailyCoaching): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(COACHING_KEY);
    const all: DailyCoaching[] = raw ? JSON.parse(raw) : [];
    const filtered = all.filter(c => c.date !== entry.date);
    await AsyncStorage.setItem(COACHING_KEY, JSON.stringify([entry, ...filtered].slice(0, 30)));
  } catch {}
}

// ── Custom Nutrition Targets (user overrides) ─────────────────────────────────
const CUSTOM_NUTRITION_KEY = 'ftf_custom_nutrition';

export interface CustomNutritionTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export async function getCustomNutritionTargets(): Promise<CustomNutritionTargets | null> {
  try {
    const raw = await AsyncStorage.getItem(CUSTOM_NUTRITION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function saveCustomNutritionTargets(targets: CustomNutritionTargets): Promise<void> {
  await AsyncStorage.setItem(CUSTOM_NUTRITION_KEY, JSON.stringify(targets));
}

export async function clearCustomNutritionTargets(): Promise<void> {
  await AsyncStorage.removeItem(CUSTOM_NUTRITION_KEY);
}

// ── Weight Log ───────────────────────────────────────────────────────────────
const WEIGHT_LOG_KEY = 'ftf_weight_log';

export interface WeightEntry {
  date: string;        // YYYY-MM-DD
  weightLbs: number;
  loggedAt: string;    // ISO timestamp
}

export async function getWeightLog(): Promise<WeightEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(WEIGHT_LOG_KEY);
    const entries: WeightEntry[] = raw ? JSON.parse(raw) : [];
    return entries.sort((a, b) => b.date.localeCompare(a.date));
  } catch { return []; }
}

export async function addWeightEntry(entry: WeightEntry): Promise<void> {
  try {
    const log = await getWeightLog();
    // One entry per day — replace same-day entry
    const filtered = log.filter(e => e.date !== entry.date);
    const updated = [entry, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    await AsyncStorage.setItem(WEIGHT_LOG_KEY, JSON.stringify(updated.slice(0, 365)));
  } catch {}
}
