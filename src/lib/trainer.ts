/**
 * Funkytown Fit — Trainer Platform API
 * All Supabase operations for the trainer/client feature.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

// ─── Local storage key ────────────────────────────────────────────────────────
const TRAINER_MODE_KEY = 'ftf_trainer_mode';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TrainerRelationship {
  id: string;
  trainerId: string;
  clientId: string | null;
  inviteCode: string;
  status: 'pending' | 'active' | 'removed';
  trainerName: string | null;
  clientName: string | null;
  createdAt: string;
}

export interface AssignedExercise {
  name: string;
  sets: number;
  reps: string;    // e.g. "8-12" or "AMRAP"
  notes?: string;
}

export interface AssignedWorkout {
  id: string;
  trainerId: string;
  clientId: string;
  title: string;
  coachNote?: string;
  exercises: AssignedExercise[];
  targetDate?: string;   // YYYY-MM-DD
  status: 'pending' | 'completed' | 'skipped';
  assignedAt: string;
  completedAt?: string;
  trainerName?: string;
}

export interface ClientSummary {
  relationship: TrainerRelationship;
  recentWorkouts: number;   // last 7 days
  lastWorkoutDate: string | null;
  todayCalories: number;
  latestWeightLbs: number | null;
  streak: number;
}

export interface ClientDayNutrition {
  date: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  entryCount: number;
}

export interface ClientWorkoutEntry {
  id: string;
  date: string;
  dayLabel: string;
  durationMinutes: number;
  exerciseCount: number;
  totalVolumeLbs: number;
}

// ─── Trainer Mode ─────────────────────────────────────────────────────────────

export async function isTrainerMode(): Promise<boolean> {
  const val = await AsyncStorage.getItem(TRAINER_MODE_KEY);
  return val === 'true';
}

export async function enableTrainerMode(): Promise<void> {
  await AsyncStorage.setItem(TRAINER_MODE_KEY, 'true');
}

export async function disableTrainerMode(): Promise<void> {
  await AsyncStorage.setItem(TRAINER_MODE_KEY, 'false');
}

// ─── Invite Code Generation ───────────────────────────────────────────────────

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing I/1/O/0
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Creates a pending invite row in Supabase and returns the 6-char code.
 * If the trainer already has a pending invite, returns that code instead.
 */
export async function getOrCreateInviteCode(
  trainerId: string,
  trainerName: string,
): Promise<{ code: string | null; error: string | null }> {
  // Check if there's already a pending invite without a client
  const { data: existing } = await supabase
    .from('trainer_client_relationships')
    .select('invite_code')
    .eq('trainer_id', trainerId)
    .eq('status', 'pending')
    .is('client_id', null)
    .single();

  if (existing?.invite_code) {
    return { code: existing.invite_code, error: null };
  }

  // Create a new one
  const code = generateCode();
  const { error } = await supabase
    .from('trainer_client_relationships')
    .insert({
      trainer_id: trainerId,
      invite_code: code,
      trainer_name: trainerName,
      status: 'pending',
    });

  if (error) return { code: null, error: error.message };
  return { code, error: null };
}

/**
 * Client accepts an invite code.
 * Returns the relationship row on success.
 */
