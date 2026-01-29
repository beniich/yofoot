import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // Can comment on different things
    entityType: {
        type: String,
        enum: ['match', 'news', 'player', 'team'],
        required: true,
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    content: {
        type: String,
        required: true,
        maxLength: 500,
    },

    // Nested comments (replies)
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },

    // Engagement
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    // Moderation
    isHidden: {
        type: Boolean,
        default: false,
    },
    reportCount: {
        type: Number,
        default: 0,
    },

}, {
    timestamps: true,
});

commentSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

export default mongoose.model('Comment', commentSchema);
