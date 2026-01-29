import mongoose from 'mongoose';

const oddsSchema = new mongoose.Schema({
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true,
    },

    // Bookmaker
    bookmaker: {
        name: String,
        logo: String,
    },

    // Match Winner
    matchWinner: {
        home: Number,
        draw: Number,
        away: Number,
    },

    // Over/Under
    overUnder: {
        over0_5: Number,
        under0_5: Number,
        over1_5: Number,
        under1_5: Number,
        over2_5: Number,
        under2_5: Number,
        over3_5: Number,
        under3_5: Number,
    },

    // Both Teams Score
    bothTeamsScore: {
        yes: Number,
        no: Number,
    },

    // Correct Score
    correctScore: [{
        score: String, // "2-1"
        odds: Number,
    }],

    // First Goalscorer
    firstGoalscorer: [{
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
        },
        odds: Number,
    }],

    // Updated timestamp
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

oddsSchema.index({ match: 1, bookmaker: 1 });

export default mongoose.model('Odds', oddsSchema);
