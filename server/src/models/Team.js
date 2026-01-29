import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    apiFootballId: {
        type: Number,
        unique: true,
        sparse: true,
    },

    name: {
        type: String,
        required: true,
    },
    code: String,
    country: String,
    founded: Number,

    // Visual
    logo: String,

    // Venue
    venue: {
        name: String,
        address: String,
        city: String,
        capacity: Number,
        surface: String,
        image: String,
    },

    // League association
    leagues: [{
        league: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'League',
        },
        season: Number,
    }],

    // Stats
    followersCount: {
        type: Number,
        default: 0,
    },

    lastSyncedAt: Date,
}, {
    timestamps: true,
});

teamSchema.index({ name: 'text' });
teamSchema.index({ country: 1 });

const Team = mongoose.model('Team', teamSchema);
export default Team;
