import express from 'express';
import Member from '../models/Member.js';

const router = express.Router();

// GET /api/members - Get all members
router.get('/', async (req, res) => {
    try {
        const {
            status,
            type,
            search,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (status) query.membershipStatus = status;
        if (type) query.membershipType = type;
        if (search) {
            query.$or = [
                { firstName: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { membershipNumber: new RegExp(search, 'i') },
            ];
        }

        const members = await Member.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Member.countDocuments(query);

        res.json({
            members,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/members/:id - Get member by ID
router.get('/:id', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id)
            .populate('tickets')
            .populate('orders');

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/members - Create new member
router.post('/', async (req, res) => {
    try {
        const member = new Member(req.body);
        const newMember = await member.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH /api/members/:id - Update member
router.patch('/:id', async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/members/:id - Delete member
router.delete('/:id', async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);

        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/members/stats - Get membership statistics
// Note: This route must be placed before /:id to avoid conflict if 'stats' is interpreted as an ID
router.get('/data/stats', async (req, res) => {
    try {
        const stats = await Member.aggregate([
            {
                $group: {
                    _id: '$membershipType',
                    count: { $sum: 1 },
                },
            },
        ]);

        const totalMembers = await Member.countDocuments();
        const activeMembers = await Member.countDocuments({ membershipStatus: 'Active' });

        res.json({
            totalMembers,
            activeMembers,
            byType: stats,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
