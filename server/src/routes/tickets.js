import express from 'express';
import Ticket from '../models/Ticket.js';
import Event from '../models/Event.js';
import Member from '../models/Member.js';

const router = express.Router();

// GET /api/tickets - Get all tickets
router.get('/', async (req, res) => {
    try {
        const {
            memberId,
            eventId,
            status,
            type,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (memberId) query.member = memberId;
        if (eventId) query.event = eventId;
        if (status) query.status = status;
        if (type) query.ticketType = type;

        const tickets = await Ticket.find(query)
            .populate('event', 'title startDate venue coverImage')
            .populate('member', 'firstName lastName email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Ticket.countDocuments(query);

        res.json({
            tickets,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/tickets/:id - Get ticket by ID
router.get('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('event')
            .populate('member', 'firstName lastName email phone avatar')
            .populate('validatedBy', 'firstName lastName');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/tickets/qr/:qrCode - Get ticket by QR code
router.get('/qr/:qrCode', async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ qrCode: req.params.qrCode })
            .populate('event')
            .populate('member', 'firstName lastName email phone avatar');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/tickets - Create new ticket
router.post('/', async (req, res) => {
    try {
        const { eventId, memberId, ticketType, price, seating } = req.body;

        // Vérifier que l'événement existe
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Vérifier que le membre existe
        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Vérifier la capacité
        const ticketCount = await Ticket.countDocuments({
            event: eventId,
            status: { $in: ['Valid', 'Used'] }
        });

        if (event.maxCapacity > 0 && ticketCount >= event.maxCapacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        const ticket = new Ticket({
            event: eventId,
            member: memberId,
            ticketType,
            price: price || event.ticketPrice || 0,
            currency: event.currency,
            seating,
        });

        const newTicket = await ticket.save();

        // Mettre à jour les références
        await Member.findByIdAndUpdate(memberId, {
            $push: { tickets: newTicket._id },
        });

        res.status(201).json(newTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST /api/tickets/:id/validate - Validate ticket
router.post('/:id/validate', async (req, res) => {
    try {
        const { validatorId } = req.body;

        const ticket = await Ticket.findById(req.params.id)
            .populate('event')
            .populate('member', 'firstName lastName email avatar');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Vérifier le statut
        if (ticket.status !== 'Valid') {
            return res.status(400).json({
                message: 'Ticket is not valid',
                status: ticket.status
            });
        }

        if (ticket.isValidated) {
            return res.status(400).json({
                message: 'Ticket already used',
                validatedAt: ticket.validatedAt
            });
        }

        // Vérifier la date de l'événement
        const now = new Date();
        const eventStart = new Date(ticket.event.startDate);
        const eventEnd = ticket.event.endDate
            ? new Date(ticket.event.endDate)
            : new Date(eventStart.getTime() + 6 * 60 * 60 * 1000); // +6h

        if (now < eventStart || now > eventEnd) {
            return res.status(400).json({
                message: 'Ticket not valid for current time',
                eventStart,
                eventEnd
            });
        }

        // Valider le ticket
        ticket.isValidated = true;
        ticket.validatedAt = now;
        ticket.validatedBy = validatorId;
        ticket.status = 'Used';

        await ticket.save();

        res.json({
            success: true,
            message: 'Ticket validated successfully',
            ticket,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST /api/tickets/validate-qr - Validate ticket by QR code
router.post('/validate-qr', async (req, res) => {
    try {
        const { qrCode, validatorId } = req.body;

        const ticket = await Ticket.findOne({ qrCode })
            .populate('event')
            .populate('member', 'firstName lastName email avatar');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Utiliser la même logique de validation
        if (ticket.status !== 'Valid') {
            return res.status(400).json({
                message: 'Ticket is not valid',
                status: ticket.status
            });
        }

        if (ticket.isValidated) {
            return res.status(400).json({
                message: 'Ticket already used',
                validatedAt: ticket.validatedAt
            });
        }

        const now = new Date();
        const eventStart = new Date(ticket.event.startDate);
        const eventEnd = ticket.event.endDate
            ? new Date(ticket.event.endDate)
            : new Date(eventStart.getTime() + 6 * 60 * 60 * 1000);

        if (now < eventStart || now > eventEnd) {
            return res.status(400).json({
                message: 'Ticket not valid for current time'
            });
        }

        ticket.isValidated = true;
        ticket.validatedAt = now;
        ticket.validatedBy = validatorId;
        ticket.status = 'Used';

        await ticket.save();

        res.json({
            success: true,
            message: 'Ticket validated successfully',
            ticket,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH /api/tickets/:id - Update ticket
router.patch('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/tickets/:id - Cancel ticket
router.delete('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status: 'Cancelled' },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json({ message: 'Ticket cancelled successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
