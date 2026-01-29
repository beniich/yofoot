import mongoose from 'mongoose';

const leagueSchema = new mongoose.Schema({
    // IDs externes
    apiFootballId: {
        type: Number,
        unique: true,
        sparse: true,
    },

    // Informations de base
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['League', 'Cup'],
        default: 'League',
    },
    country: {
        name: String,
        code: String,
        flag: String,
    },

    // Logo et branding
    logo: String,
    flag: String,

    // Saison actuelle
    currentSeason: {
        year: Number,
        start: Date,
        end: Date,
        current: Boolean,
    },

    // Métadonnées
    isActive: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: Number,
        default: 0,
    },

    // Stats
    followersCount: {
        type: Number,
        default: 0,
    },

    // Dernière mise à jour
    lastSyncedAt: Date,
}, {
    timestamps: true,
});

leagueSchema.index({ country: 1, priority: -1 });
leagueSchema.index({ isFeatured: 1 });

const League = mongoose.model('League', leagueSchema);
export default League;
