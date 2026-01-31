import express from 'express';
import axios from 'axios';
import { protect } from '../middleware/auth.js';
import predictionService from '../services/predictionService.js';

const router = express.Router();

// @route   POST /api/ai/predict
// @desc    Get AI prediction for a match
// @access  Private (Pro/Elite users)
// @route   POST /api/ai/predict
// @desc    Get AI prediction for a match
// @access  Private (Pro/Elite users)
router.post('/predict', protect, async (req, res) => {
    try {
        const { matchId } = req.body;

        // Check user plan
        if (!req.user.hasAccess('advanced_predictions')) {
            return res.status(403).json({
                success: false,
                message: 'Upgrade to Pro or Elite plan to access AI predictions'
            });
        }

        try {
            // Use local Prediction Service
            const prediction = await predictionService.predictMatch(matchId);

            res.json({
                success: true,
                prediction
            });

        } catch (serviceError) {
            console.error('Prediction Service error:', serviceError.message);
            res.status(500).json({
                success: false,
                message: 'Error generating prediction',
                error: serviceError.message
            });
        }

    } catch (error) {
        console.error('Prediction route error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
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
