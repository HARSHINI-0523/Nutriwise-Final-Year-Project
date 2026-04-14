// backend/controllers/dietController.js
const DietPlan = require("../models/DietPlan");
const Food = require("../models/Food");
const Report = require("../models/Report");
const UserDetails = require("../models/UserDetails");
const { generateWeeklyPlan } = require("../services/dietGenerator");

exports.generateDiet = async (req, res) => {
  try {
    const { labReportId } = req.body;
    const userId = req.user.id;

    const report = await Report.findById(labReportId);
    if (!report) return res.status(404).json({ msg: "Report not found" });

    // User details OPTIONAL now
    const userDetails = await UserDetails.findOne({ user: userId });

    // If user details missing, create minimal object
    const safeUserDetails =
      userDetails ||
      ({
        age: 25,
        gender: "Unknown",
        weight: 60,
        height: 165,
      });

    const patterns = (report.analysis || []).map((p) =>
      p.toLowerCase().replace(/\s/g, "_")
    );

    const result = await generateWeeklyPlan(safeUserDetails, patterns);

    const saved = await DietPlan.create({
      user: userId,
      plan: result.weekly,
      groceryList: result.groceryList,
    });

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getLatestDietPlan = async (req, res) => {
  try {
    const plan = await DietPlan.findOne({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(plan || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
