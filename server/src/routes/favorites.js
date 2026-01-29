import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// GET /api/favorites - Get user favorites
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('favoriteLeagues', 'name logo country')
            .populate('favoriteTeams', 'name logo')
            .populate('favoritePlayers', 'firstName lastName photo position');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            leagues: user.favoriteLeagues,
            teams: user.favoriteTeams,
            players: user.favoritePlayers,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/favorites/:type/:id - Add to favorites (type: leagues, teams, players)
router.post('/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const updateField = {
            leagues: 'favoriteLeagues',
            teams: 'favoriteTeams',
            players: 'favoritePlayers'
        }[type];

        if (!updateField) return res.status(400).json({ message: 'Invalid favorite type' });

        const user = await User.findById(req.user.id);
        if (!user[updateField].includes(id)) {
            user[updateField].push(id);
            await user.save();
        }

        res.json({ message: `${type.slice(0, -1)} added to favorites` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/favorites/:type/:id - Remove from favorites
router.delete('/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const updateField = {
            leagues: 'favoriteLeagues',
            teams: 'favoriteTeams',
            players: 'favoritePlayers'
        }[type];

        if (!updateField) return res.status(400).json({ message: 'Invalid favorite type' });

        const user = await User.findById(req.user.id);
        user[updateField] = user[updateField].filter(item => item.toString() !== id);
        await user.save();

        res.json({ message: `${type.slice(0, -1)} removed from favorites` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
