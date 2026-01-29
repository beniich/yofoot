import mongoose from 'mongoose';

const fantasyPlayerSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
    },
    position: {
        type: String,
        enum: ['GK', 'DEF', 'MID', 'FWD'],
        required: true,
    },
    isCaptain: {
        type: Boolean,
        default: false,
    },
    isViceCaptain: {
        type: Boolean,
        default: false,
    },
    purchasePrice: Number,
    currentValue: Number,
});

const fantasyTeamSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    // League/Competition
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
        required: true,
    },
    season: Number,

    // Squad (15 players: 2 GK, 5 DEF, 5 MID, 3 FWD)
    squad: [fantasyPlayerSchema],

    // Starting 11
    formation: {
        type: String,
        default: '4-3-3',
    },
    startingEleven: [fantasyPlayerSchema],

    // Budget
    budget: {
        type: Number,
        default: 100000000, // 100M
    },
    remainingBudget: Number,

    // Points
    totalPoints: {
        type: Number,
        default: 0,
    },
    gameweekPoints: [{
        gameweek: Number,
        points: Number,
        transfers: Number,
    }],

    // Transfers
    freeTransfers: {
        type: Number,
        default: 1,
    },
    transfersMade: {
        type: Number,
        default: 0,
    },

    // Chips
    chipsAvailable: [{
        type: {
            type: String,
            enum: ['wildcard', 'bench_boost', 'triple_captain', 'free_hit'],
        },
        used: Boolean,
        gameweekUsed: Number,
    }],

    // Rank
    globalRank: Number,
    countryRank: Number,

}, {
    timestamps: true,
});

fantasyTeamSchema.index({ user: 1, league: 1 });
fantasyTeamSchema.index({ totalPoints: -1 });

export default mongoose.model('FantasyTeam', fantasyTeamSchema);
