// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAppointments,
  createAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

// Get all appointments for a user
router.get("/:userId", getAppointments);

// Create a new appointment
router.post("/", createAppointment);

// Delete an appointment by its ID
router.delete("/:id", deleteAppointment);

module.exports = router;