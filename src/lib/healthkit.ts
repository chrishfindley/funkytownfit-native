/**
 * Funkytown Fit — Apple Health / HealthKit Integration
 *
 * ⚠️  Requires a Custom Development Build (NOT Expo Go).
 *     Install: npm install react-native-health --legacy-peer-deps
 *     Then add to app.json entitlements:
 *       "NSHealthShareUsageDescription": "Funkytown Fit reads your health data to enhance workouts.",
 *       "NSHealthUpdateUsageDescription": "Funkytown Fit saves workouts to Apple Health.",
 *
 * In Expo Go: all functions gracefully return null / empty data.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Types ────────────────────────────────────────────────────────────────────────
export interface HealthData {
  heartRateBPM: number | null;        // most recent BPM
  activeCaloriesBurned: number | null; // kcal today
  stepCount: number | null;           // steps today
  restingHeartRate: number | null;    // resting HR (bpm)
  hrv: number | null;                 // HRV SDNN (ms) — recovery indicator
  vo2Max: number | null;              // VO2 max mL/kg/min
  sleepHours: number | null;          // sleep last night (hours)
}

export interface WorkoutHealthPayload {
  startDate: string;   // ISO
  endDate: string;     // ISO
  energyBurned: number; // kcal
  totalDistance?: number; // meters, optional
}

// ── HealthKit availability detection ─────────────────────────────────────────────
let AppleHealthKit: any = null;

try {
  // Dynamic require — gracefully fails in Expo Go
  AppleHealthKit = require('react-native-health').default;
} catch {
  // Not installed or Expo Go — AppleHealthKit stays null
}

export const healthKitAvailable = !!AppleHealthKit;

// ── Permission keys ───────────────────────────────────────────────────────────────
const PERMS = AppleHealthKit ? {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.HeartRate,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.RestingHeartRate,
      AppleHealthKit.Constants.Permissions.HeartRateVariability,
      AppleHealthKit.Constants.Permissions.Vo2Max,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
    ],
    write: [
      AppleHealthKit.Constants.Permissions.Workout,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
  },
} : null;

// ── Init ──────────────────────────────────────────────────────────────────────────
let initialized = false;

export async function initHealthKit(): Promise<boolean> {
  if (!AppleHealthKit || !PERMS) return false;
  return new Promise(resolve => {
    AppleHealthKit.initHealthKit(PERMS, (err: Error) => {
      if (err) { console.warn('HealthKit init failed:', err); resolve(false); return; }
      initialized = true;
      resolve(true);
    });
  });
}

// ── Read today's health data ──────────────────────────────────────────────────────
export async function getTodayHealthData(): Promise<HealthData> {
  const empty: HealthData = {
    heartRateBPM: null, activeCaloriesBurned: null, stepCount: null,
    restingHeartRate: null, hrv: null, vo2Max: null, sleepHours: null,
  };
  if (!AppleHealthKit || !initialized) return empty;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const now = new Date();

  try {
    const [hr, active, steps, restingHR, hrv, sleep] = await Promise.all([
      getLatestHeartRate(),
      getActiveCaloriesToday(todayStart, now),
      getStepsToday(todayStart, now),
      getRestingHeartRateSample(),
      getLatestHRV(),
      getSleepLastNight(),
    ]);
    return {
      heartRateBPM: hr,
      activeCaloriesBurned: active,
      stepCount: steps,
      restingHeartRate: restingHR,
      hrv,
      vo2Max: null, // fetched separately if needed
      sleepHours: sleep,
    };
  } catch {
    return empty;
  }
}

function getLatestHeartRate(): Promise<number | null> {
  return new Promise(resolve => {
    if (!AppleHealthKit) { resolve(null); return; }
    AppleHealthKit.getHeartRateSamples(
      { unit: 'bpm', startDate: new Date(Date.now() - 3600000).toISOString(), endDate: new Date().toISOString() },
      (err: any, results: any[]) => {
        if (err || !results?.length) { resolve(null); return; }
        resolve(Math.round(results[results.length - 1].value));
      }
    );
  });
}

function getActiveCaloriesToday(start: Date, end: Date): Promise<number | null> {
  return new Promise(resolve => {
    if (!AppleHealthKit) { resolve(null); return; }
    AppleHealthKit.getActiveEnergyBurned(
      { startDate: start.toISOString(), endDate: end.toISOString() },
      (err: any, results: any[]) => {
        if (err || !results?.length) { resolve(null); return; }
        const total = results.reduce((s: number, r: any) => s + (r.value || 0), 0);
        resolve(Math.round(total));
      }
    );
  });
}

function getStepsToday(start: Date, end: Date): Promise<number | null> {
  return new Promise(resolve => {
    if (!AppleHealthKit) { resolve(null); return; }
    AppleHealthKit.getStepCount(
      { startDate: start.toISOString(), endDate: end.toISOString() },
      (err: any, results: any) => {
        if (err || !results) { resolve(null); return; }
        resolve(Math.round(results.value || 0));
      }
    );
  });
}

function getRestingHeartRateSample(): Promise<number | null> {
  return new Promise(resolve => {
    if (!AppleHealthKit) { resolve(null); return; }
    const start = new Date();
    start.setDate(start.getDate() - 1); // look back 24h for latest resting HR
    AppleHealthKit.getRestingHeartRate(
      { startDate: start.toISOString(), endDate: new Date().toISOString() },
      (err: any, results: any) => {
        if (err || !results?.value) { resolve(null); return; }
        resolve(Math.round(results.value));
      }
    );
  });
}

function getLatestHRV(): Promise<number | null> {
  return new Promise(resolve => {
    if (!AppleHealthKit) { resolve(null); return; }
    const start = new Date();
    start.setHours(0, 0, 0, 0); // midnight today
    AppleHealthKit.getHeartRateVariabilitySamples(
      { startDate: start.toISOString(), endDate: new Date().toISOString(), limit: 10 },
      (err: any, results: any[]) => {
        if (err || !results?.length) { resolve(null); return; }
        // Most recent sample, convert to ms (HK stores in seconds)
        const latest = results[results.length - 1];
        const val = latest.value ?? latest.HKHeartRateVariabilityMSSD;
        if (val == null) { resolve(null); return; }
        // Apple Watch reports in seconds — convert to ms if value < 1
        resolve(Math.round(val < 1 ? val * 1000 : val));
      }
    );
  });
}

function getSleepLastNight(): Promise<number | null> {
  return new Promise(resolve => {
    if (!AppleHealthKit) { resolve(null); return; }
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 1);
    start.setHours(18, 0, 0, 0); // 6 PM yesterday — captures overnight sleep
    AppleHealthKit.getSleepSamples(
      { startDate: start.toISOString(), endDate: end.toISOString() },
      (err: any, results: any[]) => {
        if (err || !results?.length) { resolve(null); return; }
        // Sum "ASLEEP" samples (value = 'ASLEEP' | 'INBED')
        const asleepMs = results
          .filter((s: any) => s.value === 'ASLEEP' || s.value === 'ASLEEP_CORE' || s.value === 'ASLEEP_DEEP' || s.value === 'ASLEEP_REM')
          .reduce((total: number, s: any) => {
            const ms = new Date(s.endDate).getTime() - new Date(s.startDate).getTime();
            return total + ms;
          }, 0);
        if (asleepMs === 0) { resolve(null); return; }
        resolve(Math.round((asleepMs / 3600000) * 10) / 10); // hours, 1 decimal
      }
    );
  });
}

// ── Real-time heart rate polling ──────────────────────────────────────────────────
// Returns a cleanup function
export function subscribeHeartRate(
  onValue: (bpm: number) => void,
  intervalMs = 5000
): () => void {
  if (!AppleHealthKit || !initialized) return () => {};
  const id = setInterval(async () => {
    const bpm = await getLatestHeartRate();
    if (bpm !== null) onValue(bpm);
  }, intervalMs);
  return () => clearInterval(id);
}

// ── Save workout to HealthKit ─────────────────────────────────────────────────────
export async function saveWorkoutToHealthKit(payload: WorkoutHealthPayload): Promise<boolean> {
  if (!AppleHealthKit || !initialized) return false;
  return new Promise(resolve => {
    AppleHealthKit.saveWorkout(
      {
        type: AppleHealthKit.Constants.Activities.TraditionalStrengthTraining,
        startDate: payload.startDate,
        endDate: payload.endDate,
        energyBurned: payload.energyBurned,
        energyBurnedUnit: 'calorie',
      },
      (err: any) => { resolve(!err); }
    );
  });
}

// ── Cache key for "last known" data (shown when HK unavailable) ───────────────────
const CACHE_KEY = 'health_cache';
export async function getCachedHealthData(): Promise<Partial<HealthData>> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
export async function setCachedHealthData(data: Partial<HealthData>): Promise<void> {
  try { await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
}
