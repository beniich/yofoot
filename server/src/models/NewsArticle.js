import mongoose from 'mongoose';

const newsArticleSchema = new mongoose.Schema({
    // Source
    source: {
        type: String,
        required: true,
    },
    sourceUrl: String,

    // Content
    title: {
        type: String,
        required: true,
    },
    description: String,
    content: String,

    // Media
    image: String,
    video: String,

    // Categories
    category: {
        type: String,
        enum: ['Match', 'Transfer', 'Injury', 'Interview', 'General'],
        default: 'General',
    },
    tags: [String],

    // Relations
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'League',
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
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
    isFeatured: {
        type: Boolean,
        default: false,
    },

    // Engagement
    viewCount: {
        type: Number,
        default: 0,
    },
    likeCount: {
        type: Number,
        default: 0,
    },

    // Author
    author: {
        name: String,
        avatar: String,
    },
}, {
    timestamps: true,
});

newsArticleSchema.index({ publishedAt: -1 });
newsArticleSchema.index({ league: 1, publishedAt: -1 });
newsArticleSchema.index({ category: 1, publishedAt: -1 });
newsArticleSchema.index({ title: 'text', description: 'text' });

const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);
export default NewsArticle;
