// controllers/appointmentController.js
const Appointment = require("../models/Appointment");

// Get all appointments for a specific user
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.params.userId });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
  const { title, start, end, user, notes } = req.body;

  const newAppointment = new Appointment({
    title,
    start: new Date(start),
    end: new Date(end),
    user,
    notes,
  });

  try {
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    await appointment.deleteOne();
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};