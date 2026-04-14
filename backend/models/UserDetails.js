const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  // _id will be manually set to match User._id, so no explicit field definition needed here unless we want to validate it
  name: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  gender: { type: String, required: true },
  isDiabetic: Boolean,
  hasHypertension: Boolean,
  hasThyroid: Boolean,
  hasHeartDisease: Boolean,
  hasKidneyDisease: Boolean,
  hasOtherAllergies: String,
  cholesterolLevel: { type: String, default: "Normal" },
  foodAllergies: String,
  lifestyle: {
    exerciseFrequency: String,
    sleepHours: String,
    smoke: Boolean,
    alcohol: Boolean,
    waterIntake: String,
    stressLevel: String,
  },
  additionalDetails: {
    medications: String,
    dietaryPreference: String,
  }
}, { timestamps: true });

module.exports = mongoose.models.UserDetails || mongoose.model("UserDetails", userDetailsSchema);
