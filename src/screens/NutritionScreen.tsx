import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, RefreshControl, Modal, Alert, FlatList, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { analyzeFood, FoodAnalysis } from '@/lib/foodvision';
import { searchFoods, FoodDBResult } from '@/lib/foodDatabase';

import { colors, spacing, radius, typography } from '@/theme';
import { RESTAURANTS, Restaurant as RestaurantDef, MenuItem } from '@/data/restaurants';
import { RESTAURANTS2 } from '@/data/restaurants2';

const ALL_RESTAURANTS: RestaurantDef[] = [...RESTAURANTS, ...RESTAURANTS2];
import {
  getFoodLog, addFoodEntry, deleteFoodEntry, getNutritionTargets,
  todayStr, updateWaterLog, getWaterLog,
  getRecentFoods, addToRecentFoods,
  getMealTemplates, saveMealTemplate, deleteMealTemplate, MealTemplate,
  getCustomNutritionTargets, saveCustomNutritionTargets, clearCustomNutritionTargets,
  CustomNutritionTargets,
} from '@/lib/storage';
import { FoodLogEntry } from '@/lib/storage';

type Meal = 'breakfast' | 'lunch' | 'dinner' | 'snack';
const MEALS: Meal[] = ['breakfast', 'lunch', 'dinner', 'snack'];
const MEAL_LABELS: Record<Meal, string> = {
  breakfast: '🌅 Breakfast',
  lunch: '☀️ Lunch',
  dinner: '🌙 Dinner',
  snack: '🍎 Snack',
};

type Tab = 'log' | 'search' | 'restaurants';

// Scanned food from barcode
interface ScannedFood {
  name: string;
  brand: string;
  cal100g: number;
  prot100g: number;
  carb100g: number;
  fat100g: number;
  servingG: number;
  servingLabel: string;
}

// Built-in food database with 60+ common foods
interface FoodDBItem {
  id: string;
  name: string;
  category: 'protein' | 'grain' | 'dairy' | 'fruit' | 'vegetable' | 'fat' | 'beverage' | 'snack' | 'fast_food';
  cal100g: number;
  prot100g: number;
  carb100g: number;
  fat100g: number;
  emoji: string;
  commonServingG: number;
  commonServingLabel: string;
}