export async function acceptInvite(
  clientId: string,
  clientName: string,
  code: string,
): Promise<{ relationship: TrainerRelationship | null; error: string | null }> {
  const upperCode = code.trim().toUpperCase();

  // Find the pending invite
  const { data: row, error: findErr } = await supabase
    .from('trainer_client_relationships')
    .select('*')
    .eq('invite_code', upperCode)
    .eq('status', 'pending')
    .is('client_id', null)
    .single();

  if (findErr || !row) {
    return { relationship: null, error: 'Invalid or expired invite code.' };
  }

  if (row.trainer_id === clientId) {
    return { relationship: null, error: 'You cannot connect to yourself.' };
  }

  // Accept it
  const { data: updated, error: updateErr } = await supabase
    .from('trainer_client_relationships')
    .update({
      client_id: clientId,
      client_name: clientName,
      status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('id', row.id)
    .select()
    .single();

  if (updateErr || !updated) {
    return { relationship: null, error: updateErr?.message ?? 'Failed to accept invite.' };
  }

  return { relationship: rowToRelationship(updated), error: null };
}

// ─── Relationships ────────────────────────────────────────────────────────────

export async function getMyClients(
  trainerId: string,
): Promise<TrainerRelationship[]> {
  const { data } = await supabase
    .from('trainer_client_relationships')
    .select('*')
    .eq('trainer_id', trainerId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (data ?? []).map(rowToRelationship);
}

export async function getMyTrainer(
  clientId: string,
): Promise<TrainerRelationship | null> {
  const { data } = await supabase
    .from('trainer_client_relationships')
    .select('*')
    .eq('client_id', clientId)
    .eq('status', 'active')
    .single();

  return data ? rowToRelationship(data) : null;
}

export async function removeClient(
  trainerId: string,
  clientId: string,
): Promise<void> {
  await supabase
    .from('trainer_client_relationships')
    .update({ status: 'removed' })
    .eq('trainer_id', trainerId)
    .eq('client_id', clientId);
}

// ─── Client Data (trainer reads client's logs) ────────────────────────────────

export async function getClientProfile(clientId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', clientId)
    .single();
  return data ?? null;
}

export async function getClientWorkouts(
  clientId: string,
  limit = 30,
): Promise<ClientWorkoutEntry[]> {
  const { data } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', clientId)
    .order('date', { ascending: false })
    .limit(limit);

  return (data ?? []).map(row => {
    const exs: any[] = row.exercises ?? [];
    const volume = exs.reduce((total: number, ex: any) =>
      total + (ex.sets ?? []).reduce((s: number, set: any) =>
        s + (set.weightKg ?? 0) * (set.reps ?? 0) * 2.20462, 0), 0);
    return {
      id: row.id,
      date: row.date,
      dayLabel: row.day_label,
      durationMinutes: row.duration_minutes,
      exerciseCount: exs.length,
      totalVolumeLbs: Math.round(volume),
    };
  });
}

export async function getClientNutrition(
  clientId: string,
  days = 30,
): Promise<ClientDayNutrition[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().slice(0, 10);

  const { data } = await supabase
    .from('food_log')
    .select('date, calories, protein_g, carbs_g, fat_g')
    .eq('user_id', clientId)
    .gte('date', sinceStr)
    .order('date', { ascending: false });

  if (!data?.length) return [];

  // Group by date
  const byDate: Record<string, ClientDayNutrition> = {};
  for (const row of data) {
    if (!byDate[row.date]) {
      byDate[row.date] = {
        date: row.date,
        calories: 0,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
        entryCount: 0,
      };
    }
    const d = byDate[row.date];
    d.calories   += row.calories   ?? 0;
    d.proteinG   += row.protein_g  ?? 0;
    d.carbsG     += row.carbs_g    ?? 0;
    d.fatG       += row.fat_g      ?? 0;
    d.entryCount += 1;
  }

  return Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getClientWeightLog(
  clientId: string,
): Promise<{ date: string; weightLbs: number }[]> {
  const { data } = await supabase
    .from('weight_log')
    .select('date, weight_lbs')
    .eq('user_id', clientId)
    .order('date', { ascending: false })
    .limit(60);

  return (data ?? []).map(r => ({ date: r.date, weightLbs: r.weight_lbs }));
}

// ─── Assigned Workouts ────────────────────────────────────────────────────────

export async function assignWorkout(
  workout: Omit<AssignedWorkout, 'id' | 'assignedAt' | 'completedAt'>,
): Promise<{ id: string | null; error: string | null }> {
  const { data, error } = await supabase
    .from('assigned_workouts')
    .insert({
      trainer_id:  workout.trainerId,
      client_id:   workout.clientId,
      title:       workout.title,
      coach_note:  workout.coachNote ?? null,
      exercises:   workout.exercises,
      target_date: workout.targetDate ?? null,
      status:      'pending',
    })
    .select('id')
    .single();

  if (error || !data) return { id: null, error: error?.message ?? 'Failed to assign workout' };
  return { id: data.id, error: null };
}

export async function getAssignedWorkoutsForClient(
  clientId: string,
): Promise<AssignedWorkout[]> {
  const { data } = await supabase
    .from('assigned_workouts')
    .select('*, trainer:trainer_id(name)')
    .eq('client_id', clientId)
    .order('assigned_at', { ascending: false })
    .limit(20);

  return (data ?? []).map(rowToAssigned);
}

export async function getAssignedWorkoutsForTrainer(
  trainerId: string,
  clientId: string,
): Promise<AssignedWorkout[]> {
  const { data } = await supabase
    .from('assigned_workouts')
    .select('*')
    .eq('trainer_id', trainerId)
    .eq('client_id', clientId)
    .order('assigned_at', { ascending: false })
    .limit(20);

  return (data ?? []).map(rowToAssigned);
}

export async function markAssignedWorkoutDone(
  workoutId: string,
  clientId: string,
): Promise<void> {
  await supabase
    .from('assigned_workouts')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', workoutId)
    .eq('client_id', clientId);
}

export async function markAssignedWorkoutSkipped(
  workoutId: string,
  clientId: string,
): Promise<void> {
  await supabase
    .from('assigned_workouts')
    .update({ status: 'skipped' })
    .eq('id', workoutId)
    .eq('client_id', clientId);
}

// ─── Helper: build client summary ────────────────────────────────────────────

export async function buildClientSummary(
  relationship: TrainerRelationship,
): Promise<ClientSummary> {
  if (!relationship.clientId) {
    return { relationship, recentWorkouts: 0, lastWorkoutDate: null, todayCalories: 0, latestWeightLbs: null, streak: 0 };
  }

  const clientId = relationship.clientId;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().slice(0, 10);
  const todayStr = new Date().toISOString().slice(0, 10);

  const [workouts, nutrition, weight] = await Promise.all([
    getClientWorkouts(clientId, 50),
    getClientNutrition(clientId, 2),
    getClientWeightLog(clientId),
  ]);

  const recentWorkouts = workouts.filter(w => w.date >= weekAgoStr).length;
  const lastWorkoutDate = workouts[0]?.date ?? null;

  const todayNutrition = nutrition.find(d => d.date === todayStr);
  const todayCalories = todayNutrition?.calories ?? 0;

  const latestWeightLbs = weight[0]?.weightLbs ?? null;

  // Simple streak calc
  let streak = 0;
  const sortedDates = workouts.map(w => w.date).sort((a, b) => b.localeCompare(a));
  const dateSet = new Set(sortedDates);
  const checkDate = new Date();
  while (dateSet.has(checkDate.toISOString().slice(0, 10))) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return { relationship, recentWorkouts, lastWorkoutDate, todayCalories, latestWeightLbs, streak };
}

// ─── Row mappers ──────────────────────────────────────────────────────────────

function rowToRelationship(row: any): TrainerRelationship {
  return {
    id:          row.id,
    trainerId:   row.trainer_id,
    clientId:    row.client_id ?? null,
    inviteCode:  row.invite_code,
    status:      row.status,
    trainerName: row.trainer_name ?? null,
    clientName:  row.client_name ?? null,
    createdAt:   row.created_at,
  };
}

function rowToAssigned(row: any): AssignedWorkout {
  return {
    id:          row.id,
    trainerId:   row.trainer_id,
    clientId:    row.client_id,
    title:       row.title,
    coachNote:   row.coach_note ?? undefined,
    exercises:   row.exercises ?? [],
    targetDate:  row.target_date ?? undefined,
    status:      row.status,
    assignedAt:  row.assigned_at,
    completedAt: row.completed_at ?? undefined,
    trainerName: row.trainer?.name ?? undefined,
  };
}
