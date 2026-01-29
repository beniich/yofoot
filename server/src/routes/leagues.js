import express from 'express';
import League from '../models/League.js';
import footballApi from '../services/footballApi.js';

const router = express.Router();

// GET /api/leagues - Get all leagues
router.get('/', async (req, res) => {
    try {
        const {
            country,
            featured,
            search,
            page = 1,
            limit = 20,
        } = req.query;

        const query = { isActive: true };

        if (country) query['country.name'] = country;
        if (featured) query.isFeatured = featured === 'true';
        if (search) query.name = new RegExp(search, 'i');

        const leagues = await League.find(query)
            .sort({ priority: -1, 'country.name': 1, name: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await League.countDocuments(query);

        res.json({
            leagues,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/leagues/featured - Get featured leagues
router.get('/featured', async (req, res) => {
    try {
        const leagues = await League.find({ isFeatured: true, isActive: true })
            .sort({ priority: -1 })
            .limit(10);

        res.json(leagues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/leagues/:id - Get league by ID
router.get('/:id', async (req, res) => {
    try {
        const league = await League.findById(req.params.id);

        if (!league) {
            return res.status(404).json({ message: 'League not found' });
        }

        res.json(league);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/leagues/sync - Sync leagues from API
router.post('/sync', async (req, res) => {
    try {
        const leagues = await footballApi.syncLeagues();
        res.json({ message: 'Leagues synced successfully', count: leagues.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/leagues/:id/follow - Follow a league
router.post('/:id/follow', async (req, res) => {
    try {
        const league = await League.findByIdAndUpdate(
            req.params.id,
            { $inc: { followersCount: 1 } },
            { new: true }
        );

        res.json(league);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
