// Auto-generated Fort Worth area restaurant data
// Nutrition data are estimates. Macros may vary.

export interface MenuItem {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  servingSize: string;
  tags?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  emoji: string;
  items: MenuItem[];
}

export const RESTAURANTS: Restaurant[] = [
  {
    "id": "angelos",
    "name": "Angelo's BBQ",
    "category": "BBQ",
    "emoji": "🍖",
    "items": [
      {
        "id": "ang1",
        "name": "Beef Brisket Plate",
        "calories": 820,
        "proteinG": 58,
        "carbsG": 42,
        "fatG": 44,
        "servingSize": "1 plate"
      },
      {
        "id": "ang2",
        "name": "Pork Ribs Half Rack",
        "calories": 960,
        "proteinG": 52,
        "carbsG": 12,
        "fatG": 70,
        "servingSize": "half rack"
      },
      {
        "id": "ang3",
        "name": "Sausage Link",
        "calories": 310,
        "proteinG": 14,
        "carbsG": 4,
        "fatG": 26,
        "servingSize": "1 link"
      },
      {
        "id": "ang4",
        "name": "Pulled Pork Sandwich",
        "calories": 580,
        "proteinG": 36,
        "carbsG": 48,
        "fatG": 22,
        "servingSize": "1 sandwich"
      },
      {
        "id": "ang5",
        "name": "Smoked Turkey Plate",
        "calories": 640,
        "proteinG": 62,
        "carbsG": 38,
        "fatG": 24,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ang6",
        "name": "Baked Beans",
        "calories": 190,
        "proteinG": 8,
        "carbsG": 34,
        "fatG": 3,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ang7",
        "name": "Coleslaw",
        "calories": 140,
        "proteinG": 2,
        "carbsG": 18,
        "fatG": 7,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ang8",
        "name": "Peach Cobbler",
        "calories": 380,
        "proteinG": 4,
        "carbsG": 62,
        "fatG": 14,
        "servingSize": "1 serving"
      }
    ]
  },
  {
    "id": "railhead",
    "name": "Railhead Smokehouse",
    "category": "BBQ",
    "emoji": "🤠",
    "items": [
      {
        "id": "rl1",
        "name": "Brisket Sandwich",
        "calories": 720,
        "proteinG": 48,
        "carbsG": 52,
        "fatG": 32,
        "servingSize": "1 sandwich"
      },
      {
        "id": "rl2",
        "name": "Baby Back Ribs Full",
        "calories": 1420,
        "proteinG": 78,
        "carbsG": 22,
        "fatG": 108,
        "servingSize": "full rack"
      },
      {
        "id": "rl3",
        "name": "Smoked Chicken Quarter",
        "calories": 420,
        "proteinG": 44,
        "carbsG": 8,
        "fatG": 24,
        "servingSize": "1 quarter",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rl4",
        "name": "Jalapeño Sausage",
        "calories": 340,
        "proteinG": 15,
        "carbsG": 6,
        "fatG": 28,
        "servingSize": "1 link"
      },
      {
        "id": "rl5",
        "name": "Potato Salad",
        "calories": 220,
        "proteinG": 4,
        "carbsG": 28,
        "fatG": 11,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "rl6",
        "name": "Green Beans",
        "calories": 80,
        "proteinG": 3,
        "carbsG": 14,
        "fatG": 1,
        "servingSize": "1 cup",
        "tags": ["low-cal", "vegetarian"]
      },
      {
        "id": "rl7",
        "name": "Chopped Beef Sandwich",
        "calories": 690,
        "proteinG": 44,
        "carbsG": 54,
        "fatG": 28,
        "servingSize": "1 sandwich"
      },
      {
        "id": "rl8",
        "name": "Banana Pudding",
        "calories": 310,
        "proteinG": 6,
        "carbsG": 48,
        "fatG": 10,
        "servingSize": "1 cup"
      }
    ]
  },
  {
    "id": "risckys",
    "name": "Riscky's BBQ",
    "category": "BBQ",
    "emoji": "🔥",
    "items": [
      {
        "id": "rk1",
        "name": "Brisket Plate",
        "calories": 780,
        "proteinG": 55,
        "carbsG": 40,
        "fatG": 42,
        "servingSize": "1 plate"
      },
      {
        "id": "rk2",
        "name": "Ribs & Brisket Combo",
        "calories": 1180,
        "proteinG": 72,
        "carbsG": 46,
        "fatG": 72,
        "servingSize": "1 combo"
      },
      {
        "id": "rk3",
        "name": "BBQ Chicken Plate",
        "calories": 560,
        "proteinG": 54,
        "carbsG": 28,
        "fatG": 24,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rk4",
        "name": "Smoked Sausage Plate",
        "calories": 690,
        "proteinG": 28,
        "carbsG": 38,
        "fatG": 46,
        "servingSize": "1 plate"
      },
      {
        "id": "rk5",
        "name": "Mac & Cheese",
        "calories": 320,
        "proteinG": 12,
        "carbsG": 42,
        "fatG": 12,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "rk6",
        "name": "Pinto Beans",
        "calories": 180,
        "proteinG": 10,
        "carbsG": 30,
        "fatG": 2,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "rk7",
        "name": "Jalapeño Cornbread",
        "calories": 210,
        "proteinG": 5,
        "carbsG": 30,
        "fatG": 8,
        "servingSize": "1 piece",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "rk8",
        "name": "Lemon Pie",
        "calories": 360,
        "proteinG": 5,
        "carbsG": 52,
        "fatG": 15,
        "servingSize": "1 slice"
      }
    ]
  },
  {
    "id": "joet",
    "name": "Joe T. Garcia's",
    "category": "Mexican",
    "emoji": "🌮",
    "items": [
      {
        "id": "jt1",
        "name": "Beef Fajitas",
        "calories": 820,
        "proteinG": 52,
        "carbsG": 48,
        "fatG": 38,
        "servingSize": "1 plate"
      },
      {
        "id": "jt2",
        "name": "Chicken Fajitas",
        "calories": 720,
        "proteinG": 60,
        "carbsG": 46,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "jt3",
        "name": "Cheese Enchiladas",
        "calories": 680,
        "proteinG": 28,
        "carbsG": 64,
        "fatG": 34,
        "servingSize": "3 enchiladas",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "jt4",
        "name": "Beef Tacos",
        "calories": 540,
        "proteinG": 34,
        "carbsG": 44,
        "fatG": 22,
        "servingSize": "3 tacos"
      },
      {
        "id": "jt5",
        "name": "Puffy Tacos",
        "calories": 580,
        "proteinG": 26,
        "carbsG": 60,
        "fatG": 24,
        "servingSize": "3 tacos",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "jt6",
        "name": "Nachos Grande",
        "calories": 860,
        "proteinG": 36,
        "carbsG": 72,
        "fatG": 48,
        "servingSize": "1 plate"
      },
      {
        "id": "jt7",
        "name": "Guacamole",
        "calories": 190,
        "proteinG": 3,
        "carbsG": 12,
        "fatG": 16,
        "servingSize": "1 cup",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "jt8",
        "name": "Margarita",
        "calories": 220,
        "proteinG": 0,
        "carbsG": 24,
        "fatG": 0,
        "servingSize": "1 glass"
      },
      {
        "id": "jt9",
        "name": "Sopapillas",
        "calories": 280,
        "proteinG": 4,
        "carbsG": 40,
        "fatG": 11,
        "servingSize": "3 pieces",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "reata",
    "name": "Reata Restaurant",
    "category": "Steakhouse",
    "emoji": "🥩",
    "items": [
      {
        "id": "re1",
        "name": "Cowboy Ribeye 16oz",
        "calories": 1180,
        "proteinG": 98,
        "carbsG": 4,
        "fatG": 82,
        "servingSize": "16 oz",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "re2",
        "name": "Tenderloin Filet 8oz",
        "calories": 680,
        "proteinG": 72,
        "carbsG": 4,
        "fatG": 42,
        "servingSize": "8 oz",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "re3",
        "name": "Pan-Seared Salmon",
        "calories": 540,
        "proteinG": 54,
        "carbsG": 12,
        "fatG": 28,
        "servingSize": "8 oz",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "re4",
        "name": "Rattlesnake Pasta",
        "calories": 740,
        "proteinG": 36,
        "carbsG": 82,
        "fatG": 28,
        "servingSize": "1 plate"
      },
      {
        "id": "re5",
        "name": "Warm Brie Tenderloin",
        "calories": 920,
        "proteinG": 62,
        "carbsG": 32,
        "fatG": 58,
        "servingSize": "1 plate"
      },
      {
        "id": "re6",
        "name": "Prairie Dust Crusted Shrimp",
        "calories": 480,
        "proteinG": 42,
        "carbsG": 18,
        "fatG": 26,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "re7",
        "name": "Texas Pecan Pie",
        "calories": 520,
        "proteinG": 6,
        "carbsG": 68,
        "fatG": 24,
        "servingSize": "1 slice"
      },
      {
        "id": "re8",
        "name": "Jalapeño Cheese Grits",
        "calories": 310,
        "proteinG": 10,
        "carbsG": 42,
        "fatG": 12,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "lonesomed",
    "name": "Lonesome Dove",
    "category": "American",
    "emoji": "🦅",
    "items": [
      {
        "id": "ld1",
        "name": "Buffalo Tenderloin",
        "calories": 780,
        "proteinG": 82,
        "carbsG": 18,
        "fatG": 38,
        "servingSize": "8 oz",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ld2",
        "name": "Wild Boar Ribs",
        "calories": 860,
        "proteinG": 64,
        "carbsG": 22,
        "fatG": 56,
        "servingSize": "1 plate"
      },
      {
        "id": "ld3",
        "name": "Smoked Antelope Chops",
        "calories": 620,
        "proteinG": 68,
        "carbsG": 12,
        "fatG": 32,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ld4",
        "name": "Rabbit & Rattlesnake Sausage",
        "calories": 480,
        "proteinG": 36,
        "carbsG": 16,
        "fatG": 30,
        "servingSize": "1 serving"
      },
      {
        "id": "ld5",
        "name": "Venison Steak",
        "calories": 540,
        "proteinG": 72,
        "carbsG": 8,
        "fatG": 22,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ld6",
        "name": "Bison Burger",
        "calories": 720,
        "proteinG": 52,
        "carbsG": 44,
        "fatG": 36,
        "servingSize": "1 burger"
      },
      {
        "id": "ld7",
        "name": "Sweet Potato Fries",
        "calories": 280,
        "proteinG": 4,
        "carbsG": 48,
        "fatG": 8,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "ellerbe",
    "name": "Ellerbe Fine Foods",
    "category": "Fine Dining",
    "emoji": "🍽️",
    "items": [
      {
        "id": "ef1",
        "name": "Pan-Seared Duck Breast",
        "calories": 620,
        "proteinG": 56,
        "carbsG": 18,
        "fatG": 34,
        "servingSize": "6 oz",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ef2",
        "name": "Grilled Gulf Red Snapper",
        "calories": 480,
        "proteinG": 52,
        "carbsG": 14,
        "fatG": 22,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ef3",
        "name": "Braised Short Rib",
        "calories": 840,
        "proteinG": 62,
        "carbsG": 28,
        "fatG": 52,
        "servingSize": "1 plate"
      },
      {
        "id": "ef4",
        "name": "Mushroom Risotto",
        "calories": 540,
        "proteinG": 16,
        "carbsG": 72,
        "fatG": 18,
        "servingSize": "1 plate",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ef5",
        "name": "Roasted Beet Salad",
        "calories": 220,
        "proteinG": 8,
        "carbsG": 28,
        "fatG": 10,
        "servingSize": "1 salad",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "ef6",
        "name": "Crème Brûlée",
        "calories": 380,
        "proteinG": 6,
        "carbsG": 46,
        "fatG": 18,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ef7",
        "name": "Seared Foie Gras",
        "calories": 520,
        "proteinG": 18,
        "carbsG": 12,
        "fatG": 44,
        "servingSize": "3 oz"
      }
    ]
  },
  {
    "id": "woodshed",
    "name": "Woodshed Smokehouse",
    "category": "BBQ",
    "emoji": "🌳",
    "items": [
      {
        "id": "ws1",
        "name": "Smoked Brisket",
        "calories": 760,
        "proteinG": 58,
        "carbsG": 18,
        "fatG": 52,
        "servingSize": "8 oz"
      },
      {
        "id": "ws2",
        "name": "BBQ Half Chicken",
        "calories": 580,
        "proteinG": 62,
        "carbsG": 12,
        "fatG": 28,
        "servingSize": "1 half",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ws3",
        "name": "Smoked Duck",
        "calories": 640,
        "proteinG": 54,
        "carbsG": 8,
        "fatG": 42,
        "servingSize": "6 oz"
      },
      {
        "id": "ws4",
        "name": "Pork Belly Burnt Ends",
        "calories": 880,
        "proteinG": 42,
        "carbsG": 16,
        "fatG": 72,
        "servingSize": "6 oz"
      },
      {
        "id": "ws5",
        "name": "Smoked Jalapeño Sausage",
        "calories": 370,
        "proteinG": 18,
        "carbsG": 8,
        "fatG": 30,
        "servingSize": "1 link"
      },
      {
        "id": "ws6",
        "name": "Smoked Corn on Cob",
        "calories": 160,
        "proteinG": 4,
        "carbsG": 32,
        "fatG": 4,
        "servingSize": "1 ear",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "ws7",
        "name": "Smash Burger",
        "calories": 780,
        "proteinG": 44,
        "carbsG": 52,
        "fatG": 44,
        "servingSize": "1 burger"
      },
      {
        "id": "ws8",
        "name": "Smoked Turkey Leg",
        "calories": 680,
        "proteinG": 82,
        "carbsG": 6,
        "fatG": 32,
        "servingSize": "1 leg",
        "tags": [
          "high-protein"
        ]
      }
    ]
  },
  {
    "id": "heim",
    "name": "Heim Barbecue",
    "category": "BBQ",
    "emoji": "🏆",
    "items": [
      {
        "id": "hm1",
        "name": "Bacon Burnt Ends",
        "calories": 760,
        "proteinG": 38,
        "carbsG": 14,
        "fatG": 64,
        "servingSize": "6 oz"
      },
      {
        "id": "hm2",
        "name": "Beef Brisket",
        "calories": 790,
        "proteinG": 56,
        "carbsG": 16,
        "fatG": 58,
        "servingSize": "8 oz"
      },
      {
        "id": "hm3",
        "name": "Pork Ribs",
        "calories": 820,
        "proteinG": 48,
        "carbsG": 8,
        "fatG": 66,
        "servingSize": "half rack"
      },
      {
        "id": "hm4",
        "name": "Smoked Turkey",
        "calories": 480,
        "proteinG": 68,
        "carbsG": 8,
        "fatG": 20,
        "servingSize": "6 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "hm5",
        "name": "Jalapeño Cheddar Sausage",
        "calories": 390,
        "proteinG": 18,
        "carbsG": 8,
        "fatG": 32,
        "servingSize": "1 link"
      },
      {
        "id": "hm6",
        "name": "Mac & Cheese",
        "calories": 340,
        "proteinG": 14,
        "carbsG": 44,
        "fatG": 14,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "hm7",
        "name": "Pickled Jalapeños",
        "calories": 10,
        "proteinG": 0,
        "carbsG": 2,
        "fatG": 0,
        "servingSize": "1 oz",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "hm8",
        "name": "Banana Pudding",
        "calories": 290,
        "proteinG": 5,
        "carbsG": 44,
        "fatG": 10,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "fixture",
    "name": "Fixture Kitchen & Social",
    "category": "American",
    "emoji": "🍔",
    "items": [
      {
        "id": "fx1",
        "name": "Fixture Burger",
        "calories": 820,
        "proteinG": 46,
        "carbsG": 58,
        "fatG": 42,
        "servingSize": "1 burger"
      },
      {
        "id": "fx2",
        "name": "Blackened Chicken Sandwich",
        "calories": 640,
        "proteinG": 52,
        "carbsG": 54,
        "fatG": 22,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "fx3",
        "name": "Avocado Toast",
        "calories": 420,
        "proteinG": 14,
        "carbsG": 44,
        "fatG": 22,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fx4",
        "name": "Chopped Salad",
        "calories": 380,
        "proteinG": 22,
        "carbsG": 32,
        "fatG": 18,
        "servingSize": "1 salad"
      },
      {
        "id": "fx5",
        "name": "Truffle Fries",
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
        "id": "fx6",
        "name": "Tuna Poke Bowl",
        "calories": 560,
        "proteinG": 42,
        "carbsG": 58,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "fx7",
        "name": "Brunch Plate",
        "calories": 680,
        "proteinG": 28,
        "carbsG": 62,
        "fatG": 34,
        "servingSize": "1 plate"
      },
      {
        "id": "fx8",
        "name": "Seasonal Grain Bowl",
        "calories": 460,
        "proteinG": 18,
        "carbsG": 64,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "spiral",
    "name": "Spiral Diner & Bakery",
    "category": "Vegan",
    "emoji": "🌱",
    "items": [
      {
        "id": "sp1",
        "name": "Reuben Sandwich",
        "calories": 620,
        "proteinG": 24,
        "carbsG": 72,
        "fatG": 26,
        "servingSize": "1 sandwich",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "sp2",
        "name": "Mac Attack",
        "calories": 540,
        "proteinG": 18,
        "carbsG": 78,
        "fatG": 16,
        "servingSize": "1 plate",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "sp3",
        "name": "Breakfast Burrito",
        "calories": 580,
        "proteinG": 22,
        "carbsG": 64,
        "fatG": 24,
        "servingSize": "1 burrito",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "sp4",
        "name": "Buffalo Cauliflower",
        "calories": 320,
        "proteinG": 8,
        "carbsG": 44,
        "fatG": 12,
        "servingSize": "1 plate",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "sp5",
        "name": "Portobello Club",
        "calories": 480,
        "proteinG": 16,
        "carbsG": 58,
        "fatG": 18,
        "servingSize": "1 sandwich",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "sp6",
        "name": "Blueberry Pancakes",
        "calories": 420,
        "proteinG": 8,
        "carbsG": 72,
        "fatG": 10,
        "servingSize": "3 pancakes",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "sp7",
        "name": "Chocolate Cake Slice",
        "calories": 380,
        "proteinG": 5,
        "carbsG": 58,
        "fatG": 14,
        "servingSize": "1 slice",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "sp8",
        "name": "Green Smoothie",
        "calories": 180,
        "proteinG": 4,
        "carbsG": 36,
        "fatG": 3,
        "servingSize": "16 oz",
        "tags": ["vegan", "low-cal"]
      }
    ]
  },
  {
    "id": "torchys",
    "name": "Torchy's Tacos",
    "category": "Mexican",
    "emoji": "🌶️",
    "items": [
      {
        "id": "tr1",
        "name": "Trailer Park Taco",
        "calories": 580,
        "proteinG": 28,
        "carbsG": 52,
        "fatG": 28,
        "servingSize": "1 taco"
      },
      {
        "id": "tr2",
        "name": "Baja Shrimp Taco",
        "calories": 420,
        "proteinG": 22,
        "carbsG": 44,
        "fatG": 16,
        "servingSize": "1 taco"
      },
      {
        "id": "tr3",
        "name": "Green Chile Pork Taco",
        "calories": 480,
        "proteinG": 30,
        "carbsG": 42,
        "fatG": 20,
        "servingSize": "1 taco"
      },
      {
        "id": "tr4",
        "name": "Democrat Taco",
        "calories": 520,
        "proteinG": 26,
        "carbsG": 48,
        "fatG": 22,
        "servingSize": "1 taco"
      },
      {
        "id": "tr5",
        "name": "Brushfire Taco",
        "calories": 540,
        "proteinG": 32,
        "carbsG": 44,
        "fatG": 24,
        "servingSize": "1 taco"
      },
      {
        "id": "tr6",
        "name": "Queso",
        "calories": 360,
        "proteinG": 16,
        "carbsG": 22,
        "fatG": 24,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "tr7",
        "name": "Chips & Guac",
        "calories": 480,
        "proteinG": 8,
        "carbsG": 58,
        "fatG": 26,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "tr8",
        "name": "Diablo Taco",
        "calories": 560,
        "proteinG": 30,
        "carbsG": 46,
        "fatG": 26,
        "servingSize": "1 taco"
      },
      {
        "id": "tr9",
        "name": "Fried Avocado Taco",
        "calories": 460,
        "proteinG": 12,
        "carbsG": 54,
        "fatG": 22,
        "servingSize": "1 taco",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "velvet",
    "name": "Velvet Taco",
    "category": "Mexican",
    "emoji": "🦋",
    "items": [
      {
        "id": "vt1",
        "name": "WTF Taco",
        "calories": 540,
        "proteinG": 28,
        "carbsG": 48,
        "fatG": 26,
        "servingSize": "1 taco"
      },
      {
        "id": "vt2",
        "name": "Chicken & Waffle Taco",
        "calories": 620,
        "proteinG": 32,
        "carbsG": 62,
        "fatG": 24,
        "servingSize": "1 taco"
      },
      {
        "id": "vt3",
        "name": "Spicy Tikka Chicken",
        "calories": 480,
        "proteinG": 34,
        "carbsG": 44,
        "fatG": 18,
        "servingSize": "1 taco"
      },
      {
        "id": "vt4",
        "name": "Grilled Mahi Taco",
        "calories": 380,
        "proteinG": 28,
        "carbsG": 38,
        "fatG": 12,
        "servingSize": "1 taco",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "vt5",
        "name": "Brisket Taco",
        "calories": 560,
        "proteinG": 36,
        "carbsG": 46,
        "fatG": 26,
        "servingSize": "1 taco"
      },
      {
        "id": "vt6",
        "name": "Fried Avocado Taco",
        "calories": 440,
        "proteinG": 10,
        "carbsG": 54,
        "fatG": 22,
        "servingSize": "1 taco",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "vt7",
        "name": "Rice Bowl",
        "calories": 480,
        "proteinG": 14,
        "carbsG": 72,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "vt8",
        "name": "Elote",
        "calories": 280,
        "proteinG": 6,
        "carbsG": 38,
        "fatG": 12,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "canerosso",
    "name": "Cane Rosso",
    "category": "Pizza",
    "emoji": "🍕",
    "items": [
      {
        "id": "cr1",
        "name": "Margherita Pizza",
        "calories": 720,
        "proteinG": 28,
        "carbsG": 88,
        "fatG": 26,
        "servingSize": "12 inch",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cr2",
        "name": "Hot Sopressata Pizza",
        "calories": 860,
        "proteinG": 36,
        "carbsG": 90,
        "fatG": 38,
        "servingSize": "12 inch"
      },
      {
        "id": "cr3",
        "name": "Mushroom Truffle Pizza",
        "calories": 780,
        "proteinG": 24,
        "carbsG": 92,
        "fatG": 30,
        "servingSize": "12 inch",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cr4",
        "name": "Honey Bastard Pizza",
        "calories": 940,
        "proteinG": 34,
        "carbsG": 96,
        "fatG": 42,
        "servingSize": "12 inch"
      },
      {
        "id": "cr5",
        "name": "Arugula Salad",
        "calories": 280,
        "proteinG": 8,
        "carbsG": 22,
        "fatG": 18,
        "servingSize": "1 salad",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "cr6",
        "name": "Burrata",
        "calories": 360,
        "proteinG": 16,
        "carbsG": 8,
        "fatG": 28,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cr7",
        "name": "Meatball Appetizer",
        "calories": 420,
        "proteinG": 28,
        "carbsG": 22,
        "fatG": 26,
        "servingSize": "4 meatballs"
      },
      {
        "id": "cr8",
        "name": "Tiramisu",
        "calories": 440,
        "proteinG": 8,
        "carbsG": 54,
        "fatG": 20,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "paris",
    "name": "Paris Coffee Shop",
    "category": "Breakfast",
    "emoji": "☕",
    "items": [
      {
        "id": "pc1",
        "name": "Full Breakfast",
        "calories": 780,
        "proteinG": 36,
        "carbsG": 64,
        "fatG": 38,
        "servingSize": "1 plate"
      },
      {
        "id": "pc2",
        "name": "Chicken Fried Steak & Eggs",
        "calories": 980,
        "proteinG": 44,
        "carbsG": 72,
        "fatG": 56,
        "servingSize": "1 plate"
      },
      {
        "id": "pc3",
        "name": "Buttermilk Pancakes",
        "calories": 560,
        "proteinG": 12,
        "carbsG": 88,
        "fatG": 16,
        "servingSize": "3 pancakes",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pc4",
        "name": "Western Omelette",
        "calories": 620,
        "proteinG": 38,
        "carbsG": 18,
        "fatG": 44,
        "servingSize": "1 omelette",
        "tags": [
          "gluten-free"
        ]
      },
      {
        "id": "pc5",
        "name": "Biscuits & Gravy",
        "calories": 680,
        "proteinG": 18,
        "carbsG": 82,
        "fatG": 30,
        "servingSize": "2 biscuits"
      },
      {
        "id": "pc6",
        "name": "Fresh Fruit Plate",
        "calories": 140,
        "proteinG": 3,
        "carbsG": 34,
        "fatG": 1,
        "servingSize": "1 plate",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "pc7",
        "name": "Avocado Toast",
        "calories": 380,
        "proteinG": 12,
        "carbsG": 40,
        "fatG": 20,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pc8",
        "name": "Belgian Waffle",
        "calories": 480,
        "proteinG": 10,
        "carbsG": 74,
        "fatG": 16,
        "servingSize": "1 waffle",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "birdcafe",
    "name": "Bird Cafe",
    "category": "American",
    "emoji": "🐦",
    "items": [
      {
        "id": "bc1",
        "name": "Bird Burger",
        "calories": 760,
        "proteinG": 44,
        "carbsG": 54,
        "fatG": 38,
        "servingSize": "1 burger"
      },
      {
        "id": "bc2",
        "name": "Roasted Chicken",
        "calories": 580,
        "proteinG": 64,
        "carbsG": 22,
        "fatG": 24,
        "servingSize": "1 half",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "bc3",
        "name": "Salmon Nicoise Salad",
        "calories": 520,
        "proteinG": 44,
        "carbsG": 32,
        "fatG": 24,
        "servingSize": "1 salad",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "bc4",
        "name": "Truffle Deviled Eggs",
        "calories": 220,
        "proteinG": 12,
        "carbsG": 6,
        "fatG": 16,
        "servingSize": "4 halves",
        "tags": ["low-cal", "gluten-free"]
      },
      {
        "id": "bc5",
        "name": "Fried Chicken Sandwich",
        "calories": 720,
        "proteinG": 48,
        "carbsG": 58,
        "fatG": 30,
        "servingSize": "1 sandwich"
      },
      {
        "id": "bc6",
        "name": "Kale Caesar",
        "calories": 340,
        "proteinG": 16,
        "carbsG": 28,
        "fatG": 18,
        "servingSize": "1 salad",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "bc7",
        "name": "Sweet Potato Hash",
        "calories": 360,
        "proteinG": 8,
        "carbsG": 56,
        "fatG": 12,
        "servingSize": "1 plate",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bc8",
        "name": "Chocolate Lava Cake",
        "calories": 480,
        "proteinG": 8,
        "carbsG": 62,
        "fatG": 22,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "rustic",
    "name": "The Rustic",
    "category": "American",
    "emoji": "🎸",
    "items": [
      {
        "id": "ru1",
        "name": "Cowboy Burger",
        "calories": 880,
        "proteinG": 52,
        "carbsG": 62,
        "fatG": 46,
        "servingSize": "1 burger"
      },
      {
        "id": "ru2",
        "name": "Smoked Wings",
        "calories": 640,
        "proteinG": 54,
        "carbsG": 12,
        "fatG": 42,
        "servingSize": "8 wings",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ru3",
        "name": "Fish Tacos",
        "calories": 560,
        "proteinG": 34,
        "carbsG": 56,
        "fatG": 20,
        "servingSize": "3 tacos"
      },
      {
        "id": "ru4",
        "name": "BBQ Nachos",
        "calories": 820,
        "proteinG": 36,
        "carbsG": 76,
        "fatG": 42,
        "servingSize": "1 order"
      },
      {
        "id": "ru5",
        "name": "Wedge Salad",
        "calories": 380,
        "proteinG": 14,
        "carbsG": 22,
        "fatG": 26,
        "servingSize": "1 salad",
        "tags": [
          "gluten-free"
        ]
      },
      {
        "id": "ru6",
        "name": "Queso Flameado",
        "calories": 460,
        "proteinG": 24,
        "carbsG": 18,
        "fatG": 32,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ru7",
        "name": "Pork Belly Sandwich",
        "calories": 740,
        "proteinG": 38,
        "carbsG": 58,
        "fatG": 38,
        "servingSize": "1 sandwich"
      },
      {
        "id": "ru8",
        "name": "Peach Cobbler",
        "calories": 420,
        "proteinG": 5,
        "carbsG": 68,
        "fatG": 14,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "righteous",
    "name": "Righteous Foods",
    "category": "Healthy",
    "emoji": "🥗",
    "items": [
      {
        "id": "rf1",
        "name": "Power Bowl",
        "calories": 480,
        "proteinG": 32,
        "carbsG": 56,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rf2",
        "name": "Green Detox Salad",
        "calories": 280,
        "proteinG": 12,
        "carbsG": 32,
        "fatG": 12,
        "servingSize": "1 salad",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "rf3",
        "name": "Turkey Power Wrap",
        "calories": 540,
        "proteinG": 42,
        "carbsG": 52,
        "fatG": 14,
        "servingSize": "1 wrap",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rf4",
        "name": "Acaí Bowl",
        "calories": 420,
        "proteinG": 10,
        "carbsG": 72,
        "fatG": 12,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "rf5",
        "name": "Protein Smoothie",
        "calories": 360,
        "proteinG": 28,
        "carbsG": 44,
        "fatG": 8,
        "servingSize": "20 oz",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rf6",
        "name": "Avocado Chicken Bowl",
        "calories": 560,
        "proteinG": 44,
        "carbsG": 42,
        "fatG": 22,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "rf7",
        "name": "Overnight Oats",
        "calories": 380,
        "proteinG": 14,
        "carbsG": 58,
        "fatG": 10,
        "servingSize": "1 jar",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "rf8",
        "name": "Grain Bowl",
        "calories": 440,
        "proteinG": 16,
        "carbsG": 68,
        "fatG": 12,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      }
    ]
  },
  {
    "id": "chickfila",
    "name": "Chick-fil-A",
    "category": "Fast Food",
    "emoji": "🐔",
    "items": [
      {
        "id": "cfa1",
        "name": "Original Chicken Sandwich",
        "calories": 440,
        "proteinG": 28,
        "carbsG": 41,
        "fatG": 19,
        "servingSize": "1 sandwich"
      },
      {
        "id": "cfa2",
        "name": "Spicy Deluxe Sandwich",
        "calories": 500,
        "proteinG": 32,
        "carbsG": 44,
        "fatG": 22,
        "servingSize": "1 sandwich"
      },
      {
        "id": "cfa3",
        "name": "Grilled Chicken Sandwich",
        "calories": 310,
        "proteinG": 29,
        "carbsG": 31,
        "fatG": 6,
        "servingSize": "1 sandwich",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "cfa4",
        "name": "Nuggets 8pc",
        "calories": 250,
        "proteinG": 26,
        "carbsG": 11,
        "fatG": 11,
        "servingSize": "8 piece",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "cfa5",
        "name": "Grilled Nuggets 8pc",
        "calories": 130,
        "proteinG": 25,
        "carbsG": 1,
        "fatG": 3,
        "servingSize": "8 piece",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "cfa6",
        "name": "Waffle Fries Medium",
        "calories": 360,
        "proteinG": 5,
        "carbsG": 45,
        "fatG": 18,
        "servingSize": "medium"
      },
      {
        "id": "cfa7",
        "name": "Cobb Salad w/ Grilled Chicken",
        "calories": 500,
        "proteinG": 42,
        "carbsG": 28,
        "fatG": 24,
        "servingSize": "1 salad",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "cfa8",
        "name": "Spicy Southwest Salad",
        "calories": 450,
        "proteinG": 33,
        "carbsG": 34,
        "fatG": 22,
        "servingSize": "1 salad",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "cfa9",
        "name": "Chicken Biscuit",
        "calories": 450,
        "proteinG": 20,
        "carbsG": 48,
        "fatG": 18,
        "servingSize": "1 biscuit"
      },
      {
        "id": "cfa10",
        "name": "Fruit Cup",
        "calories": 60,
        "proteinG": 1,
        "carbsG": 14,
        "fatG": 0,
        "servingSize": "small",
        "tags": ["vegan", "low-cal"]
      }
    ]
  },
  {
    "id": "chipotle",
    "name": "Chipotle",
    "category": "Mexican",
    "emoji": "🌯",
    "items": [
      {
        "id": "ch1",
        "name": "Burrito - Chicken",
        "calories": 745,
        "proteinG": 51,
        "carbsG": 81,
        "fatG": 23,
        "servingSize": "1 burrito",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ch2",
        "name": "Burrito Bowl - Steak",
        "calories": 685,
        "proteinG": 44,
        "carbsG": 74,
        "fatG": 23,
        "servingSize": "1 bowl"
      },
      {
        "id": "ch3",
        "name": "Burrito Bowl - Chicken",
        "calories": 665,
        "proteinG": 50,
        "carbsG": 71,
        "fatG": 21,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ch4",
        "name": "Veggie Burrito Bowl",
        "calories": 580,
        "proteinG": 16,
        "carbsG": 84,
        "fatG": 20,
        "servingSize": "1 bowl",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ch5",
        "name": "Tacos - Chicken (3)",
        "calories": 510,
        "proteinG": 38,
        "carbsG": 50,
        "fatG": 16,
        "servingSize": "3 tacos",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ch6",
        "name": "Salad - Barbacoa",
        "calories": 560,
        "proteinG": 34,
        "carbsG": 42,
        "fatG": 27,
        "servingSize": "1 salad"
      },
      {
        "id": "ch7",
        "name": "Chips & Guacamole",
        "calories": 570,
        "proteinG": 7,
        "carbsG": 73,
        "fatG": 30,
        "servingSize": "1 order",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "ch8",
        "name": "Queso Blanco",
        "calories": 240,
        "proteinG": 9,
        "carbsG": 12,
        "fatG": 18,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ch9",
        "name": "Chicken Quesadilla",
        "calories": 800,
        "proteinG": 51,
        "carbsG": 78,
        "fatG": 33,
        "servingSize": "1 quesadilla"
      },
      {
        "id": "ch10",
        "name": "Sofritas Bowl",
        "calories": 620,
        "proteinG": 14,
        "carbsG": 84,
        "fatG": 22,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      }
    ]
  },
  {
    "id": "whataburger",
    "name": "Whataburger",
    "category": "Fast Food",
    "emoji": "🍔",
    "items": [
      {
        "id": "wb1",
        "name": "Whataburger",
        "calories": 590,
        "proteinG": 24,
        "carbsG": 58,
        "fatG": 26,
        "servingSize": "1 burger"
      },
      {
        "id": "wb2",
        "name": "Double Meat Whataburger",
        "calories": 840,
        "proteinG": 42,
        "carbsG": 58,
        "fatG": 44,
        "servingSize": "1 burger"
      },
      {
        "id": "wb3",
        "name": "Patty Melt",
        "calories": 620,
        "proteinG": 26,
        "carbsG": 47,
        "fatG": 34,
        "servingSize": "1 sandwich"
      },
      {
        "id": "wb4",
        "name": "Spicy Chicken Sandwich",
        "calories": 530,
        "proteinG": 24,
        "carbsG": 54,
        "fatG": 22,
        "servingSize": "1 sandwich"
      },
      {
        "id": "wb5",
        "name": "Grilled Chicken Sandwich",
        "calories": 400,
        "proteinG": 31,
        "carbsG": 45,
        "fatG": 9,
        "servingSize": "1 sandwich",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "wb6",
        "name": "Honey Butter Chicken Biscuit",
        "calories": 550,
        "proteinG": 22,
        "carbsG": 52,
        "fatG": 28,
        "servingSize": "1 biscuit"
      },
      {
        "id": "wb7",
        "name": "French Fries Medium",
        "calories": 330,
        "proteinG": 4,
        "carbsG": 43,
        "fatG": 16,
        "servingSize": "medium"
      },
      {
        "id": "wb8",
        "name": "Apple & Cranberry Chicken Salad",
        "calories": 410,
        "proteinG": 31,
        "carbsG": 32,
        "fatG": 18,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "wb9",
        "name": "Breakfast on a Bun",
        "calories": 360,
        "proteinG": 18,
        "carbsG": 29,
        "fatG": 19,
        "servingSize": "1 sandwich"
      },
      {
        "id": "wb10",
        "name": "Chocolate Shake Medium",
        "calories": 580,
        "proteinG": 14,
        "carbsG": 87,
        "fatG": 18,
        "servingSize": "medium"
      }
    ]
  },
  {
    "id": "raisingcanes",
    "name": "Raising Cane's",
    "category": "Fast Food",
    "emoji": "🐓",
    "items": [
      {
        "id": "rc1",
        "name": "3 Finger Combo",
        "calories": 510,
        "proteinG": 37,
        "carbsG": 46,
        "fatG": 18,
        "servingSize": "1 combo"
      },
      {
        "id": "rc2",
        "name": "4 Finger Combo",
        "calories": 590,
        "proteinG": 46,
        "carbsG": 50,
        "fatG": 20,
        "servingSize": "1 combo",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rc3",
        "name": "The Box Combo",
        "calories": 720,
        "proteinG": 52,
        "carbsG": 68,
        "fatG": 26,
        "servingSize": "1 combo",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rc4",
        "name": "Chicken Sandwich Combo",
        "calories": 750,
        "proteinG": 44,
        "carbsG": 68,
        "fatG": 30,
        "servingSize": "1 combo"
      },
      {
        "id": "rc5",
        "name": "Caniac Combo",
        "calories": 1000,
        "proteinG": 66,
        "carbsG": 90,
        "fatG": 38,
        "servingSize": "1 combo"
      },
      {
        "id": "rc6",
        "name": "Chicken Fingers 3pc",
        "calories": 310,
        "proteinG": 36,
        "carbsG": 12,
        "fatG": 12,
        "servingSize": "3 fingers",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rc7",
        "name": "Crinkle-Cut Fries",
        "calories": 320,
        "proteinG": 4,
        "carbsG": 48,
        "fatG": 14,
        "servingSize": "1 order"
      },
      {
        "id": "rc8",
        "name": "Cane's Sauce",
        "calories": 190,
        "proteinG": 0,
        "carbsG": 4,
        "fatG": 19,
        "servingSize": "1.5 oz"
      },
      {
        "id": "rc9",
        "name": "Coleslaw",
        "calories": 150,
        "proteinG": 1,
        "carbsG": 20,
        "fatG": 8,
        "servingSize": "1 side"
      },
      {
        "id": "rc10",
        "name": "Lemonade",
        "calories": 190,
        "proteinG": 0,
        "carbsG": 50,
        "fatG": 0,
        "servingSize": "22 oz"
      }
    ]
  },
  {
    "id": "panera",
    "name": "Panera Bread",
    "category": "Fast Casual",
    "emoji": "🥖",
    "items": [
      {
        "id": "pa1",
        "name": "You Pick Two",
        "calories": 600,
        "proteinG": 30,
        "carbsG": 68,
        "fatG": 22,
        "servingSize": "1 combo"
      },
      {
        "id": "pa2",
        "name": "Fuji Apple Chicken Salad",
        "calories": 570,
        "proteinG": 30,
        "carbsG": 56,
        "fatG": 26,
        "servingSize": "1 full salad"
      },
      {
        "id": "pa3",
        "name": "Modern Greek Salad w/ Chicken",
        "calories": 380,
        "proteinG": 38,
        "carbsG": 20,
        "fatG": 16,
        "servingSize": "1 full salad",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "pa4",
        "name": "Turkey Bravo Sandwich",
        "calories": 680,
        "proteinG": 42,
        "carbsG": 72,
        "fatG": 22,
        "servingSize": "1 whole"
      },
      {
        "id": "pa5",
        "name": "Bacon Turkey Bravo",
        "calories": 700,
        "proteinG": 44,
        "carbsG": 70,
        "fatG": 24,
        "servingSize": "1 whole"
      },
      {
        "id": "pa6",
        "name": "Broccoli Cheddar Soup Bowl",
        "calories": 360,
        "proteinG": 14,
        "carbsG": 36,
        "fatG": 18,
        "servingSize": "12 oz",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pa7",
        "name": "Chicken Noodle Soup",
        "calories": 130,
        "proteinG": 9,
        "carbsG": 14,
        "fatG": 3,
        "servingSize": "12 oz",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "pa8",
        "name": "Plain Bagel",
        "calories": 290,
        "proteinG": 11,
        "carbsG": 57,
        "fatG": 1,
        "servingSize": "1 bagel",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pa9",
        "name": "Steel Cut Oatmeal",
        "calories": 210,
        "proteinG": 7,
        "carbsG": 42,
        "fatG": 3,
        "servingSize": "1 bowl",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "pa10",
        "name": "Pecan Braid",
        "calories": 440,
        "proteinG": 5,
        "carbsG": 61,
        "fatG": 19,
        "servingSize": "1 piece",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "subway",
    "name": "Subway",
    "category": "Fast Casual",
    "emoji": "🥙",
    "items": [
      {
        "id": "su1",
        "name": "Rotisserie Chicken 6\"",
        "calories": 350,
        "proteinG": 32,
        "carbsG": 40,
        "fatG": 9,
        "servingSize": "6 inch",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "su2",
        "name": "Turkey Breast 6\"",
        "calories": 280,
        "proteinG": 22,
        "carbsG": 40,
        "fatG": 5,
        "servingSize": "6 inch",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "su3",
        "name": "Steak & Cheese 6\"",
        "calories": 380,
        "proteinG": 26,
        "carbsG": 42,
        "fatG": 13,
        "servingSize": "6 inch"
      },
      {
        "id": "su4",
        "name": "Italian BMT 6\"",
        "calories": 400,
        "proteinG": 21,
        "carbsG": 42,
        "fatG": 16,
        "servingSize": "6 inch"
      },
      {
        "id": "su5",
        "name": "Veggie Delite 6\"",
        "calories": 230,
        "proteinG": 9,
        "carbsG": 43,
        "fatG": 4,
        "servingSize": "6 inch",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "su6",
        "name": "Tuna 6\"",
        "calories": 430,
        "proteinG": 20,
        "carbsG": 41,
        "fatG": 21,
        "servingSize": "6 inch"
      },
      {
        "id": "su7",
        "name": "Meatball Marinara 6\"",
        "calories": 480,
        "proteinG": 23,
        "carbsG": 58,
        "fatG": 16,
        "servingSize": "6 inch"
      },
      {
        "id": "su8",
        "name": "Spicy Italian 6\"",
        "calories": 500,
        "proteinG": 23,
        "carbsG": 41,
        "fatG": 26,
        "servingSize": "6 inch"
      },
      {
        "id": "su9",
        "name": "Chicken Caesar Wrap",
        "calories": 560,
        "proteinG": 34,
        "carbsG": 52,
        "fatG": 22,
        "servingSize": "1 wrap",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "su10",
        "name": "Footlong Turkey Breast",
        "calories": 560,
        "proteinG": 44,
        "carbsG": 80,
        "fatG": 10,
        "servingSize": "12 inch"
      }
    ]
  },
  {
    "id": "pandaexpress",
    "name": "Panda Express",
    "category": "Chinese",
    "emoji": "🐼",
    "items": [
      {
        "id": "pe1",
        "name": "Orange Chicken",
        "calories": 490,
        "proteinG": 25,
        "carbsG": 51,
        "fatG": 22,
        "servingSize": "1 serving"
      },
      {
        "id": "pe2",
        "name": "Kung Pao Chicken",
        "calories": 320,
        "proteinG": 28,
        "carbsG": 22,
        "fatG": 13,
        "servingSize": "1 serving",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "pe3",
        "name": "Broccoli Beef",
        "calories": 150,
        "proteinG": 9,
        "carbsG": 13,
        "fatG": 7,
        "servingSize": "1 serving",
        "tags": ["low-cal", "gluten-free"]
      },
      {
        "id": "pe4",
        "name": "Grilled Teriyaki Chicken",
        "calories": 275,
        "proteinG": 38,
        "carbsG": 13,
        "fatG": 8,
        "servingSize": "1 serving",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "pe5",
        "name": "String Bean Chicken Breast",
        "calories": 190,
        "proteinG": 14,
        "carbsG": 14,
        "fatG": 9,
        "servingSize": "1 serving",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "pe6",
        "name": "Honey Sesame Chicken",
        "calories": 420,
        "proteinG": 19,
        "carbsG": 41,
        "fatG": 20,
        "servingSize": "1 serving"
      },
      {
        "id": "pe7",
        "name": "Fried Rice",
        "calories": 530,
        "proteinG": 11,
        "carbsG": 82,
        "fatG": 16,
        "servingSize": "1 serving"
      },
      {
        "id": "pe8",
        "name": "Chow Mein",
        "calories": 490,
        "proteinG": 13,
        "carbsG": 79,
        "fatG": 14,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pe9",
        "name": "Mixed Vegetables",
        "calories": 70,
        "proteinG": 4,
        "carbsG": 13,
        "fatG": 0,
        "servingSize": "1 serving",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "pe10",
        "name": "Shanghai Angus Steak",
        "calories": 210,
        "proteinG": 19,
        "carbsG": 12,
        "fatG": 10,
        "servingSize": "1 serving"
      }
    ]
  },
  {
    "id": "inout",
    "name": "In-N-Out Burger",
    "category": "Fast Food",
    "emoji": "🍔",
    "items": [
      {
        "id": "io1",
        "name": "Single Hamburger",
        "calories": 480,
        "proteinG": 22,
        "carbsG": 39,
        "fatG": 27,
        "servingSize": "1 burger"
      },
      {
        "id": "io2",
        "name": "Double-Double",
        "calories": 670,
        "proteinG": 37,
        "carbsG": 40,
        "fatG": 41,
        "servingSize": "1 burger"
      },
      {
        "id": "io3",
        "name": "Cheeseburger",
        "calories": 480,
        "proteinG": 22,
        "carbsG": 39,
        "fatG": 27,
        "servingSize": "1 burger"
      },
      {
        "id": "io4",
        "name": "Animal Style Burger",
        "calories": 750,
        "proteinG": 38,
        "carbsG": 44,
        "fatG": 48,
        "servingSize": "1 burger"
      },
      {
        "id": "io5",
        "name": "Protein Style Burger",
        "calories": 330,
        "proteinG": 18,
        "carbsG": 11,
        "fatG": 25,
        "servingSize": "1 burger",
        "tags": ["low-cal", "gluten-free"]
      },
      {
        "id": "io6",
        "name": "French Fries",
        "calories": 395,
        "proteinG": 7,
        "carbsG": 54,
        "fatG": 18,
        "servingSize": "1 order"
      },
      {
        "id": "io7",
        "name": "Animal Style Fries",
        "calories": 650,
        "proteinG": 18,
        "carbsG": 56,
        "fatG": 40,
        "servingSize": "1 order"
      },
      {
        "id": "io8",
        "name": "Chocolate Shake",
        "calories": 590,
        "proteinG": 9,
        "carbsG": 82,
        "fatG": 24,
        "servingSize": "15 oz",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "io9",
        "name": "Lemonade",
        "calories": 180,
        "proteinG": 0,
        "carbsG": 47,
        "fatG": 0,
        "servingSize": "16 oz"
      }
    ]
  },
  {
    "id": "fiveguys",
    "name": "Five Guys",
    "category": "Fast Food",
    "emoji": "🍟",
    "items": [
      {
        "id": "fg1",
        "name": "Little Hamburger",
        "calories": 480,
        "proteinG": 22,
        "carbsG": 40,
        "fatG": 26,
        "servingSize": "1 burger"
      },
      {
        "id": "fg2",
        "name": "Hamburger",
        "calories": 700,
        "proteinG": 40,
        "carbsG": 40,
        "fatG": 43,
        "servingSize": "1 burger"
      },
      {
        "id": "fg3",
        "name": "Little Cheeseburger",
        "calories": 530,
        "proteinG": 26,
        "carbsG": 40,
        "fatG": 30,
        "servingSize": "1 burger"
      },
      {
        "id": "fg4",
        "name": "Bacon Cheeseburger",
        "calories": 920,
        "proteinG": 52,
        "carbsG": 40,
        "fatG": 62,
        "servingSize": "1 burger"
      },
      {
        "id": "fg5",
        "name": "Grilled Cheese Sandwich",
        "calories": 430,
        "proteinG": 18,
        "carbsG": 41,
        "fatG": 23,
        "servingSize": "1 sandwich",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fg6",
        "name": "Little Bacon Burger",
        "calories": 590,
        "proteinG": 30,
        "carbsG": 40,
        "fatG": 33,
        "servingSize": "1 burger"
      },
      {
        "id": "fg7",
        "name": "Regular Fries",
        "calories": 953,
        "proteinG": 13,
        "carbsG": 119,
        "fatG": 41,
        "servingSize": "1 order"
      },
      {
        "id": "fg8",
        "name": "Cajun Fries",
        "calories": 953,
        "proteinG": 13,
        "carbsG": 119,
        "fatG": 41,
        "servingSize": "1 order"
      },
      {
        "id": "fg9",
        "name": "Milkshake",
        "calories": 560,
        "proteinG": 12,
        "carbsG": 88,
        "fatG": 18,
        "servingSize": "1 shake",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "shakeshack",
    "name": "Shake Shack",
    "category": "Fast Casual",
    "emoji": "🥤",
    "items": [
      {
        "id": "ss1",
        "name": "ShackBurger",
        "calories": 530,
        "proteinG": 24,
        "carbsG": 40,
        "fatG": 30,
        "servingSize": "1 burger"
      },
      {
        "id": "ss2",
        "name": "SmokeShack",
        "calories": 580,
        "proteinG": 27,
        "carbsG": 41,
        "fatG": 33,
        "servingSize": "1 burger"
      },
      {
        "id": "ss3",
        "name": "Double ShackBurger",
        "calories": 760,
        "proteinG": 41,
        "carbsG": 40,
        "fatG": 46,
        "servingSize": "1 burger"
      },
      {
        "id": "ss4",
        "name": "Chick'n Shack",
        "calories": 490,
        "proteinG": 30,
        "carbsG": 40,
        "fatG": 22,
        "servingSize": "1 sandwich"
      },
      {
        "id": "ss5",
        "name": "Crispy Chick'n Shack",
        "calories": 590,
        "proteinG": 28,
        "carbsG": 52,
        "fatG": 26,
        "servingSize": "1 sandwich"
      },
      {
        "id": "ss6",
        "name": "Veggie Shack",
        "calories": 430,
        "proteinG": 18,
        "carbsG": 45,
        "fatG": 21,
        "servingSize": "1 burger",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ss7",
        "name": "Shack Stack",
        "calories": 780,
        "proteinG": 40,
        "carbsG": 42,
        "fatG": 47,
        "servingSize": "1 burger"
      },
      {
        "id": "ss8",
        "name": "Crinkle Cut Fries",
        "calories": 420,
        "proteinG": 6,
        "carbsG": 53,
        "fatG": 19,
        "servingSize": "1 order"
      },
      {
        "id": "ss9",
        "name": "Cheese Fries",
        "calories": 530,
        "proteinG": 13,
        "carbsG": 54,
        "fatG": 29,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ss10",
        "name": "Vanilla Shake",
        "calories": 610,
        "proteinG": 12,
        "carbsG": 89,
        "fatG": 24,
        "servingSize": "1 shake",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "wingstop",
    "name": "Wingstop",
    "category": "Wings",
    "emoji": "🍗",
    "items": [
      {
        "id": "wig1",
        "name": "Classic Wings 10pc",
        "calories": 720,
        "proteinG": 66,
        "carbsG": 12,
        "fatG": 46,
        "servingSize": "10 wings",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "wig2",
        "name": "Boneless Wings 10pc",
        "calories": 640,
        "proteinG": 44,
        "carbsG": 52,
        "fatG": 26,
        "servingSize": "10 wings"
      },
      {
        "id": "wig3",
        "name": "Lemon Pepper Wings 10pc",
        "calories": 810,
        "proteinG": 68,
        "carbsG": 14,
        "fatG": 52,
        "servingSize": "10 wings",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "wig4",
        "name": "Louisiana Rub Wings 10pc",
        "calories": 720,
        "proteinG": 66,
        "carbsG": 14,
        "fatG": 46,
        "servingSize": "10 wings",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "wig5",
        "name": "Mango Habanero Wings 10pc",
        "calories": 730,
        "proteinG": 66,
        "carbsG": 22,
        "fatG": 46,
        "servingSize": "10 wings"
      },
      {
        "id": "wig6",
        "name": "Garlic Parmesan Wings 10pc",
        "calories": 840,
        "proteinG": 66,
        "carbsG": 14,
        "fatG": 60,
        "servingSize": "10 wings",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "wig7",
        "name": "Seasoned Fries",
        "calories": 310,
        "proteinG": 5,
        "carbsG": 44,
        "fatG": 13,
        "servingSize": "1 order"
      },
      {
        "id": "wig8",
        "name": "Cajun Fries",
        "calories": 310,
        "proteinG": 5,
        "carbsG": 44,
        "fatG": 13,
        "servingSize": "1 order"
      },
      {
        "id": "wig9",
        "name": "Veggie Sticks",
        "calories": 50,
        "proteinG": 1,
        "carbsG": 10,
        "fatG": 1,
        "servingSize": "1 order",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "wig10",
        "name": "Ranch Dip",
        "calories": 110,
        "proteinG": 1,
        "carbsG": 1,
        "fatG": 12,
        "servingSize": "1 oz"
      }
    ]
  },
  {
    "id": "popeyes",
    "name": "Popeyes",
    "category": "Fast Food",
    "emoji": "🐓",
    "items": [
      {
        "id": "pop1",
        "name": "Chicken Sandwich",
        "calories": 700,
        "proteinG": 38,
        "carbsG": 50,
        "fatG": 42,
        "servingSize": "1 sandwich"
      },
      {
        "id": "pop2",
        "name": "Spicy Chicken Sandwich",
        "calories": 700,
        "proteinG": 38,
        "carbsG": 50,
        "fatG": 42,
        "servingSize": "1 sandwich"
      },
      {
        "id": "pop3",
        "name": "3pc Signature Chicken",
        "calories": 490,
        "proteinG": 38,
        "carbsG": 13,
        "fatG": 33,
        "servingSize": "3 piece",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pop4",
        "name": "Blackened Chicken Tenders",
        "calories": 280,
        "proteinG": 32,
        "carbsG": 8,
        "fatG": 13,
        "servingSize": "3 tenders",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "pop5",
        "name": "Red Beans & Rice",
        "calories": 230,
        "proteinG": 8,
        "carbsG": 34,
        "fatG": 7,
        "servingSize": "1 regular",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pop6",
        "name": "Cajun Fries",
        "calories": 270,
        "proteinG": 4,
        "carbsG": 34,
        "fatG": 13,
        "servingSize": "regular"
      },
      {
        "id": "pop7",
        "name": "Coleslaw",
        "calories": 200,
        "proteinG": 1,
        "carbsG": 22,
        "fatG": 12,
        "servingSize": "regular",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pop8",
        "name": "Mac & Cheese",
        "calories": 230,
        "proteinG": 9,
        "carbsG": 22,
        "fatG": 12,
        "servingSize": "regular",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pop9",
        "name": "Mashed Potatoes w/ Cajun Gravy",
        "calories": 120,
        "proteinG": 2,
        "carbsG": 19,
        "fatG": 4,
        "servingSize": "regular",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "cava",
    "name": "CAVA",
    "category": "Mediterranean",
    "emoji": "🥙",
    "items": [
      {
        "id": "cv1",
        "name": "Grain Bowl - Chicken",
        "calories": 620,
        "proteinG": 48,
        "carbsG": 62,
        "fatG": 18,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "cv2",
        "name": "Grain Bowl - Falafel",
        "calories": 580,
        "proteinG": 22,
        "carbsG": 72,
        "fatG": 22,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "cv3",
        "name": "Pita - Chicken",
        "calories": 680,
        "proteinG": 44,
        "carbsG": 74,
        "fatG": 20,
        "servingSize": "1 pita",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "cv4",
        "name": "Greens & Grains - Chicken",
        "calories": 540,
        "proteinG": 46,
        "carbsG": 48,
        "fatG": 18,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "cv5",
        "name": "Hummus Base",
        "calories": 390,
        "proteinG": 14,
        "carbsG": 52,
        "fatG": 16,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "cv6",
        "name": "Tzatziki Salad",
        "calories": 290,
        "proteinG": 14,
        "carbsG": 18,
        "fatG": 18,
        "servingSize": "1 salad",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "cv7",
        "name": "Lemon Chicken Soup",
        "calories": 160,
        "proteinG": 12,
        "carbsG": 14,
        "fatG": 6,
        "servingSize": "12 oz",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "cv8",
        "name": "Pita Bread",
        "calories": 270,
        "proteinG": 9,
        "carbsG": 52,
        "fatG": 4,
        "servingSize": "1 pita",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "truefd",
    "name": "True Food Kitchen",
    "category": "Healthy",
    "emoji": "🌿",
    "items": [
      {
        "id": "tf1",
        "name": "Tuscan Kale Salad",
        "calories": 310,
        "proteinG": 12,
        "carbsG": 34,
        "fatG": 16,
        "servingSize": "1 salad",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "tf2",
        "name": "Chicken Tikka Masala Bowl",
        "calories": 540,
        "proteinG": 42,
        "carbsG": 58,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "tf3",
        "name": "Ancient Grains Bowl",
        "calories": 480,
        "proteinG": 18,
        "carbsG": 72,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "tf4",
        "name": "Spaghetti Squash Casserole",
        "calories": 380,
        "proteinG": 16,
        "carbsG": 52,
        "fatG": 14,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "tf5",
        "name": "Edamame Dumplings",
        "calories": 240,
        "proteinG": 12,
        "carbsG": 36,
        "fatG": 6,
        "servingSize": "6 dumplings",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "tf6",
        "name": "Grass-Fed Burger",
        "calories": 680,
        "proteinG": 44,
        "carbsG": 48,
        "fatG": 32,
        "servingSize": "1 burger"
      },
      {
        "id": "tf7",
        "name": "Squash Pie",
        "calories": 420,
        "proteinG": 6,
        "carbsG": 68,
        "fatG": 14,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "tf8",
        "name": "Inside Out Quinoa",
        "calories": 430,
        "proteinG": 18,
        "carbsG": 60,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      }
    ]
  },
  {
    "id": "flowerchild",
    "name": "Flower Child",
    "category": "Healthy",
    "emoji": "🌸",
    "items": [
      {
        "id": "fc1",
        "name": "Happy Belly Bowl",
        "calories": 520,
        "proteinG": 22,
        "carbsG": 68,
        "fatG": 18,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "fc2",
        "name": "Harvest Protein Bowl",
        "calories": 580,
        "proteinG": 42,
        "carbsG": 54,
        "fatG": 18,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "fc3",
        "name": "Moroccan Spiced Chicken",
        "calories": 460,
        "proteinG": 46,
        "carbsG": 34,
        "fatG": 16,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "fc4",
        "name": "Whole Life Bowl",
        "calories": 490,
        "proteinG": 16,
        "carbsG": 72,
        "fatG": 16,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "fc5",
        "name": "Roasted Veggie Bowl",
        "calories": 380,
        "proteinG": 12,
        "carbsG": 56,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "fc6",
        "name": "Organic Chicken Sandwich",
        "calories": 540,
        "proteinG": 42,
        "carbsG": 48,
        "fatG": 16,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "fc7",
        "name": "Gluten-Free Brownie",
        "calories": 340,
        "proteinG": 4,
        "carbsG": 48,
        "fatG": 14,
        "servingSize": "1 brownie",
        "tags": ["gluten-free", "vegetarian"]
      },
      {
        "id": "fc8",
        "name": "Almond Butter Toast",
        "calories": 360,
        "proteinG": 12,
        "carbsG": 40,
        "fatG": 18,
        "servingSize": "2 slices",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "jasonsdeli",
    "name": "Jason's Deli",
    "category": "Deli",
    "emoji": "🥪",
    "items": [
      {
        "id": "jd1",
        "name": "Turkey Muffaletta",
        "calories": 720,
        "proteinG": 40,
        "carbsG": 74,
        "fatG": 26,
        "servingSize": "1 whole"
      },
      {
        "id": "jd2",
        "name": "Club Royale",
        "calories": 680,
        "proteinG": 38,
        "carbsG": 70,
        "fatG": 24,
        "servingSize": "1 whole"
      },
      {
        "id": "jd3",
        "name": "Grilled Chicken Pesto",
        "calories": 560,
        "proteinG": 44,
        "carbsG": 52,
        "fatG": 16,
        "servingSize": "1 whole",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "jd4",
        "name": "Nutty Fruity Chicken Salad",
        "calories": 640,
        "proteinG": 32,
        "carbsG": 60,
        "fatG": 28,
        "servingSize": "1 salad"
      },
      {
        "id": "jd5",
        "name": "Fresh Fruit Salad",
        "calories": 110,
        "proteinG": 2,
        "carbsG": 27,
        "fatG": 1,
        "servingSize": "1 cup",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "jd6",
        "name": "Tomato Basil Soup",
        "calories": 180,
        "proteinG": 4,
        "carbsG": 24,
        "fatG": 8,
        "servingSize": "1 cup",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "jd7",
        "name": "Veggie Wrap",
        "calories": 490,
        "proteinG": 14,
        "carbsG": 70,
        "fatG": 18,
        "servingSize": "1 wrap",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "jd8",
        "name": "Spud to the Max",
        "calories": 680,
        "proteinG": 24,
        "carbsG": 90,
        "fatG": 24,
        "servingSize": "1 spud",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "mcalisters",
    "name": "McAlister's Deli",
    "category": "Deli",
    "emoji": "🥗",
    "items": [
      {
        "id": "ma1",
        "name": "Club Max Sandwich",
        "calories": 720,
        "proteinG": 42,
        "carbsG": 72,
        "fatG": 26,
        "servingSize": "1 sandwich"
      },
      {
        "id": "ma2",
        "name": "Grilled Chicken Club",
        "calories": 580,
        "proteinG": 46,
        "carbsG": 58,
        "fatG": 18,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ma3",
        "name": "Turkey Bacon Ranch",
        "calories": 660,
        "proteinG": 40,
        "carbsG": 66,
        "fatG": 22,
        "servingSize": "1 sandwich"
      },
      {
        "id": "ma4",
        "name": "Southwest Chicken Salad",
        "calories": 480,
        "proteinG": 36,
        "carbsG": 38,
        "fatG": 20,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "ma5",
        "name": "Chicken Tortilla Soup",
        "calories": 230,
        "proteinG": 16,
        "carbsG": 24,
        "fatG": 8,
        "servingSize": "1 bowl",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "ma6",
        "name": "Baked Potato Soup",
        "calories": 310,
        "proteinG": 10,
        "carbsG": 38,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ma7",
        "name": "Huge Oatmeal Raisin Cookie",
        "calories": 350,
        "proteinG": 5,
        "carbsG": 54,
        "fatG": 14,
        "servingSize": "1 cookie",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ma8",
        "name": "Sweet Tea",
        "calories": 160,
        "proteinG": 0,
        "carbsG": 42,
        "fatG": 0,
        "servingSize": "32 oz"
      }
    ]
  },
  {
    "id": "texasroadhouse",
    "name": "Texas Roadhouse",
    "category": "Steakhouse",
    "emoji": "🥩",
    "items": [
      {
        "id": "txr1",
        "name": "USDA Choice Sirloin 6oz",
        "calories": 250,
        "proteinG": 34,
        "carbsG": 0,
        "fatG": 12,
        "servingSize": "6 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "txr2",
        "name": "Dallas Filet 6oz",
        "calories": 310,
        "proteinG": 40,
        "carbsG": 2,
        "fatG": 14,
        "servingSize": "6 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "txr3",
        "name": "Fall-Off-The-Bone Ribs",
        "calories": 1160,
        "proteinG": 66,
        "carbsG": 26,
        "fatG": 88,
        "servingSize": "full rack"
      },
      {
        "id": "txr4",
        "name": "Grilled Chicken",
        "calories": 210,
        "proteinG": 36,
        "carbsG": 2,
        "fatG": 7,
        "servingSize": "8 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "txr5",
        "name": "Country Fried Chicken",
        "calories": 740,
        "proteinG": 32,
        "carbsG": 78,
        "fatG": 32,
        "servingSize": "1 plate"
      },
      {
        "id": "txr6",
        "name": "Loaded Sweet Potato",
        "calories": 420,
        "proteinG": 5,
        "carbsG": 76,
        "fatG": 12,
        "servingSize": "1 potato",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "txr7",
        "name": "House Salad",
        "calories": 170,
        "proteinG": 6,
        "carbsG": 16,
        "fatG": 10,
        "servingSize": "1 salad",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "txr8",
        "name": "Fresh-Baked Bread",
        "calories": 250,
        "proteinG": 7,
        "carbsG": 48,
        "fatG": 3,
        "servingSize": "2 rolls",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "txr9",
        "name": "Portobello Mushroom Chicken",
        "calories": 350,
        "proteinG": 44,
        "carbsG": 10,
        "fatG": 15,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "txr10",
        "name": "Strawberry Cheesecake",
        "calories": 490,
        "proteinG": 6,
        "carbsG": 66,
        "fatG": 22,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "saltgrass",
    "name": "Saltgrass Steakhouse",
    "category": "Steakhouse",
    "emoji": "🤠",
    "items": [
      {
        "id": "sg1",
        "name": "8oz Filet Mignon",
        "calories": 420,
        "proteinG": 54,
        "carbsG": 0,
        "fatG": 22,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sg2",
        "name": "12oz Ribeye",
        "calories": 680,
        "proteinG": 62,
        "carbsG": 0,
        "fatG": 46,
        "servingSize": "12 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sg3",
        "name": "Grilled Salmon",
        "calories": 380,
        "proteinG": 48,
        "carbsG": 0,
        "fatG": 20,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sg4",
        "name": "Chicken Fried Steak",
        "calories": 960,
        "proteinG": 34,
        "carbsG": 76,
        "fatG": 60,
        "servingSize": "1 plate"
      },
      {
        "id": "sg5",
        "name": "Texas Red Chili",
        "calories": 420,
        "proteinG": 28,
        "carbsG": 36,
        "fatG": 18,
        "servingSize": "1 bowl"
      },
      {
        "id": "sg6",
        "name": "Loaded Baked Potato",
        "calories": 480,
        "proteinG": 12,
        "carbsG": 68,
        "fatG": 20,
        "servingSize": "1 potato",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sg7",
        "name": "Caesar Salad",
        "calories": 320,
        "proteinG": 10,
        "carbsG": 22,
        "fatG": 22,
        "servingSize": "1 salad",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sg8",
        "name": "Butter Cake",
        "calories": 560,
        "proteinG": 6,
        "carbsG": 76,
        "fatG": 26,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "bww",
    "name": "Buffalo Wild Wings",
    "category": "Wings",
    "emoji": "🏈",
    "items": [
      {
        "id": "bww1",
        "name": "Traditional Wings 9pc",
        "calories": 720,
        "proteinG": 66,
        "carbsG": 12,
        "fatG": 46,
        "servingSize": "9 wings",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "bww2",
        "name": "Boneless Wings 9pc",
        "calories": 720,
        "proteinG": 42,
        "carbsG": 60,
        "fatG": 24,
        "servingSize": "9 wings"
      },
      {
        "id": "bww3",
        "name": "Mozzarella Sticks",
        "calories": 740,
        "proteinG": 24,
        "carbsG": 66,
        "fatG": 40,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bww4",
        "name": "Southwest Pork Tacos",
        "calories": 640,
        "proteinG": 34,
        "carbsG": 68,
        "fatG": 22,
        "servingSize": "3 tacos"
      },
      {
        "id": "bww5",
        "name": "Chicken Nachos",
        "calories": 860,
        "proteinG": 38,
        "carbsG": 78,
        "fatG": 42,
        "servingSize": "1 order"
      },
      {
        "id": "bww6",
        "name": "Garden Salad",
        "calories": 210,
        "proteinG": 6,
        "carbsG": 18,
        "fatG": 12,
        "servingSize": "1 salad",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "bww7",
        "name": "Beer Cheese Bacon Burger",
        "calories": 920,
        "proteinG": 48,
        "carbsG": 58,
        "fatG": 54,
        "servingSize": "1 burger"
      },
      {
        "id": "bww8",
        "name": "Seasoned Fries",
        "calories": 340,
        "proteinG": 5,
        "carbsG": 46,
        "fatG": 15,
        "servingSize": "regular"
      },
      {
        "id": "bww9",
        "name": "Cauliflower Wings",
        "calories": 590,
        "proteinG": 10,
        "carbsG": 68,
        "fatG": 32,
        "servingSize": "9 pieces",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "chilis",
    "name": "Chili's Grill & Bar",
    "category": "American",
    "emoji": "🌶️",
    "items": [
      {
        "id": "cl1",
        "name": "3 for Me Combo",
        "calories": 820,
        "proteinG": 38,
        "carbsG": 88,
        "fatG": 28,
        "servingSize": "1 combo"
      },
      {
        "id": "cl2",
        "name": "Original Chicken Crispers",
        "calories": 1360,
        "proteinG": 52,
        "carbsG": 112,
        "fatG": 72,
        "servingSize": "1 plate"
      },
      {
        "id": "cl3",
        "name": "Grilled Chicken Salad",
        "calories": 430,
        "proteinG": 38,
        "carbsG": 36,
        "fatG": 16,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "cl4",
        "name": "Guiltless Grill Salmon",
        "calories": 480,
        "proteinG": 52,
        "carbsG": 22,
        "fatG": 18,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "cl5",
        "name": "Classic Sirloin 6oz",
        "calories": 250,
        "proteinG": 30,
        "carbsG": 4,
        "fatG": 12,
        "servingSize": "6 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "cl6",
        "name": "Margarita Chicken",
        "calories": 380,
        "proteinG": 46,
        "carbsG": 18,
        "fatG": 12,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "cl7",
        "name": "Cajun Chicken Pasta",
        "calories": 1260,
        "proteinG": 50,
        "carbsG": 118,
        "fatG": 58,
        "servingSize": "1 plate"
      },
      {
        "id": "cl8",
        "name": "Skillet Queso",
        "calories": 480,
        "proteinG": 18,
        "carbsG": 28,
        "fatG": 32,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cl9",
        "name": "Molten Choco Cake",
        "calories": 940,
        "proteinG": 12,
        "carbsG": 120,
        "fatG": 44,
        "servingSize": "1 dessert",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cl10",
        "name": "Baby Back Ribs Half Rack",
        "calories": 650,
        "proteinG": 42,
        "carbsG": 44,
        "fatG": 32,
        "servingSize": "half rack"
      }
    ]
  },
  {
    "id": "mcdonalds",
    "name": "McDonald's",
    "category": "Fast Food",
    "emoji": "🍟",
    "items": [
      {
        "id": "mc1",
        "name": "Big Mac",
        "calories": 563,
        "proteinG": 26,
        "carbsG": 45,
        "fatG": 33,
        "servingSize": "1 burger"
      },
      {
        "id": "mc2",
        "name": "Quarter Pounder w/ Cheese",
        "calories": 740,
        "proteinG": 42,
        "carbsG": 43,
        "fatG": 44,
        "servingSize": "1 burger"
      },
      {
        "id": "mc3",
        "name": "McDouble",
        "calories": 400,
        "proteinG": 22,
        "carbsG": 34,
        "fatG": 19,
        "servingSize": "1 burger"
      },
      {
        "id": "mc4",
        "name": "Filet-O-Fish",
        "calories": 390,
        "proteinG": 15,
        "carbsG": 38,
        "fatG": 19,
        "servingSize": "1 sandwich"
      },
      {
        "id": "mc5",
        "name": "McChicken",
        "calories": 400,
        "proteinG": 15,
        "carbsG": 44,
        "fatG": 17,
        "servingSize": "1 sandwich"
      },
      {
        "id": "mc6",
        "name": "Egg McMuffin",
        "calories": 310,
        "proteinG": 17,
        "carbsG": 30,
        "fatG": 13,
        "servingSize": "1 sandwich"
      },
      {
        "id": "mc7",
        "name": "Sausage Burrito",
        "calories": 300,
        "proteinG": 12,
        "carbsG": 26,
        "fatG": 16,
        "servingSize": "1 burrito"
      },
      {
        "id": "mc8",
        "name": "Side Salad",
        "calories": 20,
        "proteinG": 1,
        "carbsG": 3,
        "fatG": 0,
        "servingSize": "1 salad",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "mc9",
        "name": "Medium Fries",
        "calories": 320,
        "proteinG": 4,
        "carbsG": 43,
        "fatG": 15,
        "servingSize": "medium"
      },
      {
        "id": "mc10",
        "name": "McFlurry Oreo",
        "calories": 510,
        "proteinG": 12,
        "carbsG": 80,
        "fatG": 15,
        "servingSize": "1 medium",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "tacobell",
    "name": "Taco Bell",
    "category": "Fast Food",
    "emoji": "🔔",
    "items": [
      {
        "id": "tb1",
        "name": "Crunchwrap Supreme",
        "calories": 520,
        "proteinG": 17,
        "carbsG": 65,
        "fatG": 21,
        "servingSize": "1 wrap"
      },
      {
        "id": "tb2",
        "name": "Chalupa Supreme - Chicken",
        "calories": 360,
        "proteinG": 16,
        "carbsG": 36,
        "fatG": 17,
        "servingSize": "1 chalupa"
      },
      {
        "id": "tb3",
        "name": "Quesarito - Chicken",
        "calories": 640,
        "proteinG": 30,
        "carbsG": 60,
        "fatG": 32,
        "servingSize": "1 burrito"
      },
      {
        "id": "tb4",
        "name": "Power Bowl - Chicken",
        "calories": 470,
        "proteinG": 26,
        "carbsG": 50,
        "fatG": 19,
        "servingSize": "1 bowl"
      },
      {
        "id": "tb5",
        "name": "Bean Burrito",
        "calories": 350,
        "proteinG": 14,
        "carbsG": 55,
        "fatG": 9,
        "servingSize": "1 burrito",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "tb6",
        "name": "Crunchy Taco",
        "calories": 170,
        "proteinG": 8,
        "carbsG": 13,
        "fatG": 10,
        "servingSize": "1 taco"
      },
      {
        "id": "tb7",
        "name": "Doritos Locos Taco",
        "calories": 170,
        "proteinG": 8,
        "carbsG": 14,
        "fatG": 10,
        "servingSize": "1 taco"
      },
      {
        "id": "tb8",
        "name": "Nachos BellGrande",
        "calories": 740,
        "proteinG": 19,
        "carbsG": 84,
        "fatG": 38,
        "servingSize": "1 order"
      },
      {
        "id": "tb9",
        "name": "Mexican Pizza",
        "calories": 700,
        "proteinG": 20,
        "carbsG": 72,
        "fatG": 37,
        "servingSize": "1 pizza"
      },
      {
        "id": "tb10",
        "name": "Cinnabon Delights",
        "calories": 270,
        "proteinG": 4,
        "carbsG": 36,
        "fatG": 12,
        "servingSize": "2 pack",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "wendys",
    "name": "Wendy's",
    "category": "Fast Food",
    "emoji": "🦰",
    "items": [
      {
        "id": "wn1",
        "name": "Dave's Single",
        "calories": 570,
        "proteinG": 30,
        "carbsG": 40,
        "fatG": 30,
        "servingSize": "1 burger"
      },
      {
        "id": "wn2",
        "name": "Dave's Double",
        "calories": 830,
        "proteinG": 51,
        "carbsG": 40,
        "fatG": 48,
        "servingSize": "1 burger"
      },
      {
        "id": "wn3",
        "name": "Spicy Chicken Sandwich",
        "calories": 500,
        "proteinG": 29,
        "carbsG": 49,
        "fatG": 21,
        "servingSize": "1 sandwich"
      },
      {
        "id": "wn4",
        "name": "Grilled Chicken Sandwich",
        "calories": 370,
        "proteinG": 34,
        "carbsG": 36,
        "fatG": 9,
        "servingSize": "1 sandwich",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "wn5",
        "name": "Apple Pecan Chicken Salad Full",
        "calories": 570,
        "proteinG": 38,
        "carbsG": 46,
        "fatG": 24,
        "servingSize": "1 full",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "wn6",
        "name": "Small Chili",
        "calories": 190,
        "proteinG": 15,
        "carbsG": 18,
        "fatG": 6,
        "servingSize": "8 oz",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "wn7",
        "name": "Medium Fries",
        "calories": 340,
        "proteinG": 4,
        "carbsG": 45,
        "fatG": 16,
        "servingSize": "medium"
      },
      {
        "id": "wn8",
        "name": "Frosty Small",
        "calories": 280,
        "proteinG": 7,
        "carbsG": 47,
        "fatG": 7,
        "servingSize": "small",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "wn9",
        "name": "Baconator",
        "calories": 940,
        "proteinG": 58,
        "carbsG": 37,
        "fatG": 61,
        "servingSize": "1 burger"
      },
      {
        "id": "wn10",
        "name": "Side Salad",
        "calories": 25,
        "proteinG": 1,
        "carbsG": 4,
        "fatG": 0,
        "servingSize": "1 salad",
        "tags": ["vegan", "low-cal"]
      }
    ]
  },
  {
    "id": "sonic",
    "name": "Sonic Drive-In",
    "category": "Fast Food",
    "emoji": "⚡",
    "items": [
      {
        "id": "sn1",
        "name": "Sonic Burger",
        "calories": 530,
        "proteinG": 24,
        "carbsG": 42,
        "fatG": 28,
        "servingSize": "1 burger"
      },
      {
        "id": "sn2",
        "name": "SuperSONIC Bacon Cheeseburger",
        "calories": 900,
        "proteinG": 46,
        "carbsG": 48,
        "fatG": 54,
        "servingSize": "1 burger"
      },
      {
        "id": "sn3",
        "name": "Classic Grilled Chicken Sandwich",
        "calories": 430,
        "proteinG": 34,
        "carbsG": 38,
        "fatG": 12,
        "servingSize": "1 sandwich",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "sn4",
        "name": "Corn Dog",
        "calories": 230,
        "proteinG": 7,
        "carbsG": 25,
        "fatG": 11,
        "servingSize": "1 corn dog"
      },
      {
        "id": "sn5",
        "name": "Jr. Breakfast Burrito",
        "calories": 430,
        "proteinG": 22,
        "carbsG": 38,
        "fatG": 21,
        "servingSize": "1 burrito"
      },
      {
        "id": "sn6",
        "name": "Tots Medium",
        "calories": 430,
        "proteinG": 4,
        "carbsG": 48,
        "fatG": 25,
        "servingSize": "medium"
      },
      {
        "id": "sn7",
        "name": "Onion Rings Medium",
        "calories": 440,
        "proteinG": 5,
        "carbsG": 53,
        "fatG": 22,
        "servingSize": "medium",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sn8",
        "name": "Ocean Water",
        "calories": 210,
        "proteinG": 0,
        "carbsG": 54,
        "fatG": 0,
        "servingSize": "20 oz",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "sn9",
        "name": "Master Shake Chocolate Medium",
        "calories": 680,
        "proteinG": 14,
        "carbsG": 102,
        "fatG": 24,
        "servingSize": "medium",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sn10",
        "name": "Banana Split Blast",
        "calories": 640,
        "proteinG": 10,
        "carbsG": 98,
        "fatG": 22,
        "servingSize": "medium",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "dairyqueen",
    "name": "Dairy Queen",
    "category": "Fast Food",
    "emoji": "🍦",
    "items": [
      {
        "id": "dq1",
        "name": "FlameThrower GrillBurger",
        "calories": 880,
        "proteinG": 40,
        "carbsG": 52,
        "fatG": 54,
        "servingSize": "1 burger"
      },
      {
        "id": "dq2",
        "name": "1/4 lb GrillBurger",
        "calories": 590,
        "proteinG": 32,
        "carbsG": 44,
        "fatG": 30,
        "servingSize": "1 burger"
      },
      {
        "id": "dq3",
        "name": "Chicken Strips 3pc",
        "calories": 400,
        "proteinG": 28,
        "carbsG": 28,
        "fatG": 20,
        "servingSize": "3 strips",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "dq4",
        "name": "Grilled Chicken Sandwich",
        "calories": 380,
        "proteinG": 33,
        "carbsG": 38,
        "fatG": 9,
        "servingSize": "1 sandwich",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "dq5",
        "name": "Blizzard Oreo Medium",
        "calories": 660,
        "proteinG": 13,
        "carbsG": 97,
        "fatG": 23,
        "servingSize": "medium",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "dq6",
        "name": "Dipped Cone Small",
        "calories": 340,
        "proteinG": 7,
        "carbsG": 52,
        "fatG": 13,
        "servingSize": "small",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "dq7",
        "name": "Banana Split",
        "calories": 520,
        "proteinG": 9,
        "carbsG": 96,
        "fatG": 13,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "dq8",
        "name": "Onion Rings Medium",
        "calories": 340,
        "proteinG": 5,
        "carbsG": 44,
        "fatG": 16,
        "servingSize": "medium",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "jackinthebox",
    "name": "Jack in the Box",
    "category": "Fast Food",
    "emoji": "🤡",
    "items": [
      {
        "id": "jb1",
        "name": "Jack's Spicy Chicken",
        "calories": 530,
        "proteinG": 25,
        "carbsG": 51,
        "fatG": 25,
        "servingSize": "1 sandwich"
      },
      {
        "id": "jb2",
        "name": "Jumbo Jack",
        "calories": 600,
        "proteinG": 26,
        "carbsG": 46,
        "fatG": 34,
        "servingSize": "1 burger"
      },
      {
        "id": "jb3",
        "name": "Ultimate Cheeseburger",
        "calories": 850,
        "proteinG": 36,
        "carbsG": 50,
        "fatG": 53,
        "servingSize": "1 burger"
      },
      {
        "id": "jb4",
        "name": "Chicken Teriyaki Bowl",
        "calories": 660,
        "proteinG": 28,
        "carbsG": 102,
        "fatG": 12,
        "servingSize": "1 bowl"
      },
      {
        "id": "jb5",
        "name": "Grilled Chicken Salad",
        "calories": 280,
        "proteinG": 28,
        "carbsG": 14,
        "fatG": 12,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "jb6",
        "name": "Breakfast Jack",
        "calories": 350,
        "proteinG": 18,
        "carbsG": 32,
        "fatG": 16,
        "servingSize": "1 sandwich"
      },
      {
        "id": "jb7",
        "name": "Stuffed Jalapeños",
        "calories": 230,
        "proteinG": 7,
        "carbsG": 22,
        "fatG": 13,
        "servingSize": "3 pieces",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "jb8",
        "name": "Egg Rolls",
        "calories": 440,
        "proteinG": 12,
        "carbsG": 42,
        "fatG": 24,
        "servingSize": "3 pieces"
      }
    ]
  },
  {
    "id": "arbys",
    "name": "Arby's",
    "category": "Fast Food",
    "emoji": "🥩",
    "items": [
      {
        "id": "ar1",
        "name": "Classic Roast Beef",
        "calories": 360,
        "proteinG": 23,
        "carbsG": 37,
        "fatG": 14,
        "servingSize": "1 sandwich"
      },
      {
        "id": "ar2",
        "name": "Beef & Cheddar Classic",
        "calories": 450,
        "proteinG": 26,
        "carbsG": 44,
        "fatG": 18,
        "servingSize": "1 sandwich"
      },
      {
        "id": "ar3",
        "name": "Smokehouse Brisket Sandwich",
        "calories": 680,
        "proteinG": 28,
        "carbsG": 59,
        "fatG": 34,
        "servingSize": "1 sandwich"
      },
      {
        "id": "ar4",
        "name": "Crispy Fish Sandwich",
        "calories": 570,
        "proteinG": 23,
        "carbsG": 56,
        "fatG": 28,
        "servingSize": "1 sandwich"
      },
      {
        "id": "ar5",
        "name": "Chicken Pecan Salad",
        "calories": 770,
        "proteinG": 26,
        "carbsG": 63,
        "fatG": 46,
        "servingSize": "1 salad"
      },
      {
        "id": "ar6",
        "name": "Mozzarella Sticks",
        "calories": 430,
        "proteinG": 17,
        "carbsG": 38,
        "fatG": 24,
        "servingSize": "4 sticks",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ar7",
        "name": "Curly Fries Medium",
        "calories": 410,
        "proteinG": 5,
        "carbsG": 52,
        "fatG": 19,
        "servingSize": "medium"
      },
      {
        "id": "ar8",
        "name": "Chocolate Shake Small",
        "calories": 460,
        "proteinG": 11,
        "carbsG": 65,
        "fatG": 17,
        "servingSize": "small",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "pizzahut",
    "name": "Pizza Hut",
    "category": "Pizza",
    "emoji": "🍕",
    "items": [
      {
        "id": "ph1",
        "name": "Cheese Pizza Slice (Lg)",
        "calories": 290,
        "proteinG": 13,
        "carbsG": 36,
        "fatG": 10,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ph2",
        "name": "Pepperoni Pizza Slice (Lg)",
        "calories": 330,
        "proteinG": 14,
        "carbsG": 36,
        "fatG": 14,
        "servingSize": "1 slice"
      },
      {
        "id": "ph3",
        "name": "Meat Lover's Slice (Lg)",
        "calories": 390,
        "proteinG": 18,
        "carbsG": 36,
        "fatG": 18,
        "servingSize": "1 slice"
      },
      {
        "id": "ph4",
        "name": "Veggie Lover's Slice (Lg)",
        "calories": 270,
        "proteinG": 11,
        "carbsG": 36,
        "fatG": 9,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ph5",
        "name": "Supreme Slice (Lg)",
        "calories": 340,
        "proteinG": 14,
        "carbsG": 36,
        "fatG": 14,
        "servingSize": "1 slice"
      },
      {
        "id": "ph6",
        "name": "Wings 6pc Traditional",
        "calories": 460,
        "proteinG": 40,
        "carbsG": 4,
        "fatG": 30,
        "servingSize": "6 wings",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ph7",
        "name": "Bread Sticks",
        "calories": 140,
        "proteinG": 4,
        "carbsG": 22,
        "fatG": 4,
        "servingSize": "1 breadstick",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ph8",
        "name": "Pasta Primavera",
        "calories": 590,
        "proteinG": 18,
        "carbsG": 92,
        "fatG": 16,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ph9",
        "name": "Cinnabon Mini Rolls",
        "calories": 390,
        "proteinG": 5,
        "carbsG": 57,
        "fatG": 16,
        "servingSize": "2 pieces",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "dominos",
    "name": "Domino's",
    "category": "Pizza",
    "emoji": "🎲",
    "items": [
      {
        "id": "do1",
        "name": "Hand Tossed Cheese Slice (Lg)",
        "calories": 290,
        "proteinG": 11,
        "carbsG": 37,
        "fatG": 10,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "do2",
        "name": "Pepperoni Slice (Lg)",
        "calories": 330,
        "proteinG": 14,
        "carbsG": 36,
        "fatG": 14,
        "servingSize": "1 slice"
      },
      {
        "id": "do3",
        "name": "ExtravaganZZa Slice (Lg)",
        "calories": 380,
        "proteinG": 17,
        "carbsG": 36,
        "fatG": 18,
        "servingSize": "1 slice"
      },
      {
        "id": "do4",
        "name": "Pacific Veggie Slice (Lg)",
        "calories": 300,
        "proteinG": 12,
        "carbsG": 36,
        "fatG": 11,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "do5",
        "name": "Chicken Habanero Slice (Lg)",
        "calories": 350,
        "proteinG": 15,
        "carbsG": 38,
        "fatG": 15,
        "servingSize": "1 slice"
      },
      {
        "id": "do6",
        "name": "Chicken Wings 8pc",
        "calories": 580,
        "proteinG": 52,
        "carbsG": 6,
        "fatG": 40,
        "servingSize": "8 wings",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "do7",
        "name": "Stuffed Cheesy Bread",
        "calories": 370,
        "proteinG": 16,
        "carbsG": 44,
        "fatG": 14,
        "servingSize": "2 pieces",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "do8",
        "name": "Cinna Stix",
        "calories": 360,
        "proteinG": 7,
        "carbsG": 57,
        "fatG": 12,
        "servingSize": "4 pieces",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "do9",
        "name": "Parmesan Bread Bites",
        "calories": 290,
        "proteinG": 8,
        "carbsG": 38,
        "fatG": 11,
        "servingSize": "16 pieces",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "jimmyjohns",
    "name": "Jimmy John's",
    "category": "Sandwiches",
    "emoji": "🥖",
    "items": [
      {
        "id": "jj1",
        "name": "Billy Club",
        "calories": 640,
        "proteinG": 40,
        "carbsG": 58,
        "fatG": 24,
        "servingSize": "1 sandwich"
      },
      {
        "id": "jj2",
        "name": "Hunter's Club",
        "calories": 620,
        "proteinG": 38,
        "carbsG": 58,
        "fatG": 22,
        "servingSize": "1 sandwich"
      },
      {
        "id": "jj3",
        "name": "J.J. Gargantuan",
        "calories": 980,
        "proteinG": 58,
        "carbsG": 80,
        "fatG": 42,
        "servingSize": "1 sandwich"
      },
      {
        "id": "jj4",
        "name": "Turkey Tom",
        "calories": 540,
        "proteinG": 32,
        "carbsG": 58,
        "fatG": 16,
        "servingSize": "1 sandwich"
      },
      {
        "id": "jj5",
        "name": "Slim Turkey Unwich",
        "calories": 190,
        "proteinG": 18,
        "carbsG": 4,
        "fatG": 8,
        "servingSize": "1 wrap",
        "tags": ["low-cal", "gluten-free"]
      },
      {
        "id": "jj6",
        "name": "Country Club",
        "calories": 600,
        "proteinG": 34,
        "carbsG": 58,
        "fatG": 20,
        "servingSize": "1 sandwich"
      },
      {
        "id": "jj7",
        "name": "Italian Night Club",
        "calories": 700,
        "proteinG": 36,
        "carbsG": 60,
        "fatG": 28,
        "servingSize": "1 sandwich"
      },
      {
        "id": "jj8",
        "name": "Tuna Salad",
        "calories": 580,
        "proteinG": 24,
        "carbsG": 58,
        "fatG": 24,
        "servingSize": "1 sandwich"
      }
    ]
  },
  {
    "id": "firehousesubs",
    "name": "Firehouse Subs",
    "category": "Sandwiches",
    "emoji": "🔥",
    "items": [
      {
        "id": "fh1",
        "name": "Hook & Ladder Medium",
        "calories": 590,
        "proteinG": 32,
        "carbsG": 60,
        "fatG": 22,
        "servingSize": "medium"
      },
      {
        "id": "fh2",
        "name": "Engineer Medium",
        "calories": 620,
        "proteinG": 34,
        "carbsG": 62,
        "fatG": 24,
        "servingSize": "medium"
      },
      {
        "id": "fh3",
        "name": "Turkey Bacon Ranch Medium",
        "calories": 570,
        "proteinG": 36,
        "carbsG": 58,
        "fatG": 20,
        "servingSize": "medium",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "fh4",
        "name": "Italian Medium",
        "calories": 660,
        "proteinG": 32,
        "carbsG": 64,
        "fatG": 28,
        "servingSize": "medium"
      },
      {
        "id": "fh5",
        "name": "Veggie Medium",
        "calories": 440,
        "proteinG": 18,
        "carbsG": 62,
        "fatG": 14,
        "servingSize": "medium",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fh6",
        "name": "New York Steamer Medium",
        "calories": 640,
        "proteinG": 32,
        "carbsG": 62,
        "fatG": 26,
        "servingSize": "medium"
      },
      {
        "id": "fh7",
        "name": "Smokehouse Beef & Cheddar Medium",
        "calories": 690,
        "proteinG": 38,
        "carbsG": 64,
        "fatG": 28,
        "servingSize": "medium"
      },
      {
        "id": "fh8",
        "name": "Chicken Salad Medium",
        "calories": 540,
        "proteinG": 30,
        "carbsG": 62,
        "fatG": 18,
        "servingSize": "medium"
      }
    ]
  },
  {
    "id": "sweetgreen",
    "name": "Sweetgreen",
    "category": "Salads",
    "emoji": "🥬",
    "items": [
      {
        "id": "swg1",
        "name": "Harvest Bowl",
        "calories": 705,
        "proteinG": 27,
        "carbsG": 82,
        "fatG": 30,
        "servingSize": "1 bowl"
      },
      {
        "id": "swg2",
        "name": "Shroomami Bowl",
        "calories": 625,
        "proteinG": 22,
        "carbsG": 88,
        "fatG": 22,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "swg3",
        "name": "Guacamole Greens",
        "calories": 555,
        "proteinG": 20,
        "carbsG": 48,
        "fatG": 34,
        "servingSize": "1 bowl",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "swg4",
        "name": "Fish Taco Salad",
        "calories": 550,
        "proteinG": 34,
        "carbsG": 46,
        "fatG": 22,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "swg5",
        "name": "Chicken Pesto Parm",
        "calories": 590,
        "proteinG": 46,
        "carbsG": 42,
        "fatG": 22,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "swg6",
        "name": "Kale Caesar",
        "calories": 460,
        "proteinG": 28,
        "carbsG": 30,
        "fatG": 28,
        "servingSize": "1 bowl",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "swg7",
        "name": "Hummus Crunch Salad",
        "calories": 590,
        "proteinG": 18,
        "carbsG": 72,
        "fatG": 26,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "swg8",
        "name": "Warm Portobello Mix",
        "calories": 490,
        "proteinG": 12,
        "carbsG": 68,
        "fatG": 18,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      }
    ]
  },
  {
    "id": "smoothieking",
    "name": "Smoothie King",
    "category": "Smoothies",
    "emoji": "🥤",
    "items": [
      {
        "id": "sk1",
        "name": "Gladiator Vanilla 20oz",
        "calories": 230,
        "proteinG": 45,
        "carbsG": 9,
        "fatG": 3,
        "servingSize": "20 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "sk2",
        "name": "The Hulk Strawberry 20oz",
        "calories": 950,
        "proteinG": 30,
        "carbsG": 148,
        "fatG": 30,
        "servingSize": "20 oz"
      },
      {
        "id": "sk3",
        "name": "Angel Food 20oz",
        "calories": 330,
        "proteinG": 4,
        "carbsG": 78,
        "fatG": 1,
        "servingSize": "20 oz",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "sk4",
        "name": "Peanut Power Plus Grape 20oz",
        "calories": 680,
        "proteinG": 24,
        "carbsG": 112,
        "fatG": 18,
        "servingSize": "20 oz"
      },
      {
        "id": "sk5",
        "name": "Pure Recharge Mango Strawberry 20oz",
        "calories": 280,
        "proteinG": 2,
        "carbsG": 66,
        "fatG": 1,
        "servingSize": "20 oz",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "sk6",
        "name": "Lean 1 Vanilla 20oz",
        "calories": 280,
        "proteinG": 25,
        "carbsG": 40,
        "fatG": 5,
        "servingSize": "20 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "sk7",
        "name": "Activator Strawberry Banana 20oz",
        "calories": 400,
        "proteinG": 30,
        "carbsG": 60,
        "fatG": 5,
        "servingSize": "20 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sk8",
        "name": "Muscle Punch Plus Strawberry 20oz",
        "calories": 340,
        "proteinG": 26,
        "carbsG": 54,
        "fatG": 3,
        "servingSize": "20 oz",
        "tags": ["high-protein", "gluten-free"]
      }
    ]
  },
  {
    "id": "tropicalsmoothie",
    "name": "Tropical Smoothie Cafe",
    "category": "Smoothies",
    "emoji": "🌴",
    "items": [
      {
        "id": "ts1",
        "name": "Jetty Punch 24oz",
        "calories": 320,
        "proteinG": 3,
        "carbsG": 76,
        "fatG": 1,
        "servingSize": "24 oz",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "ts2",
        "name": "Sunrise Sunset 24oz",
        "calories": 310,
        "proteinG": 2,
        "carbsG": 74,
        "fatG": 1,
        "servingSize": "24 oz",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "ts3",
        "name": "Detox Island Green 24oz",
        "calories": 220,
        "proteinG": 3,
        "carbsG": 52,
        "fatG": 1,
        "servingSize": "24 oz",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "ts4",
        "name": "Peanut Butter Cup 24oz",
        "calories": 620,
        "proteinG": 22,
        "carbsG": 88,
        "fatG": 22,
        "servingSize": "24 oz",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ts5",
        "name": "Chia Banana Boost 24oz",
        "calories": 450,
        "proteinG": 6,
        "carbsG": 100,
        "fatG": 6,
        "servingSize": "24 oz",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "ts6",
        "name": "Flatbread - Turkey & Bacon",
        "calories": 420,
        "proteinG": 26,
        "carbsG": 42,
        "fatG": 14,
        "servingSize": "1 flatbread"
      },
      {
        "id": "ts7",
        "name": "Veggie Hummus Wrap",
        "calories": 380,
        "proteinG": 14,
        "carbsG": 52,
        "fatG": 14,
        "servingSize": "1 wrap",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ts8",
        "name": "Acaí Bowl",
        "calories": 380,
        "proteinG": 6,
        "carbsG": 72,
        "fatG": 10,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      }
    ]
  },
  {
    "id": "starbucks",
    "name": "Starbucks",
    "category": "Coffee",
    "emoji": "☕",
    "items": [
      {
        "id": "sb1",
        "name": "Tall Caramel Macchiato",
        "calories": 250,
        "proteinG": 10,
        "carbsG": 35,
        "fatG": 7,
        "servingSize": "12 oz",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sb2",
        "name": "Grande Vanilla Latte",
        "calories": 350,
        "proteinG": 12,
        "carbsG": 48,
        "fatG": 11,
        "servingSize": "16 oz",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sb3",
        "name": "Venti Frappuccino Mocha",
        "calories": 520,
        "proteinG": 9,
        "carbsG": 85,
        "fatG": 14,
        "servingSize": "24 oz",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sb4",
        "name": "Tall Cold Brew",
        "calories": 10,
        "proteinG": 0,
        "carbsG": 0,
        "fatG": 0,
        "servingSize": "12 oz",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "sb5",
        "name": "Egg White & Roasted Red Pepper Egg Bites",
        "calories": 170,
        "proteinG": 13,
        "carbsG": 13,
        "fatG": 6,
        "servingSize": "2 bites",
        "tags": ["low-cal", "gluten-free"]
      },
      {
        "id": "sb6",
        "name": "Spinach Feta & Egg White Wrap",
        "calories": 290,
        "proteinG": 19,
        "carbsG": 33,
        "fatG": 8,
        "servingSize": "1 wrap",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "sb7",
        "name": "Banana Nut Bread",
        "calories": 430,
        "proteinG": 6,
        "carbsG": 64,
        "fatG": 17,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sb8",
        "name": "Turkey Pesto Panini",
        "calories": 430,
        "proteinG": 25,
        "carbsG": 47,
        "fatG": 14,
        "servingSize": "1 panini"
      },
      {
        "id": "sb9",
        "name": "Protein Box (Eggs & Cheese)",
        "calories": 470,
        "proteinG": 26,
        "carbsG": 46,
        "fatG": 21,
        "servingSize": "1 box"
      },
      {
        "id": "sb10",
        "name": "Tall Matcha Latte",
        "calories": 240,
        "proteinG": 10,
        "carbsG": 34,
        "fatG": 7,
        "servingSize": "12 oz",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "firstwatch",
    "name": "First Watch",
    "category": "Breakfast",
    "emoji": "🌅",
    "items": [
      {
        "id": "fw1",
        "name": "Farmhouse Hash",
        "calories": 620,
        "proteinG": 28,
        "carbsG": 52,
        "fatG": 30,
        "servingSize": "1 plate"
      },
      {
        "id": "fw2",
        "name": "Avocado Toast",
        "calories": 360,
        "proteinG": 14,
        "carbsG": 38,
        "fatG": 18,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fw3",
        "name": "Quinoa Power Bowl",
        "calories": 440,
        "proteinG": 18,
        "carbsG": 62,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "fw4",
        "name": "Smoked Salmon Eggs Benedict",
        "calories": 680,
        "proteinG": 38,
        "carbsG": 44,
        "fatG": 34,
        "servingSize": "1 plate"
      },
      {
        "id": "fw5",
        "name": "Morning Meditation Smoothie",
        "calories": 290,
        "proteinG": 6,
        "carbsG": 64,
        "fatG": 4,
        "servingSize": "1 smoothie",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "fw6",
        "name": "Chickichanga Breakfast",
        "calories": 780,
        "proteinG": 36,
        "carbsG": 62,
        "fatG": 38,
        "servingSize": "1 plate"
      },
      {
        "id": "fw7",
        "name": "A.M. Superfoods Bowl",
        "calories": 380,
        "proteinG": 16,
        "carbsG": 58,
        "fatG": 10,
        "servingSize": "1 bowl",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fw8",
        "name": "Classic Eggs Benedict",
        "calories": 680,
        "proteinG": 30,
        "carbsG": 44,
        "fatG": 38,
        "servingSize": "1 plate"
      },
      {
        "id": "fw9",
        "name": "Crispy Cauliflower Sandwich",
        "calories": 490,
        "proteinG": 14,
        "carbsG": 62,
        "fatG": 20,
        "servingSize": "1 sandwich",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "ihopp",
    "name": "IHOP",
    "category": "Breakfast",
    "emoji": "🥞",
    "items": [
      {
        "id": "ih1",
        "name": "Original Buttermilk Pancakes",
        "calories": 590,
        "proteinG": 12,
        "carbsG": 96,
        "fatG": 16,
        "servingSize": "3 pancakes",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ih2",
        "name": "Chicken & Waffles",
        "calories": 920,
        "proteinG": 52,
        "carbsG": 76,
        "fatG": 40,
        "servingSize": "1 plate"
      },
      {
        "id": "ih3",
        "name": "Steak & Eggs",
        "calories": 720,
        "proteinG": 52,
        "carbsG": 32,
        "fatG": 44,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ih4",
        "name": "Create Your Own Omelette",
        "calories": 380,
        "proteinG": 28,
        "carbsG": 12,
        "fatG": 26,
        "servingSize": "1 omelette",
        "tags": [
          "gluten-free"
        ]
      },
      {
        "id": "ih5",
        "name": "Big Steak Omelette",
        "calories": 730,
        "proteinG": 44,
        "carbsG": 26,
        "fatG": 52,
        "servingSize": "1 omelette",
        "tags": [
          "gluten-free"
        ]
      },
      {
        "id": "ih6",
        "name": "New Impossible Sausage Omelette",
        "calories": 560,
        "proteinG": 28,
        "carbsG": 22,
        "fatG": 38,
        "servingSize": "1 omelette",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "ih7",
        "name": "Blueberry Harvest Grain Pancakes",
        "calories": 480,
        "proteinG": 12,
        "carbsG": 74,
        "fatG": 14,
        "servingSize": "3 pancakes",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ih8",
        "name": "French Toast Classic",
        "calories": 530,
        "proteinG": 12,
        "carbsG": 74,
        "fatG": 20,
        "servingSize": "3 slices",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ih9",
        "name": "Jr. Chicken Strips (side)",
        "calories": 280,
        "proteinG": 22,
        "carbsG": 18,
        "fatG": 13,
        "servingSize": "2 strips"
      }
    ]
  },
  {
    "id": "dennys",
    "name": "Denny's",
    "category": "Breakfast",
    "emoji": "🥚",
    "items": [
      {
        "id": "dn1",
        "name": "Grand Slam",
        "calories": 650,
        "proteinG": 30,
        "carbsG": 52,
        "fatG": 36,
        "servingSize": "1 plate"
      },
      {
        "id": "dn2",
        "name": "Super Bird Sandwich",
        "calories": 480,
        "proteinG": 30,
        "carbsG": 44,
        "fatG": 18,
        "servingSize": "1 sandwich"
      },
      {
        "id": "dn3",
        "name": "All-American Slam",
        "calories": 730,
        "proteinG": 38,
        "carbsG": 36,
        "fatG": 46,
        "servingSize": "1 plate",
        "tags": [
          "gluten-free"
        ]
      },
      {
        "id": "dn4",
        "name": "Lumberjack Slam",
        "calories": 1100,
        "proteinG": 46,
        "carbsG": 90,
        "fatG": 58,
        "servingSize": "1 plate"
      },
      {
        "id": "dn5",
        "name": "Fit Slam",
        "calories": 390,
        "proteinG": 28,
        "carbsG": 52,
        "fatG": 8,
        "servingSize": "1 plate",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "dn6",
        "name": "Classic Burger",
        "calories": 650,
        "proteinG": 32,
        "carbsG": 44,
        "fatG": 36,
        "servingSize": "1 burger"
      },
      {
        "id": "dn7",
        "name": "Spaghetti & Meat Sauce",
        "calories": 680,
        "proteinG": 28,
        "carbsG": 92,
        "fatG": 22,
        "servingSize": "1 plate"
      },
      {
        "id": "dn8",
        "name": "Seasonal Pancakes",
        "calories": 510,
        "proteinG": 10,
        "carbsG": 80,
        "fatG": 16,
        "servingSize": "3 pancakes",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "olivegarden",
    "name": "Olive Garden",
    "category": "Italian",
    "emoji": "🇮🇹",
    "items": [
      {
        "id": "og1",
        "name": "Chicken Parmigiana",
        "calories": 1090,
        "proteinG": 62,
        "carbsG": 78,
        "fatG": 52,
        "servingSize": "1 plate"
      },
      {
        "id": "og2",
        "name": "Shrimp Scampi",
        "calories": 810,
        "proteinG": 42,
        "carbsG": 98,
        "fatG": 26,
        "servingSize": "1 plate"
      },
      {
        "id": "og3",
        "name": "Zoodles Primavera",
        "calories": 290,
        "proteinG": 12,
        "carbsG": 38,
        "fatG": 11,
        "servingSize": "1 plate",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "og4",
        "name": "Create Your Own Pasta - Spaghetti Marinara",
        "calories": 550,
        "proteinG": 18,
        "carbsG": 100,
        "fatG": 8,
        "servingSize": "1 plate",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "og5",
        "name": "Grilled Chicken Margherita",
        "calories": 560,
        "proteinG": 64,
        "carbsG": 18,
        "fatG": 24,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "og6",
        "name": "Unlimited Soup, Salad & Breadsticks",
        "calories": 420,
        "proteinG": 16,
        "carbsG": 60,
        "fatG": 12,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "og7",
        "name": "Tiramisu",
        "calories": 480,
        "proteinG": 6,
        "carbsG": 68,
        "fatG": 20,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "og8",
        "name": "Asiago Tortelloni Alfredo w/ Grilled Chicken",
        "calories": 1380,
        "proteinG": 66,
        "carbsG": 120,
        "fatG": 68,
        "servingSize": "1 plate"
      },
      {
        "id": "og9",
        "name": "Breadsticks",
        "calories": 140,
        "proteinG": 5,
        "carbsG": 25,
        "fatG": 2,
        "servingSize": "1 breadstick",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "outback",
    "name": "Outback Steakhouse",
    "category": "Steakhouse",
    "emoji": "🐨",
    "items": [
      {
        "id": "ob1",
        "name": "Victoria's Filet 9oz",
        "calories": 330,
        "proteinG": 44,
        "carbsG": 2,
        "fatG": 16,
        "servingSize": "9 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ob2",
        "name": "Ribeye 12oz",
        "calories": 620,
        "proteinG": 56,
        "carbsG": 2,
        "fatG": 42,
        "servingSize": "12 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ob3",
        "name": "Bloomin' Onion",
        "calories": 1950,
        "proteinG": 22,
        "carbsG": 162,
        "fatG": 138,
        "servingSize": "1 whole",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ob4",
        "name": "Alice Springs Chicken",
        "calories": 1180,
        "proteinG": 72,
        "carbsG": 78,
        "fatG": 60,
        "servingSize": "1 plate"
      },
      {
        "id": "ob5",
        "name": "Grilled Salmon",
        "calories": 460,
        "proteinG": 52,
        "carbsG": 2,
        "fatG": 26,
        "servingSize": "7 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ob6",
        "name": "Chicken on the Barbie",
        "calories": 490,
        "proteinG": 56,
        "carbsG": 10,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "ob7",
        "name": "Loaded Baked Potato",
        "calories": 480,
        "proteinG": 12,
        "carbsG": 68,
        "fatG": 22,
        "servingSize": "1 potato",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ob8",
        "name": "Chocolate Thunder From Down Under",
        "calories": 1010,
        "proteinG": 12,
        "carbsG": 130,
        "fatG": 50,
        "servingSize": "1 dessert",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "redlobster",
    "name": "Red Lobster",
    "category": "Seafood",
    "emoji": "🦞",
    "items": [
      {
        "id": "rl1b",
        "name": "Endless Shrimp - Garlic Shrimp Scampi",
        "calories": 490,
        "proteinG": 38,
        "carbsG": 18,
        "fatG": 28,
        "servingSize": "1 serving",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rl2b",
        "name": "Endless Shrimp - Popcorn Shrimp",
        "calories": 420,
        "proteinG": 26,
        "carbsG": 38,
        "fatG": 18,
        "servingSize": "1 serving"
      },
      {
        "id": "rl3b",
        "name": "Grilled Salmon",
        "calories": 360,
        "proteinG": 44,
        "carbsG": 0,
        "fatG": 18,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free", "low-cal"]
      },
      {
        "id": "rl4b",
        "name": "Ultimate Feast",
        "calories": 1230,
        "proteinG": 74,
        "carbsG": 68,
        "fatG": 70,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "rl5b",
        "name": "Cheddar Bay Biscuit",
        "calories": 160,
        "proteinG": 4,
        "carbsG": 17,
        "fatG": 9,
        "servingSize": "1 biscuit",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "rl6b",
        "name": "Lobster Bisque Cup",
        "calories": 230,
        "proteinG": 8,
        "carbsG": 14,
        "fatG": 16,
        "servingSize": "1 cup",
        "tags": [
          "gluten-free"
        ]
      },
      {
        "id": "rl7b",
        "name": "Caesar Salad",
        "calories": 350,
        "proteinG": 8,
        "carbsG": 18,
        "fatG": 28,
        "servingSize": "1 salad",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "rl8b",
        "name": "Chocolate Wave",
        "calories": 730,
        "proteinG": 8,
        "carbsG": 98,
        "fatG": 34,
        "servingSize": "1 dessert",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "crackerbarrrel",
    "name": "Cracker Barrel",
    "category": "Southern",
    "emoji": "🪵",
    "items": [
      {
        "id": "cb1",
        "name": "Sunrise Sampler",
        "calories": 820,
        "proteinG": 36,
        "carbsG": 62,
        "fatG": 46,
        "servingSize": "1 plate"
      },
      {
        "id": "cb2",
        "name": "Old Timer's Breakfast",
        "calories": 680,
        "proteinG": 34,
        "carbsG": 52,
        "fatG": 34,
        "servingSize": "1 plate"
      },
      {
        "id": "cb3",
        "name": "Country Boy Breakfast",
        "calories": 760,
        "proteinG": 38,
        "carbsG": 56,
        "fatG": 38,
        "servingSize": "1 plate"
      },
      {
        "id": "cb4",
        "name": "Chicken n' Dumplings",
        "calories": 680,
        "proteinG": 34,
        "carbsG": 82,
        "fatG": 20,
        "servingSize": "1 plate"
      },
      {
        "id": "cb5",
        "name": "Grilled Chicken Tenderloin Dinner",
        "calories": 400,
        "proteinG": 52,
        "carbsG": 22,
        "fatG": 12,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "cb6",
        "name": "Meatloaf Dinner",
        "calories": 580,
        "proteinG": 32,
        "carbsG": 58,
        "fatG": 24,
        "servingSize": "1 plate"
      },
      {
        "id": "cb7",
        "name": "Corn Muffins",
        "calories": 220,
        "proteinG": 4,
        "carbsG": 36,
        "fatG": 8,
        "servingSize": "2 muffins",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cb8",
        "name": "Double Chocolate Fudge Coca-Cola Cake",
        "calories": 610,
        "proteinG": 6,
        "carbsG": 92,
        "fatG": 24,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "bjsbrewhouse",
    "name": "BJ's Brewhouse",
    "category": "American",
    "emoji": "🍺",
    "items": [
      {
        "id": "bj1",
        "name": "Pizookie",
        "calories": 1050,
        "proteinG": 10,
        "carbsG": 130,
        "fatG": 54,
        "servingSize": "1 pizookie",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bj2",
        "name": "Deep Dish Pizza Slice",
        "calories": 380,
        "proteinG": 16,
        "carbsG": 44,
        "fatG": 16,
        "servingSize": "1 slice"
      },
      {
        "id": "bj3",
        "name": "Enlightened Salmon",
        "calories": 480,
        "proteinG": 52,
        "carbsG": 18,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "bj4",
        "name": "Chicken Parmigiana",
        "calories": 940,
        "proteinG": 60,
        "carbsG": 88,
        "fatG": 32,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "bj5",
        "name": "Brewhouse Burger",
        "calories": 870,
        "proteinG": 48,
        "carbsG": 62,
        "fatG": 46,
        "servingSize": "1 burger"
      },
      {
        "id": "bj6",
        "name": "Grilled Chicken Salad",
        "calories": 520,
        "proteinG": 44,
        "carbsG": 28,
        "fatG": 24,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "bj7",
        "name": "Avocado Egg Rolls",
        "calories": 880,
        "proteinG": 18,
        "carbsG": 80,
        "fatG": 54,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bj8",
        "name": "Wings 12pc",
        "calories": 1050,
        "proteinG": 74,
        "carbsG": 28,
        "fatG": 70,
        "servingSize": "12 wings",
        "tags": [
          "high-protein"
        ]
      }
    ]
  },
  {
    "id": "freebirds",
    "name": "Freebirds World Burrito",
    "category": "Mexican",
    "emoji": "🎸",
    "items": [
      {
        "id": "fb1",
        "name": "Monster Burrito - Chicken",
        "calories": 1020,
        "proteinG": 62,
        "carbsG": 110,
        "fatG": 32,
        "servingSize": "1 burrito",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "fb2",
        "name": "Regular Burrito - Steak",
        "calories": 780,
        "proteinG": 48,
        "carbsG": 86,
        "fatG": 24,
        "servingSize": "1 burrito"
      },
      {
        "id": "fb3",
        "name": "Naked Burrito Bowl - Chicken",
        "calories": 540,
        "proteinG": 50,
        "carbsG": 52,
        "fatG": 18,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "fb4",
        "name": "Burrito Bowl - Veggie",
        "calories": 520,
        "proteinG": 18,
        "carbsG": 78,
        "fatG": 16,
        "servingSize": "1 bowl",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fb5",
        "name": "Tacos - Chicken (3)",
        "calories": 480,
        "proteinG": 36,
        "carbsG": 52,
        "fatG": 12,
        "servingSize": "3 tacos",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "fb6",
        "name": "Nachos",
        "calories": 820,
        "proteinG": 34,
        "carbsG": 82,
        "fatG": 40,
        "servingSize": "1 order"
      },
      {
        "id": "fb7",
        "name": "Queso",
        "calories": 320,
        "proteinG": 14,
        "carbsG": 18,
        "fatG": 22,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fb8",
        "name": "Chips & Guacamole",
        "calories": 440,
        "proteinG": 6,
        "carbsG": 54,
        "fatG": 24,
        "servingSize": "1 order",
        "tags": [
          "vegan"
        ]
      }
    ]
  },
  {
    "id": "salata",
    "name": "Salata",
    "category": "Salads",
    "emoji": "🥗",
    "items": [
      {
        "id": "sl1",
        "name": "Grilled Chicken Salad (base)",
        "calories": 320,
        "proteinG": 40,
        "carbsG": 18,
        "fatG": 10,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "sl2",
        "name": "Salmon Salad (base)",
        "calories": 380,
        "proteinG": 36,
        "carbsG": 18,
        "fatG": 18,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "sl3",
        "name": "Steak Salad (base)",
        "calories": 420,
        "proteinG": 38,
        "carbsG": 18,
        "fatG": 22,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "sl4",
        "name": "Veggie Salad",
        "calories": 280,
        "proteinG": 10,
        "carbsG": 28,
        "fatG": 14,
        "servingSize": "1 salad",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "sl5",
        "name": "Falafel Salad",
        "calories": 480,
        "proteinG": 16,
        "carbsG": 52,
        "fatG": 22,
        "servingSize": "1 salad",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "sl6",
        "name": "Tuna Salad",
        "calories": 360,
        "proteinG": 34,
        "carbsG": 18,
        "fatG": 16,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "sl7",
        "name": "Classic Wrap",
        "calories": 520,
        "proteinG": 32,
        "carbsG": 52,
        "fatG": 18,
        "servingSize": "1 wrap"
      },
      {
        "id": "sl8",
        "name": "Soup of the Day",
        "calories": 180,
        "proteinG": 8,
        "carbsG": 24,
        "fatG": 6,
        "servingSize": "1 cup",
        "tags": [
          "low-cal"
        ]
      }
    ]
  },
  {
    "id": "peiwei",
    "name": "Pei Wei",
    "category": "Asian",
    "emoji": "🍜",
    "items": [
      {
        "id": "pw1",
        "name": "Wok-Fired Chicken Lo Mein",
        "calories": 580,
        "proteinG": 36,
        "carbsG": 74,
        "fatG": 14,
        "servingSize": "1 plate"
      },
      {
        "id": "pw2",
        "name": "Vietnamese Chicken Rolls",
        "calories": 620,
        "proteinG": 34,
        "carbsG": 76,
        "fatG": 18,
        "servingSize": "1 plate"
      },
      {
        "id": "pw3",
        "name": "Thai Chicken Basil",
        "calories": 440,
        "proteinG": 38,
        "carbsG": 44,
        "fatG": 12,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "pw4",
        "name": "Honey Seared Chicken",
        "calories": 520,
        "proteinG": 40,
        "carbsG": 54,
        "fatG": 14,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pw5",
        "name": "Kung Pao Shrimp",
        "calories": 380,
        "proteinG": 26,
        "carbsG": 34,
        "fatG": 14,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "pw6",
        "name": "Wok Smart Edamame",
        "calories": 130,
        "proteinG": 12,
        "carbsG": 8,
        "fatG": 5,
        "servingSize": "1 order",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "pw7",
        "name": "Caramel Ginger Chicken Bowl",
        "calories": 490,
        "proteinG": 36,
        "carbsG": 58,
        "fatG": 12,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pw8",
        "name": "Fried Rice - Chicken",
        "calories": 680,
        "proteinG": 32,
        "carbsG": 92,
        "fatG": 16,
        "servingSize": "1 plate"
      }
    ]
  },
  {
    "id": "noodles",
    "name": "Noodles & Company",
    "category": "Noodles",
    "emoji": "🍝",
    "items": [
      {
        "id": "no1",
        "name": "Mac & Cheese Regular",
        "calories": 680,
        "proteinG": 26,
        "carbsG": 92,
        "fatG": 22,
        "servingSize": "regular",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "no2",
        "name": "Wisconsin Mac & Cheese",
        "calories": 760,
        "proteinG": 30,
        "carbsG": 96,
        "fatG": 28,
        "servingSize": "regular",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "no3",
        "name": "Pad Thai - Chicken",
        "calories": 640,
        "proteinG": 34,
        "carbsG": 84,
        "fatG": 18,
        "servingSize": "regular",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "no4",
        "name": "Japanese Pan Noodles",
        "calories": 600,
        "proteinG": 16,
        "carbsG": 98,
        "fatG": 16,
        "servingSize": "regular",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "no5",
        "name": "Pesto Cavatappi",
        "calories": 720,
        "proteinG": 24,
        "carbsG": 94,
        "fatG": 28,
        "servingSize": "regular",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "no6",
        "name": "Zoodles - Marinara",
        "calories": 220,
        "proteinG": 8,
        "carbsG": 28,
        "fatG": 8,
        "servingSize": "regular",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "no7",
        "name": "Med Salad - Chicken",
        "calories": 490,
        "proteinG": 34,
        "carbsG": 36,
        "fatG": 22,
        "servingSize": "1 salad",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "no8",
        "name": "Broccoli & Rice Bowl",
        "calories": 380,
        "proteinG": 14,
        "carbsG": 68,
        "fatG": 8,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      }
    ]
  },
  {
    "id": "thaiorbis",
    "name": "Thai Lanna",
    "category": "Thai",
    "emoji": "🇹🇭",
    "items": [
      {
        "id": "tl1",
        "name": "Pad Thai - Chicken",
        "calories": 620,
        "proteinG": 34,
        "carbsG": 72,
        "fatG": 18,
        "servingSize": "1 plate"
      },
      {
        "id": "tl2",
        "name": "Pad See Ew - Shrimp",
        "calories": 560,
        "proteinG": 30,
        "carbsG": 68,
        "fatG": 16,
        "servingSize": "1 plate"
      },
      {
        "id": "tl3",
        "name": "Massaman Curry - Chicken",
        "calories": 580,
        "proteinG": 36,
        "carbsG": 52,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "tl4",
        "name": "Green Curry - Tofu",
        "calories": 480,
        "proteinG": 16,
        "carbsG": 56,
        "fatG": 20,
        "servingSize": "1 plate",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "tl5",
        "name": "Tom Kha Soup",
        "calories": 220,
        "proteinG": 14,
        "carbsG": 12,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": ["gluten-free", "low-cal"]
      },
      {
        "id": "tl6",
        "name": "Spring Rolls",
        "calories": 280,
        "proteinG": 8,
        "carbsG": 34,
        "fatG": 12,
        "servingSize": "4 rolls",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "tl7",
        "name": "Basil Fried Rice",
        "calories": 560,
        "proteinG": 26,
        "carbsG": 72,
        "fatG": 16,
        "servingSize": "1 plate"
      },
      {
        "id": "tl8",
        "name": "Mango Sticky Rice",
        "calories": 380,
        "proteinG": 4,
        "carbsG": 78,
        "fatG": 6,
        "servingSize": "1 serving",
        "tags": [
          "vegan"
        ]
      }
    ]
  },
  {
    "id": "jasonsushi",
    "name": "Blue Sushi Sake Grill",
    "category": "Japanese",
    "emoji": "🍱",
    "items": [
      {
        "id": "bs1",
        "name": "Salmon Sashimi",
        "calories": 180,
        "proteinG": 28,
        "carbsG": 0,
        "fatG": 6,
        "servingSize": "6 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "bs2",
        "name": "Tuna Sashimi",
        "calories": 160,
        "proteinG": 30,
        "carbsG": 0,
        "fatG": 2,
        "servingSize": "6 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "bs3",
        "name": "California Roll",
        "calories": 260,
        "proteinG": 12,
        "carbsG": 38,
        "fatG": 6,
        "servingSize": "8 pieces"
      },
      {
        "id": "bs4",
        "name": "Spicy Tuna Roll",
        "calories": 300,
        "proteinG": 20,
        "carbsG": 34,
        "fatG": 8,
        "servingSize": "8 pieces",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "bs5",
        "name": "Dragon Roll",
        "calories": 380,
        "proteinG": 16,
        "carbsG": 52,
        "fatG": 12,
        "servingSize": "8 pieces"
      },
      {
        "id": "bs6",
        "name": "Vegetable Tempura",
        "calories": 320,
        "proteinG": 6,
        "carbsG": 42,
        "fatG": 14,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bs7",
        "name": "Edamame",
        "calories": 120,
        "proteinG": 12,
        "carbsG": 8,
        "fatG": 4,
        "servingSize": "1 bowl",
        "tags": ["vegan", "low-cal", "gluten-free"]
      },
      {
        "id": "bs8",
        "name": "Ramen Bowl - Chicken",
        "calories": 560,
        "proteinG": 32,
        "carbsG": 62,
        "fatG": 18,
        "servingSize": "1 bowl"
      },
      {
        "id": "bs9",
        "name": "Chicken Teriyaki",
        "calories": 480,
        "proteinG": 52,
        "carbsG": 38,
        "fatG": 12,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      }
    ]
  },
  {
    "id": "medimap",
    "name": "Zoe's Kitchen",
    "category": "Mediterranean",
    "emoji": "🫒",
    "items": [
      {
        "id": "zk1",
        "name": "Chicken Kabob Plate",
        "calories": 480,
        "proteinG": 52,
        "carbsG": 32,
        "fatG": 14,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "zk2",
        "name": "Hummus Plate",
        "calories": 640,
        "proteinG": 20,
        "carbsG": 72,
        "fatG": 30,
        "servingSize": "1 plate",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "zk3",
        "name": "Spinach Roll-Up",
        "calories": 370,
        "proteinG": 18,
        "carbsG": 42,
        "fatG": 16,
        "servingSize": "1 wrap",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "zk4",
        "name": "Greek Salad",
        "calories": 310,
        "proteinG": 12,
        "carbsG": 22,
        "fatG": 20,
        "servingSize": "1 salad",
        "tags": ["vegetarian", "low-cal", "gluten-free"]
      },
      {
        "id": "zk5",
        "name": "Lemon Herb Salmon",
        "calories": 380,
        "proteinG": 46,
        "carbsG": 2,
        "fatG": 18,
        "servingSize": "6 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "zk6",
        "name": "Braised Beef Bowl",
        "calories": 560,
        "proteinG": 44,
        "carbsG": 48,
        "fatG": 18,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "zk7",
        "name": "Pita with Hummus",
        "calories": 320,
        "proteinG": 10,
        "carbsG": 50,
        "fatG": 10,
        "servingSize": "1 pita",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "zk8",
        "name": "Lemon-Herb Cauliflower",
        "calories": 140,
        "proteinG": 4,
        "carbsG": 18,
        "fatG": 6,
        "servingSize": "1 side",
        "tags": ["vegan", "low-cal"]
      }
    ]
  },
  {
    "id": "lilis",
    "name": "Lili's Bistro",
    "category": "American",
    "emoji": "🌷",
    "items": [
      {
        "id": "lb1",
        "name": "Shrimp & Grits",
        "calories": 580,
        "proteinG": 36,
        "carbsG": 54,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "lb2",
        "name": "Chicken Piccata",
        "calories": 520,
        "proteinG": 48,
        "carbsG": 28,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "lb3",
        "name": "Filet Mignon 6oz",
        "calories": 440,
        "proteinG": 52,
        "carbsG": 4,
        "fatG": 22,
        "servingSize": "6 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "lb4",
        "name": "Mushroom Flatbread",
        "calories": 460,
        "proteinG": 18,
        "carbsG": 54,
        "fatG": 18,
        "servingSize": "1 flatbread",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "lb5",
        "name": "Smoked Salmon Salad",
        "calories": 420,
        "proteinG": 34,
        "carbsG": 24,
        "fatG": 20,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "lb6",
        "name": "Brick Chicken",
        "calories": 490,
        "proteinG": 56,
        "carbsG": 12,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "lb7",
        "name": "Crème Brûlée",
        "calories": 360,
        "proteinG": 6,
        "carbsG": 44,
        "fatG": 16,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "swissps",
    "name": "Swiss Pastry Shop",
    "category": "Bakery/Café",
    "emoji": "🥐",
    "items": [
      {
        "id": "swp1",
        "name": "Croissant",
        "calories": 260,
        "proteinG": 6,
        "carbsG": 32,
        "fatG": 12,
        "servingSize": "1 croissant",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "swp2",
        "name": "Quiche Lorraine",
        "calories": 420,
        "proteinG": 18,
        "carbsG": 28,
        "fatG": 28,
        "servingSize": "1 slice"
      },
      {
        "id": "swp3",
        "name": "Fruit Tart",
        "calories": 340,
        "proteinG": 5,
        "carbsG": 52,
        "fatG": 12,
        "servingSize": "1 tart",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "swp4",
        "name": "Turkey Croissant Sandwich",
        "calories": 480,
        "proteinG": 28,
        "carbsG": 40,
        "fatG": 20,
        "servingSize": "1 sandwich"
      },
      {
        "id": "swp5",
        "name": "Chocolate Éclair",
        "calories": 310,
        "proteinG": 6,
        "carbsG": 42,
        "fatG": 13,
        "servingSize": "1 éclair",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "swp6",
        "name": "Greek Yogurt Parfait",
        "calories": 240,
        "proteinG": 14,
        "carbsG": 32,
        "fatG": 6,
        "servingSize": "1 serving",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "swp7",
        "name": "Soup of the Day",
        "calories": 180,
        "proteinG": 8,
        "carbsG": 22,
        "fatG": 6,
        "servingSize": "1 bowl",
        "tags": [
          "low-cal"
        ]
      }
    ]
  },
  {
    "id": "funkybrew",
    "name": "Funkytown Brewery",
    "category": "Pub Food",
    "emoji": "🍺",
    "items": [
      {
        "id": "fbt1",
        "name": "Brewery Burger",
        "calories": 840,
        "proteinG": 48,
        "carbsG": 60,
        "fatG": 44,
        "servingSize": "1 burger"
      },
      {
        "id": "fbt2",
        "name": "Pretzel Bites w/ Beer Cheese",
        "calories": 520,
        "proteinG": 18,
        "carbsG": 64,
        "fatG": 20,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fbt3",
        "name": "Fish & Chips",
        "calories": 780,
        "proteinG": 34,
        "carbsG": 72,
        "fatG": 36,
        "servingSize": "1 plate"
      },
      {
        "id": "fbt4",
        "name": "Smoked Wings 8pc",
        "calories": 620,
        "proteinG": 52,
        "carbsG": 12,
        "fatG": 42,
        "servingSize": "8 wings",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "fbt5",
        "name": "Cowtown Nachos",
        "calories": 880,
        "proteinG": 38,
        "carbsG": 78,
        "fatG": 46,
        "servingSize": "1 order"
      },
      {
        "id": "fbt6",
        "name": "Brisket Grilled Cheese",
        "calories": 720,
        "proteinG": 42,
        "carbsG": 58,
        "fatG": 36,
        "servingSize": "1 sandwich"
      },
      {
        "id": "fbt7",
        "name": "Veggie Flatbread",
        "calories": 420,
        "proteinG": 14,
        "carbsG": 54,
        "fatG": 16,
        "servingSize": "1 flatbread",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "schlotzskys",
    "name": "Schlotzsky's",
    "category": "Deli",
    "emoji": "🥪",
    "items": [
      {
        "id": "sc1",
        "name": "Original Sandwich Small",
        "calories": 520,
        "proteinG": 26,
        "carbsG": 64,
        "fatG": 16,
        "servingSize": "small"
      },
      {
        "id": "sc2",
        "name": "Turkey & Guacamole Small",
        "calories": 480,
        "proteinG": 28,
        "carbsG": 60,
        "fatG": 14,
        "servingSize": "small"
      },
      {
        "id": "sc3",
        "name": "Chicken & Pesto Small",
        "calories": 500,
        "proteinG": 30,
        "carbsG": 60,
        "fatG": 16,
        "servingSize": "small",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "sc4",
        "name": "Fiesta Chicken Flatbread Small",
        "calories": 470,
        "proteinG": 26,
        "carbsG": 52,
        "fatG": 16,
        "servingSize": "small"
      },
      {
        "id": "sc5",
        "name": "Tomato Basil Soup Cup",
        "calories": 160,
        "proteinG": 4,
        "carbsG": 24,
        "fatG": 6,
        "servingSize": "1 cup",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "sc6",
        "name": "Caesar Salad",
        "calories": 310,
        "proteinG": 10,
        "carbsG": 22,
        "fatG": 22,
        "servingSize": "1 salad",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sc7",
        "name": "Cinnamon Roll",
        "calories": 510,
        "proteinG": 7,
        "carbsG": 84,
        "fatG": 16,
        "servingSize": "1 roll",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "whichwich",
    "name": "Which Wich",
    "category": "Sandwiches",
    "emoji": "🥖",
    "items": [
      {
        "id": "ww1",
        "name": "Turkey Wich Medium",
        "calories": 540,
        "proteinG": 32,
        "carbsG": 62,
        "fatG": 16,
        "servingSize": "medium"
      },
      {
        "id": "ww2",
        "name": "Chicken Wich Medium",
        "calories": 580,
        "proteinG": 38,
        "carbsG": 64,
        "fatG": 18,
        "servingSize": "medium",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ww3",
        "name": "Italian Wich Medium",
        "calories": 680,
        "proteinG": 30,
        "carbsG": 66,
        "fatG": 28,
        "servingSize": "medium"
      },
      {
        "id": "ww4",
        "name": "Tuna Wich Medium",
        "calories": 560,
        "proteinG": 26,
        "carbsG": 62,
        "fatG": 22,
        "servingSize": "medium"
      },
      {
        "id": "ww5",
        "name": "Vegwich Medium",
        "calories": 440,
        "proteinG": 16,
        "carbsG": 66,
        "fatG": 14,
        "servingSize": "medium",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ww6",
        "name": "Protein Power Wich Medium",
        "calories": 620,
        "proteinG": 48,
        "carbsG": 50,
        "fatG": 22,
        "servingSize": "medium",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ww7",
        "name": "Cookies 2pc",
        "calories": 380,
        "proteinG": 4,
        "carbsG": 56,
        "fatG": 16,
        "servingSize": "2 cookies",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "snapkitchen",
    "name": "Snap Kitchen",
    "category": "Healthy Meals",
    "emoji": "📦",
    "items": [
      {
        "id": "sk1b",
        "name": "Turkey Meatballs & Zoodles",
        "calories": 380,
        "proteinG": 38,
        "carbsG": 18,
        "fatG": 14,
        "servingSize": "1 meal",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "sk2b",
        "name": "Bison Stuffed Peppers",
        "calories": 420,
        "proteinG": 36,
        "carbsG": 28,
        "fatG": 16,
        "servingSize": "1 meal",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sk3b",
        "name": "Chicken Tikka Masala",
        "calories": 460,
        "proteinG": 42,
        "carbsG": 38,
        "fatG": 14,
        "servingSize": "1 meal",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sk4b",
        "name": "Grass-Fed Beef Bowl",
        "calories": 480,
        "proteinG": 40,
        "carbsG": 32,
        "fatG": 18,
        "servingSize": "1 meal",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sk5b",
        "name": "Vegan Power Bowl",
        "calories": 360,
        "proteinG": 14,
        "carbsG": 56,
        "fatG": 12,
        "servingSize": "1 meal",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "sk6b",
        "name": "Salmon & Asparagus",
        "calories": 440,
        "proteinG": 46,
        "carbsG": 16,
        "fatG": 20,
        "servingSize": "1 meal",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sk7b",
        "name": "Greek Chicken Bowl",
        "calories": 400,
        "proteinG": 38,
        "carbsG": 28,
        "fatG": 14,
        "servingSize": "1 meal",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      }
    ]
  },
  {
    "id": "modpizza",
    "name": "MOD Pizza",
    "category": "Pizza",
    "emoji": "🍕",
    "items": [
      {
        "id": "mp1",
        "name": "11\" Build-Your-Own (avg)",
        "calories": 680,
        "proteinG": 28,
        "carbsG": 82,
        "fatG": 24,
        "servingSize": "1 pizza"
      },
      {
        "id": "mp2",
        "name": "Tristan Pizza",
        "calories": 650,
        "proteinG": 24,
        "carbsG": 80,
        "fatG": 22,
        "servingSize": "1 pizza"
      },
      {
        "id": "mp3",
        "name": "Lucy Sunshine",
        "calories": 600,
        "proteinG": 20,
        "carbsG": 80,
        "fatG": 20,
        "servingSize": "1 pizza",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "mp4",
        "name": "Jasper Pizza",
        "calories": 720,
        "proteinG": 30,
        "carbsG": 82,
        "fatG": 28,
        "servingSize": "1 pizza"
      },
      {
        "id": "mp5",
        "name": "Dillon James Pizza",
        "calories": 710,
        "proteinG": 28,
        "carbsG": 82,
        "fatG": 28,
        "servingSize": "1 pizza"
      },
      {
        "id": "mp6",
        "name": "Mad Dog Pizza",
        "calories": 740,
        "proteinG": 32,
        "carbsG": 82,
        "fatG": 30,
        "servingSize": "1 pizza"
      },
      {
        "id": "mp7",
        "name": "Salad - Mini",
        "calories": 180,
        "proteinG": 6,
        "carbsG": 14,
        "fatG": 12,
        "servingSize": "1 mini salad",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "mp8",
        "name": "No-Bake Cookie",
        "calories": 280,
        "proteinG": 4,
        "carbsG": 42,
        "fatG": 12,
        "servingSize": "1 cookie",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "bostonmkt",
    "name": "Boston Market",
    "category": "American",
    "emoji": "🍗",
    "items": [
      {
        "id": "bm1",
        "name": "Rotisserie Chicken Half",
        "calories": 480,
        "proteinG": 60,
        "carbsG": 4,
        "fatG": 24,
        "servingSize": "1 half",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "bm2",
        "name": "Meatloaf",
        "calories": 480,
        "proteinG": 26,
        "carbsG": 38,
        "fatG": 22,
        "servingSize": "1 serving"
      },
      {
        "id": "bm3",
        "name": "Turkey Breast",
        "calories": 180,
        "proteinG": 34,
        "carbsG": 3,
        "fatG": 4,
        "servingSize": "5 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "bm4",
        "name": "Mac & Cheese",
        "calories": 310,
        "proteinG": 11,
        "carbsG": 40,
        "fatG": 11,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bm5",
        "name": "Sweet Potato Casserole",
        "calories": 460,
        "proteinG": 5,
        "carbsG": 90,
        "fatG": 9,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bm6",
        "name": "Cornbread",
        "calories": 180,
        "proteinG": 3,
        "carbsG": 31,
        "fatG": 5,
        "servingSize": "1 piece",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bm7",
        "name": "Creamed Spinach",
        "calories": 190,
        "proteinG": 7,
        "carbsG": 12,
        "fatG": 13,
        "servingSize": "1 serving",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "bm8",
        "name": "Chicken Pot Pie",
        "calories": 750,
        "proteinG": 28,
        "carbsG": 78,
        "fatG": 36,
        "servingSize": "1 pie"
      }
    ]
  },
  {
    "id": "corkyspizza",
    "name": "Corrientes 348",
    "category": "Argentinian",
    "emoji": "🥩",
    "items": [
      {
        "id": "co1",
        "name": "Empanadas 3pc",
        "calories": 420,
        "proteinG": 22,
        "carbsG": 42,
        "fatG": 18,
        "servingSize": "3 pieces"
      },
      {
        "id": "co2",
        "name": "Lomo Sandwich",
        "calories": 680,
        "proteinG": 44,
        "carbsG": 52,
        "fatG": 28,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "co3",
        "name": "Milanesa Napolitana",
        "calories": 820,
        "proteinG": 52,
        "carbsG": 58,
        "fatG": 36,
        "servingSize": "1 plate"
      },
      {
        "id": "co4",
        "name": "Grilled Skirt Steak",
        "calories": 520,
        "proteinG": 56,
        "carbsG": 4,
        "fatG": 28,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "co5",
        "name": "Choripan",
        "calories": 560,
        "proteinG": 26,
        "carbsG": 48,
        "fatG": 28,
        "servingSize": "1 sandwich"
      },
      {
        "id": "co6",
        "name": "Provoleta (Grilled Cheese)",
        "calories": 380,
        "proteinG": 20,
        "carbsG": 4,
        "fatG": 30,
        "servingSize": "1 serving",
        "tags": ["vegetarian", "gluten-free"]
      },
      {
        "id": "co7",
        "name": "Argentine Asado Plate",
        "calories": 780,
        "proteinG": 68,
        "carbsG": 6,
        "fatG": 52,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      }
    ]
  },
  {
    "id": "faz",
    "name": "Fazoli's",
    "category": "Italian",
    "emoji": "🍝",
    "items": [
      {
        "id": "fa1",
        "name": "Spaghetti w/ Meat Sauce",
        "calories": 620,
        "proteinG": 28,
        "carbsG": 86,
        "fatG": 16,
        "servingSize": "1 plate"
      },
      {
        "id": "fa2",
        "name": "Chicken Parmigiana",
        "calories": 780,
        "proteinG": 54,
        "carbsG": 78,
        "fatG": 26,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "fa3",
        "name": "Fettuccine Alfredo",
        "calories": 740,
        "proteinG": 24,
        "carbsG": 96,
        "fatG": 28,
        "servingSize": "1 plate",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fa4",
        "name": "Baked Lasagna",
        "calories": 620,
        "proteinG": 32,
        "carbsG": 66,
        "fatG": 24,
        "servingSize": "1 plate"
      },
      {
        "id": "fa5",
        "name": "Broccoli Cheese Stuffed Fettuccine",
        "calories": 680,
        "proteinG": 24,
        "carbsG": 90,
        "fatG": 24,
        "servingSize": "1 plate",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "fa6",
        "name": "Breadstick",
        "calories": 100,
        "proteinG": 4,
        "carbsG": 18,
        "fatG": 1,
        "servingSize": "1 breadstick",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "fa7",
        "name": "Caesar Salad Side",
        "calories": 240,
        "proteinG": 6,
        "carbsG": 16,
        "fatG": 17,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "cheddars",
    "name": "Cheddar's Scratch Kitchen",
    "category": "American",
    "emoji": "🧀",
    "items": [
      {
        "id": "chs1",
        "name": "Honey Butter Croissant Chicken",
        "calories": 1010,
        "proteinG": 62,
        "carbsG": 82,
        "fatG": 46,
        "servingSize": "1 plate"
      },
      {
        "id": "chs2",
        "name": "Salmon",
        "calories": 520,
        "proteinG": 52,
        "carbsG": 14,
        "fatG": 26,
        "servingSize": "8 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "chs3",
        "name": "Chicken Tenders Full",
        "calories": 1180,
        "proteinG": 60,
        "carbsG": 84,
        "fatG": 62,
        "servingSize": "full order"
      },
      {
        "id": "chs4",
        "name": "Baby Back Ribs Half",
        "calories": 740,
        "proteinG": 46,
        "carbsG": 52,
        "fatG": 34,
        "servingSize": "half rack"
      },
      {
        "id": "chs5",
        "name": "Santa Fe Spinach Dip",
        "calories": 760,
        "proteinG": 20,
        "carbsG": 60,
        "fatG": 50,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "chs6",
        "name": "Grilled Chicken Salad",
        "calories": 510,
        "proteinG": 46,
        "carbsG": 28,
        "fatG": 22,
        "servingSize": "1 salad",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "chs7",
        "name": "New Orleans Pasta",
        "calories": 1420,
        "proteinG": 52,
        "carbsG": 130,
        "fatG": 72,
        "servingSize": "1 plate"
      },
      {
        "id": "chs8",
        "name": "Triple Chocolate Meltdown",
        "calories": 780,
        "proteinG": 8,
        "carbsG": 102,
        "fatG": 38,
        "servingSize": "1 dessert",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "logans",
    "name": "Logan's Roadhouse",
    "category": "Steakhouse",
    "emoji": "🥩",
    "items": [
      {
        "id": "lg1",
        "name": "6oz Sirloin",
        "calories": 220,
        "proteinG": 28,
        "carbsG": 0,
        "fatG": 12,
        "servingSize": "6 oz",
        "tags": ["high-protein", "gluten-free", "low-cal"]
      },
      {
        "id": "lg2",
        "name": "Mesquite Grilled Chicken",
        "calories": 260,
        "proteinG": 44,
        "carbsG": 2,
        "fatG": 8,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "lg3",
        "name": "Bourbon Street Chicken",
        "calories": 580,
        "proteinG": 46,
        "carbsG": 42,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "lg4",
        "name": "Country Fried Steak",
        "calories": 860,
        "proteinG": 34,
        "carbsG": 72,
        "fatG": 48,
        "servingSize": "1 plate"
      },
      {
        "id": "lg5",
        "name": "Rails Shrimp",
        "calories": 440,
        "proteinG": 38,
        "carbsG": 14,
        "fatG": 24,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "lg6",
        "name": "Yeast Rolls",
        "calories": 160,
        "proteinG": 5,
        "carbsG": 28,
        "fatG": 4,
        "servingSize": "1 roll",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "lg7",
        "name": "Made-From-Scratch Chili",
        "calories": 340,
        "proteinG": 24,
        "carbsG": 30,
        "fatG": 12,
        "servingSize": "1 bowl",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "lg8",
        "name": "Apple Butter Skillet Cookie",
        "calories": 860,
        "proteinG": 10,
        "carbsG": 116,
        "fatG": 40,
        "servingSize": "1 dessert",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "jasonsshack",
    "name": "Shake Shack Dallas",
    "category": "Fast Casual",
    "emoji": "🥛",
    "items": [
      {
        "id": "shd1",
        "name": "Shroom Burger",
        "calories": 540,
        "proteinG": 18,
        "carbsG": 40,
        "fatG": 34,
        "servingSize": "1 burger",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "shd2",
        "name": "SmokeShack Double",
        "calories": 930,
        "proteinG": 58,
        "carbsG": 42,
        "fatG": 62,
        "servingSize": "1 burger"
      },
      {
        "id": "shd3",
        "name": "Avocado Bacon Burger",
        "calories": 660,
        "proteinG": 30,
        "carbsG": 42,
        "fatG": 42,
        "servingSize": "1 burger"
      },
      {
        "id": "shd4",
        "name": "Hot Chick'n",
        "calories": 540,
        "proteinG": 30,
        "carbsG": 42,
        "fatG": 24,
        "servingSize": "1 sandwich"
      },
      {
        "id": "shd5",
        "name": "Flat-Top Dog",
        "calories": 430,
        "proteinG": 15,
        "carbsG": 37,
        "fatG": 24,
        "servingSize": "1 dog"
      },
      {
        "id": "shd6",
        "name": "Cheese Fries",
        "calories": 530,
        "proteinG": 14,
        "carbsG": 54,
        "fatG": 28,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "shd7",
        "name": "Frozen Custard",
        "calories": 380,
        "proteinG": 8,
        "carbsG": 60,
        "fatG": 12,
        "servingSize": "1 concrete",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "mooyah",
    "name": "MOOYAH Burgers",
    "category": "Burgers",
    "emoji": "🐄",
    "items": [
      {
        "id": "my1",
        "name": "MOOYAH Burger",
        "calories": 600,
        "proteinG": 34,
        "carbsG": 44,
        "fatG": 30,
        "servingSize": "1 burger"
      },
      {
        "id": "my2",
        "name": "Turkey Burger",
        "calories": 510,
        "proteinG": 36,
        "carbsG": 44,
        "fatG": 18,
        "servingSize": "1 burger",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "my3",
        "name": "Veggie Burger",
        "calories": 460,
        "proteinG": 16,
        "carbsG": 56,
        "fatG": 16,
        "servingSize": "1 burger",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "my4",
        "name": "Double Burger",
        "calories": 820,
        "proteinG": 56,
        "carbsG": 44,
        "fatG": 48,
        "servingSize": "1 burger",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "my5",
        "name": "Sweet Potato Fries",
        "calories": 330,
        "proteinG": 4,
        "carbsG": 52,
        "fatG": 13,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "my6",
        "name": "Loaded Fries",
        "calories": 560,
        "proteinG": 18,
        "carbsG": 52,
        "fatG": 32,
        "servingSize": "1 order"
      },
      {
        "id": "my7",
        "name": "Vanilla Shake",
        "calories": 550,
        "proteinG": 12,
        "carbsG": 84,
        "fatG": 18,
        "servingSize": "1 shake",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "pitajungle",
    "name": "Pita Jungle",
    "category": "Mediterranean",
    "emoji": "🫙",
    "items": [
      {
        "id": "pj1",
        "name": "Chicken Kabob Pita",
        "calories": 580,
        "proteinG": 46,
        "carbsG": 60,
        "fatG": 14,
        "servingSize": "1 pita",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pj2",
        "name": "Falafel Plate",
        "calories": 540,
        "proteinG": 18,
        "carbsG": 68,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "pj3",
        "name": "Quinoa Tabbouleh",
        "calories": 280,
        "proteinG": 8,
        "carbsG": 48,
        "fatG": 8,
        "servingSize": "1 bowl",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "pj4",
        "name": "Mezza Plate",
        "calories": 620,
        "proteinG": 18,
        "carbsG": 70,
        "fatG": 30,
        "servingSize": "1 plate",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pj5",
        "name": "Grilled Salmon Plate",
        "calories": 420,
        "proteinG": 50,
        "carbsG": 18,
        "fatG": 16,
        "servingSize": "1 plate",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "pj6",
        "name": "Power Bowl",
        "calories": 480,
        "proteinG": 32,
        "carbsG": 54,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pj7",
        "name": "Lemon Rice Soup",
        "calories": 190,
        "proteinG": 6,
        "carbsG": 32,
        "fatG": 4,
        "servingSize": "1 bowl",
        "tags": ["vegetarian", "low-cal"]
      }
    ]
  },
  {
    "id": "koreanspot",
    "name": "Korean Palace",
    "category": "Korean",
    "emoji": "🥢",
    "items": [
      {
        "id": "kp1",
        "name": "Bibimbap - Beef",
        "calories": 620,
        "proteinG": 36,
        "carbsG": 78,
        "fatG": 16,
        "servingSize": "1 bowl",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "kp2",
        "name": "Bulgogi Bowl",
        "calories": 580,
        "proteinG": 40,
        "carbsG": 62,
        "fatG": 18,
        "servingSize": "1 bowl",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "kp3",
        "name": "Japchae (Glass Noodles)",
        "calories": 460,
        "proteinG": 18,
        "carbsG": 72,
        "fatG": 12,
        "servingSize": "1 plate",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "kp4",
        "name": "Korean Fried Chicken 8pc",
        "calories": 680,
        "proteinG": 48,
        "carbsG": 42,
        "fatG": 32,
        "servingSize": "8 pieces",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "kp5",
        "name": "Kimchi Jjigae (Stew)",
        "calories": 380,
        "proteinG": 24,
        "carbsG": 32,
        "fatG": 16,
        "servingSize": "1 bowl",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "kp6",
        "name": "Mandu Dumplings 6pc",
        "calories": 300,
        "proteinG": 16,
        "carbsG": 36,
        "fatG": 10,
        "servingSize": "6 pieces"
      },
      {
        "id": "kp7",
        "name": "Tteokbokki",
        "calories": 340,
        "proteinG": 8,
        "carbsG": 62,
        "fatG": 8,
        "servingSize": "1 plate",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "kp8",
        "name": "Bibim Guksu",
        "calories": 420,
        "proteinG": 14,
        "carbsG": 72,
        "fatG": 10,
        "servingSize": "1 plate",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "indiantemple",
    "name": "Saffron Indian Cuisine",
    "category": "Indian",
    "emoji": "🍛",
    "items": [
      {
        "id": "ic1",
        "name": "Chicken Tikka Masala",
        "calories": 520,
        "proteinG": 42,
        "carbsG": 38,
        "fatG": 20,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ic2",
        "name": "Palak Paneer",
        "calories": 440,
        "proteinG": 18,
        "carbsG": 32,
        "fatG": 28,
        "servingSize": "1 plate",
        "tags": ["vegetarian", "gluten-free"]
      },
      {
        "id": "ic3",
        "name": "Lamb Biryani",
        "calories": 680,
        "proteinG": 44,
        "carbsG": 72,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ic4",
        "name": "Chana Masala",
        "calories": 360,
        "proteinG": 16,
        "carbsG": 58,
        "fatG": 8,
        "servingSize": "1 plate",
        "tags": ["vegan", "gluten-free"]
      },
      {
        "id": "ic5",
        "name": "Tandoori Chicken Half",
        "calories": 320,
        "proteinG": 48,
        "carbsG": 8,
        "fatG": 12,
        "servingSize": "1 half",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "ic6",
        "name": "Garlic Naan",
        "calories": 260,
        "proteinG": 8,
        "carbsG": 44,
        "fatG": 6,
        "servingSize": "1 piece",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ic7",
        "name": "Mango Lassi",
        "calories": 280,
        "proteinG": 8,
        "carbsG": 52,
        "fatG": 6,
        "servingSize": "1 glass",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ic8",
        "name": "Samosas 2pc",
        "calories": 320,
        "proteinG": 8,
        "carbsG": 42,
        "fatG": 14,
        "servingSize": "2 pieces",
        "tags": [
          "vegan"
        ]
      }
    ]
  },
  {
    "id": "ethan",
    "name": "Elote Café",
    "category": "Mexican Elevated",
    "emoji": "🌽",
    "items": [
      {
        "id": "ec1",
        "name": "Elote Street Corn",
        "calories": 320,
        "proteinG": 8,
        "carbsG": 42,
        "fatG": 14,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ec2",
        "name": "Carne Asada Tacos",
        "calories": 560,
        "proteinG": 44,
        "carbsG": 44,
        "fatG": 20,
        "servingSize": "3 tacos",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ec3",
        "name": "Shrimp Tacos Verde",
        "calories": 460,
        "proteinG": 32,
        "carbsG": 46,
        "fatG": 16,
        "servingSize": "3 tacos",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "ec4",
        "name": "Chile Colorado",
        "calories": 540,
        "proteinG": 46,
        "carbsG": 28,
        "fatG": 24,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ec5",
        "name": "Tamales 2pc",
        "calories": 480,
        "proteinG": 22,
        "carbsG": 60,
        "fatG": 18,
        "servingSize": "2 tamales",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ec6",
        "name": "Sopas (Bean Soup)",
        "calories": 240,
        "proteinG": 12,
        "carbsG": 38,
        "fatG": 6,
        "servingSize": "1 bowl",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "ec7",
        "name": "Churros",
        "calories": 360,
        "proteinG": 5,
        "carbsG": 56,
        "fatG": 14,
        "servingSize": "3 pieces",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "greekcafe",
    "name": "Nosh & Bottle",
    "category": "Wine Bar",
    "emoji": "🍷",
    "items": [
      {
        "id": "nb1",
        "name": "Cheese Board",
        "calories": 680,
        "proteinG": 24,
        "carbsG": 28,
        "fatG": 50,
        "servingSize": "1 board",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "nb2",
        "name": "Charcuterie Board",
        "calories": 760,
        "proteinG": 36,
        "carbsG": 22,
        "fatG": 56,
        "servingSize": "1 board"
      },
      {
        "id": "nb3",
        "name": "Avocado Bruschetta",
        "calories": 340,
        "proteinG": 8,
        "carbsG": 38,
        "fatG": 18,
        "servingSize": "1 serving",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "nb4",
        "name": "Grilled Salmon",
        "calories": 480,
        "proteinG": 52,
        "carbsG": 12,
        "fatG": 22,
        "servingSize": "8 oz",
        "tags": ["high-protein", "gluten-free", "low-cal"]
      },
      {
        "id": "nb5",
        "name": "Short Rib Flatbread",
        "calories": 680,
        "proteinG": 34,
        "carbsG": 56,
        "fatG": 34,
        "servingSize": "1 flatbread"
      },
      {
        "id": "nb6",
        "name": "Truffle Arancini",
        "calories": 420,
        "proteinG": 14,
        "carbsG": 52,
        "fatG": 18,
        "servingSize": "4 pieces",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "nb7",
        "name": "Kale Caesar",
        "calories": 310,
        "proteinG": 12,
        "carbsG": 22,
        "fatG": 20,
        "servingSize": "1 salad",
        "tags": ["vegetarian", "low-cal"]
      }
    ]
  },
  {
    "id": "hardseven",
    "name": "Hard Eight BBQ",
    "category": "BBQ",
    "emoji": "🎱",
    "items": [
      {
        "id": "h8_1",
        "name": "Brisket Plate",
        "calories": 820,
        "proteinG": 58,
        "carbsG": 28,
        "fatG": 56,
        "servingSize": "1 plate"
      },
      {
        "id": "h8_2",
        "name": "Pork Ribs Half Rack",
        "calories": 940,
        "proteinG": 52,
        "carbsG": 12,
        "fatG": 72,
        "servingSize": "half rack"
      },
      {
        "id": "h8_3",
        "name": "Smoked Turkey Leg",
        "calories": 660,
        "proteinG": 80,
        "carbsG": 4,
        "fatG": 32,
        "servingSize": "1 leg",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "h8_4",
        "name": "Beef Ribs",
        "calories": 1080,
        "proteinG": 68,
        "carbsG": 6,
        "fatG": 84,
        "servingSize": "1 rib"
      },
      {
        "id": "h8_5",
        "name": "Sausage Links 2pc",
        "calories": 640,
        "proteinG": 28,
        "carbsG": 10,
        "fatG": 54,
        "servingSize": "2 links"
      },
      {
        "id": "h8_6",
        "name": "Jalapeño Mac & Cheese",
        "calories": 380,
        "proteinG": 16,
        "carbsG": 50,
        "fatG": 14,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "h8_7",
        "name": "Smoked Corn",
        "calories": 140,
        "proteinG": 4,
        "carbsG": 28,
        "fatG": 4,
        "servingSize": "1 ear",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "h8_8",
        "name": "Peach Cobbler",
        "calories": 400,
        "proteinG": 5,
        "carbsG": 66,
        "fatG": 14,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "tacodave",
    "name": "Dave's Hot Chicken",
    "category": "Chicken",
    "emoji": "🌶️",
    "items": [
      {
        "id": "dhc1",
        "name": "Chicken Tender Plate (3pc)",
        "calories": 680,
        "proteinG": 56,
        "carbsG": 40,
        "fatG": 28,
        "servingSize": "3 tenders",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "dhc2",
        "name": "Slider (2pc)",
        "calories": 560,
        "proteinG": 38,
        "carbsG": 46,
        "fatG": 18,
        "servingSize": "2 sliders"
      },
      {
        "id": "dhc3",
        "name": "Chicken Sandwich",
        "calories": 640,
        "proteinG": 46,
        "carbsG": 52,
        "fatG": 22,
        "servingSize": "1 sandwich",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "dhc4",
        "name": "Chicken Bites",
        "calories": 380,
        "proteinG": 34,
        "carbsG": 22,
        "fatG": 16,
        "servingSize": "1 cup",
        "tags": ["high-protein", "low-cal"]
      },
      {
        "id": "dhc5",
        "name": "Mac & Cheese",
        "calories": 320,
        "proteinG": 12,
        "carbsG": 44,
        "fatG": 12,
        "servingSize": "1 side",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "dhc6",
        "name": "Kale Slaw",
        "calories": 120,
        "proteinG": 3,
        "carbsG": 14,
        "fatG": 6,
        "servingSize": "1 side",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "dhc7",
        "name": "Cheese Fries",
        "calories": 480,
        "proteinG": 16,
        "carbsG": 56,
        "fatG": 22,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "blaze",
    "name": "Blaze Pizza",
    "category": "Pizza",
    "emoji": "🔥",
    "items": [
      {
        "id": "bl1",
        "name": "11\" Build-Your-Own (avg)",
        "calories": 660,
        "proteinG": 26,
        "carbsG": 84,
        "fatG": 22,
        "servingSize": "1 pizza"
      },
      {
        "id": "bl2",
        "name": "Red Vine Pizza",
        "calories": 640,
        "proteinG": 24,
        "carbsG": 84,
        "fatG": 22,
        "servingSize": "1 pizza"
      },
      {
        "id": "bl3",
        "name": "White Top Pizza",
        "calories": 680,
        "proteinG": 26,
        "carbsG": 82,
        "fatG": 26,
        "servingSize": "1 pizza"
      },
      {
        "id": "bl4",
        "name": "Art Lover Pizza",
        "calories": 620,
        "proteinG": 22,
        "carbsG": 84,
        "fatG": 20,
        "servingSize": "1 pizza",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bl5",
        "name": "High Street Pizza",
        "calories": 700,
        "proteinG": 28,
        "carbsG": 84,
        "fatG": 28,
        "servingSize": "1 pizza"
      },
      {
        "id": "bl6",
        "name": "Salad - Build Your Own",
        "calories": 340,
        "proteinG": 18,
        "carbsG": 28,
        "fatG": 18,
        "servingSize": "1 salad",
        "tags": [
          "low-cal"
        ]
      },
      {
        "id": "bl7",
        "name": "Lava Cake",
        "calories": 350,
        "proteinG": 4,
        "carbsG": 52,
        "fatG": 14,
        "servingSize": "1 cake",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "crumbl",
    "name": "Crumbl Cookies",
    "category": "Bakery",
    "emoji": "🍪",
    "items": [
      {
        "id": "cc1",
        "name": "Pink Sugar Cookie",
        "calories": 530,
        "proteinG": 5,
        "carbsG": 78,
        "fatG": 22,
        "servingSize": "1 cookie",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cc2",
        "name": "Milk Chocolate Chip Cookie",
        "calories": 680,
        "proteinG": 7,
        "carbsG": 88,
        "fatG": 34,
        "servingSize": "1 cookie",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cc3",
        "name": "Churro Cookie",
        "calories": 620,
        "proteinG": 5,
        "carbsG": 86,
        "fatG": 28,
        "servingSize": "1 cookie",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cc4",
        "name": "Red Velvet Cookie",
        "calories": 600,
        "proteinG": 6,
        "carbsG": 82,
        "fatG": 28,
        "servingSize": "1 cookie",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cc5",
        "name": "Lemon Glaze Cookie",
        "calories": 520,
        "proteinG": 4,
        "carbsG": 76,
        "fatG": 22,
        "servingSize": "1 cookie",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cc6",
        "name": "S'mores Cookie",
        "calories": 640,
        "proteinG": 7,
        "carbsG": 88,
        "fatG": 30,
        "servingSize": "1 cookie",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cc7",
        "name": "Snickerdoodle Cookie",
        "calories": 560,
        "proteinG": 5,
        "carbsG": 82,
        "fatG": 24,
        "servingSize": "1 cookie",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "pappasitos",
    "name": "Pappasito's Cantina",
    "category": "Mexican",
    "emoji": "🌮",
    "items": [
      {
        "id": "pp1",
        "name": "Steak Fajitas",
        "calories": 960,
        "proteinG": 64,
        "carbsG": 54,
        "fatG": 46,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pp2",
        "name": "Chicken Fajitas",
        "calories": 820,
        "proteinG": 72,
        "carbsG": 54,
        "fatG": 24,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pp3",
        "name": "Carnitas Plate",
        "calories": 780,
        "proteinG": 56,
        "carbsG": 48,
        "fatG": 38,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "pp4",
        "name": "Shrimp Fajitas",
        "calories": 680,
        "proteinG": 52,
        "carbsG": 54,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "pp5",
        "name": "Beef Enchiladas",
        "calories": 720,
        "proteinG": 36,
        "carbsG": 64,
        "fatG": 32,
        "servingSize": "3 enchiladas"
      },
      {
        "id": "pp6",
        "name": "Queso Flameado",
        "calories": 480,
        "proteinG": 24,
        "carbsG": 16,
        "fatG": 36,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pp7",
        "name": "Guacamole",
        "calories": 200,
        "proteinG": 3,
        "carbsG": 12,
        "fatG": 18,
        "servingSize": "1 cup",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "pp8",
        "name": "Sopapillas",
        "calories": 280,
        "proteinG": 4,
        "carbsG": 40,
        "fatG": 12,
        "servingSize": "3 pieces",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "pp9",
        "name": "Margarita",
        "calories": 240,
        "proteinG": 0,
        "carbsG": 28,
        "fatG": 0,
        "servingSize": "1 glass"
      }
    ]
  },
  {
    "id": "claypigeon",
    "name": "Clay Pigeon Food + Drink",
    "category": "Modern American",
    "emoji": "🐦",
    "items": [
      {
        "id": "cpf1",
        "name": "Dry-Aged Burger",
        "calories": 860,
        "proteinG": 52,
        "carbsG": 56,
        "fatG": 48,
        "servingSize": "1 burger"
      },
      {
        "id": "cpf2",
        "name": "Pan-Seared Salmon",
        "calories": 520,
        "proteinG": 52,
        "carbsG": 18,
        "fatG": 24,
        "servingSize": "7 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "cpf3",
        "name": "Roasted Chicken",
        "calories": 580,
        "proteinG": 60,
        "carbsG": 18,
        "fatG": 28,
        "servingSize": "1 half",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "cpf4",
        "name": "Pork Chop",
        "calories": 640,
        "proteinG": 54,
        "carbsG": 14,
        "fatG": 42,
        "servingSize": "12 oz",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "cpf5",
        "name": "Burrata & Heirloom Tomato",
        "calories": 360,
        "proteinG": 14,
        "carbsG": 18,
        "fatG": 28,
        "servingSize": "1 plate",
        "tags": ["vegetarian", "low-cal"]
      },
      {
        "id": "cpf6",
        "name": "Charred Broccolini",
        "calories": 140,
        "proteinG": 5,
        "carbsG": 16,
        "fatG": 7,
        "servingSize": "1 side",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "cpf7",
        "name": "Chocolate Budino",
        "calories": 480,
        "proteinG": 8,
        "carbsG": 62,
        "fatG": 22,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "soulman",
    "name": "Soulman's BBQ",
    "category": "BBQ",
    "emoji": "🍖",
    "items": [
      {
        "id": "sm1",
        "name": "Brisket Dinner",
        "calories": 780,
        "proteinG": 56,
        "carbsG": 32,
        "fatG": 52,
        "servingSize": "1 dinner"
      },
      {
        "id": "sm2",
        "name": "Ribs Half Rack",
        "calories": 920,
        "proteinG": 50,
        "carbsG": 14,
        "fatG": 72,
        "servingSize": "half rack"
      },
      {
        "id": "sm3",
        "name": "Chicken Dinner",
        "calories": 560,
        "proteinG": 56,
        "carbsG": 20,
        "fatG": 24,
        "servingSize": "1 dinner",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "sm4",
        "name": "Link Sausage",
        "calories": 320,
        "proteinG": 16,
        "carbsG": 4,
        "fatG": 28,
        "servingSize": "1 link"
      },
      {
        "id": "sm5",
        "name": "Beef Sandwich",
        "calories": 640,
        "proteinG": 42,
        "carbsG": 54,
        "fatG": 28,
        "servingSize": "1 sandwich"
      },
      {
        "id": "sm6",
        "name": "Potato Salad",
        "calories": 220,
        "proteinG": 4,
        "carbsG": 28,
        "fatG": 11,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sm7",
        "name": "Coleslaw",
        "calories": 150,
        "proteinG": 2,
        "carbsG": 18,
        "fatG": 8,
        "servingSize": "1 cup",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "sm8",
        "name": "Peach Cobbler",
        "calories": 360,
        "proteinG": 4,
        "carbsG": 60,
        "fatG": 13,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "hopdoddy",
    "name": "Hopdoddy Burger Bar",
    "category": "Burgers",
    "emoji": "🍔",
    "items": [
      {
        "id": "hd1",
        "name": "Classic Burger",
        "calories": 680,
        "proteinG": 38,
        "carbsG": 52,
        "fatG": 32,
        "servingSize": "1 burger"
      },
      {
        "id": "hd2",
        "name": "El Diablo Burger",
        "calories": 760,
        "proteinG": 44,
        "carbsG": 54,
        "fatG": 40,
        "servingSize": "1 burger"
      },
      {
        "id": "hd3",
        "name": "Truffle Burger",
        "calories": 780,
        "proteinG": 40,
        "carbsG": 54,
        "fatG": 42,
        "servingSize": "1 burger"
      },
      {
        "id": "hd4",
        "name": "Impossible Burger",
        "calories": 630,
        "proteinG": 28,
        "carbsG": 56,
        "fatG": 28,
        "servingSize": "1 burger",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "hd5",
        "name": "Ahi Tuna Burger",
        "calories": 560,
        "proteinG": 42,
        "carbsG": 52,
        "fatG": 18,
        "servingSize": "1 burger",
        "tags": [
          "high-protein"
        ]
      },
      {
        "id": "hd6",
        "name": "Magic Shroom Burger",
        "calories": 640,
        "proteinG": 22,
        "carbsG": 58,
        "fatG": 32,
        "servingSize": "1 burger",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "hd7",
        "name": "Parmesan Truffle Fries",
        "calories": 440,
        "proteinG": 8,
        "carbsG": 54,
        "fatG": 22,
        "servingSize": "1 order",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "eatzis",
    "name": "Eatzi's Market & Bakery",
    "category": "Market Café",
    "emoji": "🛒",
    "items": [
      {
        "id": "ez1",
        "name": "Rotisserie Chicken",
        "calories": 420,
        "proteinG": 52,
        "carbsG": 4,
        "fatG": 22,
        "servingSize": "half",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "ez2",
        "name": "Grilled Salmon",
        "calories": 380,
        "proteinG": 46,
        "carbsG": 0,
        "fatG": 20,
        "servingSize": "6 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "ez3",
        "name": "Pasta Primavera",
        "calories": 520,
        "proteinG": 16,
        "carbsG": 80,
        "fatG": 14,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "ez4",
        "name": "Caprese Salad",
        "calories": 280,
        "proteinG": 12,
        "carbsG": 12,
        "fatG": 20,
        "servingSize": "1 salad",
        "tags": ["vegetarian", "low-cal", "gluten-free"]
      },
      {
        "id": "ez5",
        "name": "Artisan Sandwich",
        "calories": 560,
        "proteinG": 28,
        "carbsG": 60,
        "fatG": 20,
        "servingSize": "1 sandwich"
      },
      {
        "id": "ez6",
        "name": "Fresh Fruit Cup",
        "calories": 80,
        "proteinG": 1,
        "carbsG": 18,
        "fatG": 0,
        "servingSize": "1 cup",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "ez7",
        "name": "Chocolate Brownie",
        "calories": 380,
        "proteinG": 5,
        "carbsG": 56,
        "fatG": 16,
        "servingSize": "1 brownie",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "catchandfry",
    "name": "Catch N Fry Seafood",
    "category": "Seafood",
    "emoji": "🦐",
    "items": [
      {
        "id": "cf1",
        "name": "Fried Catfish Plate",
        "calories": 680,
        "proteinG": 38,
        "carbsG": 62,
        "fatG": 30,
        "servingSize": "1 plate"
      },
      {
        "id": "cf2",
        "name": "Fried Shrimp Plate",
        "calories": 640,
        "proteinG": 32,
        "carbsG": 68,
        "fatG": 28,
        "servingSize": "1 plate"
      },
      {
        "id": "cf3",
        "name": "Grilled Tilapia",
        "calories": 320,
        "proteinG": 48,
        "carbsG": 8,
        "fatG": 12,
        "servingSize": "8 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "cf4",
        "name": "Seafood Combo Plate",
        "calories": 820,
        "proteinG": 44,
        "carbsG": 72,
        "fatG": 38,
        "servingSize": "1 combo"
      },
      {
        "id": "cf5",
        "name": "Fish Sandwich",
        "calories": 580,
        "proteinG": 28,
        "carbsG": 58,
        "fatG": 24,
        "servingSize": "1 sandwich"
      },
      {
        "id": "cf6",
        "name": "Hush Puppies",
        "calories": 240,
        "proteinG": 5,
        "carbsG": 34,
        "fatG": 10,
        "servingSize": "4 pieces",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "cf7",
        "name": "Coleslaw",
        "calories": 130,
        "proteinG": 1,
        "carbsG": 16,
        "fatG": 7,
        "servingSize": "1 cup",
        "tags": ["vegetarian", "low-cal"]
      }
    ]
  },
  {
    "id": "localmkt",
    "name": "The Local",
    "category": "Farm-to-Table",
    "emoji": "🌾",
    "items": [
      {
        "id": "lm1",
        "name": "Farm Burger",
        "calories": 720,
        "proteinG": 44,
        "carbsG": 52,
        "fatG": 36,
        "servingSize": "1 burger"
      },
      {
        "id": "lm2",
        "name": "Roasted Chicken Plate",
        "calories": 520,
        "proteinG": 58,
        "carbsG": 18,
        "fatG": 22,
        "servingSize": "1 plate",
        "tags": ["high-protein", "gluten-free"]
      },
      {
        "id": "lm3",
        "name": "Beet & Arugula Salad",
        "calories": 280,
        "proteinG": 10,
        "carbsG": 28,
        "fatG": 16,
        "servingSize": "1 salad",
        "tags": ["vegan", "low-cal"]
      },
      {
        "id": "lm4",
        "name": "Seasonal Grain Bowl",
        "calories": 460,
        "proteinG": 18,
        "carbsG": 66,
        "fatG": 14,
        "servingSize": "1 bowl",
        "tags": [
          "vegan"
        ]
      },
      {
        "id": "lm5",
        "name": "Pan-Seared Trout",
        "calories": 420,
        "proteinG": 48,
        "carbsG": 6,
        "fatG": 20,
        "servingSize": "6 oz",
        "tags": ["high-protein", "low-cal", "gluten-free"]
      },
      {
        "id": "lm6",
        "name": "Heirloom Tomato Toast",
        "calories": 360,
        "proteinG": 10,
        "carbsG": 42,
        "fatG": 16,
        "servingSize": "1 serving",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "lm7",
        "name": "Skillet Cookie",
        "calories": 640,
        "proteinG": 8,
        "carbsG": 86,
        "fatG": 30,
        "servingSize": "1 skillet",
        "tags": [
          "vegetarian"
        ]
      }
    ]
  },
  {
    "id": "burgerking",
    "name": "Burger King",
    "category": "Fast Food",
    "emoji": "👑",
    "items": [
      {
        "id": "bk1",
        "name": "Whopper",
        "calories": 660,
        "proteinG": 28,
        "carbsG": 49,
        "fatG": 40,
        "servingSize": "1 burger"
      },
      {
        "id": "bk2",
        "name": "Double Whopper",
        "calories": 900,
        "proteinG": 48,
        "carbsG": 50,
        "fatG": 56,
        "servingSize": "1 burger"
      },
      {
        "id": "bk3",
        "name": "Ch'King Sandwich",
        "calories": 700,
        "proteinG": 38,
        "carbsG": 66,
        "fatG": 28,
        "servingSize": "1 sandwich"
      },
      {
        "id": "bk4",
        "name": "Impossible Whopper",
        "calories": 630,
        "proteinG": 25,
        "carbsG": 58,
        "fatG": 34,
        "servingSize": "1 burger",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bk5",
        "name": "Crispy Chicken Sandwich",
        "calories": 660,
        "proteinG": 30,
        "carbsG": 62,
        "fatG": 31,
        "servingSize": "1 sandwich"
      },
      {
        "id": "bk6",
        "name": "Chicken Fries 9pc",
        "calories": 290,
        "proteinG": 18,
        "carbsG": 21,
        "fatG": 15,
        "servingSize": "9 pieces"
      },
      {
        "id": "bk7",
        "name": "Medium Fries",
        "calories": 380,
        "proteinG": 4,
        "carbsG": 53,
        "fatG": 17,
        "servingSize": "medium"
      },
      {
        "id": "bk8",
        "name": "Hershey Pie",
        "calories": 310,
        "proteinG": 4,
        "carbsG": 39,
        "fatG": 16,
        "servingSize": "1 slice",
        "tags": [
          "vegetarian"
        ]
      },
      {
        "id": "bk9",
        "name": "Spicy Crispy Chicken",
        "calories": 700,
        "proteinG": 30,
        "carbsG": 66,
        "fatG": 32,
        "servingSize": "1 sandwich"
      }
    ]
  }
];

export default RESTAURANTS;