/**
 * Workout Planner — shared program definitions, personalization, and week scheduling.
 * Imported by both WorkoutScreen and DashboardScreen.
 */
import { UserProfile } from './types';

// ── Exercise definition ────────────────────────────────────────────────────────
export interface ExDef {
  name: string;
  muscle: string;
  setsTarget: number;       // how many sets to perform
  repsTarget: string;       // e.g. "8–10" or "max" or "60s"
  defaultLbs: number;       // starting weight suggestion (0 = bodyweight)
  restSeconds: number;      // recommended rest after each set (0 = superset, go straight to next)
  groupId?: string;         // exercises sharing a groupId are a superset/circuit
  notes?: string;           // coach tip shown in detail view
}

/** Convenience: display string like "4 × 6–8" */
export function getRepRange(ex: ExDef): string {
  return `${ex.setsTarget} × ${ex.repsTarget}`;
}

// ── Program ────────────────────────────────────────────────────────────────────
export interface Program {
  id: string;
  emoji: string;
  label: string;
  tag: string;
  color: string;
  estMins: number;
  exercises: ExDef[];
}

// ── Default full-gym programs (with supersets & rest times) ───────────────────
export const DEFAULT_PROGRAMS: Program[] = [
  {
    id: 'push', emoji: '💪', label: 'Push Day', tag: 'Chest · Shoulders · Tris',
    color: '#F97316', estMins: 55,
    exercises: [
      { name: 'Bench Press', muscle: 'Chest / Triceps', setsTarget: 4, repsTarget: '6–8', defaultLbs: 135, restSeconds: 120, notes: 'Drive through your feet. Keep arch natural. Bar slightly diagonal path.' },
      { name: 'Overhead Press', muscle: 'Shoulders', setsTarget: 3, repsTarget: '8–10', defaultLbs: 95, restSeconds: 90, notes: 'Brace core hard. Don\'t hyperextend lower back.' },
      { name: 'Incline DB Press', muscle: 'Upper Chest', setsTarget: 3, repsTarget: '10–12', defaultLbs: 50, restSeconds: 0, groupId: 'push_ss1', notes: '⚡ Superset — go straight to Lateral Raise. No rest until both are done.' },
      { name: 'Lateral Raise', muscle: 'Shoulders', setsTarget: 3, repsTarget: '12–15', defaultLbs: 25, restSeconds: 60, groupId: 'push_ss1', notes: 'Slight bend in elbow. Lead with elbows, not hands.' },
      { name: 'Tricep Pushdown', muscle: 'Triceps', setsTarget: 3, repsTarget: '12–15', defaultLbs: 65, restSeconds: 60, notes: 'Keep elbows pinned to sides.' },
    ],
  },
  {
    id: 'pull', emoji: '🏋️', label: 'Pull Day', tag: 'Back · Biceps',
    color: '#06B6D4', estMins: 55,
    exercises: [
      { name: 'Deadlift', muscle: 'Back / Glutes', setsTarget: 3, repsTarget: '5', defaultLbs: 225, restSeconds: 180, notes: 'Hinge at hips. Bar stays over mid-foot throughout.' },
      { name: 'Pull-Ups', muscle: 'Back / Biceps', setsTarget: 4, repsTarget: 'max', defaultLbs: 0, restSeconds: 90, notes: 'Full dead hang. Drive elbows down and back.' },
      { name: 'Barbell Row', muscle: 'Back', setsTarget: 3, repsTarget: '8–10', defaultLbs: 135, restSeconds: 90, notes: 'Stay rigid. Pull to belly button.' },
      { name: 'Face Pull', muscle: 'Rear Delts', setsTarget: 3, repsTarget: '15–20', defaultLbs: 45, restSeconds: 0, groupId: 'pull_ss1', notes: '⚡ Superset with Hammer Curl.' },
      { name: 'Hammer Curl', muscle: 'Biceps', setsTarget: 3, repsTarget: '12', defaultLbs: 35, restSeconds: 60, groupId: 'pull_ss1' },
    ],
  },
  {
    id: 'legs', emoji: '🦵', label: 'Leg Day', tag: 'Quads · Hams · Glutes',
    color: '#8B5CF6', estMins: 65,
    exercises: [
      { name: 'Back Squat', muscle: 'Quads / Glutes', setsTarget: 4, repsTarget: '5–6', defaultLbs: 185, restSeconds: 180, notes: 'Depth: hip crease below knee. Knees track toes.' },
      { name: 'Romanian Deadlift', muscle: 'Hamstrings', setsTarget: 3, repsTarget: '8–10', defaultLbs: 155, restSeconds: 90, notes: 'Slight knee bend. Feel the stretch in hamstrings.' },
      { name: 'Leg Press', muscle: 'Quads', setsTarget: 3, repsTarget: '12', defaultLbs: 270, restSeconds: 90 },
      { name: 'Walking Lunges', muscle: 'Quads / Glutes', setsTarget: 3, repsTarget: '10/leg', defaultLbs: 45, restSeconds: 0, groupId: 'legs_ss1', notes: '⚡ Superset with Calf Raise.' },
      { name: 'Calf Raise', muscle: 'Calves', setsTarget: 3, repsTarget: '15–20', defaultLbs: 135, restSeconds: 60, groupId: 'legs_ss1' },
    ],
  },
  {
    id: 'upper', emoji: '🔝', label: 'Upper Body', tag: 'Chest · Back · Shoulders',
    color: '#F97316', estMins: 55,
    exercises: [
      { name: 'Bench Press', muscle: 'Chest / Triceps', setsTarget: 4, repsTarget: '6–8', defaultLbs: 135, restSeconds: 90 },
      { name: 'Barbell Row', muscle: 'Back', setsTarget: 4, repsTarget: '6–8', defaultLbs: 135, restSeconds: 90, notes: 'Pair these as a superset if time is tight.' },
      { name: 'Overhead Press', muscle: 'Shoulders', setsTarget: 3, repsTarget: '8–10', defaultLbs: 95, restSeconds: 0, groupId: 'upper_ss1', notes: '⚡ Superset with Pull-Ups.' },
      { name: 'Pull-Ups', muscle: 'Back / Biceps', setsTarget: 3, repsTarget: 'max', defaultLbs: 0, restSeconds: 90, groupId: 'upper_ss1' },
      { name: 'DB Curl', muscle: 'Biceps', setsTarget: 3, repsTarget: '12', defaultLbs: 35, restSeconds: 0, groupId: 'upper_ss2', notes: '⚡ Superset with Tricep Pushdown.' },
      { name: 'Tricep Pushdown', muscle: 'Triceps', setsTarget: 3, repsTarget: '12', defaultLbs: 65, restSeconds: 60, groupId: 'upper_ss2' },
    ],
  },
  {
    id: 'full', emoji: '🔥', label: 'Full Body', tag: 'Everything · Cowtown style',
    color: '#F97316', estMins: 65,
    exercises: [
      { name: 'Back Squat', muscle: 'Quads / Glutes', setsTarget: 4, repsTarget: '5', defaultLbs: 155, restSeconds: 120 },
      { name: 'Bench Press', muscle: 'Chest / Triceps', setsTarget: 3, repsTarget: '8', defaultLbs: 135, restSeconds: 90 },
      { name: 'Deadlift', muscle: 'Back / Glutes', setsTarget: 3, repsTarget: '5', defaultLbs: 225, restSeconds: 120 },
      { name: 'Pull-Ups', muscle: 'Back / Biceps', setsTarget: 3, repsTarget: 'max', defaultLbs: 0, restSeconds: 0, groupId: 'full_ss1', notes: '⚡ Superset with Overhead Press.' },
      { name: 'Overhead Press', muscle: 'Shoulders', setsTarget: 3, repsTarget: '8', defaultLbs: 95, restSeconds: 90, groupId: 'full_ss1' },
    ],
  },
];

