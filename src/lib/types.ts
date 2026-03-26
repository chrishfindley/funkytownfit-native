// ─── User Profile ────────────────────────────────────────────────────────────

export type Goal =
  | 'lose_fat'
  | 'build_muscle'
  | 'body_recomp'        // lose fat + build muscle simultaneously
  | 'improve_fitness'
  | 'strength'           // raw strength (powerlifting/barbell)
  | 'run_5k'
  | 'run_10k'
  | 'run_half'
  | 'run_full'
  | 'athletic_performance'
  | 'glute_focus'        // glute-dominant training
  | 'maintain'
  | 'mobility_flexibility'; // flexibility and movement quality

export type TrainingBackground =
  | 'complete_beginner'   // never trained consistently
  | 'beginner'            // < 6 months
  | 'intermediate'        // 6 months – 2 years
  | 'advanced';           // 2+ years

export type ExerciseType =
  | 'lift'
  | 'bodyweight_only'
  | 'run'
  | 'bike'
  | 'swim'
  | 'hiit'
  | 'kettlebell'
  | 'yoga_mobility'
  | 'lift_and_run'
  | 'lift_and_bike'
  | 'full_hybrid';

export type Equipment =
  | 'full_gym'            // barbells, cables, machines
  | 'dumbbells_only'
  | 'home_gym'            // dumbbells + some barbells/rack
  | 'bodyweight_only'
  | 'resistance_bands'
  | 'kettlebells_only'
  | 'gym_and_outdoor';    // gym + running/biking routes

export type Sex = 'male' | 'female' | 'prefer_not';

export type MusicStyle =
  | 'rap'
  | 'country'
  | 'rock'
  | 'pop'
  | 'electronic'
  | 'rnb'
  | 'latin'
  | 'metal'
  | 'indie'
  | 'jazz'
  | 'everything'; // no preference / eclectic

/**
 * Follow-up detail question based on musicStyle.
 * rap → 'kendrick' | 'drake'
 * country → 'old_school' | 'new_country'
 * rock → 'classic_rock' | 'modern_rock'
 * others → no follow-up (undefined)
 */
export type MusicVibeDetail =
  | 'kendrick' | 'drake'
  | 'old_school_country' | 'new_country'
  | 'classic_rock' | 'modern_rock';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  goals: Goal[];               // multi-select — primary goal is [0]
  primaryGoal?: Goal;
  trainingBackground: TrainingBackground;
  exerciseTypes: ExerciseType[]; // multi-select — all selected types
  equipment: Equipment;
  daysPerWeek: number;        // 2–6
  minutesPerSession: number;  // 30–90
  injuries?: string;
  musicStyle?: MusicStyle;
  musicVibeDetail?: MusicVibeDetail;
  createdAt: string;
  updatedAt: string;
}

// ─── Workout Plan ─────────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'core'
  | 'full_body' | 'cardio';

export type DayType =
  | 'upper' | 'lower' | 'push' | 'pull' | 'legs'
  | 'full_body' | 'run' | 'bike' | 'rest' | 'active_recovery'
  | 'chest' | 'back' | 'shoulders' | 'arms' | 'glutes' | 'hiit' | 'mobility';

export interface Exercise {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  instructions: string;
  scienceNote?: string;
  videoKeyword?: string;
}

export interface WorkoutSet {
  sets: number;
  reps?: string;
  duration?: string;
  rest: string;
  rpe?: number;
  note?: string;
  scienceNote?: string;
}

export interface WorkoutExercise {
  exercise: Exercise;
  prescription: WorkoutSet;
  order: number;
}

export interface WorkoutDay {
  dayNumber: number;
  dayType: DayType;
  label: string;
  warmup: string;
  exercises: WorkoutExercise[];
  cooldown: string;
  estimatedMinutes: number;
  coachNote?: string;
}

export type PhaseType = 'build' | 'deload' | 'peak';

// ─── Adaptive Check-ins ───────────────────────────────────────────────────────

export type CheckinRating = 'too_easy' | 'just_right' | 'too_hard';

export interface CheckinRecord {
  date: string;
  weekNumber: number;   // milestone week: 1, 3, or 6
  rating: CheckinRating;
}

export interface WeeklyPlan {
  week: number;
  days: WorkoutDay[];
  weeklyNote?: string;
  phaseLabel?: string;      // "Phase 1: Foundation" | "Deload" | "Phase 2: Progression"
  phaseType?: PhaseType;    // used for UI color / logic
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  programName: string;
  programDescription: string;
  scienceBasis: string;
  goals: Goal[];               // multi-goal support
  weeks: WeeklyPlan[];
  progressionNote: string;
  createdAt: string;
  cycleNumber: number;         // 1 = first run, increments each cycle
  templateName?: string;       // used to regenerate the next cycle
  deloadStarted?: string;      // ISO date — set when user begins optional deload
}

// ─── Workout Logging ──────────────────────────────────────────────────────────

export interface ExerciseSetLog {
  setNumber: number;
  weightKg?: number;   // undefined = bodyweight
  reps?: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps?: string;
  sets: ExerciseSetLog[];
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string;           // YYYY-MM-DD
  dayLabel: string;
  dayType: DayType;
  exercises: ExerciseLog[];
  durationMinutes: number;
  completedAt: string;    // ISO
  weekNumber: number;
  cycleNumber: number;
  caloriesBurned?: number; // estimated kcal burned during workout
}

// ─── Weight History ───────────────────────────────────────────────────────────

export interface WeightEntry {
  date: string;   // YYYY-MM-DD
  kg: number;
}

// ─── Water Tracking ───────────────────────────────────────────────────────────

export interface WaterLog {
  date: string;
  ml: number;
}

// ─── Nutrition ────────────────────────────────────────────────────────────────

export interface NutritionTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  basisNote: string;
}

export interface FoodItem {
  fdcId: string;
  name: string;
  brandName?: string;
  calories100g: number;
  protein100g: number;
  carbs100g: number;
  fat100g: number;
  fiber100g?: number;
  servingSize?: number;
  servingUnit?: string;
}

export interface FoodLogEntry {
  id: string;
  userId: string;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food: FoodItem;
  amountG: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  loggedAt: string;
}

export interface DailyLog {
  date: string;
  entries: FoodLogEntry[];
  totals: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  };
}
