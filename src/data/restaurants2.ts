// AUTO-GENERATED — do not edit manually. Run: node scripts/gen-restaurants-2.js

export interface MenuItem {
  id: string; name: string; calories: number; proteinG: number;
  carbsG: number; fatG: number; servingSize: string; tags?: string[];
}

export interface Restaurant {
  id: string; name: string; category: string; emoji: string; items: MenuItem[];
}

export const RESTAURANTS2: Restaurant[] = [
  {
    "id": "paris_coffee",
    "name": "Paris Coffee Shop",
    "category": "Breakfast",
    "emoji": "☕",
    "items": [
      {
        "id": "pc1",
        "name": "French Toast",
        "calories": 520,
        "proteinG": 14,
        "carbsG": 68,
        "fatG": 18,
        "servingSize": "3 slices",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pc2",
        "name": "Chicken Fried Steak & Eggs",
        "calories": 980,
        "proteinG": 48,
        "carbsG": 72,
        "fatG": 52,
        "servingSize": "1 plate"
      },
      {
        "id": "pc3",
        "name": "Breakfast Burrito",
        "calories": 640,
        "proteinG": 34,
        "carbsG": 58,
        "fatG": 28,
        "servingSize": "1 burrito"
      },
      {
        "id": "pc4",
        "name": "Pancakes Short Stack",
        "calories": 480,
        "proteinG": 12,
        "carbsG": 76,
        "fatG": 14,
        "servingSize": "3 pancakes",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pc5",
        "name": "Eggs Benedict",
        "calories": 620,
        "proteinG": 28,
        "carbsG": 44,
        "fatG": 34,
        "servingSize": "1 plate"
      },
      {
        "id": "pc6",
        "name": "Two Eggs Any Style",
        "calories": 220,
        "proteinG": 14,
        "carbsG": 2,
        "fatG": 16,
        "servingSize": "2 eggs",
        "tags": ["low-cal", "gluten-free"]
      },
      {
        "id": "pc7",
        "name": "Biscuits & Gravy",
        "calories": 580,
        "proteinG": 18,
        "carbsG": 66,
        "fatG": 24,
        "servingSize": "2 biscuits"
      },
      {
        "id": "pc8",
        "name": "Fresh Fruit Bowl",
        "calories": 140,
        "proteinG": 2,
        "carbsG": 34,
        "fatG": 1,
        "servingSize": "1 bowl",
        "tags": ["vegan", "low-cal"]
      }
    ]
  },
  {
    "id": "olsouth",
    "name": "Ol' South Pancake House",
    "category": "Breakfast",
    "emoji": "🥞",
    "items": [
      {
        "id": "os1",
        "name": "Dutch Baby Pancake",
        "calories": 560,
        "proteinG": 14,
        "carbsG": 74,
        "fatG": 22,
        "servingSize": "1 pancake",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "os2",
        "name": "Belgian Waffle",
        "calories": 620,
        "proteinG": 16,
        "carbsG": 80,
        "fatG": 24,
        "servingSize": "1 waffle",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "os3",
        "name": "Country Fried Steak",
        "calories": 920,
        "proteinG": 46,
        "carbsG": 68,
        "fatG": 48,
        "servingSize": "1 plate"
      },
      {
        "id": "os4",
        "name": "Omelette 3-Egg",
        "calories": 480,
        "proteinG": 32,
        "carbsG": 8,
        "fatG": 34,
        "servingSize": "1 omelette",
        "tags": [
          "gluten-free"
        ]
      },
      {
        "id": "os5",
        "name": "Banana Foster Pancakes",
        "calories": 780,
        "proteinG": 16,
        "carbsG": 106,
        "fatG": 28,
        "servingSize": "3 pancakes",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "os6",
        "name": "Corned Beef Hash",
        "calories": 540,
        "proteinG": 28,
        "carbsG": 42,
        "fatG": 26,
        "servingSize": "1 plate"
      },
      {
        "id": "os7",
        "name": "Egg White Veggie Omelette",
        "calories": 280,
        "proteinG": 24,
        "carbsG": 12,
        "fatG": 12,
        "servingSize": "1 omelette",
        "tags": ["low-cal", "gluten-free"]
      },
      {
        "id": "os8",
        "name": "Buttermilk Pancakes",
        "calories": 520,
        "proteinG": 12,
        "carbsG": 78,
        "fatG": 16,
        "servingSize": "3 pancakes",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "freds",
    "name": "Fred's Texas Cafe",
    "category": "Burgers",
    "emoji": "🍔",
    "items": [
      {
        "id": "ft1",
        "name": "Diablo Burger",
        "calories": 780,
        "proteinG": 44,
        "carbsG": 52,
        "fatG": 42,
        "servingSize": "1 burger"
      },
      {
        "id": "ft2",
        "name": "Philly Cheesesteak",
        "calories": 820,
        "proteinG": 52,
        "carbsG": 64,
        "fatG": 34,
        "servingSize": "1 sandwich"
      },
      {
        "id": "ft3",
        "name": "Buffalo Chicken Sandwich",
        "calories": 680,
        "proteinG": 46,
        "carbsG": 56,
        "fatG": 26,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ft4",
        "name": "Chicken Tenders Basket",
        "calories": 740,
        "proteinG": 42,
        "carbsG": 68,
        "fatG": 28,
        "servingSize": "4 tenders"
      },
      {
        "id": "ft5",
        "name": "Green Chile Cheeseburger",
        "calories": 860,
        "proteinG": 48,
        "carbsG": 54,
        "fatG": 46,
        "servingSize": "1 burger"
      },
      {
        "id": "ft6",
        "name": "Queso & Chips",
        "calories": 480,
        "proteinG": 16,
        "carbsG": 48,
        "fatG": 26,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ft7",
        "name": "Onion Rings",
        "calories": 340,
        "proteinG": 6,
        "carbsG": 42,
        "fatG": 16,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ft8",
        "name": "Loaded Nachos",
        "calories": 860,
        "proteinG": 36,
        "carbsG": 72,
        "fatG": 44,
        "servingSize": "1 order"
      }
    ]
  },
  {
    "id": "woodshed_2",
    "name": "Woodshed Smokehouse",
    "category": "BBQ",
    "emoji": "🪵",
    "items": [
      {
        "id": "ws1",
        "name": "Smoked Brisket Plate",
        "calories": 840,
        "proteinG": 62,
        "carbsG": 44,
        "fatG": 44,
        "servingSize": "1 plate"
      },
      {
        "id": "ws2",
        "name": "Wood-Roasted Chicken",
        "calories": 580,
        "proteinG": 68,
        "carbsG": 12,
        "fatG": 26,
        "servingSize": "1 half",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ws3",
        "name": "Smoked Lamb Ribs",
        "calories": 920,
        "proteinG": 58,
        "carbsG": 18,
        "fatG": 68,
        "servingSize": "1 plate"
      },
      {
        "id": "ws4",
        "name": "Grilled Redfish",
        "calories": 480,
        "proteinG": 52,
        "carbsG": 14,
        "fatG": 22,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ws5",
        "name": "BBQ Pork Belly",
        "calories": 780,
        "proteinG": 42,
        "carbsG": 28,
        "fatG": 54,
        "servingSize": "1 plate"
      },
      {
        "id": "ws6",
        "name": "Cast Iron Cornbread",
        "calories": 240,
        "proteinG": 6,
        "carbsG": 38,
        "fatG": 8,
        "servingSize": "1 piece",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ws7",
        "name": "Smoked Jalapeño Mac",
        "calories": 380,
        "proteinG": 14,
        "carbsG": 46,
        "fatG": 16,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ws8",
        "name": "Peach Bread Pudding",
        "calories": 420,
        "proteinG": 8,
        "carbsG": 62,
        "fatG": 16,
        "servingSize": "1 serving"
      }
    ]
  },
  {
    "id": "bonnells",
    "name": "Bonnell's Fine Texas Cuisine",
    "category": "Fine Dining",
    "emoji": "🦌",
    "items": [
      {
        "id": "bo1",
        "name": "Elk Tenderloin",
        "calories": 680,
        "proteinG": 72,
        "carbsG": 12,
        "fatG": 34,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "bo2",
        "name": "Wild Boar Chops",
        "calories": 740,
        "proteinG": 62,
        "carbsG": 18,
        "fatG": 44,
        "servingSize": "1 plate",
        "tags": [
          "gluten-free"
        ]
      },
      {
        "id": "bo3",
        "name": "Grilled Axis Deer",
        "calories": 580,
        "proteinG": 68,
        "carbsG": 8,
        "fatG": 26,
        "servingSize": "6 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "bo4",
        "name": "Pan-Seared Quail",
        "calories": 420,
        "proteinG": 46,
        "carbsG": 14,
        "fatG": 18,
        "servingSize": "2 quail",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "bo5",
        "name": "Texas Redfish",
        "calories": 520,
        "proteinG": 54,
        "carbsG": 18,
        "fatG": 24,
        "servingSize": "8 oz",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "bo6",
        "name": "Bison Strip Loin",
        "calories": 680,
        "proteinG": 76,
        "carbsG": 6,
        "fatG": 34,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "bo7",
        "name": "Truffle Mac & Cheese",
        "calories": 480,
        "proteinG": 18,
        "carbsG": 52,
        "fatG": 22,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bo8",
        "name": "Venison Carpaccio",
        "calories": 280,
        "proteinG": 32,
        "carbsG": 8,
        "fatG": 12,
        "servingSize": "1 app",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      }
    ]
  },
  {
    "id": "lilisbistro",
    "name": "Lili's Bistro",
    "category": "American",
    "emoji": "🌺",
    "items": [
      {
        "id": "lb1",
        "name": "Grilled Salmon",
        "calories": 520,
        "proteinG": 52,
        "carbsG": 14,
        "fatG": 28,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "lb2",
        "name": "Bistro Burger",
        "calories": 780,
        "proteinG": 46,
        "carbsG": 54,
        "fatG": 38,
        "servingSize": "1 burger"
      },
      {
        "id": "lb3",
        "name": "Chicken Marsala",
        "calories": 620,
        "proteinG": 54,
        "carbsG": 32,
        "fatG": 24,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "lb4",
        "name": "Shrimp & Grits",
        "calories": 680,
        "proteinG": 42,
        "carbsG": 58,
        "fatG": 24,
        "servingSize": "1 plate"
      },
      {
        "id": "lb5",
        "name": "Spinach Salad",
        "calories": 280,
        "proteinG": 18,
        "carbsG": 22,
        "fatG": 14,
        "servingSize": "1 salad",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "lb6",
        "name": "Filet Mignon 6oz",
        "calories": 580,
        "proteinG": 58,
        "carbsG": 4,
        "fatG": 34,
        "servingSize": "6 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "lb7",
        "name": "Pasta Primavera",
        "calories": 520,
        "proteinG": 18,
        "carbsG": 72,
        "fatG": 16,
        "servingSize": "1 plate",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "lb8",
        "name": "Crème Brûlée",
        "calories": 380,
        "proteinG": 6,
        "carbsG": 44,
        "fatG": 20,
        "servingSize": "1 ramekin",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "cattlemens",
    "name": "Cattlemen's Steakhouse",
    "category": "Steakhouse",
    "emoji": "🐄",
    "items": [
      {
        "id": "cs1",
        "name": "T-Bone 16oz",
        "calories": 1080,
        "proteinG": 88,
        "carbsG": 4,
        "fatG": 74,
        "servingSize": "16 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "cs2",
        "name": "NY Strip 12oz",
        "calories": 820,
        "proteinG": 76,
        "carbsG": 4,
        "fatG": 54,
        "servingSize": "12 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "cs3",
        "name": "Rib-Eye 10oz",
        "calories": 760,
        "proteinG": 64,
        "carbsG": 4,
        "fatG": 54,
        "servingSize": "10 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "cs4",
        "name": "Sirloin 8oz",
        "calories": 560,
        "proteinG": 58,
        "carbsG": 4,
        "fatG": 32,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "cs5",
        "name": "Chicken Fried Steak",
        "calories": 880,
        "proteinG": 44,
        "carbsG": 74,
        "fatG": 42,
        "servingSize": "1 plate"
      },
      {
        "id": "cs6",
        "name": "Baked Potato",
        "calories": 280,
        "proteinG": 7,
        "carbsG": 62,
        "fatG": 4,
        "servingSize": "1 potato",
        "tags": ["vegetarian", "gluten-free"]
      },
      {
        "id": "cs7",
        "name": "Onion Rings",
        "calories": 360,
        "proteinG": 6,
        "carbsG": 44,
        "fatG": 18,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cs8",
        "name": "Strawberry Shortcake",
        "calories": 420,
        "proteinG": 5,
        "carbsG": 68,
        "fatG": 15,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "delfriscos",
    "name": "Del Frisco's Double Eagle",
    "category": "Steakhouse",
    "emoji": "🥂",
    "items": [
      {
        "id": "df1",
        "name": "Double Eagle Porterhouse 32oz",
        "calories": 1840,
        "proteinG": 158,
        "carbsG": 6,
        "fatG": 128,
        "servingSize": "32 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "df2",
        "name": "Prime NY Strip 16oz",
        "calories": 1120,
        "proteinG": 104,
        "carbsG": 4,
        "fatG": 76,
        "servingSize": "16 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "df3",
        "name": "Chilean Sea Bass",
        "calories": 680,
        "proteinG": 58,
        "carbsG": 12,
        "fatG": 42,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "df4",
        "name": "Lobster Mac & Cheese",
        "calories": 820,
        "proteinG": 48,
        "carbsG": 72,
        "fatG": 34,
        "servingSize": "1 order"
      },
      {
        "id": "df5",
        "name": "Warm Butter Cake",
        "calories": 680,
        "proteinG": 8,
        "carbsG": 82,
        "fatG": 36,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "df6",
        "name": "Shrimp Cocktail",
        "calories": 180,
        "proteinG": 28,
        "carbsG": 12,
        "fatG": 2,
        "servingSize": "6 shrimp",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "df7",
        "name": "Caesar Salad",
        "calories": 320,
        "proteinG": 12,
        "carbsG": 22,
        "fatG": 22,
        "servingSize": "1 salad"
      },
      {
        "id": "df8",
        "name": "Filet Mignon 8oz",
        "calories": 680,
        "proteinG": 64,
        "carbsG": 4,
        "fatG": 44,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      }
    ]
  },
  {
    "id": "tokyo_cafe",
    "name": "Tokyo Cafe",
    "category": "Japanese",
    "emoji": "🍣",
    "items": [
      {
        "id": "tc1",
        "name": "Dragon Roll",
        "calories": 420,
        "proteinG": 22,
        "carbsG": 52,
        "fatG": 14,
        "servingSize": "8 pieces"
      },
      {
        "id": "tc2",
        "name": "Salmon Sashimi",
        "calories": 280,
        "proteinG": 38,
        "carbsG": 0,
        "fatG": 12,
        "servingSize": "6 pieces",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "tc3",
        "name": "Chicken Teriyaki",
        "calories": 480,
        "proteinG": 52,
        "carbsG": 32,
        "fatG": 12,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "tc4",
        "name": "Edamame",
        "calories": 120,
        "proteinG": 10,
        "carbsG": 10,
        "fatG": 4,
        "servingSize": "1 cup",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "tc5",
        "name": "Spicy Tuna Roll",
        "calories": 380,
        "proteinG": 20,
        "carbsG": 48,
        "fatG": 12,
        "servingSize": "8 pieces"
      },
      {
        "id": "tc6",
        "name": "Miso Soup",
        "calories": 60,
        "proteinG": 4,
        "carbsG": 8,
        "fatG": 2,
        "servingSize": "1 bowl",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "tc7",
        "name": "Beef Yakitori Skewers",
        "calories": 320,
        "proteinG": 28,
        "carbsG": 16,
        "fatG": 14,
        "servingSize": "4 skewers",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "tc8",
        "name": "Green Tea Ice Cream",
        "calories": 240,
        "proteinG": 4,
        "carbsG": 36,
        "fatG": 10,
        "servingSize": "1 scoop",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "maharaja",
    "name": "Maharaja Indian Cuisine",
    "category": "Indian",
    "emoji": "🍛",
    "items": [
      {
        "id": "mh1",
        "name": "Chicken Tikka Masala",
        "calories": 520,
        "proteinG": 42,
        "carbsG": 28,
        "fatG": 24,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "mh2",
        "name": "Lamb Biryani",
        "calories": 680,
        "proteinG": 38,
        "carbsG": 72,
        "fatG": 24,
        "servingSize": "1 plate"
      },
      {
        "id": "mh3",
        "name": "Paneer Makhani",
        "calories": 480,
        "proteinG": 22,
        "carbsG": 32,
        "fatG": 28,
        "servingSize": "1 plate",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "mh4",
        "name": "Saag Chicken",
        "calories": 440,
        "proteinG": 44,
        "carbsG": 18,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "mh5",
        "name": "Naan Bread",
        "calories": 180,
        "proteinG": 6,
        "carbsG": 34,
        "fatG": 4,
        "servingSize": "1 piece",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "mh6",
        "name": "Dal Tadka",
        "calories": 280,
        "proteinG": 14,
        "carbsG": 40,
        "fatG": 6,
        "servingSize": "1 bowl",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "mh7",
        "name": "Samosa (2 pieces)",
        "calories": 260,
        "proteinG": 6,
        "carbsG": 34,
        "fatG": 12,
        "servingSize": "2 samosas",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "mh8",
        "name": "Mango Lassi",
        "calories": 220,
        "proteinG": 6,
        "carbsG": 40,
        "fatG": 4,
        "servingSize": "12 oz",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "piranha",
    "name": "Piranha Killer Sushi",
    "category": "Sushi",
    "emoji": "🐟",
    "items": [
      {
        "id": "pk1",
        "name": "Piranha Roll",
        "calories": 460,
        "proteinG": 24,
        "carbsG": 54,
        "fatG": 16,
        "servingSize": "8 pieces"
      },
      {
        "id": "pk2",
        "name": "Tuna Tataki",
        "calories": 240,
        "proteinG": 32,
        "carbsG": 8,
        "fatG": 8,
        "servingSize": "6 slices",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "pk3",
        "name": "Salmon Avocado Roll",
        "calories": 380,
        "proteinG": 18,
        "carbsG": 46,
        "fatG": 14,
        "servingSize": "8 pieces"
      },
      {
        "id": "pk4",
        "name": "Lobster Roll",
        "calories": 520,
        "proteinG": 28,
        "carbsG": 56,
        "fatG": 18,
        "servingSize": "8 pieces"
      },
      {
        "id": "pk5",
        "name": "Edamame Gyoza",
        "calories": 200,
        "proteinG": 8,
        "carbsG": 28,
        "fatG": 6,
        "servingSize": "6 pieces",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pk6",
        "name": "Rainbow Roll",
        "calories": 440,
        "proteinG": 26,
        "carbsG": 50,
        "fatG": 14,
        "servingSize": "8 pieces"
      },
      {
        "id": "pk7",
        "name": "Yellowtail Jalapeño",
        "calories": 260,
        "proteinG": 28,
        "carbsG": 10,
        "fatG": 10,
        "servingSize": "6 pieces",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "pk8",
        "name": "Mochi Ice Cream",
        "calories": 280,
        "proteinG": 4,
        "carbsG": 46,
        "fatG": 8,
        "servingSize": "3 pieces",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "raisingcanes_2",
    "name": "Raising Cane's",
    "category": "Chicken",
    "emoji": "🐔",
    "items": [
      {
        "id": "rc1",
        "name": "Box Combo (4 tenders)",
        "calories": 780,
        "proteinG": 44,
        "carbsG": 68,
        "fatG": 32,
        "servingSize": "1 box"
      },
      {
        "id": "rc2",
        "name": "3-Finger Combo",
        "calories": 640,
        "proteinG": 36,
        "carbsG": 58,
        "fatG": 26,
        "servingSize": "1 combo"
      },
      {
        "id": "rc3",
        "name": "Caniac Combo (6 tenders)",
        "calories": 1080,
        "proteinG": 62,
        "carbsG": 88,
        "fatG": 44,
        "servingSize": "1 combo"
      },
      {
        "id": "rc4",
        "name": "Chicken Tender",
        "calories": 130,
        "proteinG": 11,
        "carbsG": 10,
        "fatG": 5,
        "servingSize": "1 tender",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rc5",
        "name": "Cane's Sauce",
        "calories": 100,
        "proteinG": 0,
        "carbsG": 4,
        "fatG": 10,
        "servingSize": "1 oz"
      },
      {
        "id": "rc6",
        "name": "Crinkle Fries",
        "calories": 320,
        "proteinG": 5,
        "carbsG": 46,
        "fatG": 14,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "rc7",
        "name": "Coleslaw",
        "calories": 120,
        "proteinG": 1,
        "carbsG": 14,
        "fatG": 7,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "rc8",
        "name": "Texas Toast",
        "calories": 120,
        "proteinG": 3,
        "carbsG": 16,
        "fatG": 5,
        "servingSize": "1 piece",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "popeyes_2",
    "name": "Popeyes",
    "category": "Chicken",
    "emoji": "🍗",
    "items": [
      {
        "id": "pp1",
        "name": "Spicy Chicken Sandwich",
        "calories": 700,
        "proteinG": 42,
        "carbsG": 52,
        "fatG": 32,
        "servingSize": "1 sandwich"
      },
      {
        "id": "pp2",
        "name": "Classic Chicken Sandwich",
        "calories": 660,
        "proteinG": 40,
        "carbsG": 52,
        "fatG": 28,
        "servingSize": "1 sandwich"
      },
      {
        "id": "pp3",
        "name": "3-Piece Tenders",
        "calories": 480,
        "proteinG": 42,
        "carbsG": 28,
        "fatG": 20,
        "servingSize": "3 tenders",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pp4",
        "name": "Spicy Chicken 2-Piece",
        "calories": 620,
        "proteinG": 48,
        "carbsG": 28,
        "fatG": 34,
        "servingSize": "2 pieces",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pp5",
        "name": "Red Beans & Rice",
        "calories": 280,
        "proteinG": 8,
        "carbsG": 40,
        "fatG": 10,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pp6",
        "name": "Cajun Fries",
        "calories": 300,
        "proteinG": 5,
        "carbsG": 42,
        "fatG": 14,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pp7",
        "name": "Biscuit",
        "calories": 260,
        "proteinG": 5,
        "carbsG": 32,
        "fatG": 12,
        "servingSize": "1 biscuit",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pp8",
        "name": "Mashed Potatoes & Gravy",
        "calories": 220,
        "proteinG": 4,
        "carbsG": 32,
        "fatG": 9,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "buffalowildwings",
    "name": "Buffalo Wild Wings",
    "category": "Wings",
    "emoji": "🏈",
    "items": [
      {
        "id": "bw1",
        "name": "Traditional Wings 6pc",
        "calories": 430,
        "proteinG": 38,
        "carbsG": 0,
        "fatG": 28,
        "servingSize": "6 wings",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "bw2",
        "name": "Boneless Wings 6pc",
        "calories": 480,
        "proteinG": 32,
        "carbsG": 32,
        "fatG": 20,
        "servingSize": "6 pieces"
      },
      {
        "id": "bw3",
        "name": "Chicken Sandwich",
        "calories": 700,
        "proteinG": 44,
        "carbsG": 58,
        "fatG": 28,
        "servingSize": "1 sandwich"
      },
      {
        "id": "bw4",
        "name": "Loaded Nachos",
        "calories": 960,
        "proteinG": 44,
        "carbsG": 84,
        "fatG": 46,
        "servingSize": "1 order"
      },
      {
        "id": "bw5",
        "name": "Street Tacos 3pc",
        "calories": 540,
        "proteinG": 30,
        "carbsG": 48,
        "fatG": 20,
        "servingSize": "3 tacos"
      },
      {
        "id": "bw6",
        "name": "Cauliflower Wings",
        "calories": 380,
        "proteinG": 6,
        "carbsG": 48,
        "fatG": 18,
        "servingSize": "6 pieces",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bw7",
        "name": "Beer-Battered Onion Rings",
        "calories": 360,
        "proteinG": 6,
        "carbsG": 44,
        "fatG": 18,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bw8",
        "name": "Southwest Chicken Salad",
        "calories": 580,
        "proteinG": 46,
        "carbsG": 36,
        "fatG": 24,
        "servingSize": "1 salad",
        "tags": [
          "high-protein"
        ]
      }
    ]
  },
  {
    "id": "ihop",
    "name": "IHOP",
    "category": "Breakfast",
    "emoji": "🥞",
    "items": [
      {
        "id": "ih1",
        "name": "Original Buttermilk Pancakes",
        "calories": 580,
        "proteinG": 14,
        "carbsG": 86,
        "fatG": 18,
        "servingSize": "3 pancakes",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ih2",
        "name": "Chicken & Waffles",
        "calories": 820,
        "proteinG": 46,
        "carbsG": 74,
        "fatG": 32,
        "servingSize": "1 plate"
      },
      {
        "id": "ih3",
        "name": "Omelette Combo",
        "calories": 680,
        "proteinG": 38,
        "carbsG": 44,
        "fatG": 36,
        "servingSize": "1 plate"
      },
      {
        "id": "ih4",
        "name": "New York Cheesecake Pancakes",
        "calories": 860,
        "proteinG": 16,
        "carbsG": 112,
        "fatG": 36,
        "servingSize": "3 pancakes",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ih5",
        "name": "Simple & Fit Veggie Omelette",
        "calories": 340,
        "proteinG": 24,
        "carbsG": 18,
        "fatG": 16,
        "servingSize": "1 omelette",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "ih6",
        "name": "French Toast Combo",
        "calories": 640,
        "proteinG": 20,
        "carbsG": 82,
        "fatG": 24,
        "servingSize": "2 slices",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ih7",
        "name": "Breakfast Sampler",
        "calories": 920,
        "proteinG": 44,
        "carbsG": 72,
        "fatG": 46,
        "servingSize": "1 plate"
      },
      {
        "id": "ih8",
        "name": "Harvest Grain Pancakes",
        "calories": 480,
        "proteinG": 16,
        "carbsG": 74,
        "fatG": 14,
        "servingSize": "3 pancakes",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "wafflehouse",
    "name": "Waffle House",
    "category": "Breakfast",
    "emoji": "🧇",
    "items": [
      {
        "id": "wh1",
        "name": "Original Waffle",
        "calories": 340,
        "proteinG": 8,
        "carbsG": 50,
        "fatG": 12,
        "servingSize": "1 waffle",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "wh2",
        "name": "Scattered Smothered Covered",
        "calories": 520,
        "proteinG": 14,
        "carbsG": 64,
        "fatG": 22,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "wh3",
        "name": "Double Bacon Egg Cheese",
        "calories": 580,
        "proteinG": 36,
        "carbsG": 42,
        "fatG": 28,
        "servingSize": "1 sandwich"
      },
      {
        "id": "wh4",
        "name": "T-Bone Steak & Eggs",
        "calories": 820,
        "proteinG": 62,
        "carbsG": 12,
        "fatG": 54,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "wh5",
        "name": "Grits",
        "calories": 120,
        "proteinG": 3,
        "carbsG": 24,
        "fatG": 2,
        "servingSize": "1 cup",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "wh6",
        "name": "Hashbrowns Plain",
        "calories": 260,
        "proteinG": 3,
        "carbsG": 34,
        "fatG": 13,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "wh7",
        "name": "Pecan Waffle",
        "calories": 380,
        "proteinG": 10,
        "carbsG": 52,
        "fatG": 16,
        "servingSize": "1 waffle",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "wh8",
        "name": "Cheese Eggs",
        "calories": 260,
        "proteinG": 18,
        "carbsG": 2,
        "fatG": 20,
        "servingSize": "2 eggs",
        "tags": ["vegetarian", "gluten-free"]
      }
    ]
  },
  {
    "id": "crackerbarl",
    "name": "Cracker Barrel",
    "category": "Southern",
    "emoji": "🪣",
    "items": [
      {
        "id": "cb1",
        "name": "Chicken n' Dumplins",
        "calories": 480,
        "proteinG": 24,
        "carbsG": 56,
        "fatG": 16,
        "servingSize": "1 plate"
      },
      {
        "id": "cb2",
        "name": "Country Fried Chicken",
        "calories": 720,
        "proteinG": 38,
        "carbsG": 64,
        "fatG": 32,
        "servingSize": "1 plate"
      },
      {
        "id": "cb3",
        "name": "Grilled Chicken Tenders",
        "calories": 380,
        "proteinG": 52,
        "carbsG": 12,
        "fatG": 12,
        "servingSize": "4 tenders",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "cb4",
        "name": "Meatloaf Plate",
        "calories": 680,
        "proteinG": 34,
        "carbsG": 52,
        "fatG": 32,
        "servingSize": "1 plate"
      },
      {
        "id": "cb5",
        "name": "Sunrise Sampler",
        "calories": 820,
        "proteinG": 38,
        "carbsG": 68,
        "fatG": 42,
        "servingSize": "1 plate"
      },
      {
        "id": "cb6",
        "name": "Turnip Greens",
        "calories": 80,
        "proteinG": 4,
        "carbsG": 12,
        "fatG": 2,
        "servingSize": "1 side",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "cb7",
        "name": "Biscuits (2)",
        "calories": 280,
        "proteinG": 6,
        "carbsG": 38,
        "fatG": 10,
        "servingSize": "2 biscuits",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cb8",
        "name": "Double Chocolate Fudge Coca-Cola Cake",
        "calories": 560,
        "proteinG": 6,
        "carbsG": 80,
        "fatG": 24,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "outback_2",
    "name": "Outback Steakhouse",
    "category": "Steakhouse",
    "emoji": "🦘",
    "items": [
      {
        "id": "ob1",
        "name": "Victoria's Filet 9oz",
        "calories": 680,
        "proteinG": 66,
        "carbsG": 6,
        "fatG": 42,
        "servingSize": "9 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ob2",
        "name": "Outback Special Sirloin 10oz",
        "calories": 560,
        "proteinG": 58,
        "carbsG": 4,
        "fatG": 32,
        "servingSize": "10 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ob3",
        "name": "Bloomin' Onion",
        "calories": 800,
        "proteinG": 14,
        "carbsG": 76,
        "fatG": 52,
        "servingSize": "1 onion",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ob4",
        "name": "Alice Springs Chicken",
        "calories": 680,
        "proteinG": 62,
        "carbsG": 22,
        "fatG": 36,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ob5",
        "name": "Grilled Salmon",
        "calories": 580,
        "proteinG": 54,
        "carbsG": 14,
        "fatG": 32,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ob6",
        "name": "Steakhouse Mac & Cheese",
        "calories": 420,
        "proteinG": 16,
        "carbsG": 52,
        "fatG": 18,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ob7",
        "name": "Loaded Baked Potato",
        "calories": 380,
        "proteinG": 10,
        "carbsG": 62,
        "fatG": 12,
        "servingSize": "1 potato",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ob8",
        "name": "Chocolate Thunder Down Under",
        "calories": 680,
        "proteinG": 8,
        "carbsG": 82,
        "fatG": 36,
        "servingSize": "1 dessert",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "olivegarden_2",
    "name": "Olive Garden",
    "category": "Italian",
    "emoji": "🍝",
    "items": [
      {
        "id": "og1",
        "name": "Chicken Alfredo",
        "calories": 1050,
        "proteinG": 62,
        "carbsG": 84,
        "fatG": 50,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "og2",
        "name": "Spaghetti & Meatballs",
        "calories": 920,
        "proteinG": 44,
        "carbsG": 108,
        "fatG": 28,
        "servingSize": "1 plate"
      },
      {
        "id": "og3",
        "name": "Tour of Italy",
        "calories": 1520,
        "proteinG": 66,
        "carbsG": 134,
        "fatG": 74,
        "servingSize": "1 plate"
      },
      {
        "id": "og4",
        "name": "Grilled Chicken Margherita",
        "calories": 560,
        "proteinG": 60,
        "carbsG": 28,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "og5",
        "name": "Soup Salad Breadsticks",
        "calories": 520,
        "proteinG": 18,
        "carbsG": 68,
        "fatG": 20,
        "servingSize": "1 combo",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "og6",
        "name": "Breadstick",
        "calories": 140,
        "proteinG": 5,
        "carbsG": 26,
        "fatG": 2,
        "servingSize": "1 breadstick",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "og7",
        "name": "Shrimp Scampi",
        "calories": 640,
        "proteinG": 42,
        "carbsG": 58,
        "fatG": 24,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "og8",
        "name": "Tiramisu",
        "calories": 440,
        "proteinG": 8,
        "carbsG": 54,
        "fatG": 22,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "pandaexpress_2",
    "name": "Panda Express",
    "category": "Chinese",
    "emoji": "🐼",
    "items": [
      {
        "id": "pe1",
        "name": "Orange Chicken",
        "calories": 490,
        "proteinG": 26,
        "carbsG": 52,
        "fatG": 20,
        "servingSize": "1 serving"
      },
      {
        "id": "pe2",
        "name": "Broccoli Beef",
        "calories": 150,
        "proteinG": 10,
        "carbsG": 12,
        "fatG": 7,
        "servingSize": "1 serving",
        "tags": ["low-cal", "gluten-free"]
      },
      {
        "id": "pe3",
        "name": "Kung Pao Chicken",
        "calories": 290,
        "proteinG": 22,
        "carbsG": 18,
        "fatG": 14,
        "servingSize": "1 serving",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "pe4",
        "name": "Honey Walnut Shrimp",
        "calories": 360,
        "proteinG": 14,
        "carbsG": 36,
        "fatG": 18,
        "servingSize": "1 serving"
      },
      {
        "id": "pe5",
        "name": "Fried Rice",
        "calories": 470,
        "proteinG": 9,
        "carbsG": 74,
        "fatG": 16,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pe6",
        "name": "Chow Mein",
        "calories": 400,
        "proteinG": 8,
        "carbsG": 62,
        "fatG": 14,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pe7",
        "name": "Super Greens",
        "calories": 90,
        "proteinG": 6,
        "carbsG": 12,
        "fatG": 2,
        "servingSize": "1 serving",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "pe8",
        "name": "Teriyaki Chicken",
        "calories": 240,
        "proteinG": 34,
        "carbsG": 10,
        "fatG": 6,
        "servingSize": "1 serving",
        "tags": ["high-protein", "gluten-free"]
      }
    ]
  },
  {
    "id": "subway_2",
    "name": "Subway",
    "category": "Sandwiches",
    "emoji": "🥖",
    "items": [
      {
        "id": "sb1",
        "name": "Turkey Breast 6\"",
        "calories": 280,
        "proteinG": 22,
        "carbsG": 38,
        "fatG": 4,
        "servingSize": "6 inch",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "sb2",
        "name": "Chicken Teriyaki 6\"",
        "calories": 370,
        "proteinG": 28,
        "carbsG": 52,
        "fatG": 6,
        "servingSize": "6 inch",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "sb3",
        "name": "Spicy Italian 6\"",
        "calories": 480,
        "proteinG": 22,
        "carbsG": 38,
        "fatG": 24,
        "servingSize": "6 inch"
      },
      {
        "id": "sb4",
        "name": "Steak & Cheese 6\"",
        "calories": 380,
        "proteinG": 30,
        "carbsG": 40,
        "fatG": 10,
        "servingSize": "6 inch",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "sb5",
        "name": "Veggie Delite 6\"",
        "calories": 200,
        "proteinG": 8,
        "carbsG": 38,
        "fatG": 2,
        "servingSize": "6 inch",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "sb6",
        "name": "Tuna 6\"",
        "calories": 480,
        "proteinG": 24,
        "carbsG": 38,
        "fatG": 22,
        "servingSize": "6 inch"
      },
      {
        "id": "sb7",
        "name": "Chicken Caesar Wrap",
        "calories": 680,
        "proteinG": 42,
        "carbsG": 62,
        "fatG": 24,
        "servingSize": "1 wrap",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "sb8",
        "name": "Harvest Rotisserie Chicken 6\"",
        "calories": 360,
        "proteinG": 32,
        "carbsG": 42,
        "fatG": 6,
        "servingSize": "6 inch",
        "tags": ["high-protein", "low-cal"]
      }
    ]
  },
  {
    "id": "jerseysmikes",
    "name": "Jersey Mike's",
    "category": "Sandwiches",
    "emoji": "🥪",
    "items": [
      {
        "id": "jm1",
        "name": "Club Supreme Regular",
        "calories": 620,
        "proteinG": 36,
        "carbsG": 52,
        "fatG": 26,
        "servingSize": "regular"
      },
      {
        "id": "jm2",
        "name": "Chicken California Regular",
        "calories": 580,
        "proteinG": 42,
        "carbsG": 54,
        "fatG": 18,
        "servingSize": "regular",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "jm3",
        "name": "Turkey & Provolone Regular",
        "calories": 460,
        "proteinG": 32,
        "carbsG": 52,
        "fatG": 14,
        "servingSize": "regular",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "jm4",
        "name": "BLT Regular",
        "calories": 560,
        "proteinG": 22,
        "carbsG": 48,
        "fatG": 28,
        "servingSize": "regular"
      },
      {
        "id": "jm5",
        "name": "Roast Beef & Provolone",
        "calories": 580,
        "proteinG": 42,
        "carbsG": 50,
        "fatG": 18,
        "servingSize": "regular",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "jm6",
        "name": "Veggie Sub Regular",
        "calories": 420,
        "proteinG": 16,
        "carbsG": 58,
        "fatG": 14,
        "servingSize": "regular",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "jm7",
        "name": "Philly Steak Regular",
        "calories": 660,
        "proteinG": 48,
        "carbsG": 54,
        "fatG": 26,
        "servingSize": "regular",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "jm8",
        "name": "Tuna Regular",
        "calories": 620,
        "proteinG": 28,
        "carbsG": 52,
        "fatG": 28,
        "servingSize": "regular"
      }
    ]
  },
  {
    "id": "panera_2",
    "name": "Panera Bread",
    "category": "Bakery Cafe",
    "emoji": "🥨",
    "items": [
      {
        "id": "pa1",
        "name": "Fuji Apple Chicken Salad",
        "calories": 570,
        "proteinG": 32,
        "carbsG": 50,
        "fatG": 26,
        "servingSize": "1 full salad",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pa2",
        "name": "Broccoli Cheddar Soup",
        "calories": 360,
        "proteinG": 14,
        "carbsG": 30,
        "fatG": 22,
        "servingSize": "1 bowl",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pa3",
        "name": "Turkey Avocado BLT",
        "calories": 580,
        "proteinG": 36,
        "carbsG": 58,
        "fatG": 22,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pa4",
        "name": "Green Goddess Grain Bowl",
        "calories": 540,
        "proteinG": 22,
        "carbsG": 64,
        "fatG": 22,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "pa5",
        "name": "Toasted Steak & White Cheddar",
        "calories": 640,
        "proteinG": 40,
        "carbsG": 60,
        "fatG": 24,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pa6",
        "name": "Steel Cut Oatmeal",
        "calories": 330,
        "proteinG": 10,
        "carbsG": 56,
        "fatG": 8,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "pa7",
        "name": "Chipotle Chicken & Bacon Flatbread",
        "calories": 720,
        "proteinG": 44,
        "carbsG": 66,
        "fatG": 28,
        "servingSize": "1 flatbread",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pa8",
        "name": "Chocolate Chip Muffin",
        "calories": 520,
        "proteinG": 8,
        "carbsG": 68,
        "fatG": 24,
        "servingSize": "1 muffin",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "fiveguys_2",
    "name": "Five Guys",
    "category": "Burgers",
    "emoji": "🍟",
    "items": [
      {
        "id": "fg1",
        "name": "Regular Burger",
        "calories": 700,
        "proteinG": 38,
        "carbsG": 40,
        "fatG": 40,
        "servingSize": "1 burger"
      },
      {
        "id": "fg2",
        "name": "Bacon Cheeseburger",
        "calories": 920,
        "proteinG": 52,
        "carbsG": 40,
        "fatG": 58,
        "servingSize": "1 burger"
      },
      {
        "id": "fg3",
        "name": "Little Burger",
        "calories": 480,
        "proteinG": 26,
        "carbsG": 40,
        "fatG": 24,
        "servingSize": "1 burger"
      },
      {
        "id": "fg4",
        "name": "Veggie Sandwich",
        "calories": 440,
        "proteinG": 16,
        "carbsG": 52,
        "fatG": 18,
        "servingSize": "1 sandwich",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fg5",
        "name": "Hot Dog",
        "calories": 450,
        "proteinG": 18,
        "carbsG": 40,
        "fatG": 22,
        "servingSize": "1 hot dog"
      },
      {
        "id": "fg6",
        "name": "Regular Fries",
        "calories": 526,
        "proteinG": 8,
        "carbsG": 70,
        "fatG": 23,
        "servingSize": "1 regular",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fg7",
        "name": "Cajun Fries",
        "calories": 526,
        "proteinG": 8,
        "carbsG": 68,
        "fatG": 23,
        "servingSize": "1 regular",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fg8",
        "name": "Milkshake Vanilla",
        "calories": 840,
        "proteinG": 18,
        "carbsG": 112,
        "fatG": 36,
        "servingSize": "24 oz",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "smashburger",
    "name": "Smashburger",
    "category": "Burgers",
    "emoji": "💥",
    "items": [
      {
        "id": "sm1",
        "name": "Classic Smash",
        "calories": 620,
        "proteinG": 34,
        "carbsG": 44,
        "fatG": 32,
        "servingSize": "1 burger"
      },
      {
        "id": "sm2",
        "name": "BBQ Bacon & Cheddar",
        "calories": 780,
        "proteinG": 42,
        "carbsG": 58,
        "fatG": 38,
        "servingSize": "1 burger"
      },
      {
        "id": "sm3",
        "name": "Spicy Baja Crispy Chicken",
        "calories": 720,
        "proteinG": 40,
        "carbsG": 62,
        "fatG": 30,
        "servingSize": "1 sandwich"
      },
      {
        "id": "sm4",
        "name": "Triple Double Smash",
        "calories": 1020,
        "proteinG": 62,
        "carbsG": 44,
        "fatG": 66,
        "servingSize": "1 burger"
      },
      {
        "id": "sm5",
        "name": "Veggie Frites Smash",
        "calories": 480,
        "proteinG": 18,
        "carbsG": 56,
        "fatG": 20,
        "servingSize": "1 burger",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sm6",
        "name": "Smashfries",
        "calories": 310,
        "proteinG": 6,
        "carbsG": 48,
        "fatG": 12,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sm7",
        "name": "Haystack Onions",
        "calories": 220,
        "proteinG": 2,
        "carbsG": 28,
        "fatG": 11,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sm8",
        "name": "Oreo Cookie Shake",
        "calories": 760,
        "proteinG": 14,
        "carbsG": 98,
        "fatG": 34,
        "servingSize": "16 oz",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "culvers",
    "name": "Culver's",
    "category": "Burgers",
    "emoji": "🧈",
    "items": [
      {
        "id": "cu1",
        "name": "ButterBurger Double",
        "calories": 620,
        "proteinG": 38,
        "carbsG": 38,
        "fatG": 30,
        "servingSize": "1 burger"
      },
      {
        "id": "cu2",
        "name": "Deluxe ButterBurger",
        "calories": 480,
        "proteinG": 28,
        "carbsG": 38,
        "fatG": 20,
        "servingSize": "1 burger"
      },
      {
        "id": "cu3",
        "name": "Chicken Tenders 3pc",
        "calories": 560,
        "proteinG": 42,
        "carbsG": 42,
        "fatG": 22,
        "servingSize": "3 tenders",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "cu4",
        "name": "Fish Sandwich",
        "calories": 580,
        "proteinG": 28,
        "carbsG": 54,
        "fatG": 26,
        "servingSize": "1 sandwich"
      },
      {
        "id": "cu5",
        "name": "Cheese Curds",
        "calories": 420,
        "proteinG": 18,
        "carbsG": 36,
        "fatG": 24,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cu6",
        "name": "Crinkle Cut Fries",
        "calories": 340,
        "proteinG": 5,
        "carbsG": 50,
        "fatG": 14,
        "servingSize": "1 medium",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cu7",
        "name": "Concrete Mixer Chocolate",
        "calories": 760,
        "proteinG": 14,
        "carbsG": 98,
        "fatG": 36,
        "servingSize": "1 regular",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cu8",
        "name": "Pot Roast Sandwich",
        "calories": 680,
        "proteinG": 42,
        "carbsG": 58,
        "fatG": 26,
        "servingSize": "1 sandwich"
      }
    ]
  },
  {
    "id": "sonic_2",
    "name": "Sonic Drive-In",
    "category": "Fast Food",
    "emoji": "🛼",
    "items": [
      {
        "id": "sn1",
        "name": "SuperSONIC Bacon Double Cheeseburger",
        "calories": 980,
        "proteinG": 52,
        "carbsG": 52,
        "fatG": 62,
        "servingSize": "1 burger"
      },
      {
        "id": "sn2",
        "name": "Chicken Slinger",
        "calories": 630,
        "proteinG": 38,
        "carbsG": 56,
        "fatG": 26,
        "servingSize": "1 sandwich"
      },
      {
        "id": "sn3",
        "name": "Corn Dog",
        "calories": 260,
        "proteinG": 8,
        "carbsG": 30,
        "fatG": 12,
        "servingSize": "1 corn dog"
      },
      {
        "id": "sn4",
        "name": "Breakfast Burrito",
        "calories": 560,
        "proteinG": 28,
        "carbsG": 54,
        "fatG": 24,
        "servingSize": "1 burrito"
      },
      {
        "id": "sn5",
        "name": "Tater Tots Medium",
        "calories": 310,
        "proteinG": 3,
        "carbsG": 40,
        "fatG": 16,
        "servingSize": "1 medium",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sn6",
        "name": "Cherry Limeade Medium",
        "calories": 220,
        "proteinG": 0,
        "carbsG": 58,
        "fatG": 0,
        "servingSize": "20 oz",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "sn7",
        "name": "Chicken Strip Dinner",
        "calories": 760,
        "proteinG": 44,
        "carbsG": 72,
        "fatG": 30,
        "servingSize": "3 strips"
      },
      {
        "id": "sn8",
        "name": "Blast Oreo Small",
        "calories": 480,
        "proteinG": 10,
        "carbsG": 70,
        "fatG": 20,
        "servingSize": "12 oz",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "deltaco",
    "name": "Del Taco",
    "category": "Mexican",
    "emoji": "🌯",
    "items": [
      {
        "id": "dt1",
        "name": "Epic Cali Burrito",
        "calories": 980,
        "proteinG": 52,
        "carbsG": 88,
        "fatG": 42,
        "servingSize": "1 burrito"
      },
      {
        "id": "dt2",
        "name": "Beyond Chicken Avocado Burrito",
        "calories": 680,
        "proteinG": 28,
        "carbsG": 76,
        "fatG": 28,
        "servingSize": "1 burrito",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "dt3",
        "name": "8-Layer Veggie Burrito",
        "calories": 580,
        "proteinG": 20,
        "carbsG": 76,
        "fatG": 20,
        "servingSize": "1 burrito",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "dt4",
        "name": "Crispy Chicken Tacos 3pc",
        "calories": 540,
        "proteinG": 30,
        "carbsG": 54,
        "fatG": 22,
        "servingSize": "3 tacos"
      },
      {
        "id": "dt5",
        "name": "Crunchy Taco",
        "calories": 160,
        "proteinG": 9,
        "carbsG": 14,
        "fatG": 8,
        "servingSize": "1 taco"
      },
      {
        "id": "dt6",
        "name": "Crinkle Cut Fries",
        "calories": 380,
        "proteinG": 6,
        "carbsG": 52,
        "fatG": 18,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "dt7",
        "name": "Bean & Cheese Cup",
        "calories": 280,
        "proteinG": 12,
        "carbsG": 42,
        "fatG": 7,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "dt8",
        "name": "Chicken Cheddar Quesadilla",
        "calories": 540,
        "proteinG": 38,
        "carbsG": 38,
        "fatG": 22,
        "servingSize": "1 quesadilla",
        "tags": [
          "high-protein"
        ]
      }
    ]
  },
  {
    "id": "qdoba",
    "name": "Qdoba Mexican Eats",
    "category": "Mexican",
    "emoji": "🫔",
    "items": [
      {
        "id": "qd1",
        "name": "Chicken Burrito",
        "calories": 745,
        "proteinG": 44,
        "carbsG": 86,
        "fatG": 20,
        "servingSize": "1 burrito",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "qd2",
        "name": "Steak Burrito Bowl",
        "calories": 580,
        "proteinG": 42,
        "carbsG": 58,
        "fatG": 18,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "qd3",
        "name": "Pulled Pork Tacos 3pc",
        "calories": 660,
        "proteinG": 38,
        "carbsG": 72,
        "fatG": 22,
        "servingSize": "3 tacos"
      },
      {
        "id": "qd4",
        "name": "3 Cheese Nachos",
        "calories": 890,
        "proteinG": 36,
        "carbsG": 86,
        "fatG": 44,
        "servingSize": "1 order"
      },
      {
        "id": "qd5",
        "name": "Veggie Bowl",
        "calories": 430,
        "proteinG": 14,
        "carbsG": 66,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "qd6",
        "name": "Chicken Quesadilla",
        "calories": 680,
        "proteinG": 46,
        "carbsG": 52,
        "fatG": 26,
        "servingSize": "1 quesadilla",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "qd7",
        "name": "Guacamole",
        "calories": 140,
        "proteinG": 2,
        "carbsG": 8,
        "fatG": 12,
        "servingSize": "1 side",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "qd8",
        "name": "Breakfast Burrito",
        "calories": 620,
        "proteinG": 34,
        "carbsG": 64,
        "fatG": 22,
        "servingSize": "1 burrito"
      }
    ]
  },
  {
    "id": "velvettaco",
    "name": "Velvet Taco",
    "category": "Tacos",
    "emoji": "🌮",
    "items": [
      {
        "id": "vt1",
        "name": "Chicken & Waffles Taco",
        "calories": 480,
        "proteinG": 28,
        "carbsG": 46,
        "fatG": 18,
        "servingSize": "1 taco"
      },
      {
        "id": "vt2",
        "name": "Spicy Tikka Chicken Taco",
        "calories": 420,
        "proteinG": 30,
        "carbsG": 38,
        "fatG": 14,
        "servingSize": "1 taco",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "vt3",
        "name": "Brisket Grilled Cheese Taco",
        "calories": 560,
        "proteinG": 32,
        "carbsG": 44,
        "fatG": 24,
        "servingSize": "1 taco"
      },
      {
        "id": "vt4",
        "name": "Shrimp & Grits Taco",
        "calories": 440,
        "proteinG": 24,
        "carbsG": 42,
        "fatG": 18,
        "servingSize": "1 taco"
      },
      {
        "id": "vt5",
        "name": "Impossible Taco",
        "calories": 380,
        "proteinG": 22,
        "carbsG": 38,
        "fatG": 16,
        "servingSize": "1 taco",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "vt6",
        "name": "Rotating Weekly Taco",
        "calories": 460,
        "proteinG": 26,
        "carbsG": 42,
        "fatG": 18,
        "servingSize": "1 taco"
      },
      {
        "id": "vt7",
        "name": "Elote Corn",
        "calories": 280,
        "proteinG": 6,
        "carbsG": 36,
        "fatG": 12,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "vt8",
        "name": "Churro Tots",
        "calories": 320,
        "proteinG": 4,
        "carbsG": 44,
        "fatG": 14,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "truefoods",
    "name": "True Food Kitchen",
    "category": "Healthy",
    "emoji": "🥗",
    "items": [
      {
        "id": "tf1",
        "name": "Grass-Fed Burger",
        "calories": 620,
        "proteinG": 40,
        "carbsG": 44,
        "fatG": 28,
        "servingSize": "1 burger"
      },
      {
        "id": "tf2",
        "name": "Ancient Grains Bowl",
        "calories": 480,
        "proteinG": 18,
        "carbsG": 68,
        "fatG": 16,
        "servingSize": "1 bowl",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "tf3",
        "name": "Charred Cauliflower",
        "calories": 320,
        "proteinG": 8,
        "carbsG": 36,
        "fatG": 16,
        "servingSize": "1 plate",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "tf4",
        "name": "Salmon Avocado Bowl",
        "calories": 540,
        "proteinG": 42,
        "carbsG": 42,
        "fatG": 22,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "tf5",
        "name": "Seasonal Rotation Salad",
        "calories": 380,
        "proteinG": 14,
        "carbsG": 44,
        "fatG": 18,
        "servingSize": "1 salad",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "tf6",
        "name": "Seasonal Squash Pizza",
        "calories": 620,
        "proteinG": 22,
        "carbsG": 74,
        "fatG": 24,
        "servingSize": "1 pizza",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "tf7",
        "name": "Immune Boost Green Tea",
        "calories": 80,
        "proteinG": 0,
        "carbsG": 20,
        "fatG": 0,
        "servingSize": "16 oz",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "tf8",
        "name": "Turkey Burger",
        "calories": 560,
        "proteinG": 44,
        "carbsG": 42,
        "fatG": 22,
        "servingSize": "1 burger",
        "tags": [
          "high-protein"
        ]
      }
    ]
  },
  {
    "id": "sweetgreen_2",
    "name": "Sweetgreen",
    "category": "Salads",
    "emoji": "🌿",
    "items": [
      {
        "id": "sg1",
        "name": "Harvest Bowl",
        "calories": 705,
        "proteinG": 32,
        "carbsG": 84,
        "fatG": 26,
        "servingSize": "1 bowl",
        "tags": [
          "gluten-free"
        ]
      },
      {
        "id": "sg2",
        "name": "Guacamole Greens",
        "calories": 590,
        "proteinG": 20,
        "carbsG": 52,
        "fatG": 36,
        "servingSize": "1 bowl",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "sg3",
        "name": "Chicken + Brussels Caesar",
        "calories": 580,
        "proteinG": 48,
        "carbsG": 38,
        "fatG": 24,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sg4",
        "name": "Shroomami",
        "calories": 530,
        "proteinG": 14,
        "carbsG": 66,
        "fatG": 22,
        "servingSize": "1 bowl",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "sg5",
        "name": "Kale Caesar",
        "calories": 480,
        "proteinG": 22,
        "carbsG": 44,
        "fatG": 24,
        "servingSize": "1 bowl",
        "tags": ["vegetarian", "gluten-free"]
      },
      {
        "id": "sg6",
        "name": "Chicken Pesto Parm",
        "calories": 640,
        "proteinG": 54,
        "carbsG": 48,
        "fatG": 22,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "sg7",
        "name": "Spicy Cashew Chicken Bowl",
        "calories": 580,
        "proteinG": 40,
        "carbsG": 54,
        "fatG": 20,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sg8",
        "name": "Steakhouse Chopped",
        "calories": 640,
        "proteinG": 44,
        "carbsG": 42,
        "fatG": 28,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "gluten-free"]
      }
    ]
  },
  {
    "id": "pokeworks",
    "name": "Pokéworks",
    "category": "Poke",
    "emoji": "🐠",
    "items": [
      {
        "id": "pw1",
        "name": "Spicy Tuna Poke Bowl",
        "calories": 620,
        "proteinG": 36,
        "carbsG": 72,
        "fatG": 18,
        "servingSize": "1 regular",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "pw2",
        "name": "Classic Salmon Bowl",
        "calories": 580,
        "proteinG": 40,
        "carbsG": 68,
        "fatG": 16,
        "servingSize": "1 regular",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "pw3",
        "name": "Shoyu Ahi Tuna Bowl",
        "calories": 560,
        "proteinG": 38,
        "carbsG": 66,
        "fatG": 14,
        "servingSize": "1 regular",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "pw4",
        "name": "Tofu Bowl",
        "calories": 480,
        "proteinG": 20,
        "carbsG": 66,
        "fatG": 14,
        "servingSize": "1 regular",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "pw5",
        "name": "Shrimp Burrito",
        "calories": 640,
        "proteinG": 34,
        "carbsG": 76,
        "fatG": 18,
        "servingSize": "1 burrito",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pw6",
        "name": "Pokeworks Signature Bowl",
        "calories": 660,
        "proteinG": 42,
        "carbsG": 74,
        "fatG": 18,
        "servingSize": "1 regular",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "pw7",
        "name": "Extra Protein Add-On",
        "calories": 120,
        "proteinG": 24,
        "carbsG": 0,
        "fatG": 2,
        "servingSize": "1 scoop",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "pw8",
        "name": "Edamame Side",
        "calories": 100,
        "proteinG": 8,
        "carbsG": 8,
        "fatG": 4,
        "servingSize": "1 side",
        "tags": ["vegan", "low-cal", "gluten-free"]
      }
    ]
  },
  {
    "id": "pfchangs",
    "name": "P.F. Chang's",
    "category": "Chinese",
    "emoji": "🥢",
    "items": [
      {
        "id": "pf1",
        "name": "Lettuce Wraps Chicken",
        "calories": 340,
        "proteinG": 28,
        "carbsG": 24,
        "fatG": 14,
        "servingSize": "1 order",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "pf2",
        "name": "Mongolian Beef",
        "calories": 720,
        "proteinG": 44,
        "carbsG": 62,
        "fatG": 28,
        "servingSize": "1 plate"
      },
      {
        "id": "pf3",
        "name": "Kung Pao Chicken",
        "calories": 560,
        "proteinG": 42,
        "carbsG": 44,
        "fatG": 18,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pf4",
        "name": "Pad Thai",
        "calories": 680,
        "proteinG": 28,
        "carbsG": 82,
        "fatG": 22,
        "servingSize": "1 plate"
      },
      {
        "id": "pf5",
        "name": "Fried Rice Chicken",
        "calories": 540,
        "proteinG": 30,
        "carbsG": 68,
        "fatG": 14,
        "servingSize": "1 plate"
      },
      {
        "id": "pf6",
        "name": "Crispy Honey Shrimp",
        "calories": 680,
        "proteinG": 28,
        "carbsG": 72,
        "fatG": 28,
        "servingSize": "1 plate"
      },
      {
        "id": "pf7",
        "name": "Vegetable Fried Rice",
        "calories": 420,
        "proteinG": 10,
        "carbsG": 68,
        "fatG": 14,
        "servingSize": "1 plate",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pf8",
        "name": "Great Wall of Chocolate",
        "calories": 1670,
        "proteinG": 14,
        "carbsG": 228,
        "fatG": 82,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "redlobster_2",
    "name": "Red Lobster",
    "category": "Seafood",
    "emoji": "🦞",
    "items": [
      {
        "id": "rl2_1",
        "name": "Garlic Shrimp Scampi",
        "calories": 440,
        "proteinG": 38,
        "carbsG": 28,
        "fatG": 18,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rl2_2",
        "name": "Admiral's Feast",
        "calories": 1180,
        "proteinG": 64,
        "carbsG": 84,
        "fatG": 58,
        "servingSize": "1 plate"
      },
      {
        "id": "rl2_3",
        "name": "Wood-Grilled Lobster Tail",
        "calories": 520,
        "proteinG": 56,
        "carbsG": 8,
        "fatG": 28,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "rl2_4",
        "name": "Cheddar Bay Biscuit",
        "calories": 150,
        "proteinG": 3,
        "carbsG": 16,
        "fatG": 8,
        "servingSize": "1 biscuit",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "rl2_5",
        "name": "Seafood-Stuffed Mushrooms",
        "calories": 280,
        "proteinG": 14,
        "carbsG": 18,
        "fatG": 16,
        "servingSize": "1 order"
      },
      {
        "id": "rl2_6",
        "name": "Walt's Favorite Shrimp",
        "calories": 680,
        "proteinG": 44,
        "carbsG": 52,
        "fatG": 28,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rl2_7",
        "name": "Clam Chowder Cup",
        "calories": 220,
        "proteinG": 8,
        "carbsG": 22,
        "fatG": 12,
        "servingSize": "1 cup"
      },
      {
        "id": "rl2_8",
        "name": "Chocolate Wave Cake",
        "calories": 560,
        "proteinG": 6,
        "carbsG": 78,
        "fatG": 26,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "jackinthebox_2",
    "name": "Jack in the Box",
    "category": "Fast Food",
    "emoji": "🎰",
    "items": [
      {
        "id": "jb1",
        "name": "Ultimate Cheeseburger",
        "calories": 810,
        "proteinG": 38,
        "carbsG": 56,
        "fatG": 48,
        "servingSize": "1 burger"
      },
      {
        "id": "jb2",
        "name": "Spicy Chicken Sandwich",
        "calories": 560,
        "proteinG": 26,
        "carbsG": 56,
        "fatG": 24,
        "servingSize": "1 sandwich"
      },
      {
        "id": "jb3",
        "name": "Monster Taco",
        "calories": 230,
        "proteinG": 10,
        "carbsG": 22,
        "fatG": 12,
        "servingSize": "1 taco"
      },
      {
        "id": "jb4",
        "name": "Breakfast Jack",
        "calories": 360,
        "proteinG": 18,
        "carbsG": 30,
        "fatG": 18,
        "servingSize": "1 sandwich"
      },
      {
        "id": "jb5",
        "name": "Loaded Tiny Tacos",
        "calories": 680,
        "proteinG": 24,
        "carbsG": 68,
        "fatG": 34,
        "servingSize": "15 tacos"
      },
      {
        "id": "jb6",
        "name": "Curly Fries Medium",
        "calories": 400,
        "proteinG": 6,
        "carbsG": 52,
        "fatG": 20,
        "servingSize": "1 medium",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "jb7",
        "name": "Chicken Nuggets 7pc",
        "calories": 360,
        "proteinG": 22,
        "carbsG": 30,
        "fatG": 16,
        "servingSize": "7 pieces"
      },
      {
        "id": "jb8",
        "name": "Jumbo Jack",
        "calories": 620,
        "proteinG": 26,
        "carbsG": 44,
        "fatG": 38,
        "servingSize": "1 burger"
      }
    ]
  },
  {
    "id": "applebees",
    "name": "Applebee's",
    "category": "American",
    "emoji": "🍎",
    "items": [
      {
        "id": "ab1",
        "name": "Classic Bacon Cheeseburger",
        "calories": 820,
        "proteinG": 48,
        "carbsG": 54,
        "fatG": 44,
        "servingSize": "1 burger"
      },
      {
        "id": "ab2",
        "name": "Grilled Chicken Sandwich",
        "calories": 560,
        "proteinG": 46,
        "carbsG": 50,
        "fatG": 16,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ab3",
        "name": "2 for $20 Steak",
        "calories": 680,
        "proteinG": 58,
        "carbsG": 32,
        "fatG": 38,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ab4",
        "name": "Boneless Wings 12pc",
        "calories": 1200,
        "proteinG": 72,
        "carbsG": 80,
        "fatG": 64,
        "servingSize": "12 pieces"
      },
      {
        "id": "ab5",
        "name": "Fiesta Lime Chicken",
        "calories": 520,
        "proteinG": 52,
        "carbsG": 32,
        "fatG": 20,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ab6",
        "name": "Oriental Chicken Salad",
        "calories": 1120,
        "proteinG": 42,
        "carbsG": 92,
        "fatG": 56,
        "servingSize": "1 salad"
      },
      {
        "id": "ab7",
        "name": "Triple Chocolate Meltdown",
        "calories": 800,
        "proteinG": 8,
        "carbsG": 98,
        "fatG": 42,
        "servingSize": "1 dessert",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ab8",
        "name": "Neighborhood Nachos",
        "calories": 960,
        "proteinG": 44,
        "carbsG": 88,
        "fatG": 46,
        "servingSize": "1 order"
      }
    ]
  },
  {
    "id": "zoes",
    "name": "Zoe's Kitchen",
    "category": "Mediterranean",
    "emoji": "🫒",
    "items": [
      {
        "id": "zk1",
        "name": "Grilled Chicken Kabobs",
        "calories": 320,
        "proteinG": 52,
        "carbsG": 6,
        "fatG": 8,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "zk2",
        "name": "Salmon Kabobs",
        "calories": 380,
        "proteinG": 46,
        "carbsG": 6,
        "fatG": 18,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "zk3",
        "name": "Braised Lamb Bowl",
        "calories": 680,
        "proteinG": 44,
        "carbsG": 58,
        "fatG": 26,
        "servingSize": "1 bowl"
      },
      {
        "id": "zk4",
        "name": "Chicken Salad Sandwich",
        "calories": 480,
        "proteinG": 36,
        "carbsG": 42,
        "fatG": 16,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "zk5",
        "name": "Hummus Trio",
        "calories": 380,
        "proteinG": 14,
        "carbsG": 46,
        "fatG": 16,
        "servingSize": "1 order",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "zk6",
        "name": "Greek Salad",
        "calories": 260,
        "proteinG": 6,
        "carbsG": 20,
        "fatG": 18,
        "servingSize": "1 salad",
        "tags": ["vegetarian", "low-cal", "gluten-free"]
      },
      {
        "id": "zk7",
        "name": "Cauliflower Rice",
        "calories": 100,
        "proteinG": 4,
        "carbsG": 18,
        "fatG": 2,
        "servingSize": "1 side",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "zk8",
        "name": "Pita",
        "calories": 140,
        "proteinG": 5,
        "carbsG": 26,
        "fatG": 2,
        "servingSize": "1 pita",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "longhornsteakhouse",
    "name": "LongHorn Steakhouse",
    "category": "Steakhouse",
    "emoji": "🐂",
    "items": [
      {
        "id": "lh1",
        "name": "Outlaw Ribeye 18oz",
        "calories": 1180,
        "proteinG": 96,
        "carbsG": 4,
        "fatG": 82,
        "servingSize": "18 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "lh2",
        "name": "Flo's Filet 7oz",
        "calories": 540,
        "proteinG": 52,
        "carbsG": 4,
        "fatG": 34,
        "servingSize": "7 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "lh3",
        "name": "Grilled White Cheddar Stuffed Mushrooms",
        "calories": 480,
        "proteinG": 18,
        "carbsG": 28,
        "fatG": 32,
        "servingSize": "1 app",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "lh4",
        "name": "Parmesan Crusted Chicken",
        "calories": 680,
        "proteinG": 60,
        "carbsG": 28,
        "fatG": 34,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "lh5",
        "name": "Prairie Pasta",
        "calories": 760,
        "proteinG": 34,
        "carbsG": 82,
        "fatG": 28,
        "servingSize": "1 plate"
      },
      {
        "id": "lh6",
        "name": "Wild West Shrimp",
        "calories": 560,
        "proteinG": 44,
        "carbsG": 34,
        "fatG": 24,
        "servingSize": "1 app",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "lh7",
        "name": "Seasoned Steakhouse Fries",
        "calories": 360,
        "proteinG": 6,
        "carbsG": 50,
        "fatG": 16,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "lh8",
        "name": "Chocolate Stampede",
        "calories": 1060,
        "proteinG": 10,
        "carbsG": 128,
        "fatG": 58,
        "servingSize": "1 dessert",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "cheddars_2",
    "name": "Cheddar's Scratch Kitchen",
    "category": "American",
    "emoji": "🧀",
    "items": [
      {
        "id": "ck1",
        "name": "Honey Butter Chicken Tenders",
        "calories": 740,
        "proteinG": 48,
        "carbsG": 58,
        "fatG": 32,
        "servingSize": "4 tenders",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ck2",
        "name": "Scratch Burger",
        "calories": 820,
        "proteinG": 46,
        "carbsG": 54,
        "fatG": 44,
        "servingSize": "1 burger"
      },
      {
        "id": "ck3",
        "name": "Homemade Chicken Pot Pie",
        "calories": 860,
        "proteinG": 36,
        "carbsG": 78,
        "fatG": 42,
        "servingSize": "1 pie"
      },
      {
        "id": "ck4",
        "name": "Grilled Salmon",
        "calories": 520,
        "proteinG": 52,
        "carbsG": 14,
        "fatG": 26,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ck5",
        "name": "Santa Fe Spinach Dip",
        "calories": 680,
        "proteinG": 18,
        "carbsG": 52,
        "fatG": 44,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ck6",
        "name": "Broccoli Cheese Casserole",
        "calories": 280,
        "proteinG": 10,
        "carbsG": 22,
        "fatG": 18,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ck7",
        "name": "Croissant Rolls (3)",
        "calories": 240,
        "proteinG": 6,
        "carbsG": 30,
        "fatG": 12,
        "servingSize": "3 rolls",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ck8",
        "name": "Triple Chocolate Cake",
        "calories": 560,
        "proteinG": 6,
        "carbsG": 76,
        "fatG": 26,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "genghisgrill",
    "name": "Genghis Grill",
    "category": "Mongolian BBQ",
    "emoji": "⚔️",
    "items": [
      {
        "id": "gg1",
        "name": "Build Your Own Bowl - Chicken",
        "calories": 480,
        "proteinG": 42,
        "carbsG": 48,
        "fatG": 12,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "gg2",
        "name": "Build Your Own Bowl - Beef",
        "calories": 560,
        "proteinG": 44,
        "carbsG": 50,
        "fatG": 20,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "gg3",
        "name": "Build Your Own Bowl - Tofu",
        "calories": 380,
        "proteinG": 18,
        "carbsG": 52,
        "fatG": 10,
        "servingSize": "1 bowl",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "gg4",
        "name": "Build Your Own Bowl - Shrimp",
        "calories": 420,
        "proteinG": 36,
        "carbsG": 46,
        "fatG": 10,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "gg5",
        "name": "The Khan Salad",
        "calories": 280,
        "proteinG": 8,
        "carbsG": 32,
        "fatG": 14,
        "servingSize": "1 salad",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "gg6",
        "name": "Pot Stickers",
        "calories": 240,
        "proteinG": 10,
        "carbsG": 30,
        "fatG": 8,
        "servingSize": "4 pieces"
      },
      {
        "id": "gg7",
        "name": "Egg Drop Soup",
        "calories": 80,
        "proteinG": 4,
        "carbsG": 8,
        "fatG": 2,
        "servingSize": "1 bowl",
        "tags": ["low-cal", "gluten-free"]
      },
      {
        "id": "gg8",
        "name": "Mongolian Flatbread",
        "calories": 140,
        "proteinG": 4,
        "carbsG": 24,
        "fatG": 4,
        "servingSize": "1 piece",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "benihana",
    "name": "Benihana",
    "category": "Japanese Steakhouse",
    "emoji": "🔥",
    "items": [
      {
        "id": "bh1",
        "name": "Hibachi Chicken",
        "calories": 560,
        "proteinG": 62,
        "carbsG": 28,
        "fatG": 18,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "bh2",
        "name": "Hibachi Steak",
        "calories": 680,
        "proteinG": 58,
        "carbsG": 22,
        "fatG": 36,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "bh3",
        "name": "Hibachi Shrimp",
        "calories": 420,
        "proteinG": 46,
        "carbsG": 22,
        "fatG": 12,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "bh4",
        "name": "Hibachi Salmon",
        "calories": 520,
        "proteinG": 54,
        "carbsG": 14,
        "fatG": 26,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "bh5",
        "name": "Hibachi Fried Rice",
        "calories": 420,
        "proteinG": 14,
        "carbsG": 68,
        "fatG": 14,
        "servingSize": "1 serving"
      },
      {
        "id": "bh6",
        "name": "Miso Soup",
        "calories": 60,
        "proteinG": 4,
        "carbsG": 6,
        "fatG": 2,
        "servingSize": "1 bowl",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "bh7",
        "name": "Garlic Butter Vegetables",
        "calories": 120,
        "proteinG": 4,
        "carbsG": 16,
        "fatG": 5,
        "servingSize": "1 side",
        "tags": ["vegetarian", "low-cal", "gluten-free"]
      },
      {
        "id": "bh8",
        "name": "Tempura Ice Cream",
        "calories": 420,
        "proteinG": 6,
        "carbsG": 56,
        "fatG": 20,
        "servingSize": "1 dessert",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "ontheborder",
    "name": "On The Border",
    "category": "Mexican",
    "emoji": "🌵",
    "items": [
      {
        "id": "ob2_1",
        "name": "Create Your Own Fajitas Chicken",
        "calories": 680,
        "proteinG": 56,
        "carbsG": 52,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ob2_2",
        "name": "Dos XX Fish Tacos",
        "calories": 720,
        "proteinG": 32,
        "carbsG": 72,
        "fatG": 30,
        "servingSize": "2 tacos"
      },
      {
        "id": "ob2_3",
        "name": "Big Taco Salad Chicken",
        "calories": 860,
        "proteinG": 44,
        "carbsG": 72,
        "fatG": 42,
        "servingSize": "1 salad"
      },
      {
        "id": "ob2_4",
        "name": "Loaded Queso",
        "calories": 620,
        "proteinG": 24,
        "carbsG": 52,
        "fatG": 36,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ob2_5",
        "name": "Classic Nachos",
        "calories": 1040,
        "proteinG": 40,
        "carbsG": 88,
        "fatG": 54,
        "servingSize": "1 order"
      },
      {
        "id": "ob2_6",
        "name": "Chicken Enchiladas",
        "calories": 780,
        "proteinG": 48,
        "carbsG": 62,
        "fatG": 32,
        "servingSize": "3 enchiladas",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ob2_7",
        "name": "Sopapillas",
        "calories": 440,
        "proteinG": 6,
        "carbsG": 66,
        "fatG": 16,
        "servingSize": "4 pieces",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ob2_8",
        "name": "Border Queso Dip",
        "calories": 380,
        "proteinG": 14,
        "carbsG": 28,
        "fatG": 26,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "tacobuenofw",
    "name": "Taco Bueno",
    "category": "Mexican",
    "emoji": "🐂",
    "items": [
      {
        "id": "tb1",
        "name": "Muchaco Beef",
        "calories": 390,
        "proteinG": 18,
        "carbsG": 44,
        "fatG": 15,
        "servingSize": "1 muchaco"
      },
      {
        "id": "tb2",
        "name": "Party Burrito Beef",
        "calories": 760,
        "proteinG": 34,
        "carbsG": 78,
        "fatG": 32,
        "servingSize": "1 burrito"
      },
      {
        "id": "tb3",
        "name": "Chicken Taco",
        "calories": 200,
        "proteinG": 14,
        "carbsG": 18,
        "fatG": 8,
        "servingSize": "1 taco",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "tb4",
        "name": "Beef Mexi-Dips & Chips",
        "calories": 960,
        "proteinG": 36,
        "carbsG": 88,
        "fatG": 48,
        "servingSize": "1 order"
      },
      {
        "id": "tb5",
        "name": "Chicken Quesadilla",
        "calories": 500,
        "proteinG": 32,
        "carbsG": 44,
        "fatG": 20,
        "servingSize": "1 quesadilla",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "tb6",
        "name": "Refried Beans",
        "calories": 200,
        "proteinG": 10,
        "carbsG": 32,
        "fatG": 4,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "tb7",
        "name": "Cheesecake Chimichanga",
        "calories": 380,
        "proteinG": 6,
        "carbsG": 52,
        "fatG": 18,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "tb8",
        "name": "Big Fritter",
        "calories": 250,
        "proteinG": 4,
        "carbsG": 30,
        "fatG": 13,
        "servingSize": "1 fritter",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "shipleydonuts",
    "name": "Shipley Do-Nuts",
    "category": "Donuts",
    "emoji": "🍩",
    "items": [
      {
        "id": "sd1",
        "name": "Glazed Donut",
        "calories": 210,
        "proteinG": 3,
        "carbsG": 32,
        "fatG": 8,
        "servingSize": "1 donut",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sd2",
        "name": "Chocolate Iced Donut",
        "calories": 240,
        "proteinG": 3,
        "carbsG": 36,
        "fatG": 9,
        "servingSize": "1 donut",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sd3",
        "name": "Kolache Sausage",
        "calories": 280,
        "proteinG": 12,
        "carbsG": 30,
        "fatG": 13,
        "servingSize": "1 kolache"
      },
      {
        "id": "sd4",
        "name": "Kolache Sausage & Cheese",
        "calories": 320,
        "proteinG": 14,
        "carbsG": 30,
        "fatG": 16,
        "servingSize": "1 kolache"
      },
      {
        "id": "sd5",
        "name": "Apple Fritter",
        "calories": 380,
        "proteinG": 5,
        "carbsG": 54,
        "fatG": 16,
        "servingSize": "1 fritter",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sd6",
        "name": "Cream-Filled Donut",
        "calories": 310,
        "proteinG": 4,
        "carbsG": 40,
        "fatG": 14,
        "servingSize": "1 donut",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sd7",
        "name": "Do-Hole (6 pack)",
        "calories": 190,
        "proteinG": 2,
        "carbsG": 30,
        "fatG": 7,
        "servingSize": "6 holes",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sd8",
        "name": "Blueberry Cake Donut",
        "calories": 260,
        "proteinG": 3,
        "carbsG": 38,
        "fatG": 10,
        "servingSize": "1 donut",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "smoothieking_2",
    "name": "Smoothie King",
    "category": "Smoothies",
    "emoji": "🥤",
    "items": [
      {
        "id": "sk1",
        "name": "The Hulk Strawberry 20oz",
        "calories": 964,
        "proteinG": 22,
        "carbsG": 164,
        "fatG": 24,
        "servingSize": "20 oz",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sk2",
        "name": "Angel Food 20oz",
        "calories": 312,
        "proteinG": 8,
        "carbsG": 72,
        "fatG": 2,
        "servingSize": "20 oz",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "sk3",
        "name": "Gladiator Chocolate 20oz",
        "calories": 280,
        "proteinG": 46,
        "carbsG": 14,
        "fatG": 4,
        "servingSize": "20 oz",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "sk4",
        "name": "Pure Recharge Strawberry 20oz",
        "calories": 212,
        "proteinG": 4,
        "carbsG": 50,
        "fatG": 0,
        "servingSize": "20 oz",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "sk5",
        "name": "Activator Chocolate 20oz",
        "calories": 460,
        "proteinG": 28,
        "carbsG": 62,
        "fatG": 10,
        "servingSize": "20 oz",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "sk6",
        "name": "Lean1 Chocolate 20oz",
        "calories": 340,
        "proteinG": 26,
        "carbsG": 40,
        "fatG": 7,
        "servingSize": "20 oz",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "sk7",
        "name": "Caribbean Way 20oz",
        "calories": 260,
        "proteinG": 4,
        "carbsG": 60,
        "fatG": 2,
        "servingSize": "20 oz",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "sk8",
        "name": "Original High Protein Lemon 20oz",
        "calories": 348,
        "proteinG": 24,
        "carbsG": 52,
        "fatG": 5,
        "servingSize": "20 oz",
        "tags": ["high-protein", "low-cal"]
      }
    ]
  },
  {
    "id": "jasonsdeli_2",
    "name": "Jason's Deli",
    "category": "Deli",
    "emoji": "🥙",
    "items": [
      {
        "id": "jd1",
        "name": "Club Royale",
        "calories": 660,
        "proteinG": 42,
        "carbsG": 54,
        "fatG": 28,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "jd2",
        "name": "New York Yankee",
        "calories": 580,
        "proteinG": 38,
        "carbsG": 52,
        "fatG": 20,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "jd3",
        "name": "Nutty Mixed Up Salad",
        "calories": 560,
        "proteinG": 16,
        "carbsG": 52,
        "fatG": 34,
        "servingSize": "1 salad",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "jd4",
        "name": "Grilled Chicken Salad",
        "calories": 440,
        "proteinG": 42,
        "carbsG": 26,
        "fatG": 18,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "jd5",
        "name": "Chicken Pot Pie Soup",
        "calories": 360,
        "proteinG": 16,
        "carbsG": 36,
        "fatG": 16,
        "servingSize": "1 bowl"
      },
      {
        "id": "jd6",
        "name": "Tomato Basil Soup",
        "calories": 240,
        "proteinG": 8,
        "carbsG": 28,
        "fatG": 12,
        "servingSize": "1 bowl",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "jd7",
        "name": "Organic Vegetable Soup",
        "calories": 140,
        "proteinG": 4,
        "carbsG": 24,
        "fatG": 3,
        "servingSize": "1 bowl",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "jd8",
        "name": "NY Cheesecake Slice",
        "calories": 460,
        "proteinG": 8,
        "carbsG": 52,
        "fatG": 26,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "mcalistersdeli",
    "name": "McAlister's Deli",
    "category": "Deli",
    "emoji": "🫙",
    "items": [
      {
        "id": "mc1",
        "name": "Philly Cheese Steak",
        "calories": 640,
        "proteinG": 44,
        "carbsG": 58,
        "fatG": 24,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "mc2",
        "name": "Club McAlister",
        "calories": 580,
        "proteinG": 40,
        "carbsG": 52,
        "fatG": 22,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "mc3",
        "name": "King Club",
        "calories": 760,
        "proteinG": 48,
        "carbsG": 58,
        "fatG": 30,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "mc4",
        "name": "Southwest Turkey",
        "calories": 520,
        "proteinG": 38,
        "carbsG": 50,
        "fatG": 16,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "mc5",
        "name": "Harvest Chicken Salad",
        "calories": 480,
        "proteinG": 34,
        "carbsG": 42,
        "fatG": 18,
        "servingSize": "1 salad",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "mc6",
        "name": "Sweet Tea 32oz",
        "calories": 160,
        "proteinG": 0,
        "carbsG": 42,
        "fatG": 0,
        "servingSize": "32 oz",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "mc7",
        "name": "Spud Max Broccoli & Cheese",
        "calories": 540,
        "proteinG": 18,
        "carbsG": 68,
        "fatG": 22,
        "servingSize": "1 spud",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "mc8",
        "name": "New York Deli Style Cookie",
        "calories": 300,
        "proteinG": 4,
        "carbsG": 40,
        "fatG": 14,
        "servingSize": "1 cookie",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "rosas",
    "name": "Rosa's Cafe & Tortilla Factory",
    "category": "Mexican",
    "emoji": "🌻",
    "items": [
      {
        "id": "ro1",
        "name": "Beef Fajita Plate",
        "calories": 780,
        "proteinG": 52,
        "carbsG": 52,
        "fatG": 34,
        "servingSize": "1 plate"
      },
      {
        "id": "ro2",
        "name": "Chicken Fajita Plate",
        "calories": 640,
        "proteinG": 58,
        "carbsG": 50,
        "fatG": 20,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ro3",
        "name": "Cheese Enchiladas 3",
        "calories": 660,
        "proteinG": 26,
        "carbsG": 60,
        "fatG": 34,
        "servingSize": "3 enchiladas",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ro4",
        "name": "Beef Quesadilla",
        "calories": 580,
        "proteinG": 34,
        "carbsG": 50,
        "fatG": 26,
        "servingSize": "1 quesadilla"
      },
      {
        "id": "ro5",
        "name": "Bean & Cheese Burrito",
        "calories": 460,
        "proteinG": 20,
        "carbsG": 62,
        "fatG": 14,
        "servingSize": "1 burrito",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ro6",
        "name": "House-Made Tortilla",
        "calories": 120,
        "proteinG": 3,
        "carbsG": 22,
        "fatG": 3,
        "servingSize": "1 tortilla",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ro7",
        "name": "Carne Guisada Plate",
        "calories": 720,
        "proteinG": 48,
        "carbsG": 58,
        "fatG": 28,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ro8",
        "name": "Tres Leches Cake",
        "calories": 380,
        "proteinG": 6,
        "carbsG": 58,
        "fatG": 14,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "tacocabana",
    "name": "Taco Cabana",
    "category": "Mexican",
    "emoji": "🪅",
    "items": [
      {
        "id": "tca1",
        "name": "Flour Tortilla Chicken Taco",
        "calories": 320,
        "proteinG": 22,
        "carbsG": 36,
        "fatG": 8,
        "servingSize": "1 taco"
      },
      {
        "id": "tca2",
        "name": "Fajita Chicken Burritos",
        "calories": 660,
        "proteinG": 44,
        "carbsG": 68,
        "fatG": 18,
        "servingSize": "1 burrito",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "tca3",
        "name": "Cabana Bowl Beef",
        "calories": 580,
        "proteinG": 32,
        "carbsG": 62,
        "fatG": 22,
        "servingSize": "1 bowl"
      },
      {
        "id": "tca4",
        "name": "Tex-Mex Nachos",
        "calories": 780,
        "proteinG": 32,
        "carbsG": 72,
        "fatG": 38,
        "servingSize": "1 order"
      },
      {
        "id": "tca5",
        "name": "Chicken Flautas",
        "calories": 420,
        "proteinG": 26,
        "carbsG": 44,
        "fatG": 16,
        "servingSize": "3 flautas"
      },
      {
        "id": "tca6",
        "name": "Refried Beans",
        "calories": 180,
        "proteinG": 10,
        "carbsG": 28,
        "fatG": 4,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "tca7",
        "name": "Chips & Salsa",
        "calories": 340,
        "proteinG": 5,
        "carbsG": 52,
        "fatG": 14,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "tca8",
        "name": "Sopapilla",
        "calories": 140,
        "proteinG": 2,
        "carbsG": 22,
        "fatG": 5,
        "servingSize": "1 piece",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "braums",
    "name": "Braum's Ice Cream",
    "category": "Ice Cream",
    "emoji": "🍦",
    "items": [
      {
        "id": "br1",
        "name": "Regular Cone",
        "calories": 290,
        "proteinG": 5,
        "carbsG": 44,
        "fatG": 10,
        "servingSize": "1 cone",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "br2",
        "name": "Double Scoop Waffle Cone",
        "calories": 480,
        "proteinG": 8,
        "carbsG": 68,
        "fatG": 18,
        "servingSize": "1 waffle cone",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "br3",
        "name": "Banana Split",
        "calories": 680,
        "proteinG": 10,
        "carbsG": 96,
        "fatG": 28,
        "servingSize": "1 split",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "br4",
        "name": "Double Burger",
        "calories": 620,
        "proteinG": 38,
        "carbsG": 44,
        "fatG": 30,
        "servingSize": "1 burger"
      },
      {
        "id": "br5",
        "name": "Premium Vanilla Shake",
        "calories": 560,
        "proteinG": 12,
        "carbsG": 76,
        "fatG": 22,
        "servingSize": "16 oz",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "br6",
        "name": "Fresh Strawberry Sundae",
        "calories": 380,
        "proteinG": 6,
        "carbsG": 58,
        "fatG": 14,
        "servingSize": "1 sundae",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "br7",
        "name": "Onion Rings",
        "calories": 320,
        "proteinG": 5,
        "carbsG": 38,
        "fatG": 18,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "br8",
        "name": "Chocolate Malt",
        "calories": 600,
        "proteinG": 12,
        "carbsG": 86,
        "fatG": 22,
        "servingSize": "16 oz",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "marbleslabfw",
    "name": "Marble Slab Creamery",
    "category": "Ice Cream",
    "emoji": "🍨",
    "items": [
      {
        "id": "ms1",
        "name": "Like It Size Plain",
        "calories": 320,
        "proteinG": 5,
        "carbsG": 46,
        "fatG": 12,
        "servingSize": "1 like it",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ms2",
        "name": "Like It Size w/ Mix-ins",
        "calories": 420,
        "proteinG": 6,
        "carbsG": 58,
        "fatG": 16,
        "servingSize": "1 like it",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ms3",
        "name": "Love It Size",
        "calories": 540,
        "proteinG": 8,
        "carbsG": 78,
        "fatG": 20,
        "servingSize": "1 love it",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ms4",
        "name": "Gotta Have It Size",
        "calories": 680,
        "proteinG": 10,
        "carbsG": 98,
        "fatG": 26,
        "servingSize": "1 gotta have it",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ms5",
        "name": "Waffle Cone",
        "calories": 60,
        "proteinG": 1,
        "carbsG": 12,
        "fatG": 1,
        "servingSize": "1 cone",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ms6",
        "name": "Cookie Sandwich",
        "calories": 480,
        "proteinG": 6,
        "carbsG": 64,
        "fatG": 22,
        "servingSize": "1 sandwich",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ms7",
        "name": "Ice Cream Cake Slice",
        "calories": 520,
        "proteinG": 7,
        "carbsG": 72,
        "fatG": 22,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ms8",
        "name": "Shake 16oz",
        "calories": 620,
        "proteinG": 12,
        "carbsG": 84,
        "fatG": 26,
        "servingSize": "16 oz",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "krisypykreme",
    "name": "Krispy Kreme",
    "category": "Donuts",
    "emoji": "🍩",
    "items": [
      {
        "id": "kk1",
        "name": "Original Glazed",
        "calories": 190,
        "proteinG": 2,
        "carbsG": 22,
        "fatG": 11,
        "servingSize": "1 donut",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "kk2",
        "name": "Chocolate Iced Glazed",
        "calories": 240,
        "proteinG": 3,
        "carbsG": 28,
        "fatG": 13,
        "servingSize": "1 donut",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "kk3",
        "name": "Strawberry Iced w/ Sprinkles",
        "calories": 230,
        "proteinG": 2,
        "carbsG": 28,
        "fatG": 12,
        "servingSize": "1 donut",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "kk4",
        "name": "Oreo Cookies & Kreme",
        "calories": 340,
        "proteinG": 4,
        "carbsG": 44,
        "fatG": 16,
        "servingSize": "1 donut",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "kk5",
        "name": "Original Glazed Dozen",
        "calories": 2280,
        "proteinG": 24,
        "carbsG": 264,
        "fatG": 132,
        "servingSize": "12 donuts",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "kk6",
        "name": "Lemon Filled Glazed",
        "calories": 280,
        "proteinG": 3,
        "carbsG": 36,
        "fatG": 13,
        "servingSize": "1 donut",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "kk7",
        "name": "Chocolate Glazed Cruller",
        "calories": 230,
        "proteinG": 3,
        "carbsG": 26,
        "fatG": 13,
        "servingSize": "1 donut",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "kk8",
        "name": "Iced Coffee 12oz",
        "calories": 180,
        "proteinG": 4,
        "carbsG": 30,
        "fatG": 5,
        "servingSize": "12 oz",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "dunkin",
    "name": "Dunkin'",
    "category": "Coffee & Donuts",
    "emoji": "☕",
    "items": [
      {
        "id": "dk1",
        "name": "Original Glazed Donut",
        "calories": 260,
        "proteinG": 3,
        "carbsG": 34,
        "fatG": 12,
        "servingSize": "1 donut",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "dk2",
        "name": "Bacon Egg & Cheese Croissant",
        "calories": 500,
        "proteinG": 22,
        "carbsG": 42,
        "fatG": 28,
        "servingSize": "1 sandwich"
      },
      {
        "id": "dk3",
        "name": "Beyond Sausage Sandwich",
        "calories": 520,
        "proteinG": 22,
        "carbsG": 52,
        "fatG": 24,
        "servingSize": "1 sandwich",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "dk4",
        "name": "Medium Hot Coffee",
        "calories": 10,
        "proteinG": 0,
        "carbsG": 0,
        "fatG": 0,
        "servingSize": "14 oz",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "dk5",
        "name": "Medium Iced Coffee w/ Cream",
        "calories": 120,
        "proteinG": 1,
        "carbsG": 14,
        "fatG": 6,
        "servingSize": "24 oz"
      },
      {
        "id": "dk6",
        "name": "Hash Browns",
        "calories": 200,
        "proteinG": 3,
        "carbsG": 26,
        "fatG": 10,
        "servingSize": "4 pieces",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "dk7",
        "name": "Wake-Up Wrap w/ Bacon",
        "calories": 180,
        "proteinG": 9,
        "carbsG": 15,
        "fatG": 9,
        "servingSize": "1 wrap"
      },
      {
        "id": "dk8",
        "name": "Munchkins Glazed 5pc",
        "calories": 220,
        "proteinG": 2,
        "carbsG": 32,
        "fatG": 9,
        "servingSize": "5 pieces",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "tropical_smoothie",
    "name": "Tropical Smoothie Cafe",
    "category": "Smoothies",
    "emoji": "🌴",
    "items": [
      {
        "id": "ts1",
        "name": "Mango Magic 24oz",
        "calories": 280,
        "proteinG": 2,
        "carbsG": 66,
        "fatG": 1,
        "servingSize": "24 oz",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "ts2",
        "name": "Island Green 24oz",
        "calories": 240,
        "proteinG": 6,
        "carbsG": 52,
        "fatG": 2,
        "servingSize": "24 oz",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "ts3",
        "name": "Lean Machine 24oz",
        "calories": 360,
        "proteinG": 28,
        "carbsG": 48,
        "fatG": 4,
        "servingSize": "24 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ts4",
        "name": "Detox Island Green 24oz",
        "calories": 200,
        "proteinG": 4,
        "carbsG": 44,
        "fatG": 2,
        "servingSize": "24 oz",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "ts5",
        "name": "Acai Berry Boost 24oz",
        "calories": 300,
        "proteinG": 4,
        "carbsG": 66,
        "fatG": 3,
        "servingSize": "24 oz",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "ts6",
        "name": "Chicken Pesto Flatbread",
        "calories": 480,
        "proteinG": 32,
        "carbsG": 46,
        "fatG": 16,
        "servingSize": "1 flatbread",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ts7",
        "name": "Turkey Bacon Ranch Wrap",
        "calories": 520,
        "proteinG": 34,
        "carbsG": 50,
        "fatG": 18,
        "servingSize": "1 wrap",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ts8",
        "name": "PB Crunch 24oz",
        "calories": 480,
        "proteinG": 18,
        "carbsG": 60,
        "fatG": 18,
        "servingSize": "24 oz",
        "tags": ["vegetarian", "gluten-free"]
      }
    ]
  },
  {
    "id": "elasador",
    "name": "El Asador",
    "category": "Latin American",
    "emoji": "🎊",
    "items": [
      {
        "id": "ea1",
        "name": "Churrasco Steak",
        "calories": 620,
        "proteinG": 64,
        "carbsG": 8,
        "fatG": 36,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ea2",
        "name": "Pollo a la Brasa",
        "calories": 480,
        "proteinG": 58,
        "carbsG": 6,
        "fatG": 22,
        "servingSize": "1 half",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ea3",
        "name": "Lomo Saltado",
        "calories": 680,
        "proteinG": 44,
        "carbsG": 54,
        "fatG": 28,
        "servingSize": "1 plate"
      },
      {
        "id": "ea4",
        "name": "Ceviche",
        "calories": 240,
        "proteinG": 28,
        "carbsG": 16,
        "fatG": 6,
        "servingSize": "1 cup",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "ea5",
        "name": "Arroz con Leche",
        "calories": 380,
        "proteinG": 8,
        "carbsG": 58,
        "fatG": 12,
        "servingSize": "1 bowl",
        "tags": ["vegetarian", "gluten-free"]
      },
      {
        "id": "ea6",
        "name": "Yuca Fries",
        "calories": 320,
        "proteinG": 4,
        "carbsG": 56,
        "fatG": 9,
        "servingSize": "1 order",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "ea7",
        "name": "Empanadas (2)",
        "calories": 420,
        "proteinG": 16,
        "carbsG": 46,
        "fatG": 18,
        "servingSize": "2 pieces"
      },
      {
        "id": "ea8",
        "name": "Tres Leches",
        "calories": 380,
        "proteinG": 6,
        "carbsG": 56,
        "fatG": 14,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "phoreal",
    "name": "Pho Real Vietnamese",
    "category": "Vietnamese",
    "emoji": "🍜",
    "items": [
      {
        "id": "pr1",
        "name": "Pho Tai (Rare Beef) Large",
        "calories": 480,
        "proteinG": 38,
        "carbsG": 46,
        "fatG": 8,
        "servingSize": "1 large bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "pr2",
        "name": "Pho Chicken Large",
        "calories": 420,
        "proteinG": 40,
        "carbsG": 44,
        "fatG": 6,
        "servingSize": "1 large bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "pr3",
        "name": "Bun Bo Hue Large",
        "calories": 520,
        "proteinG": 36,
        "carbsG": 50,
        "fatG": 14,
        "servingSize": "1 large bowl"
      },
      {
        "id": "pr4",
        "name": "Banh Mi Pork",
        "calories": 440,
        "proteinG": 24,
        "carbsG": 54,
        "fatG": 14,
        "servingSize": "1 sandwich"
      },
      {
        "id": "pr5",
        "name": "Spring Rolls (2)",
        "calories": 180,
        "proteinG": 8,
        "carbsG": 24,
        "fatG": 5,
        "servingSize": "2 rolls",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "pr6",
        "name": "Vermicelli Bowl Grilled Pork",
        "calories": 520,
        "proteinG": 32,
        "carbsG": 58,
        "fatG": 16,
        "servingSize": "1 bowl",
        "tags": [
          "gluten-free"
        ]
      },
      {
        "id": "pr7",
        "name": "Vietnamese Iced Coffee",
        "calories": 220,
        "proteinG": 4,
        "carbsG": 36,
        "fatG": 8,
        "servingSize": "12 oz"
      },
      {
        "id": "pr8",
        "name": "Egg Rolls (3)",
        "calories": 260,
        "proteinG": 10,
        "carbsG": 28,
        "fatG": 12,
        "servingSize": "3 rolls"
      }
    ]
  },
  {
    "id": "thaiselect",
    "name": "Thai Select",
    "category": "Thai",
    "emoji": "🍱",
    "items": [
      {
        "id": "ths1",
        "name": "Pad Thai Chicken",
        "calories": 580,
        "proteinG": 36,
        "carbsG": 68,
        "fatG": 16,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ths2",
        "name": "Green Curry Chicken",
        "calories": 520,
        "proteinG": 38,
        "carbsG": 36,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ths3",
        "name": "Tom Kha Soup",
        "calories": 320,
        "proteinG": 18,
        "carbsG": 24,
        "fatG": 16,
        "servingSize": "1 bowl",
        "tags": [
          "gluten-free"
        ]
      },
      {
        "id": "ths4",
        "name": "Massamun Curry Beef",
        "calories": 580,
        "proteinG": 34,
        "carbsG": 46,
        "fatG": 24,
        "servingSize": "1 plate"
      },
      {
        "id": "ths5",
        "name": "Pad See Ew Shrimp",
        "calories": 500,
        "proteinG": 30,
        "carbsG": 62,
        "fatG": 14,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ths6",
        "name": "Spring Rolls (2)",
        "calories": 200,
        "proteinG": 6,
        "carbsG": 28,
        "fatG": 7,
        "servingSize": "2 rolls",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ths7",
        "name": "Mango Sticky Rice",
        "calories": 380,
        "proteinG": 4,
        "carbsG": 72,
        "fatG": 8,
        "servingSize": "1 serving",
        "tags": ["vegetarian", "gluten-free"]
      },
      {
        "id": "ths8",
        "name": "Thai Iced Tea",
        "calories": 200,
        "proteinG": 2,
        "carbsG": 42,
        "fatG": 4,
        "servingSize": "16 oz"
      }
    ]
  },
  {
    "id": "flowerchild_2",
    "name": "Flower Child",
    "category": "Healthy",
    "emoji": "🌼",
    "items": [
      {
        "id": "fc1",
        "name": "My Big Fat Greek Bowl",
        "calories": 540,
        "proteinG": 34,
        "carbsG": 58,
        "fatG": 18,
        "servingSize": "1 bowl",
        "tags": [
          "gluten-free"
        ]
      },
      {
        "id": "fc2",
        "name": "Hippie Bowl",
        "calories": 460,
        "proteinG": 16,
        "carbsG": 64,
        "fatG": 16,
        "servingSize": "1 bowl",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "fc3",
        "name": "Feel Good Soup",
        "calories": 280,
        "proteinG": 10,
        "carbsG": 38,
        "fatG": 8,
        "servingSize": "1 bowl",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "fc4",
        "name": "Mother Earth Bowl",
        "calories": 480,
        "proteinG": 18,
        "carbsG": 66,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "fc5",
        "name": "Be Lean Turkey Burger",
        "calories": 480,
        "proteinG": 44,
        "carbsG": 36,
        "fatG": 16,
        "servingSize": "1 burger",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "fc6",
        "name": "Happy Ending Lemonade",
        "calories": 120,
        "proteinG": 0,
        "carbsG": 30,
        "fatG": 0,
        "servingSize": "16 oz",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "fc7",
        "name": "Bone-In Chicken Bowl",
        "calories": 520,
        "proteinG": 52,
        "carbsG": 40,
        "fatG": 16,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "fc8",
        "name": "Pineapple & Chicken Wrap",
        "calories": 540,
        "proteinG": 40,
        "carbsG": 54,
        "fatG": 14,
        "servingSize": "1 wrap",
        "tags": [
          "high-protein"
        ]
      }
    ]
  },
  {
    "id": "kornerkitchen",
    "name": "Korne Kitchen",
    "category": "Healthy Mexican",
    "emoji": "🫛",
    "items": [
      {
        "id": "kn1",
        "name": "Baja Bowl w/ Chicken",
        "calories": 580,
        "proteinG": 44,
        "carbsG": 58,
        "fatG": 16,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "kn2",
        "name": "Power Burrito",
        "calories": 680,
        "proteinG": 42,
        "carbsG": 72,
        "fatG": 18,
        "servingSize": "1 burrito",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "kn3",
        "name": "Protein Taco 3pc",
        "calories": 440,
        "proteinG": 36,
        "carbsG": 36,
        "fatG": 14,
        "servingSize": "3 tacos",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "kn4",
        "name": "Veggie Bowl",
        "calories": 420,
        "proteinG": 16,
        "carbsG": 62,
        "fatG": 12,
        "servingSize": "1 bowl",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "kn5",
        "name": "Cauliflower Rice Substitute",
        "calories": 80,
        "proteinG": 4,
        "carbsG": 16,
        "fatG": 2,
        "servingSize": "1 side",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "kn6",
        "name": "Lean Salad w/ Grilled Chicken",
        "calories": 360,
        "proteinG": 40,
        "carbsG": 18,
        "fatG": 12,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "kn7",
        "name": "Protein Smoothie 20oz",
        "calories": 320,
        "proteinG": 28,
        "carbsG": 38,
        "fatG": 6,
        "servingSize": "20 oz",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "kn8",
        "name": "Agua Fresca 16oz",
        "calories": 90,
        "proteinG": 0,
        "carbsG": 22,
        "fatG": 0,
        "servingSize": "16 oz",
        "tags": ["vegan", "low-cal"]
      }
    ]
  },
  {
    "id": "salata_2",
    "name": "Salata",
    "category": "Salads",
    "emoji": "🥬",
    "items": [
      {
        "id": "sa1",
        "name": "Build Your Own Salad - Chicken",
        "calories": 380,
        "proteinG": 38,
        "carbsG": 24,
        "fatG": 14,
        "servingSize": "1 salad",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sa2",
        "name": "Build Your Own Salad - Tuna",
        "calories": 320,
        "proteinG": 30,
        "carbsG": 20,
        "fatG": 10,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "sa3",
        "name": "Build Your Own Wrap - Chicken",
        "calories": 520,
        "proteinG": 38,
        "carbsG": 52,
        "fatG": 14,
        "servingSize": "1 wrap",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "sa4",
        "name": "Salmon Salad",
        "calories": 420,
        "proteinG": 44,
        "carbsG": 18,
        "fatG": 18,
        "servingSize": "1 salad",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sa5",
        "name": "Tofu Salad",
        "calories": 300,
        "proteinG": 18,
        "carbsG": 22,
        "fatG": 12,
        "servingSize": "1 salad",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "sa6",
        "name": "Seasonal Grain Bowl",
        "calories": 460,
        "proteinG": 16,
        "carbsG": 62,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "sa7",
        "name": "Cup of Soup",
        "calories": 180,
        "proteinG": 6,
        "carbsG": 24,
        "fatG": 6,
        "servingSize": "1 cup",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "sa8",
        "name": "Add Protein - Grilled Chicken",
        "calories": 120,
        "proteinG": 24,
        "carbsG": 0,
        "fatG": 3,
        "servingSize": "4 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      }
    ]
  }
];
