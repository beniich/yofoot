import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

// ============================================================
// GET /api/favorites - Récupérer tous les favoris de l'utilisateur
// ============================================================
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('favoriteLeagues', 'name logo country')
            .populate('favoriteTeams', 'name logo')
            .populate('favoritePlayers', 'firstName lastName photo position');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            leagues: user.favoriteLeagues || [],
            teams: user.favoriteTeams || [],
            players: user.favoritePlayers || []
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============================================================
// LEAGUES - Gestion des ligues favorites
// ============================================================

// POST /api/favorites/leagues/:id - Ajouter une ligue aux favoris
router.post('/leagues/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Vérifier si la ligue n'est pas déjà dans les favoris
        if (!user.favoriteLeagues.includes(req.params.id)) {
            user.favoriteLeagues.push(req.params.id);
            await user.save();

            res.json({
                message: 'League added to favorites',
                favoriteLeagues: user.favoriteLeagues
            });
        } else {
            res.status(400).json({ message: 'League already in favorites' });
        }
    } catch (error) {
        console.error('Error adding league to favorites:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/favorites/leagues/:id - Retirer une ligue des favoris
router.delete('/leagues/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.favoriteLeagues = user.favoriteLeagues.filter(
            (leagueId) => leagueId.toString() !== req.params.id
        );

        await user.save();

        res.json({
            message: 'League removed from favorites',
            favoriteLeagues: user.favoriteLeagues
        });
    } catch (error) {
        console.error('Error removing league from favorites:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/favorites/leagues/check/:id - Vérifier si une ligue est favorite
router.get('/leagues/check/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFavorite = user.favoriteLeagues.some(
            (leagueId) => leagueId.toString() === req.params.id
        );

        res.json({ isFavorite });
    } catch (error) {
        console.error('Error checking league favorite:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============================================================
// TEAMS - Gestion des équipes favorites
// ============================================================

// POST /api/favorites/teams/:id - Ajouter une équipe aux favoris
router.post('/teams/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.favoriteTeams.includes(req.params.id)) {
            user.favoriteTeams.push(req.params.id);
            await user.save();

            res.json({
                message: 'Team added to favorites',
                favoriteTeams: user.favoriteTeams
            });
        } else {
            res.status(400).json({ message: 'Team already in favorites' });
        }
    } catch (error) {
        console.error('Error adding team to favorites:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/favorites/teams/:id - Retirer une équipe des favoris
router.delete('/teams/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.favoriteTeams = user.favoriteTeams.filter(
            (teamId) => teamId.toString() !== req.params.id
        );

        await user.save();

        res.json({
            message: 'Team removed from favorites',
            favoriteTeams: user.favoriteTeams
        });
    } catch (error) {
        console.error('Error removing team from favorites:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/favorites/teams/check/:id - Vérifier si une équipe est favorite
router.get('/teams/check/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFavorite = user.favoriteTeams.some(
            (teamId) => teamId.toString() === req.params.id
        );

        res.json({ isFavorite });
    } catch (error) {
        console.error('Error checking team favorite:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============================================================
// PLAYERS - Gestion des joueurs favoris
// ============================================================

// POST /api/favorites/players/:id - Ajouter un joueur aux favoris
router.post('/players/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.favoritePlayers.includes(req.params.id)) {
            user.favoritePlayers.push(req.params.id);
            await user.save();

            res.json({
                message: 'Player added to favorites',
                favoritePlayers: user.favoritePlayers
            });
        } else {
            res.status(400).json({ message: 'Player already in favorites' });
        }
    } catch (error) {
        console.error('Error adding player to favorites:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/favorites/players/:id - Retirer un joueur des favoris
router.delete('/players/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.favoritePlayers = user.favoritePlayers.filter(
            (playerId) => playerId.toString() !== req.params.id
        );

        await user.save();

        res.json({
            message: 'Player removed from favorites',
            favoritePlayers: user.favoritePlayers
        });
    } catch (error) {
        console.error('Error removing player from favorites:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/favorites/players/check/:id - Vérifier si un joueur est favori
router.get('/players/check/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isFavorite = user.favoritePlayers.some(
            (playerId) => playerId.toString() === req.params.id
        );

        res.json({ isFavorite });
    } catch (error) {
        console.error('Error checking player favorite:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============================================================
// TOGGLE - Basculer le statut favori (ajouter/retirer)
// ============================================================

// POST /api/favorites/toggle/league/:id
router.post('/toggle/league/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.favoriteLeagues.findIndex(
            (leagueId) => leagueId.toString() === req.params.id
        );

        if (index > -1) {
            // Retirer
            user.favoriteLeagues.splice(index, 1);
            await user.save();
            res.json({
                message: 'League removed from favorites',
                isFavorite: false,
                favoriteLeagues: user.favoriteLeagues
            });
        } else {
            // Ajouter
            user.favoriteLeagues.push(req.params.id);
            await user.save();
            res.json({
                message: 'League added to favorites',
                isFavorite: true,
                favoriteLeagues: user.favoriteLeagues
            });
        }
    } catch (error) {
        console.error('Error toggling league favorite:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/favorites/toggle/team/:id
router.post('/toggle/team/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.favoriteTeams.findIndex(
            (teamId) => teamId.toString() === req.params.id
        );

        if (index > -1) {
            user.favoriteTeams.splice(index, 1);
            await user.save();
            res.json({
                message: 'Team removed from favorites',
                isFavorite: false,
                favoriteTeams: user.favoriteTeams
            });
        } else {
            user.favoriteTeams.push(req.params.id);
            await user.save();
            res.json({
                message: 'Team added to favorites',
                isFavorite: true,
                favoriteTeams: user.favoriteTeams
            });
        }
    } catch (error) {
        console.error('Error toggling team favorite:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/favorites/toggle/player/:id
router.post('/toggle/player/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const index = user.favoritePlayers.findIndex(
            (playerId) => playerId.toString() === req.params.id
        );

        if (index > -1) {
            user.favoritePlayers.splice(index, 1);
            await user.save();
            res.json({
                message: 'Player removed from favorites',
                isFavorite: false,
                favoritePlayers: user.favoritePlayers
            });
        } else {
            user.favoritePlayers.push(req.params.id);
            await user.save();
            res.json({
                message: 'Player added to favorites',
                isFavorite: true,
                favoritePlayers: user.favoritePlayers
            });
        }
    } catch (error) {
        console.error('Error toggling player favorite:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