// ── Personalization ────────────────────────────────────────────────────────────
export function buildPersonalizedPrograms(profile: UserProfile | null): Program[] {
  if (!profile) return DEFAULT_PROGRAMS;

  const { equipment, goals, trainingBackground } = profile;
  const primaryGoal = goals[0];
  const isAdvanced  = trainingBackground === 'advanced';
  const isBeginner  = trainingBackground === 'complete_beginner' || trainingBackground === 'beginner';

  const rest = {
    heavy:  isAdvanced ? 180 : 120,
    medium: isAdvanced ? 120 : 90,
    light:  isAdvanced ? 90  : 60,
    super:  0,
  };
  const setsFor  = (base: number) => isBeginner ? Math.max(2, base - 1) : base;
  const repsFor  = (hard: string, easy: string) => isBeginner ? easy : isAdvanced ? hard : easy;

  // ── BODYWEIGHT ─────────────────────────────────────────────────────────────
  if (equipment === 'bodyweight_only') {
    return [
      {
        id: 'bw_push', emoji: '💪', label: 'Push Day', tag: 'Chest · Shoulders · Tris',
        color: '#F97316', estMins: 40,
        exercises: [
          { name: 'Push-Ups', muscle: 'Chest / Triceps', setsTarget: setsFor(4), repsTarget: repsFor('15–20','10–15'), defaultLbs: 0, restSeconds: rest.medium },
          { name: 'Pike Push-Ups', muscle: 'Shoulders', setsTarget: setsFor(3), repsTarget: repsFor('12–15','8–12'), defaultLbs: 0, restSeconds: rest.light },
          { name: 'Diamond Push-Ups', muscle: 'Triceps', setsTarget: setsFor(3), repsTarget: repsFor('12','8–10'), defaultLbs: 0, restSeconds: 0, groupId: 'bw_push_ss1', notes: '⚡ Superset with Wide Push-Ups.' },
          { name: 'Wide Push-Ups', muscle: 'Outer Chest', setsTarget: setsFor(3), repsTarget: repsFor('15','10–12'), defaultLbs: 0, restSeconds: rest.light, groupId: 'bw_push_ss1' },
          { name: 'Chair Dips', muscle: 'Triceps / Chest', setsTarget: setsFor(3), repsTarget: repsFor('15','10'), defaultLbs: 0, restSeconds: rest.light },
        ],
      },
      {
        id: 'bw_pull', emoji: '🏋️', label: 'Pull Day', tag: 'Back · Biceps',
        color: '#06B6D4', estMins: 40,
        exercises: [
          { name: 'Pull-Ups', muscle: 'Back / Biceps', setsTarget: setsFor(4), repsTarget: 'max', defaultLbs: 0, restSeconds: rest.medium },
          { name: 'Chin-Ups', muscle: 'Biceps / Back', setsTarget: setsFor(3), repsTarget: 'max', defaultLbs: 0, restSeconds: rest.medium },
          { name: 'Inverted Rows', muscle: 'Back', setsTarget: setsFor(3), repsTarget: repsFor('15','10–12'), defaultLbs: 0, restSeconds: 0, groupId: 'bw_pull_ss1', notes: '⚡ Superset with Superman Hold.' },
          { name: 'Superman Hold', muscle: 'Lower Back', setsTarget: setsFor(3), repsTarget: '10 (3s hold)', defaultLbs: 0, restSeconds: rest.light, groupId: 'bw_pull_ss1' },
          { name: 'Reverse Snow Angels', muscle: 'Rear Delts', setsTarget: setsFor(3), repsTarget: repsFor('20','15'), defaultLbs: 0, restSeconds: rest.light },
        ],
      },
      {
        id: 'bw_legs', emoji: '🦵', label: 'Leg Day', tag: 'Quads · Hams · Glutes',
        color: '#8B5CF6', estMins: 40,
        exercises: [
          { name: 'Air Squats', muscle: 'Quads / Glutes', setsTarget: setsFor(4), repsTarget: repsFor('25','20'), defaultLbs: 0, restSeconds: rest.light },
          { name: 'Bulgarian Split Squat', muscle: 'Glutes / Quads', setsTarget: setsFor(3), repsTarget: repsFor('12/leg','8/leg'), defaultLbs: 0, restSeconds: rest.medium },
          { name: 'Glute Bridge', muscle: 'Glutes', setsTarget: setsFor(3), repsTarget: repsFor('20','15'), defaultLbs: 0, restSeconds: 0, groupId: 'bw_legs_ss1', notes: '⚡ Superset with Single-Leg Calf Raise.' },
          { name: 'Single-Leg Calf Raise', muscle: 'Calves', setsTarget: setsFor(3), repsTarget: repsFor('20/leg','15/leg'), defaultLbs: 0, restSeconds: rest.light, groupId: 'bw_legs_ss1' },
          { name: 'Nordic Curl', muscle: 'Hamstrings', setsTarget: setsFor(3), repsTarget: repsFor('6','3–5'), defaultLbs: 0, restSeconds: rest.medium, notes: 'Anchor feet under something heavy. Go slow on the way down.' },
        ],
      },
      {
        id: 'bw_full', emoji: '🔥', label: 'Full Body', tag: 'Everything · Bodyweight',
        color: '#F97316', estMins: 45,
        exercises: [
          { name: 'Air Squats', muscle: 'Quads / Glutes', setsTarget: setsFor(3), repsTarget: repsFor('20','15'), defaultLbs: 0, restSeconds: 0, groupId: 'bw_full_c1', notes: '⚡ Circuit: do all 5 exercises back to back, then rest 90s.' },
          { name: 'Push-Ups', muscle: 'Chest / Triceps', setsTarget: setsFor(3), repsTarget: repsFor('15','10'), defaultLbs: 0, restSeconds: 0, groupId: 'bw_full_c1' },
          { name: 'Inverted Rows', muscle: 'Back', setsTarget: setsFor(3), repsTarget: repsFor('15','10'), defaultLbs: 0, restSeconds: 0, groupId: 'bw_full_c1' },
          { name: 'Glute Bridge', muscle: 'Glutes', setsTarget: setsFor(3), repsTarget: repsFor('20','15'), defaultLbs: 0, restSeconds: 0, groupId: 'bw_full_c1' },
          { name: 'Mountain Climbers', muscle: 'Core / Cardio', setsTarget: setsFor(3), repsTarget: repsFor('30 reps','20 reps'), defaultLbs: 0, restSeconds: 90, groupId: 'bw_full_c1', notes: 'Last in circuit — rest 90s, then repeat.' },
        ],
      },
    ];
  }

  // ── DUMBBELLS ──────────────────────────────────────────────────────────────
  if (equipment === 'dumbbells_only') {
    return [
      {
        id: 'db_push', emoji: '💪', label: 'Push Day', tag: 'Chest · Shoulders · Tris',
        color: '#F97316', estMins: 50,
        exercises: [
          { name: 'DB Bench Press', muscle: 'Chest / Triceps', setsTarget: setsFor(4), repsTarget: repsFor('8–10','10–12'), defaultLbs: 50, restSeconds: rest.heavy },
          { name: 'DB Overhead Press', muscle: 'Shoulders', setsTarget: setsFor(3), repsTarget: repsFor('8–10','10–12'), defaultLbs: 35, restSeconds: rest.medium },
          { name: 'DB Incline Press', muscle: 'Upper Chest', setsTarget: setsFor(3), repsTarget: repsFor('10–12','12–15'), defaultLbs: 40, restSeconds: 0, groupId: 'db_push_ss1', notes: '⚡ Superset with Lateral Raise.' },
          { name: 'Lateral Raise', muscle: 'Shoulders', setsTarget: setsFor(3), repsTarget: repsFor('12–15','15'), defaultLbs: 20, restSeconds: rest.light, groupId: 'db_push_ss1' },
          { name: 'DB Skull Crusher', muscle: 'Triceps', setsTarget: setsFor(3), repsTarget: repsFor('10–12','12'), defaultLbs: 25, restSeconds: rest.light },
        ],
      },
      {
        id: 'db_pull', emoji: '🏋️', label: 'Pull Day', tag: 'Back · Biceps',
        color: '#06B6D4', estMins: 50,
        exercises: [
          { name: 'DB Romanian DL', muscle: 'Hamstrings / Back', setsTarget: setsFor(3), repsTarget: repsFor('8–10','10–12'), defaultLbs: 60, restSeconds: rest.heavy },
          { name: 'DB Row', muscle: 'Back', setsTarget: setsFor(4), repsTarget: repsFor('8–10','10–12'), defaultLbs: 50, restSeconds: rest.medium },
          { name: 'Pull-Ups', muscle: 'Back / Biceps', setsTarget: setsFor(3), repsTarget: 'max', defaultLbs: 0, restSeconds: rest.medium },
          { name: 'DB Face Pull', muscle: 'Rear Delts', setsTarget: setsFor(3), repsTarget: repsFor('15','15–20'), defaultLbs: 20, restSeconds: 0, groupId: 'db_pull_ss1', notes: '⚡ Superset with DB Hammer Curl.' },
          { name: 'DB Hammer Curl', muscle: 'Biceps', setsTarget: setsFor(3), repsTarget: repsFor('12','12–15'), defaultLbs: 30, restSeconds: rest.light, groupId: 'db_pull_ss1' },
        ],
      },
      {
        id: 'db_legs', emoji: '🦵', label: 'Leg Day', tag: 'Quads · Hams · Glutes',
        color: '#8B5CF6', estMins: 55,
        exercises: [
          { name: 'DB Goblet Squat', muscle: 'Quads / Glutes', setsTarget: setsFor(4), repsTarget: repsFor('10–12','12'), defaultLbs: 50, restSeconds: rest.medium },
          { name: 'DB Romanian DL', muscle: 'Hamstrings', setsTarget: setsFor(3), repsTarget: repsFor('10–12','12'), defaultLbs: 60, restSeconds: rest.medium },
          { name: 'DB Walking Lunge', muscle: 'Quads / Glutes', setsTarget: setsFor(3), repsTarget: repsFor('10/leg','12/leg'), defaultLbs: 30, restSeconds: 0, groupId: 'db_legs_ss1', notes: '⚡ Superset with DB Calf Raise.' },
          { name: 'DB Calf Raise', muscle: 'Calves', setsTarget: setsFor(3), repsTarget: repsFor('15–20','20'), defaultLbs: 50, restSeconds: rest.light, groupId: 'db_legs_ss1' },
          { name: 'DB Step-Up', muscle: 'Glutes / Quads', setsTarget: setsFor(3), repsTarget: repsFor('10/leg','12/leg'), defaultLbs: 35, restSeconds: rest.medium },
        ],
      },
      {
        id: 'db_full', emoji: '🔥', label: 'Full Body', tag: 'Dumbbells · Total Body',
        color: '#F97316', estMins: 60,
        exercises: [
          { name: 'DB Goblet Squat', muscle: 'Quads / Glutes', setsTarget: setsFor(3), repsTarget: repsFor('10–12','12'), defaultLbs: 50, restSeconds: rest.medium },
          { name: 'DB Bench Press', muscle: 'Chest / Triceps', setsTarget: setsFor(3), repsTarget: repsFor('10','12'), defaultLbs: 50, restSeconds: rest.medium },
          { name: 'DB Row', muscle: 'Back / Biceps', setsTarget: setsFor(3), repsTarget: repsFor('10','12'), defaultLbs: 50, restSeconds: rest.medium },
          { name: 'DB Overhead Press', muscle: 'Shoulders', setsTarget: setsFor(3), repsTarget: repsFor('10','12'), defaultLbs: 35, restSeconds: 0, groupId: 'db_full_ss1', notes: '⚡ Superset with DB Romanian DL.' },
          { name: 'DB Romanian DL', muscle: 'Hamstrings', setsTarget: setsFor(3), repsTarget: repsFor('10','12'), defaultLbs: 55, restSeconds: rest.medium, groupId: 'db_full_ss1' },
        ],
      },
    ];
  }

  // ── GLUTE FOCUS ────────────────────────────────────────────────────────────
  if (primaryGoal === 'glute_focus') {
    return [
      {
        id: 'glute_a', emoji: '🍑', label: 'Glutes A', tag: 'Hip Thrust · Split Squat · RDL',
        color: '#F97316', estMins: 55,
        exercises: [
          { name: 'Hip Thrust', muscle: 'Glutes', setsTarget: setsFor(4), repsTarget: repsFor('8–10','10–12'), defaultLbs: 135, restSeconds: rest.medium, notes: 'Squeeze at top for 1 second. Drive through heels.' },
          { name: 'Bulgarian Split Squat', muscle: 'Glutes / Quads', setsTarget: setsFor(3), repsTarget: repsFor('10/leg','12/leg'), defaultLbs: 40, restSeconds: rest.medium },
          { name: 'Romanian Deadlift', muscle: 'Glutes / Hams', setsTarget: setsFor(3), repsTarget: repsFor('10–12','12'), defaultLbs: 135, restSeconds: rest.medium },
          { name: 'Cable Kickback', muscle: 'Glutes', setsTarget: setsFor(3), repsTarget: repsFor('15/leg','15/leg'), defaultLbs: 30, restSeconds: 0, groupId: 'glute_ss1', notes: '⚡ Superset with Hip Abduction.' },
          { name: 'Hip Abduction Machine', muscle: 'Outer Glutes', setsTarget: setsFor(3), repsTarget: repsFor('15–20','20'), defaultLbs: 50, restSeconds: rest.light, groupId: 'glute_ss1' },
        ],
      },
      {
        id: 'glute_b', emoji: '🦵', label: 'Glutes B', tag: 'Squat · Leg Press · Isolation',
        color: '#8B5CF6', estMins: 55,
        exercises: [
          { name: 'Back Squat', muscle: 'Quads / Glutes', setsTarget: setsFor(4), repsTarget: repsFor('8–10','10–12'), defaultLbs: 135, restSeconds: rest.heavy },
          { name: 'Leg Press', muscle: 'Quads / Glutes', setsTarget: setsFor(3), repsTarget: repsFor('12','15'), defaultLbs: 270, restSeconds: rest.medium, notes: 'High foot placement targets glutes more.' },
          { name: 'Sumo Deadlift', muscle: 'Inner Glutes / Hams', setsTarget: setsFor(3), repsTarget: repsFor('8–10','10'), defaultLbs: 155, restSeconds: rest.medium },
          { name: 'Walking Lunge', muscle: 'Glutes / Quads', setsTarget: setsFor(3), repsTarget: repsFor('10/leg','12/leg'), defaultLbs: 35, restSeconds: 0, groupId: 'glute_b_ss1', notes: '⚡ Superset with Glute Bridge.' },
          { name: 'Glute Bridge', muscle: 'Glutes', setsTarget: setsFor(3), repsTarget: repsFor('15','20'), defaultLbs: 45, restSeconds: rest.light, groupId: 'glute_b_ss1' },
        ],
      },
      {
        id: 'glute_upper', emoji: '💪', label: 'Upper Day', tag: 'Back · Chest · Shoulders',
        color: '#06B6D4', estMins: 50,
        exercises: [
          { name: 'Bench Press', muscle: 'Chest / Triceps', setsTarget: setsFor(3), repsTarget: repsFor('8–10','10'), defaultLbs: 95, restSeconds: rest.medium },
          { name: 'Barbell Row', muscle: 'Back', setsTarget: setsFor(3), repsTarget: repsFor('8–10','10'), defaultLbs: 95, restSeconds: rest.medium },
          { name: 'Overhead Press', muscle: 'Shoulders', setsTarget: setsFor(3), repsTarget: repsFor('10','12'), defaultLbs: 65, restSeconds: 0, groupId: 'glute_upper_ss', notes: '⚡ Superset with Pull-Ups.' },
          { name: 'Pull-Ups', muscle: 'Back / Biceps', setsTarget: setsFor(3), repsTarget: 'max', defaultLbs: 0, restSeconds: rest.medium, groupId: 'glute_upper_ss' },
          { name: 'Lateral Raise', muscle: 'Shoulders', setsTarget: setsFor(3), repsTarget: repsFor('15','15–20'), defaultLbs: 20, restSeconds: rest.light },
        ],
      },
      {
        id: 'glute_full', emoji: '🔥', label: 'Full Body', tag: 'Glute Focus · Balanced',
        color: '#F97316', estMins: 60,
        exercises: DEFAULT_PROGRAMS[4].exercises,
      },
    ];
  }

  // ── RUN / CARDIO goals ─────────────────────────────────────────────────────
  const isRunGoal = ['run_5k','run_10k','run_half','run_full'].includes(primaryGoal ?? '');
  if (isRunGoal) {
    const dist = primaryGoal === 'run_full' ? 'Marathon' : primaryGoal === 'run_half' ? 'Half' : primaryGoal === 'run_10k' ? '10K' : '5K';
    return [
      {
        id: 'run_strength', emoji: '🏃', label: 'Run Strength', tag: 'Injury Prevention · Power',
        color: '#F97316', estMins: 45,
        exercises: [
          { name: 'Bulgarian Split Squat', muscle: 'Quads / Glutes', setsTarget: setsFor(3), repsTarget: repsFor('10/leg','12/leg'), defaultLbs: 30, restSeconds: rest.medium },
          { name: 'Romanian Deadlift', muscle: 'Hamstrings', setsTarget: setsFor(3), repsTarget: repsFor('10','12'), defaultLbs: 95, restSeconds: rest.medium },
          { name: 'Calf Raise', muscle: 'Calves', setsTarget: setsFor(4), repsTarget: repsFor('20','20'), defaultLbs: 95, restSeconds: 0, groupId: 'run_ss1', notes: '⚡ Superset with Hip Thrust.' },
          { name: 'Hip Thrust', muscle: 'Glutes', setsTarget: setsFor(3), repsTarget: repsFor('12','15'), defaultLbs: 65, restSeconds: rest.light, groupId: 'run_ss1' },
          { name: 'Plank', muscle: 'Core', setsTarget: setsFor(3), repsTarget: '60s', defaultLbs: 0, restSeconds: rest.light },
        ],
      },
      {
        id: 'run_upper', emoji: '💪', label: 'Upper Strength', tag: 'Arm Drive · Posture',
        color: '#06B6D4', estMins: 40,
        exercises: [
          { name: 'Pull-Ups', muscle: 'Back / Biceps', setsTarget: setsFor(3), repsTarget: 'max', defaultLbs: 0, restSeconds: rest.medium },
          { name: 'Push-Ups', muscle: 'Chest', setsTarget: setsFor(3), repsTarget: repsFor('15','12'), defaultLbs: 0, restSeconds: rest.light },
          { name: 'Overhead Press', muscle: 'Shoulders', setsTarget: setsFor(3), repsTarget: repsFor('10','12'), defaultLbs: 65, restSeconds: 0, groupId: 'run_upper_ss', notes: '⚡ Superset with Face Pull.' },
          { name: 'Face Pull', muscle: 'Rear Delts / Posture', setsTarget: setsFor(3), repsTarget: repsFor('15','15–20'), defaultLbs: 35, restSeconds: rest.light, groupId: 'run_upper_ss' },
          { name: 'Dead Bug', muscle: 'Core / Stability', setsTarget: setsFor(3), repsTarget: '10/side', defaultLbs: 0, restSeconds: rest.light },
        ],
      },
      {
        id: 'intervals', emoji: '⚡', label: `${dist} Intervals`, tag: 'Speed · Tempo · Endurance',
        color: '#F59E0B', estMins: 40,
        exercises: [
          { name: 'Warm-Up Jog', muscle: 'Cardio', setsTarget: 1, repsTarget: '5 min', defaultLbs: 0, restSeconds: 0, notes: 'Easy pace, Zone 2.' },
          { name: 'Tempo Run', muscle: 'Cardio', setsTarget: 2, repsTarget: '10 min', defaultLbs: 0, restSeconds: 120, notes: 'Comfortably hard — can say a few words but not hold conversation.' },
          { name: 'Speed Intervals', muscle: 'Cardio', setsTarget: 6, repsTarget: '1 min hard / 1 min easy', defaultLbs: 0, restSeconds: 60, notes: '90% effort on the hard intervals.' },
          { name: 'Strides', muscle: 'Cardio', setsTarget: 4, repsTarget: '100m', defaultLbs: 0, restSeconds: 60, notes: 'Build to 95% speed. Relaxed, controlled stride.' },
          { name: 'Cool-Down Walk', muscle: 'Recovery', setsTarget: 1, repsTarget: '5 min', defaultLbs: 0, restSeconds: 0 },
        ],
      },
      DEFAULT_PROGRAMS[4], // Full body
    ];
  }

  // ── STRENGTH goal ──────────────────────────────────────────────────────────
  if (primaryGoal === 'strength') {
    const sR = isAdvanced ? '3–5' : '5';
    return [
      {
        id: 'str_squat', emoji: '🏋️', label: 'Squat Day', tag: 'Linear Progression · Lower',
        color: '#F97316', estMins: 65,
        exercises: [
          { name: 'Back Squat', muscle: 'Quads / Glutes', setsTarget: 5, repsTarget: sR, defaultLbs: 185, restSeconds: 180, notes: 'Add 5 lbs each session (beginner progression).' },
          { name: 'Romanian Deadlift', muscle: 'Hamstrings', setsTarget: 3, repsTarget: '6–8', defaultLbs: 155, restSeconds: rest.medium },
          { name: 'Leg Press', muscle: 'Quads', setsTarget: 3, repsTarget: '8', defaultLbs: 270, restSeconds: rest.medium },
          { name: 'Walking Lunge', muscle: 'Glutes / Quads', setsTarget: 2, repsTarget: '10', defaultLbs: 45, restSeconds: 0, groupId: 'str_sq_ss', notes: '⚡ Superset with Calf Raise.' },
          { name: 'Calf Raise', muscle: 'Calves', setsTarget: 2, repsTarget: '15', defaultLbs: 135, restSeconds: rest.light, groupId: 'str_sq_ss' },
        ],
      },
      {
        id: 'str_bench', emoji: '💪', label: 'Bench Day', tag: 'Upper Strength · Press',
        color: '#06B6D4', estMins: 60,
        exercises: [
          { name: 'Bench Press', muscle: 'Chest / Triceps', setsTarget: 5, repsTarget: sR, defaultLbs: 185, restSeconds: 180, notes: 'Add 5 lbs each session. Touch chest, full lockout.' },
          { name: 'Overhead Press', muscle: 'Shoulders', setsTarget: 3, repsTarget: '6–8', defaultLbs: 115, restSeconds: rest.heavy },
          { name: 'Barbell Row', muscle: 'Back', setsTarget: 3, repsTarget: '6–8', defaultLbs: 155, restSeconds: rest.medium },
          { name: 'Dips', muscle: 'Chest / Triceps', setsTarget: 3, repsTarget: 'max', defaultLbs: 0, restSeconds: 0, groupId: 'str_bench_ss', notes: '⚡ Superset with Tricep Pushdown.' },
          { name: 'Tricep Pushdown', muscle: 'Triceps', setsTarget: 3, repsTarget: '10', defaultLbs: 65, restSeconds: rest.light, groupId: 'str_bench_ss' },
        ],
      },
      {
        id: 'str_dead', emoji: '⛓️', label: 'Deadlift Day', tag: 'Posterior Chain · Power',
        color: '#8B5CF6', estMins: 65,
        exercises: [
          { name: 'Deadlift', muscle: 'Back / Glutes', setsTarget: isAdvanced ? 5 : 3, repsTarget: isAdvanced ? '2–4' : '5', defaultLbs: 275, restSeconds: 240, notes: 'Biggest lift. Full reset each rep. Protect your setup.' },
          { name: 'Pull-Ups', muscle: 'Back / Biceps', setsTarget: 4, repsTarget: 'max', defaultLbs: 0, restSeconds: rest.medium },
          { name: 'Barbell Row', muscle: 'Back', setsTarget: 3, repsTarget: '6–8', defaultLbs: 155, restSeconds: rest.medium },
          { name: 'Face Pull', muscle: 'Rear Delts', setsTarget: 3, repsTarget: '15', defaultLbs: 45, restSeconds: 0, groupId: 'str_dead_ss', notes: '⚡ Superset with Hammer Curl.' },
          { name: 'Hammer Curl', muscle: 'Biceps', setsTarget: 3, repsTarget: '10', defaultLbs: 35, restSeconds: rest.light, groupId: 'str_dead_ss' },
        ],
      },
      DEFAULT_PROGRAMS[4],
    ];
  }

  // ── RESISTANCE BANDS ──────────────────────────────────────────────────────
  if (equipment === 'resistance_bands') {
    return [
      {
        id: 'band_upper', emoji: '💪', label: 'Upper Body', tag: 'Bands · Push & Pull',
        color: '#F97316', estMins: 45,
        exercises: [
          { name: 'Band Push-Ups', muscle: 'Chest / Triceps', setsTarget: setsFor(3), repsTarget: repsFor('15','12'), defaultLbs: 0, restSeconds: rest.light },
          { name: 'Band Overhead Press', muscle: 'Shoulders', setsTarget: setsFor(3), repsTarget: repsFor('12','10–12'), defaultLbs: 0, restSeconds: rest.light },
          { name: 'Band Pull-Apart', muscle: 'Rear Delts / Traps', setsTarget: setsFor(3), repsTarget: repsFor('20','15'), defaultLbs: 0, restSeconds: 0, groupId: 'band_u_ss', notes: '⚡ Superset with Band Bicep Curl.' },
          { name: 'Band Bicep Curl', muscle: 'Biceps', setsTarget: setsFor(3), repsTarget: repsFor('15','12'), defaultLbs: 0, restSeconds: rest.light, groupId: 'band_u_ss' },
          { name: 'Band Tricep Ext.', muscle: 'Triceps', setsTarget: setsFor(3), repsTarget: repsFor('15','12'), defaultLbs: 0, restSeconds: rest.light },
        ],
      },
      {
        id: 'band_lower', emoji: '🦵', label: 'Lower Body', tag: 'Bands · Legs & Glutes',
        color: '#8B5CF6', estMins: 45,
        exercises: [
          { name: 'Band Squat', muscle: 'Quads / Glutes', setsTarget: setsFor(3), repsTarget: repsFor('20','15'), defaultLbs: 0, restSeconds: rest.light },
          { name: 'Band Deadlift', muscle: 'Hamstrings', setsTarget: setsFor(3), repsTarget: repsFor('15','12'), defaultLbs: 0, restSeconds: rest.light },
          { name: 'Band Glute Kickback', muscle: 'Glutes', setsTarget: setsFor(3), repsTarget: repsFor('15/leg','15/leg'), defaultLbs: 0, restSeconds: 0, groupId: 'band_l_ss', notes: '⚡ Superset with Band Clamshell.' },
          { name: 'Band Clamshell', muscle: 'Hip Abductors', setsTarget: setsFor(3), repsTarget: repsFor('20/side','15/side'), defaultLbs: 0, restSeconds: rest.light, groupId: 'band_l_ss' },
          { name: 'Band Lateral Walk', muscle: 'Glutes / Hip', setsTarget: setsFor(3), repsTarget: '20 steps each way', defaultLbs: 0, restSeconds: rest.light },
        ],
      },
      {
        id: 'band_full', emoji: '🔥', label: 'Full Body', tag: 'Bands · Circuit',
        color: '#F97316', estMins: 50,
        exercises: [
          { name: 'Band Squat', muscle: 'Quads / Glutes', setsTarget: setsFor(3), repsTarget: repsFor('20','15'), defaultLbs: 0, restSeconds: 0, groupId: 'band_full_c', notes: '⚡ Circuit — do all 5 back-to-back, rest 90s.' },
          { name: 'Band Push-Ups', muscle: 'Chest', setsTarget: setsFor(3), repsTarget: repsFor('15','12'), defaultLbs: 0, restSeconds: 0, groupId: 'band_full_c' },
          { name: 'Band Row', muscle: 'Back', setsTarget: setsFor(3), repsTarget: repsFor('15','12'), defaultLbs: 0, restSeconds: 0, groupId: 'band_full_c' },
          { name: 'Band Overhead Press', muscle: 'Shoulders', setsTarget: setsFor(3), repsTarget: repsFor('12','10'), defaultLbs: 0, restSeconds: 0, groupId: 'band_full_c' },
          { name: 'Band Glute Bridge', muscle: 'Glutes', setsTarget: setsFor(3), repsTarget: repsFor('20','15'), defaultLbs: 0, restSeconds: 90, groupId: 'band_full_c', notes: 'Last in circuit — rest 90s, then repeat round.' },
        ],
      },
    ];
  }

  // ── KETTLEBELLS ────────────────────────────────────────────────────────────
  if (equipment === 'kettlebells_only') {
    return [
      {
        id: 'kb_a', emoji: '🔔', label: 'KB Day A', tag: 'Swings · Press · Squat',
        color: '#F97316', estMins: 45,
        exercises: [
          { name: 'KB Swing', muscle: 'Glutes / Hams / Back', setsTarget: setsFor(5), repsTarget: '20', defaultLbs: 35, restSeconds: rest.light, notes: 'Hinge, not squat. Snap hips. Power from posterior chain.' },
          { name: 'KB Goblet Squat', muscle: 'Quads / Glutes', setsTarget: setsFor(4), repsTarget: repsFor('10','12'), defaultLbs: 35, restSeconds: rest.light },
          { name: 'KB Clean & Press', muscle: 'Shoulders / Glutes', setsTarget: setsFor(3), repsTarget: '6/arm', defaultLbs: 35, restSeconds: rest.medium },
          { name: 'KB Romanian DL', muscle: 'Hamstrings', setsTarget: setsFor(3), repsTarget: repsFor('8','10'), defaultLbs: 53, restSeconds: 0, groupId: 'kb_a_ss', notes: '⚡ Superset with KB Renegade Row.' },
          { name: 'KB Renegade Row', muscle: 'Back / Core', setsTarget: setsFor(3), repsTarget: '8/arm', defaultLbs: 25, restSeconds: rest.medium, groupId: 'kb_a_ss' },
        ],
      },
      {
        id: 'kb_b', emoji: '🔔', label: 'KB Day B', tag: 'TGU · Carries · Floor Press',
        color: '#06B6D4', estMins: 45,
        exercises: [
          { name: 'KB Turkish Get-Up', muscle: 'Full Body / Core', setsTarget: setsFor(3), repsTarget: '3/arm', defaultLbs: 26, restSeconds: rest.medium, notes: 'Slow and deliberate. Own every position.' },
          { name: 'KB Single-Leg DL', muscle: 'Glutes / Balance', setsTarget: setsFor(3), repsTarget: repsFor('8/leg','10/leg'), defaultLbs: 35, restSeconds: rest.medium },
          { name: 'KB Farmer Carry', muscle: 'Grip / Traps / Core', setsTarget: setsFor(4), repsTarget: '40m', defaultLbs: 53, restSeconds: rest.light },
          { name: 'KB Floor Press', muscle: 'Chest / Triceps', setsTarget: setsFor(3), repsTarget: repsFor('10','12'), defaultLbs: 35, restSeconds: 0, groupId: 'kb_b_ss', notes: '⚡ Superset with KB Windmill.' },
          { name: 'KB Windmill', muscle: 'Core / Shoulders', setsTarget: setsFor(3), repsTarget: '5/side', defaultLbs: 26, restSeconds: rest.medium, groupId: 'kb_b_ss' },
        ],
      },
    ];
  }

  // ── BEGINNER FRIENDLY (default → scaled down) ───────────────────────────────
  if (isBeginner) {
    return DEFAULT_PROGRAMS.map(p => ({
      ...p,
      exercises: p.exercises.map(ex => ({
        ...ex,
        setsTarget: Math.max(2, ex.setsTarget - 1),
        repsTarget: ex.repsTarget.replace('5–6','8–10').replace('6–8','10–12').replace('8–10','12–15').replace(/^5$/,'8'),
        restSeconds: Math.min(ex.restSeconds + 30, ex.restSeconds === 0 ? 0 : 120),
      })),
    }));
  }

  // ── DEFAULT: full gym, intermediate ───────────────────────────────────────
  return DEFAULT_PROGRAMS;
}

// ── Week schedule ─────────────────────────────────────────────────────────────
/**
 * Returns a 7-item array indexed Monday(0)…Sunday(6).
 * null = rest day, Program = workout day.
 */
export function getWeekSchedule(programs: Program[], daysPerWeek: number): (Program | null)[] {
  const week: (Program | null)[] = Array(7).fill(null);
  const patterns: Record<number, number[]> = {
    1: [0],
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 4, 5],
    6: [0, 1, 2, 3, 4, 5],
    7: [0, 1, 2, 3, 4, 5, 6],
  };
  const clamped = Math.min(7, Math.max(1, daysPerWeek));
  const activeDays = patterns[clamped] ?? patterns[3];
  activeDays.forEach((dayIdx, i) => {
    if (i < programs.length) week[dayIdx] = programs[i % programs.length];
  });
  return week;
}

/** Get today's day index where Monday = 0, Sunday = 6 */
export function getTodayDayIdx(): number {
  const js = new Date().getDay(); // 0=Sun, 1=Mon, ...6=Sat
  return js === 0 ? 6 : js - 1;  // convert to Mon=0..Sun=6
}
