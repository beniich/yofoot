import mongoose from 'mongoose';

const lineupPlayerSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
    },

    // Position sur le terrain
    position: String,
    positionX: Number, // 0-100 (% de la largeur)
    positionY: Number, // 0-100 (% de la hauteur)

    // Infos match
    jerseyNumber: Number,
    isStarter: {
        type: Boolean,
        default: true,
    },
    isCaptain: {
        type: Boolean,
        default: false,
    },

    // Temps de jeu
    minutesPlayed: Number,

    // Stats du match
    matchStats: {
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        shots: { type: Number, default: 0 },
        shotsOnTarget: { type: Number, default: 0 },
        passes: { type: Number, default: 0 },
        passesCompleted: { type: Number, default: 0 },
        tackles: { type: Number, default: 0 },
        interceptions: { type: Number, default: 0 },
        fouls: { type: Number, default: 0 },
        yellowCard: { type: Boolean, default: false },
        redCard: { type: Boolean, default: false },
        rating: Number, // 1-10
    },

    // Substitution
    substituted: {
        isSubstituted: { type: Boolean, default: false },
        minute: Number,
        replacedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
        },
    },
});

const matchLineupSchema = new mongoose.Schema({
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true,
    },

    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },

    // Formation (ex: 4-3-3, 4-4-2)
    formation: {
        type: String,
        required: true,
    },

    // Joueurs
    startingEleven: [lineupPlayerSchema],
    substitutes: [lineupPlayerSchema],

    // Coach
    coach: {
        name: String,
        photo: String,
    },

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

export default mongoose.model('MatchLineup', matchLineupSchema);