const FOOD_DATABASE: FoodDBItem[] = [
  // Proteins
  { id: 'pb-1', name: 'Chicken Breast', category: 'protein', cal100g: 165, prot100g: 31, carb100g: 0, fat100g: 3.6, emoji: '🍗', commonServingG: 100, commonServingLabel: '3.5 oz' },
  { id: 'pb-2', name: 'Ground Beef (85%)', category: 'protein', cal100g: 217, prot100g: 23, carb100g: 0, fat100g: 13, emoji: '🥩', commonServingG: 100, commonServingLabel: '3.5 oz' },
  { id: 'pb-3', name: 'Eggs (large)', category: 'protein', cal100g: 155, prot100g: 13, carb100g: 1.1, fat100g: 11, emoji: '🥚', commonServingG: 50, commonServingLabel: '1 egg' },
  { id: 'pb-4', name: 'Salmon (wild)', category: 'protein', cal100g: 280, prot100g: 25, carb100g: 0, fat100g: 20, emoji: '🐟', commonServingG: 100, commonServingLabel: '3.5 oz' },
  { id: 'pb-5', name: 'Tuna (canned, water)', category: 'protein', cal100g: 96, prot100g: 21, carb100g: 0, fat100g: 0.7, emoji: '🐟', commonServingG: 100, commonServingLabel: '3.5 oz' },
  { id: 'pb-6', name: 'Turkey Breast', category: 'protein', cal100g: 135, prot100g: 30, carb100g: 0, fat100g: 0.7, emoji: '🦃', commonServingG: 100, commonServingLabel: '3.5 oz' },
  { id: 'pb-7', name: 'Greek Yogurt (plain)', category: 'dairy', cal100g: 59, prot100g: 10, carb100g: 3.3, fat100g: 0.4, emoji: '🥛', commonServingG: 170, commonServingLabel: '6 oz' },
  { id: 'pb-8', name: 'Cottage Cheese', category: 'dairy', cal100g: 98, prot100g: 11, carb100g: 3.9, fat100g: 5, emoji: '🥛', commonServingG: 113, commonServingLabel: '1/2 cup' },
  { id: 'pb-9', name: 'Tofu (firm)', category: 'protein', cal100g: 76, prot100g: 8.1, carb100g: 1.6, fat100g: 4.8, emoji: '🟤', commonServingG: 150, commonServingLabel: '5.3 oz' },
  { id: 'pb-10', name: 'Shrimp', category: 'protein', cal100g: 99, prot100g: 24, carb100g: 0, fat100g: 0.3, emoji: '🦐', commonServingG: 100, commonServingLabel: '3.5 oz' },

  // Grains
  { id: 'gr-1', name: 'White Rice (cooked)', category: 'grain', cal100g: 130, prot100g: 2.7, carb100g: 28, fat100g: 0.3, emoji: '🍚', commonServingG: 150, commonServingLabel: '1 cup' },
  { id: 'gr-2', name: 'Brown Rice (cooked)', category: 'grain', cal100g: 111, prot100g: 2.6, carb100g: 23, fat100g: 0.9, emoji: '🍚', commonServingG: 150, commonServingLabel: '1 cup' },
  { id: 'gr-3', name: 'Oats (dry)', category: 'grain', cal100g: 389, prot100g: 17, carb100g: 66, fat100g: 6.9, emoji: '🌾', commonServingG: 40, commonServingLabel: '1/2 cup' },
  { id: 'gr-4', name: 'White Bread', category: 'grain', cal100g: 265, prot100g: 9, carb100g: 49, fat100g: 3.2, emoji: '🍞', commonServingG: 28, commonServingLabel: '1 slice' },
  { id: 'gr-5', name: 'Whole Wheat Bread', category: 'grain', cal100g: 247, prot100g: 13, carb100g: 41, fat100g: 3.7, emoji: '🍞', commonServingG: 28, commonServingLabel: '1 slice' },
  { id: 'gr-6', name: 'Pasta (cooked)', category: 'grain', cal100g: 131, prot100g: 5, carb100g: 25, fat100g: 1.1, emoji: '🍝', commonServingG: 150, commonServingLabel: '1 cup' },
  { id: 'gr-7', name: 'Tortilla (flour)', category: 'grain', cal100g: 289, prot100g: 9, carb100g: 50, fat100g: 4.8, emoji: '🌯', commonServingG: 52, commonServingLabel: '1 large' },
  { id: 'gr-8', name: 'Quinoa (cooked)', category: 'grain', cal100g: 120, prot100g: 4.4, carb100g: 21, fat100g: 1.9, emoji: '🌾', commonServingG: 150, commonServingLabel: '1 cup' },

  // Dairy
  { id: 'da-1', name: 'Whole Milk', category: 'dairy', cal100g: 61, prot100g: 3.2, carb100g: 4.8, fat100g: 3.3, emoji: '🥛', commonServingG: 240, commonServingLabel: '8 oz' },
  { id: 'da-2', name: '2% Milk', category: 'dairy', cal100g: 49, prot100g: 3.3, carb100g: 4.8, fat100g: 1.9, emoji: '🥛', commonServingG: 240, commonServingLabel: '8 oz' },
  { id: 'da-3', name: 'Cheddar Cheese', category: 'dairy', cal100g: 402, prot100g: 25, carb100g: 1.3, fat100g: 33, emoji: '🧀', commonServingG: 28, commonServingLabel: '1 oz' },
  { id: 'da-4', name: 'Mozzarella Cheese', category: 'dairy', cal100g: 280, prot100g: 28, carb100g: 3.1, fat100g: 17, emoji: '🧀', commonServingG: 28, commonServingLabel: '1 oz' },
  { id: 'da-5', name: 'Butter', category: 'fat', cal100g: 717, prot100g: 0.9, carb100g: 0.1, fat100g: 81, emoji: '🧈', commonServingG: 14, commonServingLabel: '1 tbsp' },

  // Fruits
  { id: 'fr-1', name: 'Banana', category: 'fruit', cal100g: 89, prot100g: 1.1, carb100g: 23, fat100g: 0.3, emoji: '🍌', commonServingG: 118, commonServingLabel: '1 medium' },
  { id: 'fr-2', name: 'Apple (with skin)', category: 'fruit', cal100g: 52, prot100g: 0.3, carb100g: 14, fat100g: 0.2, emoji: '🍎', commonServingG: 182, commonServingLabel: '1 medium' },
  { id: 'fr-3', name: 'Orange', category: 'fruit', cal100g: 47, prot100g: 0.9, carb100g: 12, fat100g: 0.1, emoji: '🍊', commonServingG: 131, commonServingLabel: '1 medium' },
  { id: 'fr-4', name: 'Strawberries', category: 'fruit', cal100g: 32, prot100g: 0.8, carb100g: 7.7, fat100g: 0.3, emoji: '🍓', commonServingG: 152, commonServingLabel: '1 cup' },
  { id: 'fr-5', name: 'Blueberries', category: 'fruit', cal100g: 57, prot100g: 0.7, carb100g: 14, fat100g: 0.3, emoji: '🫐', commonServingG: 148, commonServingLabel: '1 cup' },
  { id: 'fr-6', name: 'Avocado', category: 'fruit', cal100g: 160, prot100g: 2, carb100g: 9, fat100g: 15, emoji: '🥑', commonServingG: 100, commonServingLabel: '1/2 fruit' },
  { id: 'fr-7', name: 'Grapes', category: 'fruit', cal100g: 67, prot100g: 0.6, carb100g: 17, fat100g: 0.2, emoji: '🍇', commonServingG: 92, commonServingLabel: '1 cup' },

  // Vegetables
  { id: 'vg-1', name: 'Broccoli', category: 'vegetable', cal100g: 34, prot100g: 2.8, carb100g: 7, fat100g: 0.4, emoji: '🥦', commonServingG: 91, commonServingLabel: '1 cup' },
  { id: 'vg-2', name: 'Spinach', category: 'vegetable', cal100g: 23, prot100g: 2.9, carb100g: 3.6, fat100g: 0.4, emoji: '🥬', commonServingG: 30, commonServingLabel: '1 cup raw' },
  { id: 'vg-3', name: 'Sweet Potato', category: 'vegetable', cal100g: 86, prot100g: 1.6, carb100g: 20, fat100g: 0.1, emoji: '🍠', commonServingG: 100, commonServingLabel: '1 medium' },
  { id: 'vg-4', name: 'Potato (baked)', category: 'vegetable', cal100g: 77, prot100g: 1.7, carb100g: 17, fat100g: 0.1, emoji: '🥔', commonServingG: 100, commonServingLabel: '1 medium' },
  { id: 'vg-5', name: 'Carrots', category: 'vegetable', cal100g: 41, prot100g: 0.9, carb100g: 10, fat100g: 0.2, emoji: '🥕', commonServingG: 61, commonServingLabel: '1 medium' },
  { id: 'vg-6', name: 'Green Beans', category: 'vegetable', cal100g: 31, prot100g: 1.8, carb100g: 7, fat100g: 0.1, emoji: '🫘', commonServingG: 110, commonServingLabel: '1 cup' },
  { id: 'vg-7', name: 'Corn', category: 'vegetable', cal100g: 86, prot100g: 3.3, carb100g: 19, fat100g: 1.4, emoji: '🌽', commonServingG: 77, commonServingLabel: '1/2 cup' },
  { id: 'vg-8', name: 'Tomato', category: 'vegetable', cal100g: 18, prot100g: 0.9, carb100g: 3.9, fat100g: 0.2, emoji: '🍅', commonServingG: 123, commonServingLabel: '1 medium' },

  // Fats
  { id: 'ft-1', name: 'Olive Oil', category: 'fat', cal100g: 884, prot100g: 0, carb100g: 0, fat100g: 100, emoji: '🫗', commonServingG: 14, commonServingLabel: '1 tbsp' },
  { id: 'ft-2', name: 'Peanut Butter', category: 'fat', cal100g: 588, prot100g: 25, carb100g: 20, fat100g: 50, emoji: '🥜', commonServingG: 32, commonServingLabel: '2 tbsp' },
  { id: 'ft-3', name: 'Almonds', category: 'fat', cal100g: 579, prot100g: 21, carb100g: 22, fat100g: 50, emoji: '🌰', commonServingG: 23, commonServingLabel: '1 oz (23 nuts)' },
  { id: 'ft-4', name: 'Walnuts', category: 'fat', cal100g: 654, prot100g: 9, carb100g: 14, fat100g: 65, emoji: '🌰', commonServingG: 28, commonServingLabel: '1 oz (14 halves)' },
  { id: 'ft-5', name: 'Cream Cheese', category: 'fat', cal100g: 342, prot100g: 5.9, carb100g: 4.1, fat100g: 34, emoji: '🧈', commonServingG: 28, commonServingLabel: '1 oz' },

  // Beverages
  { id: 'bv-1', name: 'Coffee (black)', category: 'beverage', cal100g: 1, prot100g: 0.1, carb100g: 0, fat100g: 0, emoji: '☕', commonServingG: 240, commonServingLabel: '8 oz' },
  { id: 'bv-2', name: 'Orange Juice', category: 'beverage', cal100g: 45, prot100g: 0.7, carb100g: 11, fat100g: 0.2, emoji: '🧃', commonServingG: 240, commonServingLabel: '8 oz' },
  { id: 'bv-3', name: 'Whole Milk', category: 'beverage', cal100g: 61, prot100g: 3.2, carb100g: 4.8, fat100g: 3.3, emoji: '🥛', commonServingG: 240, commonServingLabel: '8 oz' },
  { id: 'bv-4', name: 'Diet Coke', category: 'beverage', cal100g: 0, prot100g: 0, carb100g: 0, fat100g: 0, emoji: '🥤', commonServingG: 240, commonServingLabel: '8 oz' },
  { id: 'bv-5', name: 'Sports Drink (Gatorade)', category: 'beverage', cal100g: 30, prot100g: 0, carb100g: 7.5, fat100g: 0, emoji: '🥤', commonServingG: 240, commonServingLabel: '8 oz' },

  // Snacks
  { id: 'sn-1', name: 'Potato Chips', category: 'snack', cal100g: 536, prot100g: 5.9, carb100g: 52, fat100g: 33, emoji: '🥔', commonServingG: 28, commonServingLabel: '1 oz (1 bag)' },
  { id: 'sn-2', name: 'Protein Bar', category: 'snack', cal100g: 385, prot100g: 20, carb100g: 35, fat100g: 15, emoji: '🍫', commonServingG: 60, commonServingLabel: '1 bar' },
  { id: 'sn-3', name: 'Granola Bar', category: 'snack', cal100g: 471, prot100g: 10, carb100g: 60, fat100g: 20, emoji: '🍯', commonServingG: 40, commonServingLabel: '1 bar' },
  { id: 'sn-4', name: 'Popcorn (air-popped)', category: 'snack', cal100g: 387, prot100g: 12, carb100g: 77, fat100g: 4, emoji: '🍿', commonServingG: 30, commonServingLabel: '3 cups' },
  { id: 'sn-5', name: 'Crackers (whole grain)', category: 'snack', cal100g: 381, prot100g: 11, carb100g: 63, fat100g: 9, emoji: '🟫', commonServingG: 30, commonServingLabel: '1 oz' },

  // Fast Food
  { id: 'ff-1', name: "McDonald's Big Mac", category: 'fast_food', cal100g: 221, prot100g: 12, carb100g: 24, fat100g: 11, emoji: '🍔', commonServingG: 215, commonServingLabel: '1 sandwich' },
  { id: 'ff-2', name: "Chick-fil-A Chicken Sandwich", category: 'fast_food', cal100g: 281, prot100g: 29, carb100g: 23, fat100g: 9, emoji: '🍗', commonServingG: 157, commonServingLabel: '1 sandwich' },
  { id: 'ff-3', name: 'Chipotle Burrito Bowl', category: 'fast_food', cal100g: 137, prot100g: 8, carb100g: 14, fat100g: 6, emoji: '🥙', commonServingG: 400, commonServingLabel: '1 bowl' },
  { id: 'ff-4', name: 'Pizza Slice (large, pepperoni)', category: 'fast_food', cal100g: 290, prot100g: 12, carb100g: 36, fat100g: 10, emoji: '🍕', commonServingG: 100, commonServingLabel: '1 slice' },
  { id: 'ff-5', name: 'Burger (typical)', category: 'fast_food', cal100g: 201, prot100g: 13, carb100g: 18, fat100g: 9, emoji: '🍔', commonServingG: 150, commonServingLabel: '1 burger' },
];
export default function NutritionScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('log');
  const [foodEntries, setFoodEntries] = useState<FoodLogEntry[]>([]);
  const [targets, setTargets] = useState<any>(null);
  const [waterOz, setWaterOz] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Search tab state
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchResults, setSearchResults] = useState<FoodDBResult[]>([]);
  const [selectedFood, setSelectedFood]   = useState<FoodDBResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef                  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [servingAmount, setServingAmount] = useState('100');
  const [servingUnit, setServingUnit] = useState('g');
  const [selectedMeal, setSelectedMeal] = useState<Meal>('lunch');
  const [showLogFoodModal, setShowLogFoodModal] = useState(false);

  // Restaurants tab state
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantDef | null>(null);
  const [showRestaurantDetail, setShowRestaurantDetail] = useState(false);
  const [disclaimerSeen, setDisclaimerSeen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Barcode scanner state
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedFood | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanServingAmount, setScanServingAmount] = useState('100');

  // Food photo AI state
  const cameraRef = useRef<CameraView>(null);
  const [photoScannerVisible, setPhotoScannerVisible] = useState(false);
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);
  const [photoResult, setPhotoResult] = useState<FoodAnalysis | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Recent foods state
  const [recentFoods, setRecentFoods] = useState<FoodLogEntry[]>([]);

  // Meal templates state
  const [mealTemplates, setMealTemplates] = useState<MealTemplate[]>([]);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [selectedTemplateEmoji, setSelectedTemplateEmoji] = useState('🍗');
  const [selectedFoodsForTemplate, setSelectedFoodsForTemplate] = useState<FoodLogEntry[]>([]);
  const [showTemplateConfirmModal, setShowTemplateConfirmModal] = useState(false);
  const [selectedTemplateToLog, setSelectedTemplateToLog] = useState<MealTemplate | null>(null);

  // Edit goals state
  const [showEditGoalsModal, setShowEditGoalsModal] = useState(false);
  const [editCalories, setEditCalories] = useState('');
  const [editProtein, setEditProtein] = useState('');
  const [editCarbs, setEditCarbs] = useState('');
  const [editFat, setEditFat] = useState('');
  const [hasCustomTargets, setHasCustomTargets] = useState(false);

  async function loadData() {
    const today = todayStr();
    const [food, calcTgt, water, recents, templates, customTgt] = await Promise.all([
      getFoodLog(today),
      getNutritionTargets(),
      getWaterLog(today),
      getRecentFoods(),
      getMealTemplates(),
      getCustomNutritionTargets(),
    ]);
    setFoodEntries(food);
    // Custom targets override calculated ones
    if (customTgt) {
      setTargets(customTgt);
      setHasCustomTargets(true);
    } else {
      setTargets(calcTgt);
      setHasCustomTargets(false);
    }
    setWaterOz(water?.ozLogged ?? 0);
    setRecentFoods(recents);
    setMealTemplates(templates);
  }

  useFocusEffect(useCallback(() => { loadData(); }, []));

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  async function handleAddWater() {
    const newOz = waterOz + 8;
    await updateWaterLog(todayStr(), newOz);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWaterOz(newOz);
  }

  async function handleDeleteFood(id: string) {
    await deleteFoodEntry(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await loadData();
  }

  function handleSearchFood(text: string) {
    setSearchQuery(text);
    if (text.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    // Debounce so we don't spam on every keystroke
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setSearchLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchFoods(text);
      setSearchResults(results);
      setSearchLoading(false);
    }, 400);
  }

  function handleSelectFoodForLogging(food: FoodDBResult) {
    setSelectedFood(food);
    setServingAmount(String(food.servingG));
    setShowLogFoodModal(true);
  }

  async function handleLogFood() {
    if (!selectedFood) return;
    const amount = parseFloat(servingAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid serving size');
      return;
    }

    const factor = amount / 100;
    const brandSuffix = selectedFood.brand ? ` (${selectedFood.brand})` : '';
    const entry: FoodLogEntry = {
      id: `food_${Date.now()}`,
      date: todayStr(),
      name: selectedFood.name + brandSuffix,
      calories: Math.round(selectedFood.cal100g * factor),
      proteinG: selectedFood.prot100g * factor,
      carbsG: selectedFood.carb100g * factor,
      fatG: selectedFood.fat100g * factor,
      meal: selectedMeal,
      servingSize: `${servingAmount}${servingUnit}`,
      loggedAt: new Date().toISOString(),
    };

    await addFoodEntry(entry);
    await addToRecentFoods(entry);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowLogFoodModal(false);
    setSelectedFood(null);
    setSearchQuery('');
    setSearchResults([]);
    await loadData();
  }

  async function handleLogRestaurantItem(item: MenuItem) {
    const entry: FoodLogEntry = {
      id: `food_${Date.now()}`,
      date: todayStr(),
      name: `${item.name} (${selectedRestaurant?.name || 'Restaurant'})`,
      calories: item.calories,
      proteinG: item.proteinG,
      carbsG: item.carbsG,
      fatG: item.fatG,
      meal: 'lunch',
      loggedAt: new Date().toISOString(),
    };

    await addFoodEntry(entry);
    await addToRecentFoods(entry);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await loadData();
  }

  function openScanner() {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
      return;
    }
    setScannerVisible(true);
    setScanned(false);
    setScanResult(null);
    setScanError(null);
    setScanServingAmount('100');
  }

  function closeScanner() {
    setScannerVisible(false);
    setScanned(false);
    setScanResult(null);
    setScanError(null);
  }

  // ── Food Photo AI ────────────────────────────────────────────────────────
  function openPhotoScanner() {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
      return;
    }
    setPhotoScannerVisible(true);
    setPhotoResult(null);
    setPhotoError(null);
    setPhotoAnalyzing(false);
  }

  function closePhotoScanner() {
    setPhotoScannerVisible(false);
    setPhotoResult(null);
    setPhotoError(null);
    setPhotoAnalyzing(false);
  }

  async function handleTakePhoto() {
    if (!cameraRef.current || photoAnalyzing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhotoAnalyzing(true);
    setPhotoResult(null);
    setPhotoError(null);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
        exif: false,
      });
      if (!photo?.base64) throw new Error('No image captured.');
      const result = await analyzeFood(photo.base64);
      setPhotoResult(result);
    } catch (e: any) {
      setPhotoError(e?.message ?? 'Something went wrong. Try again.');
    } finally {
      setPhotoAnalyzing(false);
    }
  }

  async function handleLogPhotoFood() {
    if (!photoResult) return;
    const entry: FoodLogEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      name: photoResult.food,
      calories: photoResult.calories,
      proteinG: photoResult.proteinG,
      carbsG: photoResult.carbsG,
      fatG: photoResult.fatG,
      meal: selectedMeal,
      servingSize: photoResult.servingDesc,
      loggedAt: new Date().toISOString(),
    };
    await addFoodEntry(entry);
    await addToRecentFoods(entry);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    closePhotoScanner();
    await loadData();
  }

  async function handleBarcodeScan(result: any) {
    if (scanned) return;
    setScanned(true);
    const barcode = result.data;

    try {
      setScanLoading(true);
      setScanError(null);

      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        const scannedFood: ScannedFood = {
          name: product.product_name || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
          cal100g: product.nutriments?.['energy-kcal_100g'] || 0,
          prot100g: product.nutriments?.proteins_100g || 0,
          carb100g: product.nutriments?.carbohydrates_100g || 0,
          fat100g: product.nutriments?.fat_100g || 0,
          servingG: product.serving_quantity || 30,
          servingLabel: product.serving_size || '30g',
        };
        setScanResult(scannedFood);
      } else {
        setScanError('Product not found. Try searching manually.');
      }
    } catch (error) {
      setScanError('Network error. Check connection and try again.');
    } finally {
      setScanLoading(false);
    }
  }

  async function handleAddScannedFood() {
    if (!scanResult) return;

    const amount = parseFloat(scanServingAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid serving size');
      return;
    }

    const factor = amount / 100;
    const entry: FoodLogEntry = {
      id: `food_${Date.now()}`,
      date: todayStr(),
      name: `${scanResult.name} (${scanResult.brand})`,
      calories: Math.round(scanResult.cal100g * factor),
      proteinG: scanResult.prot100g * factor,
      carbsG: scanResult.carb100g * factor,
      fatG: scanResult.fat100g * factor,
      meal: selectedMeal,
      servingSize: `${scanServingAmount}g`,
      loggedAt: new Date().toISOString(),
    };

    await addFoodEntry(entry);
    await addToRecentFoods(entry);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    closeScanner();
    setSelectedMeal('lunch');
    await loadData();
  }

  async function handleLogRecentFood(recentFood: FoodLogEntry) {
    const entry: FoodLogEntry = {
      id: `food_${Date.now()}`,
      date: todayStr(),
      name: recentFood.name,
      calories: recentFood.calories,
      proteinG: recentFood.proteinG,
      carbsG: recentFood.carbsG,
      fatG: recentFood.fatG,
      servingSize: recentFood.servingSize,
      meal: selectedMeal,
      loggedAt: new Date().toISOString(),
    };

    await addFoodEntry(entry);
    await addToRecentFoods(entry);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await loadData();
  }

  async function handleLogMealTemplate(template: MealTemplate) {
    for (const food of template.foods) {
      const entry: FoodLogEntry = {
        id: `food_${Date.now()}_${Math.random()}`,
        date: todayStr(),
        name: food.foodName,
        calories: food.calories,
        proteinG: food.proteinG,
        carbsG: food.carbsG,
        fatG: food.fatG,
        meal: selectedMeal,
        servingSize: `${food.amountG}g`,
        loggedAt: new Date().toISOString(),
      };
      await addFoodEntry(entry);
      await addToRecentFoods(entry);
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowTemplateConfirmModal(false);
    setSelectedTemplateToLog(null);
    await loadData();
  }

  async function handleSaveTemplate() {
    if (!templateName.trim() || selectedFoodsForTemplate.length === 0) {
      Alert.alert('Invalid template', 'Please enter a name and select at least one food');
      return;
    }

    const totalCalories = selectedFoodsForTemplate.reduce((s, e) => s + e.calories, 0);
    const totalProtein = selectedFoodsForTemplate.reduce((s, e) => s + e.proteinG, 0);

    const template: MealTemplate = {
      id: `template_${Date.now()}`,
      name: templateName,
      emoji: selectedTemplateEmoji,
      foods: selectedFoodsForTemplate.map(food => ({
        foodName: food.name,
        calories: food.calories,
        proteinG: food.proteinG,
        carbsG: food.carbsG,
        fatG: food.fatG,
        amountG: parseFloat(food.servingSize?.match(/\d+/)?.[0] || '100') || 100,
      })),
      totalCalories,
      totalProtein,
      createdAt: new Date().toISOString(),
    };

    await saveMealTemplate(template);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowCreateTemplateModal(false);
    setTemplateName('');
    setSelectedTemplateEmoji('🍗');
    setSelectedFoodsForTemplate([]);
    await loadData();
  }

  const totalCals = foodEntries.reduce((s, e) => s + e.calories, 0);
  const totalProtein = foodEntries.reduce((s, e) => s + e.proteinG, 0);
  const totalCarbs = foodEntries.reduce((s, e) => s + e.carbsG, 0);
  const totalFat = foodEntries.reduce((s, e) => s + e.fatG, 0);

  const calPct = targets ? Math.min(totalCals / targets.calories, 1) : 0;
  const proteinPct = targets ? Math.min(totalProtein / targets.proteinG, 1) : 0;
  const waterPct = Math.min(waterOz / 64, 1);

  const filteredRestaurants = restaurantSearch.length < 2
    ? ALL_RESTAURANTS
    : ALL_RESTAURANTS.filter(r =>
        r.name.toLowerCase().includes(restaurantSearch.toLowerCase()) ||
        r.category.toLowerCase().includes(restaurantSearch.toLowerCase())
      );

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {/* Slate header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.headerTitle}>Eat Right 🌮</Text>
        <View style={styles.headerStats}>
          <Text style={styles.headerSub}>{totalCals} / {targets?.calories || 0} cal</Text>
          <ProgressBar pct={calPct} color={colors.orange} inline />
        </View>
        <View style={styles.headerDivider}>
          <View style={styles.divLine} />
          <Text style={styles.divStar}>✦</Text>
          <View style={styles.divLine} />
        </View>
      </View>

      {/* Tab selector */}
      <View style={styles.tabContainer}>
        {(['log', 'search', 'restaurants'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setActiveTab(tab);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
          >
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab === 'log' ? 'LOG' : tab === 'search' ? 'SEARCH' : 'EAT OUT'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TAB 1: LOG */}
      {activeTab === 'log' && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Macro summary */}
          {targets && (
            <View style={styles.summaryCard}>
              <View style={styles.macroRow}>
                <Text style={styles.macroLabel}>Calories</Text>
                <Text style={styles.macroValue}>{totalCals} / {targets.calories}</Text>
              </View>
              <ProgressBar pct={calPct} color={colors.calorie} />

              <View style={[styles.macroRow, { marginTop: spacing.lg }]}>
                <Text style={styles.macroLabel}>Protein</Text>
                <Text style={styles.macroValue}>{Math.round(totalProtein)}g / {targets.proteinG}g</Text>
              </View>
              <ProgressBar pct={proteinPct} color={colors.protein} />

              <View style={styles.macroGridRow}>
                <View style={styles.macroGridItem}>
                  <Text style={styles.macroGridLabel}>Carbs</Text>
                  <Text style={[styles.macroGridValue, { color: colors.carbs }]}>
                    {Math.round(totalCarbs)}g / {targets.carbsG}g
                  </Text>
                </View>
                <View style={styles.macroGridItem}>
                  <Text style={styles.macroGridLabel}>Fat</Text>
                  <Text style={[styles.macroGridValue, { color: colors.fat }]}>
                    {Math.round(totalFat)}g / {targets.fatG}g
                  </Text>
                </View>
              </View>

              {/* Edit Goals button */}
              <TouchableOpacity
                onPress={() => {
                  setEditCalories(String(targets.calories));
                  setEditProtein(String(targets.proteinG));
                  setEditCarbs(String(targets.carbsG));
                  setEditFat(String(targets.fatG));
                  setShowEditGoalsModal(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={egSt.editGoalsBtn}
              >
                <Text style={egSt.editGoalsBtnText}>
                  ✎ {hasCustomTargets ? 'Edit Custom Goals' : 'Edit Goals'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Edit Goals Modal */}
          <Modal
            visible={showEditGoalsModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowEditGoalsModal(false)}
          >
            <View style={egSt.editGoalsModal}>
              <View style={egSt.editGoalsHeader}>
                <Text style={egSt.editGoalsTitle}>Set Daily Goals</Text>
                <TouchableOpacity onPress={() => setShowEditGoalsModal(false)}>
                  <Text style={egSt.editGoalsCancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                <Text style={egSt.editGoalsHint}>
                  Set custom targets that override the auto-calculated values based on your profile.
                </Text>
                {[
                  { label: 'Calories', val: editCalories, set: setEditCalories, color: colors.calorie, unit: 'kcal' },
                  { label: 'Protein',  val: editProtein,  set: setEditProtein,  color: colors.protein, unit: 'g' },
                  { label: 'Carbs',    val: editCarbs,    set: setEditCarbs,    color: colors.carbs,   unit: 'g' },
                  { label: 'Fat',      val: editFat,      set: setEditFat,      color: colors.fat,     unit: 'g' },
                ].map(({ label, val, set, color, unit }) => (
                  <View key={label} style={egSt.editGoalsRow}>
                    <View style={[egSt.editGoalsColorDot, { backgroundColor: color }]} />
                    <Text style={egSt.editGoalsLabel}>{label}</Text>
                    <TextInput
                      style={egSt.editGoalsInput}
                      value={val}
                      onChangeText={set}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={colors.textMuted}
                    />
                    <Text style={egSt.editGoalsUnit}>{unit}</Text>
                  </View>
                ))}

                <TouchableOpacity
                  style={egSt.editGoalsSave}
                  onPress={async () => {
                    const cal = parseInt(editCalories, 10);
                    const prot = parseInt(editProtein, 10);
                    const carb = parseInt(editCarbs, 10);
                    const fat = parseInt(editFat, 10);
                    if ([cal, prot, carb, fat].some(v => isNaN(v) || v < 0)) {
                      Alert.alert('Invalid values', 'Please enter valid numbers for all fields.');
                      return;
                    }
                    const custom: CustomNutritionTargets = { calories: cal, proteinG: prot, carbsG: carb, fatG: fat };
                    await saveCustomNutritionTargets(custom);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setShowEditGoalsModal(false);
                    await loadData();
                  }}
                >
                  <Text style={egSt.editGoalsSaveText}>Save Goals ✓</Text>
                </TouchableOpacity>

                {hasCustomTargets && (
                  <TouchableOpacity
                    style={egSt.editGoalsReset}
                    onPress={async () => {
                      Alert.alert(
                        'Reset to Auto?',
                        'This will remove your custom goals and recalculate based on your profile.',
                        [
                          { text: 'Cancel' },
                          { text: 'Reset', style: 'destructive', onPress: async () => {
                            await clearCustomNutritionTargets();
                            setShowEditGoalsModal(false);
                            await loadData();
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                          }},
                        ]
                      );
                    }}
                  >
                    <Text style={egSt.editGoalsResetText}>↺ Reset to Auto-Calculated</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </Modal>

          {/* Water intake */}
          <View style={styles.waterCard}>
            <View style={styles.waterHeader}>
              <Text style={styles.waterTitle}>Water Intake</Text>
              <Text style={styles.waterAmount}>{waterOz} / 64 oz</Text>
            </View>
            <ProgressBar pct={waterPct} color={colors.blue} />
            <TouchableOpacity
              onPress={handleAddWater}
              style={styles.waterButton}
            >
              <Text style={styles.waterButtonText}>+ 8 oz</Text>
            </TouchableOpacity>
          </View>

          {/* Meal sections */}
          {MEALS.map(meal => {
            const entries = foodEntries.filter(e => e.meal === meal);
            if (entries.length === 0) return null;

            const mealCals = entries.reduce((s, e) => s + e.calories, 0);
            return (
              <View key={meal} style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealTitle}>{MEAL_LABELS[meal]}</Text>
                  <Text style={styles.mealCalories}>{mealCals} kcal</Text>
                </View>
                {entries.map(entry => (
                  <View key={entry.id} style={styles.foodItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.foodName}>{entry.name}</Text>
                      <Text style={styles.foodMacros}>
                        {entry.calories} cal · P:{entry.proteinG.toFixed(1)}g C:{entry.carbsG.toFixed(1)}g F:{entry.fatG.toFixed(1)}g
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteFood(entry.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={{ color: colors.red, fontSize: 16, fontWeight: '700' }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            );
          })}

          {/* Quick Combos */}
          {mealTemplates.length > 0 && (
            <View style={styles.quickCombosSection}>
              <View style={styles.quickCombosHeader}>
                <Text style={styles.quickCombosLabel}>QUICK COMBOS</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}
              >
                {mealTemplates.map(template => (
                  <TouchableOpacity
                    key={template.id}
                    onPress={() => {
                      setSelectedTemplateToLog(template);
                      setShowTemplateConfirmModal(true);
                    }}
                    style={styles.comboPill}
                  >
                    <Text style={styles.comboEmoji}>{template.emoji}</Text>
                    <Text style={styles.comboName}>{template.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => {
                    setSelectedFoodsForTemplate(foodEntries.slice(0, 5));
                    setShowCreateTemplateModal(true);
                  }}
                  style={[styles.comboPill, styles.newComboPill]}
                >
                  <Text style={styles.newComboText}>+</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}

          {/* Empty state */}
          {foodEntries.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🥗</Text>
              <Text style={styles.emptyText}>No food logged yet</Text>
              <Text style={styles.emptySubtext}>Use SEARCH or EAT OUT tabs to add meals</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* TAB 2: SEARCH */}
      {activeTab === 'search' && (
        <View style={{ flex: 1 }}>
          {/* Search input and barcode button */}
          <View style={styles.searchContainer}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search foods (min 2 chars)..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={handleSearchFood}
              />
            </View>
            <TouchableOpacity
              onPress={openScanner}
              style={styles.scanButton}
            >
              <Text style={styles.scanButtonText}>📷 Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openPhotoScanner}
              style={[styles.scanButton, { backgroundColor: colors.orangeDim, borderColor: colors.orangeBorder }]}
            >
              <Text style={[styles.scanButtonText, { color: colors.orange }]}>🤖 AI</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Foods */}
          {recentFoods.length > 0 && (
            <View style={styles.recentFoodsSection}>
              <Text style={styles.recentFoodsLabel}>RECENT</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}
              >
                {recentFoods.map(food => {
                  const foodEmoji = food.name.charAt(0).toUpperCase();
                  return (
                    <TouchableOpacity
                      key={food.id}
                      onPress={() => handleLogRecentFood(food)}
                      style={styles.recentFoodPill}
                    >
                      <Text style={styles.recentFoodEmoji}>{foodEmoji}</Text>
                      <Text style={styles.recentFoodName}>{food.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Results or suggestions */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: insets.bottom + spacing.lg }}
            showsVerticalScrollIndicator={false}
          >
            {searchQuery.length < 2 ? (
              <View style={styles.searchHintContainer}>
                <Text style={styles.searchHint}>Search 300,000+ foods</Text>
                <Text style={styles.searchHintSub}>Powered by USDA FoodData Central · type anything</Text>
              </View>
            ) : searchLoading ? (
              <View style={styles.searchHintContainer}>
                <ActivityIndicator color={colors.orange} size="small" />
                <Text style={[styles.searchHintSub, { marginTop: 8 }]}>Searching USDA database...</Text>
              </View>
            ) : searchResults.length === 0 ? (
              <View style={styles.searchHintContainer}>
                <Text style={styles.searchHint}>No foods found</Text>
                <Text style={styles.searchHintSub}>Try different keywords or check spelling</Text>
              </View>
            ) : (
              <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
                {/* Source badge */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.sm }}>
                  <View style={{ height: 1, flex: 1, backgroundColor: colors.cardBorder }} />
                  <Text style={{ fontSize: 9, color: colors.textMuted, fontWeight: '700', letterSpacing: 1 }}>
                    {searchResults[0]?.source === 'usda' ? `USDA DATABASE · ${searchResults.length} RESULTS` : `LOCAL DATABASE · ${searchResults.length} RESULTS`}
                  </Text>
                  <View style={{ height: 1, flex: 1, backgroundColor: colors.cardBorder }} />
                </View>
                {searchResults.map(food => {
                  const cal = Math.round(food.cal100g);
                  return (
                    <TouchableOpacity
                      key={food.id}
                      onPress={() => handleSelectFoodForLogging(food)}
                      style={styles.foodSearchResult}
                    >
                      <View style={styles.foodSearchEmoji}>
                        <Text style={styles.foodEmoji}>{food.emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.foodSearchName}>{food.name}</Text>
                        {food.brand ? <Text style={{ fontSize: 10, color: colors.textMuted, marginBottom: 1 }}>{food.brand}</Text> : null}
                        <Text style={styles.foodSearchMeta}>
                          {cal} cal · P:{food.prot100g.toFixed(1)}g C:{food.carb100g.toFixed(1)}g F:{food.fat100g.toFixed(1)}g
                        </Text>
                      </View>
                      <Text style={styles.foodSearchAdd}>→</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* TAB 3: RESTAURANTS */}
      {activeTab === 'restaurants' && !showRestaurantDetail && (
        <View style={{ flex: 1 }}>
          {/* Search bar */}
          <View style={styles.restSearchBar}>
            <Text style={styles.restSearchIcon}>🔍</Text>
            <TextInput
              style={styles.restSearchInput}
              placeholder="Search restaurants..."
              placeholderTextColor={colors.textMuted}
              value={restaurantSearch}
              onChangeText={setRestaurantSearch}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Calorie disclaimer strip */}
          <TouchableOpacity
            style={styles.disclaimerStrip}
            onPress={() => setShowDisclaimer(true)}
          >
            <Text style={styles.disclaimerStripText}>
              ⚠️ Nutrition values are estimates. Tap for info.
            </Text>
          </TouchableOpacity>

          {/* Restaurant count */}
          <Text style={styles.restCount}>
            {filteredRestaurants.length} restaurants
          </Text>

          {/* Restaurant list */}
          <FlatList
            data={filteredRestaurants}
            keyExtractor={r => r.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + spacing.lg }}
            renderItem={({ item: restaurant }) => (
              <TouchableOpacity
                onPress={() => {
                  if (!disclaimerSeen) { setShowDisclaimer(true); setDisclaimerSeen(true); }
                  setSelectedRestaurant(restaurant);
                  setShowRestaurantDetail(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={styles.restaurantCard}
              >
                <View style={styles.restaurantCardRow}>
                  <Text style={styles.restaurantEmoji}>{restaurant.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.restaurantName}>{restaurant.name}</Text>
                    <Text style={styles.restaurantCategory}>{restaurant.category} · {restaurant.items.length} items</Text>
                  </View>
                  <Text style={styles.restArrow}>→</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* RESTAURANT DETAIL VIEW */}
      {activeTab === 'restaurants' && showRestaurantDetail && selectedRestaurant && (() => {
        const hiProtein = selectedRestaurant.items
          .filter(i => i.tags?.includes('high-protein') || i.proteinG >= 30)
          .sort((a, b) => b.proteinG - a.proteinG)
          .slice(0, 4);
        const lowCal = selectedRestaurant.items
          .filter(i => i.tags?.includes('low-cal') || i.calories <= 450)
          .sort((a, b) => a.calories - b.calories)
          .slice(0, 4);
        return (
          <View style={{ flex: 1 }}>
            {/* Detail header */}
            <View style={styles.restaurantDetailHeader}>
              <TouchableOpacity onPress={() => setShowRestaurantDetail(false)} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.restaurantDetailName}>
                  {selectedRestaurant.emoji} {selectedRestaurant.name}
                </Text>
                <Text style={styles.restaurantDetailSub}>{selectedRestaurant.category}</Text>
              </View>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: insets.bottom + spacing.lg }}
              showsVerticalScrollIndicator={false}
            >
              {/* Calorie estimate disclaimer */}
              <View style={styles.restaurantDisclaimer}>
                <Text style={styles.restaurantDisclaimerText}>
                  📊 Calorie and macro values are estimates based on standard recipes. Actual values may vary by preparation and portion size.
                </Text>
              </View>

              {/* High Protein Picks */}
              {hiProtein.length > 0 && (
                <>
                  <View style={styles.recHeader}>
                    <Text style={styles.recTitle}>💪 High Protein Picks</Text>
                  </View>
                  {hiProtein.map(item => (
                    <RestaurantItem key={item.id} item={item} onLog={handleLogRestaurantItem} />
                  ))}
                </>
              )}

              {/* Low Calorie Picks */}
              {lowCal.length > 0 && (
                <>
                  <View style={[styles.recHeader, { marginTop: 8 }]}>
                    <Text style={styles.recTitle}>🥗 Low Calorie Options</Text>
                  </View>
                  {lowCal.map(item => (
                    <RestaurantItem key={item.id} item={item} onLog={handleLogRestaurantItem} />
                  ))}
                </>
              )}

              {/* Full Menu */}
              <View style={[styles.recHeader, { marginTop: 8 }]}>
                <Text style={styles.recTitle}>📋 Full Menu ({selectedRestaurant.items.length} items)</Text>
              </View>
              {selectedRestaurant.items.map(item => (
                <RestaurantItem key={item.id} item={item} onLog={handleLogRestaurantItem} />
              ))}
            </ScrollView>
          </View>
        );
      })()}

      {/* Disclaimer Modal */}
      <Modal
        visible={showDisclaimer}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDisclaimer(false)}
      >
        <View style={styles.disclaimerOverlay}>
          <View style={styles.disclaimerModal}>
            <Text style={styles.disclaimerTitle}>⚠️ Important Notices</Text>

            <Text style={styles.disclaimerSectionHead}>Medical Disclaimer</Text>
            <Text style={styles.disclaimerBody}>
              Funkytown Fit is not a medical application. Nutrition information is provided for general wellness purposes only and does not constitute medical advice. Consult a registered dietitian or physician before making significant dietary changes, especially if you have a medical condition.
            </Text>

            <Text style={styles.disclaimerSectionHead}>Calorie Estimates</Text>
            <Text style={styles.disclaimerBody}>
              Restaurant nutrition values are estimates based on publicly available information and standard recipes. Actual calorie and macro content may vary based on portion size, preparation method, substitutions, and location. We are not affiliated with any restaurant listed.
            </Text>

            <TouchableOpacity
              style={styles.disclaimerButton}
              onPress={() => { setShowDisclaimer(false); setDisclaimerSeen(true); }}
            >
              <Text style={styles.disclaimerButtonText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Log Food Modal */}
      <Modal
        visible={showLogFoodModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLogFoodModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingTop: insets.top + spacing.lg }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedFood?.name || 'Add Food'}</Text>
              <TouchableOpacity onPress={() => setShowLogFoodModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedFood && (
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* Meal selector */}
                <Text style={styles.fieldLabel}>Meal</Text>
                <View style={styles.mealSelector}>
                  {MEALS.map(meal => (
                    <TouchableOpacity
                      key={meal}
                      onPress={() => setSelectedMeal(meal)}
                      style={[
                        styles.mealSelectButton,
                        selectedMeal === meal && styles.mealSelectButtonActive,
                      ]}
                    >
                      <Text style={[
                        styles.mealSelectButtonText,
                        selectedMeal === meal && styles.mealSelectButtonTextActive,
                      ]}>
                        {MEAL_LABELS[meal]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Serving size */}
                <Text style={styles.fieldLabel}>Serving Size</Text>
                <View style={styles.servingSizeRow}>
                  <View style={{ flex: 1, marginRight: spacing.md }}>
                    <TextInput
                      style={styles.input}
                      placeholder="Amount"
                      keyboardType="decimal-pad"
                      value={servingAmount}
                      onChangeText={setServingAmount}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      style={styles.unitSelector}
                      onPress={() => setServingUnit(servingUnit === 'g' ? 'oz' : 'g')}
                    >
                      <Text style={styles.unitSelectorText}>{servingUnit}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.servingHint}>
                  {selectedFood.servingLabel} = {selectedFood.servingG}g
                </Text>

                {/* Macro preview */}
                <Text style={styles.fieldLabel}>Estimated Macros</Text>
                {(() => {
                  const factor = parseFloat(servingAmount) / 100;
                  const cal = Math.round(selectedFood.cal100g * factor);
                  const prot = selectedFood.prot100g * factor;
                  const carb = selectedFood.carb100g * factor;
                  const fat = selectedFood.fat100g * factor;
                  return (
                    <View style={styles.macroPreview}>
                      <View style={styles.macroPill}>
                        <Text style={[styles.macroPillValue, { color: colors.orange }]}>{cal}</Text>
                        <Text style={styles.macroPillLabel}>cal</Text>
                      </View>
                      <View style={styles.macroPill}>
                        <Text style={[styles.macroPillValue, { color: colors.protein }]}>{prot.toFixed(1)}</Text>
                        <Text style={styles.macroPillLabel}>protein</Text>
                      </View>
                      <View style={styles.macroPill}>
                        <Text style={[styles.macroPillValue, { color: colors.carbs }]}>{carb.toFixed(1)}</Text>
                        <Text style={styles.macroPillLabel}>carbs</Text>
                      </View>
                      <View style={styles.macroPill}>
                        <Text style={[styles.macroPillValue, { color: colors.fat }]}>{fat.toFixed(1)}</Text>
                        <Text style={styles.macroPillLabel}>fat</Text>
                      </View>
                    </View>
                  );
                })()}

                <TouchableOpacity
                  onPress={handleLogFood}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>Add to {MEAL_LABELS[selectedMeal]}</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* BARCODE SCANNER MODAL */}
      <Modal
        visible={scannerVisible}
        transparent
        animationType="fade"
        onRequestClose={closeScanner}
      >
        {!cameraPermission?.granted ? (
          <View style={styles.scannerContainer}>
            <View style={styles.permissionCard}>
              <Text style={styles.permissionTitle}>Camera Access Required</Text>
              <Text style={styles.permissionText}>
                We need camera access to scan product barcodes.
              </Text>
              <TouchableOpacity
                onPress={() => requestCameraPermission()}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Grant Permission</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeScanner}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.scannerContainer}>
            {/* Camera view */}
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScan}
            />

            {/* Frame overlay */}
            <View style={styles.scannerOverlay}>
              <View style={styles.scanFrame} />
            </View>

            {/* Cancel button */}
            <TouchableOpacity
              onPress={closeScanner}
              style={styles.scannerCancelButton}
            >
              <Text style={styles.scannerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Scan result confirmation modal */}
        {scanResult && !scanLoading && (
          <View style={[StyleSheet.absoluteFillObject, styles.resultOverlay]}>
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Scanned Product</Text>
                <TouchableOpacity onPress={closeScanner}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.resultName}>{scanResult.name}</Text>
                <Text style={styles.resultBrand}>{scanResult.brand}</Text>

                {/* Meal selector */}
                <Text style={styles.fieldLabel}>Meal</Text>
                <View style={styles.mealSelector}>
                  {MEALS.map(meal => (
                    <TouchableOpacity
                      key={meal}
                      onPress={() => setSelectedMeal(meal)}
                      style={[
                        styles.mealSelectButton,
                        selectedMeal === meal && styles.mealSelectButtonActive,
                      ]}
                    >
                      <Text style={[
                        styles.mealSelectButtonText,
                        selectedMeal === meal && styles.mealSelectButtonTextActive,
                      ]}>
                        {MEAL_LABELS[meal]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Serving size */}
                <Text style={styles.fieldLabel}>Serving Size (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="100"
                  keyboardType="decimal-pad"
                  value={scanServingAmount}
                  onChangeText={setScanServingAmount}
                />
                <Text style={styles.servingHint}>
                  Standard serving: {scanResult.servingLabel}
                </Text>

                {/* Macro preview */}
                <Text style={styles.fieldLabel}>Estimated Macros</Text>
                {(() => {
                  const factor = parseFloat(scanServingAmount) / 100;
                  const cal = Math.round(scanResult.cal100g * factor);
                  const prot = scanResult.prot100g * factor;
                  const carb = scanResult.carb100g * factor;
                  const fat = scanResult.fat100g * factor;
                  return (
                    <View style={styles.macroPreview}>
                      <View style={styles.macroPill}>
                        <Text style={[styles.macroPillValue, { color: colors.orange }]}>{cal}</Text>
                        <Text style={styles.macroPillLabel}>cal</Text>
                      </View>
                      <View style={styles.macroPill}>
                        <Text style={[styles.macroPillValue, { color: colors.protein }]}>{prot.toFixed(1)}</Text>
                        <Text style={styles.macroPillLabel}>protein</Text>
                      </View>
                      <View style={styles.macroPill}>
                        <Text style={[styles.macroPillValue, { color: colors.carbs }]}>{carb.toFixed(1)}</Text>
                        <Text style={styles.macroPillLabel}>carbs</Text>
                      </View>
                      <View style={styles.macroPill}>
                        <Text style={[styles.macroPillValue, { color: colors.fat }]}>{fat.toFixed(1)}</Text>
                        <Text style={styles.macroPillLabel}>fat</Text>
                      </View>
                    </View>
                  );
                })()}

                <TouchableOpacity
                  onPress={handleAddScannedFood}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>Add to {MEAL_LABELS[selectedMeal]}</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Loading spinner */}
        {scanLoading && (
          <View style={[StyleSheet.absoluteFillObject, styles.loadingOverlay]}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={colors.orange} />
              <Text style={styles.loadingText}>Scanning product...</Text>
            </View>
          </View>
        )}

        {/* Error message */}
        {scanError && !scanLoading && !scanResult && (
          <View style={[StyleSheet.absoluteFillObject, styles.resultOverlay]}>
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>Product Not Found</Text>
              <Text style={styles.errorText}>{scanError}</Text>
              <TouchableOpacity
                onPress={() => {
                  setScanned(false);
                  setScanError(null);
                }}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Scan Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeScanner}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>

      {/* ── FOOD PHOTO AI MODAL ─────────────────────────────────────────────── */}
      <Modal
        visible={photoScannerVisible}
        transparent
        animationType="fade"
        onRequestClose={closePhotoScanner}
      >
        {!cameraPermission?.granted ? (
          <View style={styles.scannerContainer}>
            <View style={styles.permissionCard}>
              <Text style={styles.permissionTitle}>Camera Access Required</Text>
              <Text style={styles.permissionText}>
                We need camera access to identify food with AI.
              </Text>
              <TouchableOpacity onPress={requestCameraPermission} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Grant Permission</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closePhotoScanner} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.scannerContainer}>
            {/* Live camera feed */}
            {!photoResult && (
              <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFillObject}
                facing="back"
              />
            )}

            {/* Dark overlay when not showing result */}
            {!photoResult && !photoAnalyzing && (
              <>
                <View style={photoSt.hintBanner}>
                  <Text style={photoSt.hintText}>🤖 Point camera at your food, then tap Snap</Text>
                </View>
                <TouchableOpacity style={photoSt.snapBtn} onPress={handleTakePhoto}>
                  <View style={photoSt.snapBtnInner} />
                </TouchableOpacity>
                <TouchableOpacity style={photoSt.cancelOverlay} onPress={closePhotoScanner}>
                  <Text style={photoSt.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Analyzing state */}
            {photoAnalyzing && (
              <View style={photoSt.analyzingOverlay}>
                <ActivityIndicator size="large" color={colors.orange} />
                <Text style={photoSt.analyzingText}>Analyzing food…</Text>
                <Text style={photoSt.analyzingSubText}>Claude Vision is identifying your meal</Text>
              </View>
            )}

            {/* Error state */}
            {photoError && !photoAnalyzing && (
              <View style={photoSt.analyzingOverlay}>
                <Text style={photoSt.errorIcon}>⚠️</Text>
                <Text style={photoSt.errorText}>{photoError}</Text>
                <TouchableOpacity
                  style={[styles.submitButton, { marginTop: 16, alignSelf: 'center', paddingHorizontal: 24 }]}
                  onPress={() => { setPhotoError(null); setPhotoResult(null); }}
                >
                  <Text style={styles.submitButtonText}>Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closePhotoScanner} style={{ marginTop: 10 }}>
                  <Text style={photoSt.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Result card */}
            {photoResult && !photoAnalyzing && (
              <View style={[StyleSheet.absoluteFillObject, styles.resultOverlay]}>
                <View style={[styles.resultCard, { paddingBottom: 24 }]}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>AI Food Analysis</Text>
                    <TouchableOpacity onPress={closePhotoScanner}>
                      <Text style={styles.modalClose}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.resultName}>{photoResult.food}</Text>
                  <Text style={styles.resultBrand}>{photoResult.servingDesc}</Text>

                  {/* Macro summary */}
                  <View style={photoSt.macroRow}>
                    <View style={photoSt.macroChip}>
                      <Text style={[photoSt.macroVal, { color: colors.orange }]}>{photoResult.calories}</Text>
                      <Text style={photoSt.macroLabel}>cal</Text>
                    </View>
                    <View style={photoSt.macroChip}>
                      <Text style={[photoSt.macroVal, { color: colors.protein }]}>{photoResult.proteinG}g</Text>
                      <Text style={photoSt.macroLabel}>protein</Text>
                    </View>
                    <View style={photoSt.macroChip}>
                      <Text style={[photoSt.macroVal, { color: colors.carbs }]}>{photoResult.carbsG}g</Text>
                      <Text style={photoSt.macroLabel}>carbs</Text>
                    </View>
                    <View style={photoSt.macroChip}>
                      <Text style={[photoSt.macroVal, { color: colors.fat }]}>{photoResult.fatG}g</Text>
                      <Text style={photoSt.macroLabel}>fat</Text>
                    </View>
                  </View>

                  <Text style={photoSt.aiDisclaimer}>
                    AI estimates — actual values may vary. Tap "Retake" to try a better angle.
                  </Text>

                  {/* Meal selector */}
                  <Text style={styles.fieldLabel}>Meal</Text>
                  <View style={styles.mealSelector}>
                    {MEALS.map(meal => (
                      <TouchableOpacity
                        key={meal}
                        onPress={() => setSelectedMeal(meal)}
                        style={[
                          styles.mealSelectButton,
                          selectedMeal === meal && styles.mealSelectButtonActive,
                        ]}
                      >
                        <Text style={[
                          styles.mealSelectButtonText,
                          selectedMeal === meal && styles.mealSelectButtonTextActive,
                        ]}>
                          {MEAL_LABELS[meal]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Action buttons */}
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                    <TouchableOpacity
                      style={[styles.cancelButton, { flex: 1 }]}
                      onPress={() => { setPhotoResult(null); setPhotoError(null); }}
                    >
                      <Text style={styles.cancelButtonText}>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.submitButton, { flex: 2 }]}
                      onPress={handleLogPhotoFood}
                    >
                      <Text style={styles.submitButtonText}>Add to Log</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </Modal>

      {/* Template Confirm Modal */}
      <Modal
        visible={showTemplateConfirmModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTemplateConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingTop: insets.top + spacing.lg }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedTemplateToLog?.emoji} {selectedTemplateToLog?.name}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowTemplateConfirmModal(false);
                setSelectedTemplateToLog(null);
              }}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedTemplateToLog && (
              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* Foods in template */}
                <Text style={styles.fieldLabel}>Foods in this combo</Text>
                <View style={{ marginBottom: spacing.lg }}>
                  {selectedTemplateToLog.foods.map((food, idx) => (
                    <View key={idx} style={styles.templateFoodItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.templateFoodName}>{food.foodName}</Text>
                        <Text style={styles.templateFoodMacros}>
                          {food.calories} cal · P:{food.proteinG.toFixed(1)}g C:{food.carbsG.toFixed(1)}g
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Total macros */}
                <View style={styles.templateTotalCard}>
                  <View style={styles.totalMacroRow}>
                    <Text style={styles.totalMacroLabel}>Total Calories</Text>
                    <Text style={styles.totalMacroValue}>{selectedTemplateToLog.totalCalories}</Text>
                  </View>
                  <View style={styles.totalMacroRow}>
                    <Text style={styles.totalMacroLabel}>Total Protein</Text>
                    <Text style={styles.totalMacroValue}>{selectedTemplateToLog.totalProtein.toFixed(1)}g</Text>
                  </View>
                </View>

                {/* Meal selector */}
                <Text style={styles.fieldLabel}>Meal</Text>
                <View style={styles.mealSelector}>
                  {MEALS.map(meal => (
                    <TouchableOpacity
                      key={meal}
                      onPress={() => setSelectedMeal(meal)}
                      style={[
                        styles.mealSelectButton,
                        selectedMeal === meal && styles.mealSelectButtonActive,
                      ]}
                    >
                      <Text style={[
                        styles.mealSelectButtonText,
                        selectedMeal === meal && styles.mealSelectButtonTextActive,
                      ]}>
                        {MEAL_LABELS[meal]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => handleLogMealTemplate(selectedTemplateToLog)}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>Log All</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Create Template Modal */}
      <Modal
        visible={showCreateTemplateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateTemplateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingTop: insets.top + spacing.lg }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Combo</Text>
              <TouchableOpacity onPress={() => {
                setShowCreateTemplateModal(false);
                setTemplateName('');
                setSelectedTemplateEmoji('🍗');
                setSelectedFoodsForTemplate([]);
              }}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {/* Name input */}
              <Text style={styles.fieldLabel}>Combo Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Post-Workout"
                placeholderTextColor={colors.textMuted}
                value={templateName}
                onChangeText={setTemplateName}
              />

              {/* Emoji picker */}
              <Text style={styles.fieldLabel}>Icon</Text>
              <View style={styles.emojiPicker}>
                {['🍗', '🥗', '🥞', '🍳', '🥙', '🍜', '🥩', '🫙'].map(emoji => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => setSelectedTemplateEmoji(emoji)}
                    style={[
                      styles.emojiOption,
                      selectedTemplateEmoji === emoji && styles.emojiOptionActive,
                    ]}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Foods from today */}
              <Text style={styles.fieldLabel}>Add Foods from Today</Text>
              {foodEntries.length === 0 ? (
                <Text style={styles.noFoodsText}>No foods logged yet today</Text>
              ) : (
                <View style={{ marginBottom: spacing.lg }}>
                  {foodEntries.map(entry => (
                    <TouchableOpacity
                      key={entry.id}
                      onPress={() => {
                        const idx = selectedFoodsForTemplate.findIndex(f => f.id === entry.id);
                        if (idx >= 0) {
                          setSelectedFoodsForTemplate(selectedFoodsForTemplate.filter((_, i) => i !== idx));
                        } else {
                          setSelectedFoodsForTemplate([...selectedFoodsForTemplate, entry]);
                        }
                      }}
                      style={[
                        styles.foodCheckItem,
                        selectedFoodsForTemplate.find(f => f.id === entry.id) && styles.foodCheckItemActive,
                      ]}
                    >
                      <Text style={styles.foodCheckmark}>
                        {selectedFoodsForTemplate.find(f => f.id === entry.id) ? '✓' : '○'}
                      </Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.foodCheckName}>{entry.name}</Text>
                        <Text style={styles.foodCheckMacros}>{entry.calories} cal</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Summary */}
              {selectedFoodsForTemplate.length > 0 && (
                <View style={styles.templateSummary}>
                  <Text style={styles.summaryText}>
                    {selectedFoodsForTemplate.length} food{selectedFoodsForTemplate.length !== 1 ? 's' : ''} •{' '}
                    {selectedFoodsForTemplate.reduce((s, e) => s + e.calories, 0)} cal
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={handleSaveTemplate}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Save Combo</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── RestaurantItem sub-component ──────────────────────────────────────────────
function RestaurantItem({ item, onLog }: { item: MenuItem; onLog: (i: MenuItem) => void }) {
  return (
    <View style={rstSt.item}>
      <View style={{ flex: 1 }}>
        <Text style={rstSt.itemName}>{item.name}</Text>
        <Text style={rstSt.itemMeta}>
          {item.calories} cal · P:{item.proteinG}g C:{item.carbsG}g F:{item.fatG}g
        </Text>
        <Text style={rstSt.serving}>{item.servingSize}</Text>
        {item.tags && item.tags.length > 0 && (
          <View style={rstSt.tagRow}>
            {item.tags.map(t => (
              <View key={t} style={rstSt.tag}>
                <Text style={rstSt.tagText}>{
                  t === 'high-protein' ? '💪' : t === 'low-cal' ? '🥗' :
                  t === 'vegan' ? '🌱' : t === 'gluten-free' ? 'GF' : t === 'vegetarian' ? '🥦' : t
                }</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <TouchableOpacity onPress={() => onLog(item)} style={rstSt.logBtn}>
        <Text style={rstSt.logBtnText}>+ Log</Text>
      </TouchableOpacity>
    </View>
  );
}

const rstSt = StyleSheet.create({
  item: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.card, borderRadius: radius.md,
    padding: spacing.md, marginBottom: 8,
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  itemName:    { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  itemMeta:    { fontSize: 11, color: colors.textSecondary },
  serving:     { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  tagRow:      { flexDirection: 'row', gap: 4, marginTop: 4 },
  tag:         { backgroundColor: colors.bgSecondary, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2, borderWidth: 1, borderColor: colors.cardBorder },
  tagText:     { fontSize: 9, fontWeight: '700', color: colors.textSecondary },
  logBtn:      { backgroundColor: colors.orange, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 6, marginLeft: spacing.sm, alignSelf: 'flex-start', marginTop: 2 },
  logBtnText:  { fontSize: 12, fontWeight: '800', color: '#fff' },
});

function ProgressBar({ pct, color, inline }: { pct: number; color: string; inline?: boolean }) {
  if (inline) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View style={[styles.progressBar, { flex: 1, backgroundColor: colors.cardBorder }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(pct * 100, 100)}%`, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: '600', width: 40 }}>
          {Math.round(pct * 100)}%
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.progressBar, { backgroundColor: colors.cardBorder }]}>
      <View
        style={[
          styles.progressFill,
          { width: `${Math.min(pct * 100, 100)}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: {
    fontSize: 24, fontWeight: '800', color: colors.orange,
    marginBottom: spacing.sm, letterSpacing: -0.5,
  },
  headerStats: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
  },
  headerSub: {
    fontSize: 13, color: colors.textSecondary, fontWeight: '600',
  },
  headerDivider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  divLine: { flex: 1, height: 1, backgroundColor: colors.cardBorder },
  divStar: { fontSize: 11, color: colors.orange },

  // Restaurant search + list
  restSearchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg, marginTop: spacing.md,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  restSearchIcon: { fontSize: 14, marginRight: 8 },
  restSearchInput: {
    flex: 1, fontSize: 14, color: colors.textPrimary,
    paddingVertical: 2,
  },
  disclaimerStrip: {
    marginHorizontal: spacing.lg, marginTop: spacing.sm,
    backgroundColor: '#1A1A1A',
    borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 6,
    borderWidth: 1, borderColor: '#2E2E2E',
  },
  disclaimerStripText: { fontSize: 11, color: '#FFB74D', fontWeight: '600' },
  restCount: {
    fontSize: 10, fontWeight: '700', color: colors.textMuted,
    letterSpacing: 1.2, textTransform: 'uppercase',
    marginHorizontal: spacing.lg, marginTop: spacing.sm, marginBottom: 4,
  },
  restaurantCard: {
    backgroundColor: colors.card, borderRadius: radius.md,
    padding: spacing.md, marginBottom: 8,
    borderWidth: 1, borderColor: colors.cardBorder,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 2,
  },
  restaurantCardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  restaurantEmoji: { fontSize: 26, width: 36, textAlign: 'center' },
  restaurantName: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  restaurantCategory: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  restArrow: { fontSize: 16, color: colors.textMuted, fontWeight: '700' },
  restPillRow: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  restPill: { borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  restPillText: { fontSize: 10, fontWeight: '700' },

  // Restaurant detail
  restaurantDetailHeader: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.cardBorder,
  },
  backButton: { padding: 4 },
  backButtonText: { fontSize: 14, fontWeight: '700', color: colors.orange },
  restaurantDetailName: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  restaurantDetailSub:  { fontSize: 11, color: colors.textSecondary },

  restaurantDisclaimer: {
    backgroundColor: '#141414', borderRadius: radius.sm,
    padding: spacing.sm, marginBottom: 12,
    borderWidth: 1, borderColor: '#2E2E2E',
  },
  restaurantDisclaimerText: { fontSize: 11, color: '#FFB74D', lineHeight: 16 },

  recHeader: { marginBottom: 8, marginTop: 4 },
  recTitle: {
    fontSize: 12, fontWeight: '800', color: colors.textSecondary,
    letterSpacing: 0.8, textTransform: 'uppercase',
  },

  // Disclaimer modal
  disclaimerOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center', justifyContent: 'center', padding: spacing.lg,
  },
  disclaimerModal: {
    backgroundColor: colors.card, borderRadius: radius.lg,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.cardBorder,
    maxWidth: 380, width: '100%',
  },
  disclaimerTitle: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, marginBottom: 14 },
  disclaimerSectionHead: { fontSize: 12, fontWeight: '800', color: colors.orange, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 12, marginBottom: 4 },
  disclaimerBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  disclaimerButton: {
    backgroundColor: colors.orange, borderRadius: radius.md,
    paddingVertical: 14, alignItems: 'center', marginTop: 20,
  },
  disclaimerButtonText: { fontSize: 15, fontWeight: '900', color: '#fff' },

  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.bg,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tabButtonActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  tabLabel: {
    ...typography.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '700',
  },
  tabLabelActive: {
    color: 'white',
  },

  summaryCard: {
    margin: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 2,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  macroLabel: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  macroValue: {
    ...typography.h3,
    color: colors.orange,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  macroGridRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  macroGridItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroGridLabel: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  macroGridValue: {
    ...typography.h2,
  },

  waterCard: {
    margin: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 2,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  waterTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  waterAmount: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  waterButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.orange,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  waterButtonText: {
    ...typography.button,
    color: 'white',
  },

  mealSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  mealTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  mealCalories: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  foodItem: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  foodName: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  foodMacros: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  deleteButton: {
    marginLeft: spacing.md,
    padding: spacing.sm,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },

  // Search tab styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.bg,
    gap: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  searchHintContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  searchHint: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  searchHintSub: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  foodSearchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  foodSearchEmoji: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.orangeDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  foodEmoji: {
    fontSize: 20,
  },
  foodSearchName: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  foodSearchMeta: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  foodSearchAdd: {
    fontSize: 18,
    color: colors.orange,
    fontWeight: '700',
    marginLeft: spacing.md,
  },

  // Restaurant tab styles
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.bg,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginRight: 6,
  },
  filterPillActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#fff',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  modalClose: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  mealSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  mealSelectButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  mealSelectButtonActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  mealSelectButtonText: {
    ...typography.bodySm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  mealSelectButtonTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  servingSizeRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  unitSelector: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitSelectorText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  servingHint: {
    ...typography.bodySm,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  macroPreview: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  macroPill: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  macroPillValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  macroPillLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  submitButton: {
    backgroundColor: colors.orange,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  submitButtonText: {
    ...typography.button,
    color: 'white',
  },
  cancelButton: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },

  // Barcode scanner styles
  scanButton: {
    backgroundColor: colors.orange,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginLeft: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: colors.orange,
    borderRadius: 0,
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  scannerCancelButton: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  scannerCancelText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  resultOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  resultCard: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingBottom: spacing.xl,
    maxHeight: '80%',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  resultTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  resultName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  resultBrand: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  errorCard: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  errorTitle: {
    ...typography.h2,
    color: colors.red,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  loadingOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.lg,
  },
  permissionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  permissionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  permissionText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  // Recent Foods Styles
  recentFoodsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: spacing.md,
  },
  recentFoodsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  recentFoodPill: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    minWidth: 90,
  },
  recentFoodEmoji: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  recentFoodName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Quick Combos Styles
  quickCombosSection: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: spacing.md,
    marginTop: spacing.lg,
  },
  quickCombosHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  quickCombosLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  comboPill: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    minWidth: 100,
  },
  newComboPill: {
    justifyContent: 'center',
  },
  comboEmoji: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  comboName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  newComboText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.orange,
  },

  // Template Modals
  templateFoodItem: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  templateFoodName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  templateFoodMacros: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  templateTotalCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.orange,
  },
  totalMacroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  totalMacroRow_last: {
    marginBottom: 0,
  },
  totalMacroLabel: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  totalMacroValue: {
    ...typography.body,
    color: colors.orange,
    fontWeight: '700',
  },

  // Emoji Picker
  emojiPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  emojiOption: {
    flex: 1,
    minWidth: '20%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  emojiOptionActive: {
    borderColor: colors.orange,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  emojiText: {
    fontSize: 24,
  },

  // Food Checklist
  foodCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  foodCheckItemActive: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderColor: colors.orange,
  },
  foodCheckmark: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.orange,
    marginRight: spacing.md,
    minWidth: 20,
  },
  foodCheckName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  foodCheckMacros: {
    ...typography.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  noFoodsText: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
    padding: spacing.lg,
    textAlign: 'center',
  },

  // Template Summary
  templateSummary: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  summaryText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
});


// ── Food Photo AI styles ──────────────────────────────────────────────────────
const photoSt = StyleSheet.create({
  hintBanner: {
    position: 'absolute',
    top: 60,
    left: 20, right: 20,
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderRadius: radius.md,
    paddingHorizontal: 16, paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1, borderColor: colors.cardBorder,
  },
  hintText: {
    fontSize: 14, fontWeight: '600', color: colors.textPrimary, textAlign: 'center',
  },

  // Shutter button — large circle at the bottom
  snapBtn: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    width: 76, height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 4, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  snapBtnInner: {
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },

  cancelOverlay: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  cancelText: {
    fontSize: 16, fontWeight: '700', color: 'rgba(255,255,255,0.85)',
  },

  // Analyzing / error overlay
  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,17,23,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  analyzingText: {
    fontSize: 18, fontWeight: '800', color: colors.textPrimary, textAlign: 'center',
  },
  analyzingSubText: {
    fontSize: 13, color: colors.textSecondary, textAlign: 'center',
  },
  errorIcon: { fontSize: 40 },
  errorText: {
    fontSize: 14, color: '#E84040', textAlign: 'center', lineHeight: 20,
  },

  // Result card extras
  macroRow: {
    flexDirection: 'row', gap: 8, marginTop: 14, marginBottom: 8,
  },
  macroChip: {
    flex: 1, alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.cardBorder,
    paddingVertical: 10,
  },
  macroVal: {
    fontSize: 18, fontWeight: '900', letterSpacing: -0.5,
  },
  macroLabel: {
    fontSize: 9, fontWeight: '700', color: colors.textMuted,
    letterSpacing: 1.1, textTransform: 'uppercase', marginTop: 2,
  },
  aiDisclaimer: {
    fontSize: 11, color: colors.textMuted, textAlign: 'center',
    marginBottom: 16, fontStyle: 'italic',
  },
});


const egSt = StyleSheet.create({
  editGoalsBtn: {
    marginTop: 14, alignSelf: 'flex-end',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 8, borderWidth: 1, borderColor: colors.orange + '60',
  },
  editGoalsBtnText: { fontSize: 12, color: colors.orange, fontWeight: '700' },
  editGoalsModal:  { flex: 1, backgroundColor: colors.bg },
  editGoalsHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: colors.cardBorder,
  },
  editGoalsTitle:  { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  editGoalsCancel: { fontSize: 15, color: colors.orange, fontWeight: '700' },
  editGoalsHint: {
    fontSize: 13, color: colors.textSecondary, marginBottom: 24, lineHeight: 18,
  },
  editGoalsRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 16,
    backgroundColor: colors.card, borderRadius: radius.md, padding: 14,
    borderWidth: 1, borderColor: colors.cardBorder, gap: 10,
  },
  editGoalsColorDot: { width: 10, height: 10, borderRadius: 5 },
  editGoalsLabel:    { fontSize: 14, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  editGoalsInput: {
    backgroundColor: colors.bgSecondary, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
    color: colors.textPrimary, fontSize: 16, fontWeight: '800',
    borderWidth: 1, borderColor: colors.cardBorder, minWidth: 80, textAlign: 'center',
  },
  editGoalsUnit:     { fontSize: 12, color: colors.textMuted, fontWeight: '600', width: 28 },
  editGoalsSave: {
    backgroundColor: colors.orange, borderRadius: radius.md,
    paddingVertical: 16, alignItems: 'center', marginTop: 8, marginBottom: 12,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  editGoalsSaveText: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 0.3 },
  editGoalsReset: {
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.md,
    paddingVertical: 12, alignItems: 'center',
  },
  editGoalsResetText: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
});
