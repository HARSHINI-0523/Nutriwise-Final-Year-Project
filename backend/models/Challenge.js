const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
        enum: ['General', 'Diabetic', 'Hypertension', 'Thyroid', 'Heart Disease', 'Kidney Disease'],
        default: 'General'
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy',
    },
    points: {
        type: Number,
        default: 10,
    },
}, { timestamps: true });

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
