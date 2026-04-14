// backend/routes/labAnalysisRoutes.js
const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const { protect } = require("../middleware/authMiddleware");
const { generateMedicalAnalysis } = require("../utils/groqClient");
const { analyzeLabReport } = require("../services/hfLabService");

router.get("/process/:id", protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ msg: "Report not found" });

    if (report.uploadedBy.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    // ---- 1️⃣ Send Cloudinary URL to HuggingFace ----
    console.log("Sending to HuggingFace:", report.fileURL);

    const extractedValues = await analyzeLabReport(report.fileURL);

    // ---- Validate ----
    if (!extractedValues || typeof extractedValues !== "object") {
      return res.status(500).json({
        msg: "Invalid AI response from HuggingFace",
        raw: extractedValues,
      });
    }

    // ---- 2️⃣ Save extracted values to DB ----
    report.values = extractedValues;

    // ---- 3️⃣ Generate Summary Using Groq ----
    const aiSummary = await generateMedicalAnalysis(extractedValues);
    report.analysis = aiSummary;

    await report.save();

    res.json({
      msg: "Lab analysis completed successfully",
      report,
    });

  } catch (err) {
    console.error("Analysis Route Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
