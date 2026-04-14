// backend/services/dietGenerator.js
const Food = require("../models/Food");


const MEAL_MAPPING = {
  Breakfast: "breakfast",
  Lunch: "lunch/dinner",
  EveningSnack: "snack",
  Dinner: "lunch/dinner",
};


function applyHealthFilters(query, userDetails, patterns) {
  const filter = { ...query };

  // Example constraints — expand later if needed
  if (userDetails.isDiabetic || patterns.includes("high_glucose")) {
    filter.gi = { $lte: 55 }; // Prefer low-GI foods if GI exists in dataset
  }

  if (userDetails.hasHypertension || patterns.includes("high_sodium")) {
    filter.sodium_mg = { $lte: 400 };
  }

  if (userDetails.hasKidneyDisease) {
    filter.protein_g = { $lte: 20 };
    filter.potassium_mg = { $lte: 250 };
  }

  if (patterns.includes("high_cholesterol") || userDetails.cholesterolLevel === "High") {
    filter.fat_g = { $lte: 15 };
  }

  return filter;
}


async function pickOneFood(mealType, usedFoods, userDetails, patterns) {
  let filter = { meal_type: mealType };
  filter = applyHealthFilters(filter, userDetails, patterns);

  const foods = await Food.aggregate([{ $match: filter }, { $sample: { size: 1 } }]);

  if (!foods.length) return null;

  const food = foods[0];

  // avoid duplicates
  if (usedFoods.has(food._id.toString())) {
    return pickOneFood(mealType, usedFoods, userDetails, patterns); // retry
  }

  usedFoods.add(food._id.toString());
  return food;
}

async function generateDayPlan(userDetails, patterns, usedFoods) {
  return {
    Breakfast: await pickOneFood(MEAL_MAPPING.Breakfast, usedFoods, userDetails, patterns),
    Lunch: await pickOneFood(MEAL_MAPPING.Lunch, usedFoods, userDetails, patterns),
    EveningSnack: await pickOneFood(MEAL_MAPPING.EveningSnack, usedFoods, userDetails, patterns),
    Dinner: await pickOneFood(MEAL_MAPPING.Dinner, usedFoods, userDetails, patterns),
  };
}


function buildGroceryList(weeklyPlan) {
  const grocery = {};

  for (const day of Object.values(weeklyPlan)) {
    for (const meal of Object.values(day)) {
      if (!meal || !meal.ingredient) continue;

      const ingredients = meal.ingredient.split(",").map((i) => i.trim());

      ingredients.forEach((ing) => {
        grocery[ing] = (grocery[ing] || 0) + 1;
      });
    }
  }
  return grocery;
}

exports.generateWeeklyPlan = async function generateWeeklyPlan(
  userDetails,
  patterns
) {
  const week = {};
  const usedFoods = new Set();

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  for (const day of days) {
    week[day] = await generateDayPlan(userDetails, patterns, usedFoods);
  }

  const groceryList = buildGroceryList(week);

  return {
    weekly: week,
    groceryList,
  };
};
