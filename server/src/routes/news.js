import express from 'express';
import NewsArticle from '../models/NewsArticle.js';

const router = express.Router();

// GET /api/news - Get all news
router.get('/', async (req, res) => {
    try {
        const {
            league,
            team,
            category,
            featured,
            search,
            page = 1,
            limit = 20,
        } = req.query;

        const query = { isPublished: true };

        if (league) query.league = league;
        if (team) query.teams = team;
        if (category) query.category = category;
        if (featured) query.isFeatured = featured === 'true';
        if (search) {
            query.$text = { $search: search };
        }

        const articles = await NewsArticle.find(query)
            .populate('league', 'name logo')
            .populate('teams', 'name logo')
            .sort({ publishedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await NewsArticle.countDocuments(query);

        res.json({
            articles,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/news/featured - Get featured news
router.get('/featured', async (req, res) => {
    try {
        const articles = await NewsArticle.find({
            isFeatured: true,
            isPublished: true,
        })
            .populate('league', 'name logo')
            .sort({ publishedAt: -1 })
            .limit(5);

        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/news/:id - Get article by ID
router.get('/:id', async (req, res) => {
    try {
        const article = await NewsArticle.findById(req.params.id)
            .populate('league')
            .populate('teams');

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Increment view count
        article.viewCount += 1;
        await article.save();

        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/news - Create news article
router.post('/', async (req, res) => {
    try {
        const article = new NewsArticle(req.body);
        await article.save();
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST /api/news/:id/like - Like an article
router.post('/:id/like', async (req, res) => {
    try {
        const article = await NewsArticle.findByIdAndUpdate(
            req.params.id,
            { $inc: { likeCount: 1 } },
            { new: true }
        );

        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
