import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true,
    },

    // AI Predictions
    predictions: {
        homeWin: Number,      // Probability 0-100
        draw: Number,         // Probability 0-100
        awayWin: Number,      // Probability 0-100

        expectedScore: {
            home: Number,
            away: Number,
        },

        overUnder: {
            over2_5: Number,    // Probability
            under2_5: Number,
        },

        bothTeamsScore: {
            yes: Number,
            no: Number,
        },
    },

    // Confidence Score
    confidence: {
        type: Number,
        min: 0,
        max: 100,
    },

    // Factors Used
    factors: {
        headToHead: Object,
        recentForm: Object,
        homeAdvantage: Number,
        injuries: Array,
        averageGoals: Object,
    },

    // Result (after match)
    actualResult: {
        homeScore: Number,
        awayScore: Number,
        outcome: {
            type: String,
            enum: ['home', 'draw', 'away'],
        },
    },

    accuracy: Number,

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Prediction', predictionSchema);
