const mongoose = require("mongoose");
const Friendship = require("../models/Friendship");
const User = require("../models/User");


// --------------------------------------
// GET FRIENDS
// --------------------------------------
exports.getFriends = async (req, res) => {
  const { userId } = req.params;

  try {
    const uid = new mongoose.Types.ObjectId(userId);

    const friendships = await Friendship.find({
      $or: [{ requester: uid }, { recipient: uid }],
      status: "accepted",
    })
      .populate("requester", "name email")
      .populate("recipient", "name email");

    const friends = friendships
      .map(f => {
        if (!f.requester || !f.recipient) return null;

        return f.requester._id.toString() === userId
          ? f.recipient
          : f.requester;
      })
      .filter(Boolean);

    res.json(friends);
  } catch (err) {
    console.error("getFriends error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};



// --------------------------------------
// GET RECEIVED REQUESTS
// --------------------------------------
exports.getReceivedRequests = async (req, res) => {
  const { userId } = req.params;

  try {
    const uid = new mongoose.Types.ObjectId(userId);

    const requests = await Friendship.find({
      recipient: uid,
      status: "pending",
    }).populate("requester", "name email");
  
    res.json(requests);
  } catch (err) {
    console.error("getReceivedRequests error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


// --------------------------------------
// ACCEPT / REJECT REQUEST
// --------------------------------------
exports.handleRequest = async (req, res) => {
  const { friendshipId } = req.params;
  const { action } = req.body;

  try {
    if (action === "accept") {
      const friendship = await Friendship.findByIdAndUpdate(
        friendshipId,
        { status: "accepted" },
        { new: true }
      );

      return res.json({ message: "Friend request accepted", friendship });
    }

    if (action === "reject") {
      const deleted = await Friendship.findByIdAndDelete(friendshipId);
      return res.json({ message: "Friend request rejected", friendshipId: deleted._id });
    }

    res.status(400).json({ message: "Invalid action" });
  } catch (err) {
    console.error("handleRequest error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


// --------------------------------------
// GET FRIEND SUGGESTIONS
// --------------------------------------
exports.getSuggestions = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const uid = new mongoose.Types.ObjectId(userId);

    const friendships = await Friendship.find({
      $or: [{ requester: uid }, { recipient: uid }],
      status: "accepted",
    });

    const friendIds = friendships.map(f =>
      f.requester.toString() === userId ? f.recipient.toString() : f.requester.toString()
    );

    const uidList = friendIds.map(id => new mongoose.Types.ObjectId(id));

    const fof = await Friendship.find({
      $or: [
        { requester: { $in: uidList } },
        { recipient: { $in: uidList } }
      ],
      status: "accepted",
    });

    const suggestionIds = new Set();

    fof.forEach(f => {
      const id =
        f.requester.toString() === userId
          ? f.recipient.toString()
          : f.requester.toString();

      if (id !== userId && !friendIds.includes(id)) {
        suggestionIds.add(id);
      }
    });

    const suggestions = await User.find({
      _id: { $in: [...suggestionIds].map(id => new mongoose.Types.ObjectId(id)) },
    }).select("name email");
    res.json(suggestions);
  } catch (err) {
    console.error("getSuggestions error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


// --------------------------------------
// SEND FRIEND REQUEST
// --------------------------------------
exports.sendRequest = async (req, res) => {
  const { requesterId, recipientId } = req.body;

  try {
    const existing = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existing) {
      return res.status(400).json({
        message: "A friendship or request already exists."
      });
    }

    const newFriendship = new Friendship({
      requester: requesterId,
      recipient: recipientId,
    });

    await newFriendship.save();

    res.status(201).json({ message: "Friend request sent successfully." });
  } catch (err) {
    console.error("sendRequest error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
