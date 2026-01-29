import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    // Video sources
    url: {
        type: String,
        required: true,
    },
    thumbnail: String,
    duration: Number, // seconds

    // Provider
    provider: {
        type: String,
        enum: ['youtube', 'dailymotion', 'streamable', 'custom'],
        default: 'youtube',
    },
    providerId: String, // Video ID on provider platform

    // Relations
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
    },
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
    }],
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    }],

    // Type
    type: {
        type: String,
        enum: ['highlight', 'fullMatch', 'interview', 'analysis', 'goal', 'skill'],
        default: 'highlight',
    },

    // Engagement
    views: {
        type: Number,
        default: 0,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    // Publishing
    publishedAt: {
        type: Date,
        default: Date.now,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },

}, {
    timestamps: true,
});

videoSchema.index({ match: 1 });
videoSchema.index({ type: 1, publishedAt: -1 });

export default mongoose.model('Video', videoSchema);
