const express = require("express");
const router = express.Router();
const UserDetails = require("../models/UserDetails");

const { protect } = require('../middleware/authMiddleware');

// POST: Save or Update user details
router.post("/", protect, async (req, res) => {
  try {
    // Construct ordered object to ensure BSON field order
    // Desired: name, age, gender, height, weight...
    const {
      name, age, gender, height, weight,
      isDiabetic, hasHypertension, hasThyroid, hasHeartDisease, hasKidneyDisease, hasOtherAllergies,
      cholesterolLevel, foodAllergies,
      lifestyle, additionalDetails
    } = req.body;

    const orderedUpdate = {
      name,
      age,
      gender,
      height,
      weight,
      isDiabetic,
      hasHypertension,
      hasThyroid,
      hasHeartDisease,
      hasKidneyDisease,
      hasOtherAllergies,
      cholesterolLevel,
      foodAllergies,
      lifestyle,
      additionalDetails,
      // _id is effectively set by the filter for upsert, or preserved
      userId: req.user._id // Explicitly set custom userId logic if needed (redundant now but consistent)
    };
    // Note: We used to rely on _id matching req.user._id. In findOneAndReplace with upsert, 
    // we need to be careful. The filter is {_id: req.user._id}.

    // Using findOneAndReplace to FORCE document replacement and re-ordering of keys
    const details = await UserDetails.findOneAndReplace(
      { _id: req.user._id },
      orderedUpdate,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: "Details saved successfully!", details });
  } catch (error) {
    console.error("Error saving details:", error);
    res.status(500).json({ message: "Failed to save details. Please try again." });
  }
});

// GET: Fetch current user details
router.get("/", protect, async (req, res) => {
  try {
    const details = await UserDetails.findById(req.user._id);
    if (!details) {
      return res.status(404).json({ message: "No details found for this user." });
    }
    res.json(details);
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ message: "Failed to fetch details." });
  }
});

module.exports = router;
