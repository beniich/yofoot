import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    // Informations de base
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    commonName: String,
    photo: String,

    // Profil
    dateOfBirth: Date,
    nationality: {
        name: String,
        code: String,
        flag: String,
    },
    height: Number, // cm
    weight: Number, // kg

    // Informations sportives
    position: {
        type: String,
        enum: [
            // Football
            'GK', 'RB', 'CB', 'LB', 'RWB', 'LWB',
            'CDM', 'CM', 'CAM', 'RM', 'LM',
            'RW', 'LW', 'CF', 'ST',
            // Hockey
            'G', 'D', 'C', 'LW', 'RW'
        ],
    },
    primaryPosition: String,
    secondaryPositions: [String],

    jerseyNumber: Number,
    preferredFoot: {
        type: String,
        enum: ['Left', 'Right', 'Both'],
    },

    // Équipe actuelle
    currentTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    },
    teamName: String,
    teamLogo: String,

    // Contrat
    contractUntil: Date,
    joinedDate: Date,

    // Statistiques globales
    stats: {
        // Globales
        appearances: { type: Number, default: 0 },
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        yellowCards: { type: Number, default: 0 },
        redCards: { type: Number, default: 0 },
        minutesPlayed: { type: Number, default: 0 },

        // Avancées
        shotsOnTarget: { type: Number, default: 0 },
        shotsTotal: { type: Number, default: 0 },
        passAccuracy: { type: Number, default: 0 }, // %
        tacklesWon: { type: Number, default: 0 },
        interceptions: { type: Number, default: 0 },
        clearances: { type: Number, default: 0 },

        // Gardien
        saves: { type: Number, default: 0 },
        cleanSheets: { type: Number, default: 0 },
        goalsConceded: { type: Number, default: 0 },
        penaltiesSaved: { type: Number, default: 0 },
    },

    // Ratings
    rating: {
        overall: { type: Number, min: 0, max: 100 },
        pace: { type: Number, min: 0, max: 100 },
        shooting: { type: Number, min: 0, max: 100 },
        passing: { type: Number, min: 0, max: 100 },
        dribbling: { type: Number, min: 0, max: 100 },
        defending: { type: Number, min: 0, max: 100 },
        physical: { type: Number, min: 0, max: 100 },
    },

    // Valeur marchande
    marketValue: {
        value: Number,
        currency: {
            type: String,
            default: 'EUR',
        },
    },

    // Status
    isActive: {
        type: Boolean,
        default: true,
    },
    injuryStatus: {
        isInjured: { type: Boolean, default: false },
        injuryType: String,
        expectedReturn: Date,
    },

    // Metadata
    apiFootballId: Number,
    lastSyncedAt: Date,
}, {
    timestamps: true,
});

// Virtuals
playerSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

playerSchema.virtual('age').get(function () {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

// Index
playerSchema.index({ firstName: 'text', lastName: 'text' });
playerSchema.index({ currentTeam: 1, position: 1 });
playerSchema.index({ 'rating.overall': -1 });

export default mongoose.model('Player', playerSchema);
