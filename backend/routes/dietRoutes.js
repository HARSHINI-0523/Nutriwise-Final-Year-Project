const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { generateDiet, getLatestDietPlan } = require("../controllers/dietController");
const router = express.Router();

router.post("/generate", protect, generateDiet);
router.get("/latest", protect, getLatestDietPlan);

module.exports = router;
