const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  food_name: String,
  diet_type: String,          // Veg / Non-Veg / Vegan
  meal_type: String,          // Breakfast / Lunch / Snack / Dinner
  cuisine: String,            // Indian, South Indian, etc.
  ingredient: String,
  instructions: String,
  prep_time_min: Number,
  cook_time_min: Number,
  calories: Number,

  // Nutritional macros
  protein_g: Number,
  carbs_g: Number,
  fat_g: Number,

  // Health tags
  diabetic_friendly: Boolean,
  heart_friendly: Boolean,
  kidney_safe: Boolean,
  weight_loss: Boolean,
  thyroid_safe: Boolean,
});

module.exports = mongoose.model("Food", FoodSchema);
