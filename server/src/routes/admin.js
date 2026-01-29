import express from 'express';
import uefaScraper from '../services/uefaScraper.js';
import syncService from '../services/syncService.js';

const router = express.Router();

// Middleware to check admin status (can be enhanced with auth)
const isAdmin = (req, res, next) => {
    // Simple check for now - can use req.user.role === 'admin'
    next();
};

router.use(isAdmin);

// --- UEFA Sync ---

router.post('/uefa/sync/champions-league', async (req, res) => {
    try {
        const { season } = req.body;
        await uefaScraper.scrapeChampionsLeague(season || '2024');
        res.json({ message: 'Champions League sync started' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/uefa/sync/europa-league', async (req, res) => {
    try {
        const { season } = req.body;
        await uefaScraper.scrapeEuropaLeague(season || '2024');
        res.json({ message: 'Europa League sync started' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/uefa/sync/full', async (req, res) => {
    try {
        const { season } = req.body;
        await uefaScraper.fullUEFASync(season || '2024');
        res.json({ message: 'Full UEFA sync started' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- API-Football Sync ---

router.post('/sync/full', async (req, res) => {
    try {
        await syncService.syncAll();
        res.json({ message: 'Full API-Football sync started' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/sync/status', (req, res) => {
    res.json(syncService.getSyncStatus());
});

export default router;
