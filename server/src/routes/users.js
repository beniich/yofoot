import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/leaderboard
// @desc    Get top users by prediction accuracy
// @access  Public
router.get('/leaderboard', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const topUsers = await User.find({
            isActive: true,
            'stats.predictionsCount': { $gte: 5 } // Minimum 5 predictions
        })
            .select('username avatar stats plan')
            .sort({ 'stats.accuracy': -1, 'stats.predictionsCount': -1 })
            .limit(limit);

        res.json({
            success: true,
            leaderboard: topUsers
        });

    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/users/favorites/teams
// @desc    Update user's favorite teams
// @access  Private
router.put('/favorites/teams', protect, async (req, res) => {
    try {
        const { teamIds } = req.body;

        if (!Array.isArray(teamIds)) {
            return res.status(400).json({
                success: false,
                message: 'teamIds must be an array'
            });
        }

        const user = await User.findById(req.user.id);
        user.favoriteTeams = teamIds;
        await user.save();

        res.json({
            success: true,
            message: 'Favorite teams updated',
            favoriteTeams: user.favoriteTeams
        });

    } catch (error) {
        console.error('Update favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/users/favorites/leagues
// @desc    Update user's favorite leagues
// @access  Private
router.put('/favorites/leagues', protect, async (req, res) => {
    try {
        const { leagueIds } = req.body;

        if (!Array.isArray(leagueIds)) {
            return res.status(400).json({
                success: false,
                message: 'leagueIds must be an array'
            });
        }

        const user = await User.findById(req.user.id);
        user.favoriteLeagues = leagueIds;
        await user.save();

        res.json({
            success: true,
            message: 'Favorite leagues updated',
            favoriteLeagues: user.favoriteLeagues
        });

    } catch (error) {
        console.error('Update favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -stripeCustomerId -stripeSubscriptionId');

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: user.toPublicJSON()
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;
