const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const { sendOTPEmail } = require("../utils/sendEmail");

// Utility function to generate JWT
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// @route   GET /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const accessToken = generateAccessToken(req.user._id);
    res.redirect(
      `http://localhost:5173/profile?token=${accessToken}&login=google`
    );
  }
);

router.get("/me", protect, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

// @route   POST /api/auth/signup
// @desc    Register new usera
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields." });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user = new User({
      name,
      email,
      password,
      emailOTP: otp,
      emailOTPExpires: Date.now() + 10 * 60 * 1000,
      isEmailVerified: false,
    });

    await user.save();
    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: "OTP sent to email. Please verify.",
      userId: user._id,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
});

//Email verification route
router.post("/verify-email", async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const user = await User.findById(userId);

    if (
      !user ||
      user.emailOTP !== otp.trim() ||
      user.emailOTPExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ Mark verified
    user.isEmailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpires = undefined;
    await user.save();

    // ✅ AUTO LOGIN: generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    res.json({
      message: "Email verified & logged in",
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
});



// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again later.",
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // if (!user.isEmailVerified) {
  //   return res.status(403).json({
  //     message: "Please verify your email before logging in",
  //   });
  // }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // MUST be false on localhost
    sameSite: "Lax", // NOT "Strict"
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: accessToken,
  });
});

// @route  GET /api/auth/validate-session
// @desc  Validate a user's session token
// @access Private
router.get("/validate-session", protect, (req, res) => {
  // If the request reaches this point, the token has been successfully verified by the 'protect' middleware.
  // We can simply return a success message.
  res.status(200).json({ message: "Session is valid", user: req.user });
});

router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
   console.log("🍪 Cookies:", req.cookies);
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = generateAccessToken(decoded.id);

    res.json({ token: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

module.exports = router;
