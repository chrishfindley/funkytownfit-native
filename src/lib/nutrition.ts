import { UserProfile, NutritionTargets, Goal } from './types';
export type { NutritionTargets };

/**
 * Calculates daily calorie and macro targets using evidence-based formulas.
 *
 * BMR: Mifflin-St Jeor equation (most validated in research)
 * Activity multiplier: Standard ACSM activity factors
 * Protein targets: Based on Morton et al. (2018) meta-analysis and
 *   Stokes et al. (2018) — 1.6–2.2g/kg for muscle building,
 *   1.2–1.6g/kg for fat loss (to preserve lean mass)
 */

export function calculateBMR(profile: UserProfile): number {
  const { weightKg, heightCm, age, sex } = profile;
  if (sex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    // Use male formula for 'prefer_not' as conservative estimate
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
}

function getActivityMultiplier(daysPerWeek: number, exerciseType: string): number {
  // ACSM activity factors adjusted for exercise type
  if (daysPerWeek <= 2) return 1.375;
  if (daysPerWeek <= 3) return 1.55;
  if (daysPerWeek <= 4) {
    return exerciseType.includes('run') || exerciseType.includes('bike') ? 1.65 : 1.55;
  }
  if (daysPerWeek <= 5) return 1.725;
  return 1.9;
}

function getCaloricAdjustment(goal: Goal): number {
  switch (goal) {
    case 'lose_fat':
      return -400;
    case 'build_muscle':
    case 'glute_focus':
      return 250;
    case 'body_recomp':
      return 0;  // Maintenance + high protein for recomp
    case 'strength':
      return 200;
    case 'run_5k':
    case 'run_10k':
      return 0;
    case 'run_half':
    case 'run_full':
      return 100;
    case 'maintain':
    case 'mobility_flexibility':
      return 0;
    case 'athletic_performance':
      return 150;
    default:
      return 0;
  }
}

function getProteinTarget(weightKg: number, goal: Goal): number {
  switch (goal) {
    case 'lose_fat':
      return Math.round(weightKg * 2.0);
    case 'build_muscle':
    case 'glute_focus':
      return Math.round(weightKg * 1.8);
    case 'body_recomp':
    case 'strength':
      return Math.round(weightKg * 2.2); // Higher protein for recomp and strength
    case 'run_5k':
    case 'run_10k':
      return Math.round(weightKg * 1.5);
    case 'run_half':
    case 'run_full':
      return Math.round(weightKg * 1.6);
    case 'athletic_performance':
      return Math.round(weightKg * 1.9);
    default:
      return Math.round(weightKg * 1.6);
  }
}

export function calculateNutritionTargets(profile: UserProfile): NutritionTargets {
  const bmr = calculateBMR(profile);
  // Use first exercise type for activity multiplier
  const primaryExType = profile.exerciseTypes?.[0] ?? 'lift';
  const tdee = bmr * getActivityMultiplier(profile.daysPerWeek, primaryExType);
  // Use first goal as primary for caloric adjustment
  const primaryGoal = profile.goals?.[0] ?? 'maintain';
  const adjustment = getCaloricAdjustment(primaryGoal);
  const targetCalories = Math.round(tdee + adjustment);

  const proteinG = getProteinTarget(profile.weightKg, primaryGoal);
  const proteinCalories = proteinG * 4;

  // Fat: minimum 0.8g/kg for hormonal health (Hamalainen et al. 1984)
  const fatG = Math.round(Math.max(profile.weightKg * 0.8, targetCalories * 0.25 / 9));
  const fatCalories = fatG * 9;

  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbsG = Math.max(0, Math.round(carbCalories / 4));

  const goalDescriptions: Partial<Record<Goal, string>> = {
    lose_fat: `a 400 calorie daily deficit to lose ~0.4kg/week while preserving muscle`,
    build_muscle: `a 250 calorie lean bulk surplus to maximize muscle gain`,
    body_recomp: `maintenance with high protein for simultaneous muscle gain and fat loss`,
    strength: `a slight surplus to support strength development`,
    improve_fitness: `maintenance calories at your estimated ${Math.round(tdee)} TDEE`,
    run_5k: `maintenance to fuel your running performance`,
    run_10k: `maintenance to fuel your running performance`,
    run_half: `a slight surplus to support high training volume`,
    run_full: `a slight surplus to support marathon training volume`,
    maintain: `maintenance at your estimated ${Math.round(tdee)} TDEE`,
    athletic_performance: `a slight surplus to support athletic performance and recovery`,
    glute_focus: `maintenance with high protein to support muscle development`,
    mobility_flexibility: `maintenance to support your training`,
  };

  return {
    calories: targetCalories,
    proteinG,
    carbsG,
    fatG,
    basisNote: `Mifflin-St Jeor BMR + ACSM activity factors for ${goalDescriptions[primaryGoal] ?? 'your goals'}. Protein ${proteinG}g (${(proteinG / profile.weightKg).toFixed(1)}g/kg) per Morton et al. 2018.`,
  };
}

// ─── USDA FoodData Central API ────────────────────────────────────────────────

const USDA_API_KEY = 'DEMO_KEY'; // Free demo key — rate limited but functional
const USDA_BASE = 'https://api.nal.usda.gov/fdc/v1';

export interface USDAFoodResult {
  fdcId: number;
  description: string;
  brandOwner?: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    value: number;
    unitName: string;
  }>;
  servingSize?: number;
  servingSizeUnit?: string;
}

export async function searchFoods(query: string, pageSize = 20) {
  const res = await fetch(
    `${USDA_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&dataType=SR%20Legacy,Survey%20(FNDDS),Branded&api_key=${USDA_API_KEY}`
  );
  if (!res.ok) throw new Error('Food search failed');
  const data = await res.json();
  return data.foods as USDAFoodResult[];
}

export function extractMacros(food: USDAFoodResult) {
  const get = (id: number) =>
    food.foodNutrients.find((n) => n.nutrientId === id)?.value ?? 0;

  return {
    fdcId: String(food.fdcId),
    name: food.description,
    brandName: food.brandOwner,
    calories100g: get(1008),  // Energy (kcal)
    protein100g: get(1003),   // Protein
    carbs100g: get(1005),     // Carbohydrates
    fat100g: get(1004),       // Total fat
    fiber100g: get(1079),     // Fiber
    servingSize: food.servingSize,
    servingUnit: food.servingSizeUnit,
  };
}

export function calculateFoodMacros(
  food: { calories100g: number; protein100g: number; carbs100g: number; fat100g: number },
  amountG: number
) {
  const ratio = amountG / 100;
  return {
    calories: Math.round(food.calories100g * ratio),
    proteinG: Math.round(food.protein100g * ratio * 10) / 10,
    carbsG: Math.round(food.carbs100g * ratio * 10) / 10,
    fatG: Math.round(food.fat100g * ratio * 10) / 10,
  };
}
