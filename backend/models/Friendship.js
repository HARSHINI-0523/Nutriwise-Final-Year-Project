// models/Friendship.js
const mongoose = require("mongoose");

const FriendshipSchema = new mongoose.Schema({
  // The user who sent the friend request
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // The user who received the request
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // The status of the friendship
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending",
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Friendship = mongoose.model("Friendship", FriendshipSchema);
module.exports = Friendship;