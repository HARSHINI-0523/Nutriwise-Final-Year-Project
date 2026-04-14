// models/Appointment.js
const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
  // Link the appointment to a specific user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;