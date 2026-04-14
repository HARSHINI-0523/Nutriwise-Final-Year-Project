const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


dotenv.config();

// Workaround for local DNS issues with MongoDB Atlas
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const app = express();
const PORT = process.env.PORT || 5000;
const passport = require("passport");
require("./config/passport");

// Import routes
const authRouter = require("./routes/auth");
const reportRoutes = require("./routes/reportRoutes");
const userDetailsRouter = require("./routes/userDetails");
const friendshipRoutes = require("./routes/friendshipRoutes");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const dietRoutes = require("./routes/dietRoutes");
const labAnalysisRoutes = require("./routes/labAnalysisRoutes");
const challengeRoutes = require("./routes/challengeRoutes");


// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cookieParser());

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);

// Use routes
app.use("/api/auth", authRouter);
app.use("/api/reports", reportRoutes);
app.use("/api/user-details", userDetailsRouter);
app.use("/api/friendships", friendshipRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/lab-analysis", labAnalysisRoutes);
app.use("/api/challenges", challengeRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
