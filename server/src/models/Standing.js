import mongoose from 'mongoose';

const standingSchema = new mongoose.Schema({
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
        required: true,
    },
    season: {
        type: Number,
        required: true,
    },

    rankings: [{
        rank: Number,
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
        },
        teamName: String,
        teamLogo: String,

        // Stats
        played: Number,
        win: Number,
        draw: Number,
        lose: Number,

        goals: {
            for: Number,
            against: Number,
            diff: Number,
        },

        points: Number,

        // Form (last 5 matches)
        form: String, // "WWDLW"

        // Status
        status: String, // "Champions League", "Relegation", etc.
        description: String,
    }],

    lastSyncedAt: Date,
}, {
    timestamps: true,
});

standingSchema.index({ league: 1, season: -1 });

const Standing = mongoose.model('Standing', standingSchema);
export default Standing;
