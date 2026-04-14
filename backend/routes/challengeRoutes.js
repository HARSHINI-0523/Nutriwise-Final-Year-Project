const express = require("express");
const router = express.Router();
const Challenge = require("../models/Challenge");
const User = require("../models/User");
const { protect } = require('../middleware/authMiddleware');
const UserDetails = require("../models/UserDetails");
const Friendship = require("../models/Friendship");

// GET /api/challenges - Get all challenges with completion status for current user (Personalized)
router.get("/", protect, async (req, res) => {
    try {
        const user = req.user;

        // Fetch user details to get conditions
        // Fetch user details to get conditions
        const details = await UserDetails.findById(user._id);

        if (!details) {
            return res.status(400).json({
                error: "PROFILE_MISSING",
                message: "Please fill out the User Details form to unlock personalized challenges."
            });
        }

        let conditions = ['General'];
        if (details.isDiabetic) conditions.push('Diabetic');
        if (details.hasHypertension) conditions.push('Hypertension');
        if (details.hasThyroid) conditions.push('Thyroid');
        if (details.hasHeartDisease) conditions.push('Heart Disease');
        if (details.hasKidneyDisease) conditions.push('Kidney Disease');

        const challenges = await Challenge.find({
            condition: { $in: conditions }
        });
        const today = new Date().toISOString().split('T')[0];

        const getSeed = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = (hash << 5) - hash + char;
                hash = hash & hash;
            }
            return Math.abs(hash);
        };

        const dailySeed = getSeed(today);

        const seededRandom = (seed) => {
            let value = seed;
            return function () {
                value = (value * 9301 + 49297) % 233280;
                return value / 233280;
            }
        };

        const randomGen = seededRandom(dailySeed);

        const shuffledChallenges = challenges.sort(() => randomGen() - 0.5);

        const dailyChallenges = shuffledChallenges.slice(0, 5);

        // Helper to check status (handles both legacy Strings and new Objects)
        const checkStatus = (list, challengeId) => {
            return list.some(item => {
                if (item.challenge) {
                    return item.challenge.toString() === challengeId.toString() && item.date === today;
                } else {
                    // Legacy item (ObjectId string). Treat as "completed in the past".
                    // So it is NOT completed today.
                    return false;
                }
            });
        };

        const challengesWithStatus = dailyChallenges.map((challenge) => {
            const isCompleted = checkStatus(user.completedChallenges, challenge._id);
            const isJoined = checkStatus(user.joinedChallenges, challenge._id);
            return {
                ...challenge.toObject(),
                completed: isCompleted,
                joined: isJoined || isCompleted
            };
        });

        // Lazy Migration: Convert legacy Strings to Objects with old date
        let userDirty = false;
        const migrateLegacy = (list) => {
            return list.map(item => {
                if (!item.challenge && !item.date) { // It's likely an ID
                    userDirty = true;
                    return { challenge: item, date: '1970-01-01' };
                }
                return item;
            });
        };

        user.completedChallenges = migrateLegacy(user.completedChallenges);
        user.joinedChallenges = migrateLegacy(user.joinedChallenges);

        if (userDirty) {
            await user.save();
        }

        res.json(challengesWithStatus);

    } catch (error) {
        console.error("Error fetching challenges:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// PATCH /api/challenges/:id/complete
router.patch("/:id/complete", protect, async (req, res) => {
    try {
        const challengeId = req.params.id;
        const user = await User.findById(req.user._id);

        const today = new Date().toISOString().split('T')[0];

        // Check if already completed TODAY
        const alreadyCompleted = user.completedChallenges.some(c => {
            // Handle legacy string (if not migrated yet)
            if (!c.challenge) return false;
            return c.challenge.toString() === challengeId && c.date === today;
        });

        if (alreadyCompleted) {
            return res.status(400).json({ message: "Challenge already completed" });
        }

        user.completedChallenges.push({ challenge: challengeId, date: today });
        await user.save();

        res.json({ message: "Challenge completed! 🎉" });

    } catch (error) {
        console.error("Error completing challenge:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/challenges/:id/join
router.post("/:id/join", protect, async (req, res) => {
    try {
        const challengeId = req.params.id;
        const user = await User.findById(req.user._id);

        const today = new Date().toISOString().split('T')[0];

        // Check if already joined TODAY
        const alreadyJoined = user.joinedChallenges.some(c => {
            // Handle legacy string
            if (!c.challenge) return false;
            return c.challenge.toString() === challengeId && c.date === today;
        });

        if (alreadyJoined) {
            return res.status(400).json({ message: "Challenge already joined" });
        }

        user.joinedChallenges.push({ challenge: challengeId, date: today });
        await user.save();

        res.json({ message: "Challenge joined! Let's do this! 🚀" });

    } catch (error) {
        console.error("Error joining challenge:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/challenges/social/leaderboard
router.get("/social/leaderboard", protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Find all accepted friendships
        const friendships = await Friendship.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: "accepted",
        });

        // 2. Get friend IDs
        const friendIds = friendships.map(f =>
            f.requester.toString() === userId.toString() ? f.recipient : f.requester
        );

        // 3. Find friends' details and their completed challenges
        const friends = await User.find({ _id: { $in: friendIds } })
            .select('name email completedChallenges');

        // 4. Structure the data: Map challengeIDs to list of friends who completed it
        // Since we don't know *which* challenges are being asked about (the frontend has the daily list),
        // we'll just return a map of { challengeId: [friendName1, friendName2] }

        const leaderboard = {};

        const today = new Date().toISOString().split('T')[0];

        friends.forEach(friend => {
            friend.completedChallenges.forEach(record => {
                let challengeId;
                let isToday = false;

                if (record.challenge) {
                    challengeId = record.challenge.toString();
                    if (record.date === today) {
                        isToday = true;
                    }
                } else {
                    // Legacy: record is the ID itself, treat as old
                    challengeId = record.toString();
                }

                if (isToday) {
                    if (!leaderboard[challengeId]) {
                        leaderboard[challengeId] = [];
                    }
                    leaderboard[challengeId].push(friend.name);
                }
            });
        });

        res.json(leaderboard);

    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/challenges/history - Get list of dates with completed challenges
router.get("/history", protect, async (req, res) => {
    try {
        const user = req.user;

        // Extract unique dates from completedChallenges
        // Filter out any legacy entries that might not have a date
        const dates = new Set();

        user.completedChallenges.forEach(record => {
            if (record.date) {
                dates.add(record.date);
            }
        });

        res.json({ dates: Array.from(dates) });

    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
