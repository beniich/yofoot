import mongoose from 'mongoose';
import crypto from 'crypto';

const ticketSchema = new mongoose.Schema({
    ticketNumber: {
        type: String,
        unique: true,
        required: true,
    },
    qrCode: {
        type: String,
        unique: true,
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },
    ticketType: {
        type: String,
        enum: ['VIP', 'Standard', 'Early Bird', 'Free'],
        default: 'Standard',
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    seating: {
        section: String,
        row: String,
        seat: String,
    },
    status: {
        type: String,
        enum: ['Valid', 'Used', 'Cancelled', 'Expired'],
        default: 'Valid',
    },
    isValidated: {
        type: Boolean,
        default: false,
    },
    validatedAt: Date,
    validatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },
}, {
    timestamps: true,
});

// Auto-génération
ticketSchema.pre('save', async function (next) {
    if (!this.ticketNumber) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = crypto.randomBytes(4).toString('hex').toUpperCase();
        this.ticketNumber = `TKT-${timestamp}-${random}`;
    }

    if (!this.qrCode) {
        const qrData = {
            ticket: this.ticketNumber,
            event: this.event,
            member: this.member,
            timestamp: Date.now(),
        };
        this.qrCode = Buffer.from(JSON.stringify(qrData)).toString('base64');
    }

    next();
});

export default mongoose.model('Ticket', ticketSchema);
