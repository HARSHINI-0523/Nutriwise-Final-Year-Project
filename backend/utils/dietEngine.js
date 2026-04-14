function calculateCalories(user) {
  const { age, gender, height, weight, lifestyle } = user;

  let BMR =
    gender === "Male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const activityFactor = {
    low: 1.2,
    medium: 1.45,
    high: 1.65,
  };

  const factor = activityFactor[lifestyle?.exerciseFrequency] || 1.3;

  return Math.round(BMR * factor);
}

function classifyHealthPatterns(user, labs) {
  const flags = [];

  if (labs.hba1c > 6.4 || labs.glucose_fasting > 126)
    flags.push("diabetes");

  if (labs.creatinine > 1.3)
    flags.push("kidney");

  if (labs.cholesterol_total > 200 || labs.ldl > 130)
    flags.push("cholesterol");

  if (labs.hemoglobin < 12)
    flags.push("anemia");

  if (labs.sgot_ast > 40 || labs.sgpt_alt > 40)
    flags.push("liver");

  if (user.hasHypertension)
    flags.push("hypertension");

  return flags;
}

function filterFoods(foods, user, flags) {
  return foods.filter((food) => {
    if (!food) return false;

    if (user.foodAllergies && food.allergens?.includes(user.foodAllergies))
      return false;

    if (flags.includes("diabetes") && food.gi > 55)
      return false;

    if (flags.includes("cholesterol") && food.fats > 12)
      return false;

    if (flags.includes("kidney") && food.protein > 18)
      return false;

    return true;
  });
}

function buildMealPlan(foods, calorieTarget) {
  const breakfast = foods.filter(f => f.meal === "breakfast").slice(0, 2);
  const lunch = foods.filter(f => f.meal === "lunch").slice(0, 3);
  const dinner = foods.filter(f => f.meal === "dinner").slice(0, 3);

  return {
    calorieTarget,
    meals: { breakfast, lunch, dinner }
  };
}

module.exports = {
  calculateCalories,
  classifyHealthPatterns,
  filterFoods,
  buildMealPlan
};
