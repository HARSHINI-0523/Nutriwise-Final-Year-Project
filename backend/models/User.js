const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  emailOTP: String,
  emailOTPExpires: Date,

  completedChallenges: [{
    type: mongoose.Schema.Types.Mixed // Allows both ObjectId (legacy) and { challenge: ObjectId, date: String } (new)
  }],

  joinedChallenges: [{
    type: mongoose.Schema.Types.Mixed // Allows both ObjectId (legacy) and { challenge: ObjectId, date: String } (new)
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
