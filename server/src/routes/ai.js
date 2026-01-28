import express from 'express';
import axios from 'axios';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/ai/predict
// @desc    Get AI prediction for a match
// @access  Private (Pro/Elite users)
router.post('/predict', protect, async (req, res) => {
    try {
        const { matchId, homeTeam, awayTeam, league } = req.body;

        // Check user plan
        if (!req.user.hasAccess('advanced_predictions')) {
            return res.status(403).json({
                success: false,
                message: 'Upgrade to Pro or Elite plan to access AI predictions'
            });
        }

        // Call AI service
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

        try {
            const response = await axios.post(`${aiServiceUrl}/predict`, {
                match_id: matchId,
                home_team: homeTeam,
                away_team: awayTeam,
                league
            }, {
                timeout: 5000
            });

            res.json({
                success: true,
                prediction: response.data
            });

        } catch (aiError) {
            console.error('AI Service error:', aiError.message);

            // Fallback: return mock prediction if AI service is down
            res.json({
                success: true,
                prediction: {
                    winner: 'home',
                    confidence: 0.65,
                    score_prediction: '2-1',
                    note: 'AI service unavailable - showing fallback prediction'
                }
            });
        }

    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/ai/stats
// @desc    Get AI model statistics
// @access  Public
router.get('/stats', async (req, res) => {
    try {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

        try {
            const response = await axios.get(`${aiServiceUrl}/stats`, {
                timeout: 3000
            });

            res.json({
                success: true,
                stats: response.data
            });

        } catch (aiError) {
            // Return mock stats if service is down
            res.json({
                success: true,
                stats: {
                    accuracy: 0.72,
                    total_predictions: 1250,
                    model_version: '1.0.0',
                    status: 'unavailable'
                }
            });
        }

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;
