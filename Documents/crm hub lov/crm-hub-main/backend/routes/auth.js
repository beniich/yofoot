const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

router.post('/signup', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').trim().notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, fullName } = req.body;

        const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 7);

        const [result] = await pool.query('INSERT INTO users (email, password_hash, full_name, trial_ends_at, subscription_plan, subscription_status) VALUES (?, ?, ?, ?, ?, ?)', [email, passwordHash, fullName, trialEndsAt, 'trial', 'active']);

        const userId = result.insertId;
        const { accessToken, refreshToken } = generateTokens(userId);

        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

        await pool.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [userId, refreshToken, refreshTokenExpiry]);

        res.status(201).json({
            message: 'Account created successfully! Your 7-day free trial has started.',
            user: { id: userId, email, fullName, subscriptionPlan: 'trial', trialEndsAt },
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const { accessToken, refreshToken } = generateTokens(user.id);
        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

        await pool.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [user.id, refreshToken, refreshTokenExpiry]);

        const trialExpired = user.subscription_plan === 'trial' && new Date() > new Date(user.trial_ends_at);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                subscriptionPlan: user.subscription_plan,
                subscriptionStatus: user.subscription_status,
                trialEndsAt: user.trial_ends_at,
                trialExpired
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/logout', authenticateToken, async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await pool.query('DELETE FROM refresh_tokens WHERE token = ? AND user_id = ?', [refreshToken, req.user.id]);
        }
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const trialExpired = user.subscription_plan === 'trial' && new Date() > new Date(user.trial_ends_at);

        res.json({
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                subscriptionPlan: user.subscription_plan,
                subscriptionStatus: user.subscription_status,
                trialEndsAt: user.trial_ends_at,
                trialExpired
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

module.exports = router;
