import express from 'express';
import Standing from '../models/Standing.js';
import footballApi from '../services/footballApi.js';

const router = express.Router();

// GET /api/standings/:leagueId/:season
router.get('/:leagueId/:season', async (req, res) => {
    try {
        const { leagueId, season } = req.params;

        const standing = await Standing.findOne({
            league: leagueId,
            season: Number(season),
        })
            .populate('league', 'name logo country')
            .populate('rankings.team', 'name logo');

        if (!standing) {
            return res.status(404).json({ message: 'Standings not found' });
        }

        res.json(standing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/standings/sync/:leagueId/:season
router.post('/sync/:leagueId/:season', async (req, res) => {
    try {
        const { leagueId, season } = req.params;
        const standing = await footballApi.syncStandingsByLeague(
            Number(leagueId),
            Number(season)
        );
        res.json({ message: 'Standings synced', standing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
