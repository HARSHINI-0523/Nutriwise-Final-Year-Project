// backend/models/Report.js
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // The reportType field corresponds to the reportType selected in the frontend.
  reportType: {
    type: String,
    required: true,
  },
  fileURL: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
  },
  values: { type: Object, default: {} },
  analysis: { type: Array, default: [] },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", ReportSchema);
