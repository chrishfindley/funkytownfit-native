import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FoodDBResult {
  id: string;
  name: string;
  brand?: string;
  cal100g: number;
  prot100g: number;
  carb100g: number;
  fat100g: number;
  fiber100g: number;
  servingG: number;
  servingLabel: string;
  emoji: string;
  source: 'usda' | 'local';
}

export interface DayCalories {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface USDANutrient {
  nutrientId: number;
  value: number;
}

interface USDAFood {
  fdcId: string;
  description: string;
  brandName?: string;
  nutrients: USDANutrient[];
}

const USDA_NUTRIENT_MAP = {
  1008: 'energy', // Energy (kcal)
  1003: 'protein', // Protein
  1005: 'carbs', // Carbohydrates
  1004: 'fat', // Fat
  1079: 'fiber', // Fiber
};

const LOCAL_FOOD_DATABASE: FoodDBResult[] = [
  // Proteins
  { id: 'local_chicken_breast', name: 'Chicken Breast', cal100g: 165, prot100g: 31, carb100g: 0, fat100g: 3.6, fiber100g: 0, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🍗', source: 'local' },
  { id: 'local_ground_beef_lean', name: 'Ground Beef (Lean)', cal100g: 217, prot100g: 26, carb100g: 0, fat100g: 11, fiber100g: 0, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🥩', source: 'local' },
  { id: 'local_salmon', name: 'Salmon', cal100g: 208, prot100g: 20, carb100g: 0, fat100g: 13, fiber100g: 0, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🐟', source: 'local' },
  { id: 'local_eggs', name: 'Eggs (Large)', cal100g: 155, prot100g: 13, carb100g: 1.1, fat100g: 11, fiber100g: 0, servingG: 50, servingLabel: '1 large egg', emoji: '🥚', source: 'local' },
  { id: 'local_ribeye_steak', name: 'Ribeye Steak', cal100g: 291, prot100g: 25, carb100g: 0, fat100g: 22, fiber100g: 0, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🥩', source: 'local' },
  { id: 'local_pork_loin', name: 'Pork Loin', cal100g: 242, prot100g: 27, carb100g: 0, fat100g: 14, fiber100g: 0, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🥓', source: 'local' },
  { id: 'local_cod', name: 'Cod', cal100g: 82, prot100g: 18, carb100g: 0, fat100g: 0.7, fiber100g: 0, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🐟', source: 'local' },
  { id: 'local_tilapia', name: 'Tilapia', cal100g: 96, prot100g: 20, carb100g: 0, fat100g: 1.7, fiber100g: 0, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🐟', source: 'local' },
  { id: 'local_edamame', name: 'Edamame', cal100g: 95, prot100g: 11, carb100g: 7, fat100g: 5, fiber100g: 2.2, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🫛', source: 'local' },
  { id: 'local_black_beans', name: 'Black Beans (Cooked)', cal100g: 132, prot100g: 8.9, carb100g: 24, fat100g: 0.5, fiber100g: 6.4, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🫘', source: 'local' },
  { id: 'local_lentils', name: 'Lentils (Cooked)', cal100g: 116, prot100g: 9.0, carb100g: 20, fat100g: 0.4, fiber100g: 3.8, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🫘', source: 'local' },
  { id: 'local_tempeh', name: 'Tempeh', cal100g: 195, prot100g: 19, carb100g: 7.6, fat100g: 11, fiber100g: 1.0, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🌱', source: 'local' },

  // Grains
  { id: 'local_white_rice', name: 'White Rice (Cooked)', cal100g: 130, prot100g: 2.7, carb100g: 28, fat100g: 0.3, fiber100g: 0.4, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🍚', source: 'local' },
  { id: 'local_brown_rice', name: 'Brown Rice (Cooked)', cal100g: 111, prot100g: 2.6, carb100g: 23, fat100g: 0.9, fiber100g: 1.8, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🍚', source: 'local' },
  { id: 'local_oats', name: 'Oats (Dry)', cal100g: 389, prot100g: 17, carb100g: 66, fat100g: 6.9, fiber100g: 10, servingG: 40, servingLabel: '½ cup dry', emoji: '🌾', source: 'local' },
  { id: 'local_pasta_cooked', name: 'Pasta (Cooked)', cal100g: 131, prot100g: 5.0, carb100g: 25, fat100g: 1.1, fiber100g: 1.8, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🍝', source: 'local' },
  { id: 'local_bread_whole_wheat', name: 'Bread (Whole Wheat)', cal100g: 247, prot100g: 8.4, carb100g: 41, fat100g: 3.3, fiber100g: 6.8, servingG: 28, servingLabel: '1 slice', emoji: '🍞', source: 'local' },
  { id: 'local_quinoa', name: 'Quinoa (Cooked)', cal100g: 120, prot100g: 4.4, carb100g: 21, fat100g: 1.9, fiber100g: 2.8, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🌾', source: 'local' },
  { id: 'local_sweet_potato', name: 'Sweet Potato (Baked)', cal100g: 86, prot100g: 1.6, carb100g: 20, fat100g: 0.1, fiber100g: 3.0, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🍠', source: 'local' },
  { id: 'local_white_potato', name: 'White Potato (Baked)', cal100g: 77, prot100g: 1.7, carb100g: 17, fat100g: 0.1, fiber100g: 2.1, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🥔', source: 'local' },
  { id: 'local_tortilla', name: 'Tortilla (Wheat)', cal100g: 238, prot100g: 7.2, carb100g: 42, fat100g: 3.5, fiber100g: 7.0, servingG: 64, servingLabel: '1 tortilla', emoji: '🌯', source: 'local' },
  { id: 'local_bagel', name: 'Bagel (Plain)', cal100g: 250, prot100g: 9.5, carb100g: 49, fat100g: 1.7, fiber100g: 2.0, servingG: 89, servingLabel: '1 bagel', emoji: '🥯', source: 'local' },
  { id: 'local_granola', name: 'Granola', cal100g: 471, prot100g: 11, carb100g: 61, fat100g: 20, fiber100g: 8.0, servingG: 40, servingLabel: '¼ cup', emoji: '🌾', source: 'local' },

  // Dairy
  { id: 'local_greek_yogurt', name: 'Greek Yogurt (Plain)', cal100g: 59, prot100g: 10, carb100g: 3.3, fat100g: 0.4, fiber100g: 0, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🥛', source: 'local' },
  { id: 'local_cheddar_cheese', name: 'Cheddar Cheese', cal100g: 403, prot100g: 23, carb100g: 1.3, fat100g: 33, fiber100g: 0, servingG: 28, servingLabel: '1 oz', emoji: '🧀', source: 'local' },
  { id: 'local_mozzarella', name: 'Mozzarella Cheese', cal100g: 280, prot100g: 28, carb100g: 3.1, fat100g: 17, fiber100g: 0, servingG: 28, servingLabel: '1 oz', emoji: '🧀', source: 'local' },
  { id: 'local_whole_milk', name: 'Whole Milk', cal100g: 61, prot100g: 3.2, carb100g: 4.8, fat100g: 3.3, fiber100g: 0, servingG: 240, servingLabel: '1 cup', emoji: '🥛', source: 'local' },
  { id: 'local_2percent_milk', name: '2% Milk', cal100g: 49, prot100g: 3.3, carb100g: 4.8, fat100g: 1.9, fiber100g: 0, servingG: 240, servingLabel: '1 cup', emoji: '🥛', source: 'local' },
  { id: 'local_cream_cheese', name: 'Cream Cheese', cal100g: 342, prot100g: 5.9, carb100g: 4.1, fat100g: 34, fiber100g: 0, servingG: 28, servingLabel: '1 oz', emoji: '🧀', source: 'local' },
  { id: 'local_butter', name: 'Butter', cal100g: 717, prot100g: 0.9, carb100g: 0.1, fat100g: 81, fiber100g: 0, servingG: 14, servingLabel: '1 tbsp', emoji: '🧈', source: 'local' },
  { id: 'local_ice_cream', name: 'Ice Cream (Vanilla)', cal100g: 207, prot100g: 3.5, carb100g: 24, fat100g: 11, fiber100g: 0, servingG: 50, servingLabel: '½ cup', emoji: '🍦', source: 'local' },

  // Fruits
  { id: 'local_apple', name: 'Apple (Medium)', cal100g: 52, prot100g: 0.3, carb100g: 14, fat100g: 0.2, fiber100g: 2.4, servingG: 182, servingLabel: '1 medium apple', emoji: '🍎', source: 'local' },
  { id: 'local_banana', name: 'Banana (Medium)', cal100g: 89, prot100g: 1.1, carb100g: 23, fat100g: 0.3, fiber100g: 2.6, servingG: 118, servingLabel: '1 medium banana', emoji: '🍌', source: 'local' },
  { id: 'local_orange', name: 'Orange (Medium)', cal100g: 47, prot100g: 0.9, carb100g: 12, fat100g: 0.3, fiber100g: 2.4, servingG: 131, servingLabel: '1 medium orange', emoji: '🍊', source: 'local' },
  { id: 'local_strawberries', name: 'Strawberries', cal100g: 32, prot100g: 0.8, carb100g: 7.7, fat100g: 0.3, fiber100g: 2.0, servingG: 100, servingLabel: '1 cup', emoji: '🍓', source: 'local' },
  { id: 'local_blueberries', name: 'Blueberries', cal100g: 57, prot100g: 0.7, carb100g: 14, fat100g: 0.3, fiber100g: 2.4, servingG: 100, servingLabel: '1 cup', emoji: '🫐', source: 'local' },
  { id: 'local_grapes', name: 'Grapes', cal100g: 67, prot100g: 0.7, carb100g: 17, fat100g: 0.4, fiber100g: 0.9, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🍇', source: 'local' },
  { id: 'local_avocado', name: 'Avocado', cal100g: 160, prot100g: 2.0, carb100g: 9, fat100g: 15, fiber100g: 6.7, servingG: 100, servingLabel: '½ avocado', emoji: '🥑', source: 'local' },
  { id: 'local_mango', name: 'Mango', cal100g: 60, prot100g: 0.8, carb100g: 15, fat100g: 0.4, fiber100g: 1.6, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🥭', source: 'local' },
  { id: 'local_watermelon', name: 'Watermelon', cal100g: 30, prot100g: 0.6, carb100g: 7.6, fat100g: 0.2, fiber100g: 0.4, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🍉', source: 'local' },
  { id: 'local_pineapple', name: 'Pineapple', cal100g: 50, prot100g: 0.5, carb100g: 13, fat100g: 0.1, fiber100g: 1.4, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🍍', source: 'local' },

  // Vegetables
  { id: 'local_broccoli', name: 'Broccoli (Raw)', cal100g: 34, prot100g: 2.8, carb100g: 7.0, fat100g: 0.4, fiber100g: 2.4, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🥦', source: 'local' },
  { id: 'local_spinach', name: 'Spinach (Raw)', cal100g: 23, prot100g: 2.7, carb100g: 3.6, fat100g: 0.4, fiber100g: 2.2, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🥬', source: 'local' },
  { id: 'local_kale', name: 'Kale (Raw)', cal100g: 49, prot100g: 4.3, carb100g: 9.0, fat100g: 0.9, fiber100g: 2.0, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🥬', source: 'local' },
  { id: 'local_carrots', name: 'Carrots (Raw)', cal100g: 41, prot100g: 0.9, carb100g: 10, fat100g: 0.2, fiber100g: 2.8, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🥕', source: 'local' },
  { id: 'local_bell_pepper', name: 'Bell Pepper (Red)', cal100g: 31, prot100g: 1.0, carb100g: 6.0, fat100g: 0.3, fiber100g: 2.0, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🫑', source: 'local' },
  { id: 'local_cucumber', name: 'Cucumber', cal100g: 16, prot100g: 0.7, carb100g: 3.6, fat100g: 0.1, fiber100g: 0.5, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🥒', source: 'local' },
  { id: 'local_tomato', name: 'Tomato', cal100g: 18, prot100g: 0.9, carb100g: 3.9, fat100g: 0.2, fiber100g: 1.2, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🍅', source: 'local' },
  { id: 'local_sweet_corn', name: 'Sweet Corn (Cooked)', cal100g: 96, prot100g: 3.3, carb100g: 21, fat100g: 1.5, fiber100g: 2.7, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🌽', source: 'local' },
  { id: 'local_peas', name: 'Peas (Cooked)', cal100g: 84, prot100g: 5.4, carb100g: 14, fat100g: 0.4, fiber100g: 5.5, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🫛', source: 'local' },
  { id: 'local_asparagus', name: 'Asparagus', cal100g: 20, prot100g: 2.2, carb100g: 3.7, fat100g: 0.1, fiber100g: 2.1, servingG: 100, servingLabel: '100g (3.5 oz)', emoji: '🌱', source: 'local' },

  // Snacks
  { id: 'local_almonds', name: 'Almonds', cal100g: 579, prot100g: 21, carb100g: 22, fat100g: 50, fiber100g: 12, servingG: 28, servingLabel: '1 oz', emoji: '🌰', source: 'local' },
  { id: 'local_cashews', name: 'Cashews', cal100g: 553, prot100g: 18, carb100g: 30, fat100g: 44, fiber100g: 3.3, servingG: 28, servingLabel: '1 oz', emoji: '🥜', source: 'local' },
  { id: 'local_peanut_butter', name: 'Peanut Butter', cal100g: 588, prot100g: 25, carb100g: 20, fat100g: 50, fiber100g: 6.0, servingG: 32, servingLabel: '2 tbsp', emoji: '🥜', source: 'local' },
  { id: 'local_hummus', name: 'Hummus', cal100g: 150, prot100g: 4.8, carb100g: 14, fat100g: 8.0, fiber100g: 3.9, servingG: 30, servingLabel: '2 tbsp', emoji: '🫘', source: 'local' },
  { id: 'local_protein_bar', name: 'Protein Bar (Generic)', cal100g: 350, prot100g: 20, carb100g: 35, fat100g: 12, fiber100g: 3.0, servingG: 40, servingLabel: '1 bar', emoji: '📊', source: 'local' },
  { id: 'local_granola_bar', name: 'Granola Bar', cal100g: 421, prot100g: 8.0, carb100g: 56, fat100g: 18, fiber100g: 4.0, servingG: 28, servingLabel: '1 bar', emoji: '🌾', source: 'local' },
  { id: 'local_potato_chips', name: 'Potato Chips', cal100g: 536, prot100g: 5.7, carb100g: 53, fat100g: 35, fiber100g: 4.7, servingG: 28, servingLabel: '1 oz', emoji: '🥔', source: 'local' },
  { id: 'local_dark_chocolate', name: 'Dark Chocolate (70%)', cal100g: 598, prot100g: 7.8, carb100g: 46, fat100g: 43, fiber100g: 6.8, servingG: 10, servingLabel: '1 square', emoji: '🍫', source: 'local' },

  // Fast Food
  { id: 'local_big_mac', name: 'Big Mac', cal100g: 214, prot100g: 12, carb100g: 16, fat100g: 10, fiber100g: 1.0, servingG: 216, servingLabel: '1 sandwich', emoji: '🍔', source: 'local' },
  { id: 'local_chipotle_bowl', name: 'Chipotle Bowl (Chicken)', cal100g: 145, prot100g: 14, carb100g: 18, fat100g: 3.5, fiber100g: 2.2, servingG: 560, servingLabel: '1 bowl', emoji: '🍲', source: 'local' },
  { id: 'local_chick_fil_a', name: 'Chick-fil-A Sandwich', cal100g: 228, prot100g: 23, carb100g: 16, fat100g: 9.0, fiber100g: 1.0, servingG: 130, servingLabel: '1 sandwich', emoji: '🍗', source: 'local' },
  { id: 'local_subway_turkey', name: 'Subway 6" Turkey', cal100g: 110, prot100g: 12, carb100g: 18, fat100g: 1.5, fiber100g: 3.0, servingG: 213, servingLabel: '6" sandwich', emoji: '🥪', source: 'local' },

  // Beverages
  { id: 'local_black_coffee', name: 'Black Coffee', cal100g: 0, prot100g: 0, carb100g: 0, fat100g: 0, fiber100g: 0, servingG: 240, servingLabel: '1 cup', emoji: '☕', source: 'local' },
  { id: 'local_orange_juice', name: 'Orange Juice', cal100g: 47, prot100g: 0.7, carb100g: 11, fat100g: 0.3, fiber100g: 0.2, servingG: 240, servingLabel: '1 cup', emoji: '🧃', source: 'local' },
  { id: 'local_sports_drink', name: 'Sports Drink (Gatorade)', cal100g: 32, prot100g: 0, carb100g: 8.0, fat100g: 0, fiber100g: 0, servingG: 240, servingLabel: '1 cup', emoji: '🥤', source: 'local' },
  { id: 'local_protein_shake', name: 'Protein Shake (Generic)', cal100g: 105, prot100g: 20, carb100g: 4.0, fat100g: 1.5, fiber100g: 0, servingG: 255, servingLabel: '1 shake', emoji: '🥤', source: 'local' },
  { id: 'local_beer', name: 'Beer (5% ABV)', cal100g: 43, prot100g: 0.5, carb100g: 3.6, fat100g: 0, fiber100g: 0, servingG: 355, servingLabel: '12 oz', emoji: '🍺', source: 'local' },
  { id: 'local_wine', name: 'Red Wine', cal100g: 85, prot100g: 0.1, carb100g: 2.6, fat100g: 0, fiber100g: 0, servingG: 150, servingLabel: '5 oz glass', emoji: '🍷', source: 'local' },
  { id: 'local_coca_cola', name: 'Coca-Cola', cal100g: 42, prot100g: 0, carb100g: 11, fat100g: 0, fiber100g: 0, servingG: 355, servingLabel: '12 oz', emoji: '🥤', source: 'local' },
];

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function getCachedResults(query: string): Promise<FoodDBResult[] | null> {
  try {
    const cacheKey = `ftf_food_cache_${query.toLowerCase()}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    const now = Date.now();
    if (now - parsed.timestamp > CACHE_TTL_MS) {
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }

    return parsed.data as FoodDBResult[];
  } catch (error) {
    console.error('Error reading food cache:', error);
    return null;
  }
}

async function setCachedResults(query: string, results: FoodDBResult[]): Promise<void> {
  try {
    const cacheKey = `ftf_food_cache_${query.toLowerCase()}`;
    await AsyncStorage.setItem(
      cacheKey,
      JSON.stringify({
        data: results,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error('Error setting food cache:', error);
  }
}

function mapUSDAFood(food: USDAFood): FoodDBResult | null {
  const nutrients: Record<string, number> = {};

  for (const nutrient of food.nutrients) {
    const key = USDA_NUTRIENT_MAP[nutrient.nutrientId as keyof typeof USDA_NUTRIENT_MAP];
    if (key) {
      nutrients[key] = nutrient.value;
    }
  }

  if (!nutrients.energy) return null;

  const name = food.description.toLowerCase();
  let emoji = '🍽️';
  if (name.includes('chicken') || name.includes('beef') || name.includes('pork')) emoji = '🥩';
  else if (name.includes('fish') || name.includes('salmon')) emoji = '🐟';
  else if (name.includes('egg')) emoji = '🥚';
  else if (name.includes('rice') || name.includes('bread') || name.includes('pasta')) emoji = '🍚';
  else if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt')) emoji = '🥛';
  else if (name.includes('apple') || name.includes('banana') || name.includes('berry')) emoji = '🍎';
  else if (name.includes('broccoli') || name.includes('carrot') || name.includes('spinach')) emoji = '🥦';

  return {
    id: `usda_${food.fdcId}`,
    name: food.description,
    brand: food.brandName,
    cal100g: nutrients.energy || 0,
    prot100g: nutrients.protein || 0,
    carb100g: nutrients.carbs || 0,
    fat100g: nutrients.fat || 0,
    fiber100g: nutrients.fiber || 0,
    servingG: 100,
    servingLabel: '100g',
    emoji,
    source: 'usda',
  };
}

export async function searchUSDAFoods(query: string): Promise<FoodDBResult[]> {
  const apiKey = Constants.expoConfig?.extra?.usdaApiKey ?? 'DEMO_KEY';

  try {
    const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search');
    url.searchParams.append('query', query);
    url.searchParams.append('pageSize', '20');
    url.searchParams.append('api_key', apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.status}`);
    }

    const data = await response.json() as { foods?: USDAFood[] };
    const foods = data.foods ?? [];

    const results = foods
      .map((food) => mapUSDAFood(food))
      .filter((result): result is FoodDBResult => result !== null)
      .slice(0, 20);

    if (results.length > 0) {
      await setCachedResults(query, results);
    }

    return results;
  } catch (error) {
    console.error('USDA API search failed:', error);
    return [];
  }
}

export async function searchFoods(query: string): Promise<FoodDBResult[]> {
  // Check cache first
  const cached = await getCachedResults(query);
  if (cached && cached.length > 0) {
    return cached;
  }

  // Try USDA first
  const usdaResults = await searchUSDAFoods(query);
  if (usdaResults.length > 0) {
    return usdaResults;
  }

  // Fall back to local search
  const queryLower = query.toLowerCase();
  const localResults = LOCAL_FOOD_DATABASE.filter((food) => {
    const name = food.name.toLowerCase();
    const brand = food.brand?.toLowerCase() ?? '';
    return name.includes(queryLower) || brand.includes(queryLower);
  });

  return localResults;
}

export async function getCalorieHistory(days: number): Promise<DayCalories[]> {
  try {
    const logData = await AsyncStorage.getItem('ftf_food_log');
    if (!logData) {
      return Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        return {
          date: date.toISOString().split('T')[0],
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      });
    }

    const entries = JSON.parse(logData) as Array<{
      date: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }>;

    const now = new Date();
    const result: DayCalories[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayEntry = entries.find((e) => e.date === dateStr);
      result.push({
        date: dateStr,
        calories: dayEntry?.calories ?? 0,
        protein: dayEntry?.protein ?? 0,
        carbs: dayEntry?.carbs ?? 0,
        fat: dayEntry?.fat ?? 0,
      });
    }

    return result;
  } catch (error) {
    console.error('Error reading calorie history:', error);
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toISOString().split('T')[0],
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    });
  }
}
