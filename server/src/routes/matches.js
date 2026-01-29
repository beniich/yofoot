import express from 'express';
import Match from '../models/Match.js';
import footballApi from '../services/footballApi.js';

const router = express.Router();

// GET /api/matches - Get all matches
router.get('/', async (req, res) => {
    try {
        const {
            league,
            team,
            status,
            date,
            live,
            page = 1,
            limit = 20,
        } = req.query;

        const query = {};

        if (league) query.league = league;
        if (team) {
            query.$or = [
                { 'homeTeam.team': team },
                { 'awayTeam.team': team },
            ];
        }
        if (status) query.status = status;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.matchDate = { $gte: startDate, $lt: endDate };
        }
        if (live) query.status = 'LIVE';

        const matches = await Match.find(query)
            .populate('league', 'name logo country')
            .populate('homeTeam.team', 'name logo')
            .populate('awayTeam.team', 'name logo')
            .sort({ matchDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Match.countDocuments(query);

        res.json({
            matches,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/matches/live - Get live matches
router.get('/live', async (req, res) => {
    try {
        const matches = await Match.find({ status: 'LIVE' })
            .populate('league', 'name logo')
            .sort({ matchDate: -1 });

        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/matches/upcoming - Get upcoming matches
router.get('/upcoming', async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const matches = await Match.find({
            status: 'SCHEDULED',
            matchDate: { $gte: new Date() },
        })
            .populate('league', 'name logo')
            .sort({ matchDate: 1 })
            .limit(Number(limit));

        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/matches/:id - Get match by ID
router.get('/:id', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate('league')
            .populate('homeTeam.team')
            .populate('awayTeam.team');

        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }

        res.json(match);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/matches/sync/:leagueId/:season - Sync matches
router.post('/sync/:leagueId/:season', async (req, res) => {
    try {
        const { leagueId, season } = req.params;
        const matches = await footballApi.syncFixturesByLeague(
            Number(leagueId),
            Number(season)
        );
        res.json({ message: 'Matches synced', count: matches.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
