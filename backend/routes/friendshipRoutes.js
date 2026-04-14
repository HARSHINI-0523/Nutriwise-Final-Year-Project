// routes/friendshipRoutes.js
const express = require("express");
const router = express.Router();
const {
  getFriends,
  getReceivedRequests,
  handleRequest,
  getSuggestions,
  sendRequest
} = require("../controllers/friendshipController");

// Route to get a user's list of accepted friends
router.get("/friends/:userId", getFriends);

// Route to get a user's list of received friend requests
router.get("/requests/received/:userId", getReceivedRequests);

// Route to handle a request (accept/reject)
router.post("/requests/handle/:friendshipId", handleRequest);

// Route to get suggestions
router.get("/suggestions/:userId", getSuggestions);

router.post("/request/send", sendRequest);

module.exports = router;