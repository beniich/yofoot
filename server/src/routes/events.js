import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// GET /api/events - Get all events
router.get('/', async (req, res) => {
    try {
        const {
            category,
            status,
            search,
            featured,
            upcoming,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (category) query.category = category;
        if (status) query.status = status;
        if (featured) query.isFeatured = featured === 'true';
        if (upcoming) {
            query.startDate = { $gte: new Date() };
            query.status = { $in: ['Published', 'Ongoing'] };
        }

        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { venue: new RegExp(search, 'i') },
            ];
        }

        const events = await Event.find(query)
            .populate('organizer', 'firstName lastName email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ startDate: 1 });

        const count = await Event.countDocuments(query);

        res.json({
            events,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/events/:id - Get event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'firstName lastName email avatar')
            .populate('attendees.member', 'firstName lastName email avatar');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/events - Create new event
router.post('/', async (req, res) => {
    try {
        const event = new Event(req.body);
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH /api/events/:id - Update event
router.patch('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/events/:id - Delete event
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/events/:id/register - Register for event
router.post('/:id/register', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.isFull) {
            return res.status(400).json({ message: 'Event is full' });
        }

        const { memberId } = req.body;

        // Check if member already registered
        const alreadyRegistered = event.attendees.find(
            (a) => a.member && a.member.toString() === memberId
        );

        if (alreadyRegistered) {
            return res.status(400).json({ message: 'Already registered' });
        }

        event.attendees.push({
            member: memberId,
            registeredAt: new Date(),
            status: 'Registered',
        });

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
