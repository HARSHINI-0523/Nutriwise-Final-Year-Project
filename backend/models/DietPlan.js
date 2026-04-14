const mongoose = require("mongoose");

const DietPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  plan: { type: Object, required: true },
  groceryList: { type: Object, required: true },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DietPlan", DietPlanSchema);
