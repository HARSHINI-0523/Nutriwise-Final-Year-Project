// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { searchUsers } = require("../controllers/userController");

// Define the user search route here
router.get("/search/:userId", searchUsers);

module.exports = router;