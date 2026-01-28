import mongoose from 'mongoose';
import crypto from 'crypto';

const ticketSchema = new mongoose.Schema({
    // Numéro de ticket
    ticketNumber: {
        type: String,
        unique: true,
        required: true,
    },

    // Code QR
    qrCode: {
        type: String,
        unique: true,
        required: true,
    },

    // Références
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

    // Type de ticket
    ticketType: {
        type: String,
        enum: ['VIP', 'Standard', 'Early Bird', 'Free'],
        default: 'Standard',
    },

    // Pricing
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    currency: {
        type: String,
        default: 'MAD',
    },

    // Seating (optionnel)
    seating: {
        section: String,
        row: String,
        seat: String,
    },

    // Status
    status: {
        type: String,
        enum: ['Valid', 'Used', 'Cancelled', 'Expired'],
        default: 'Valid',
    },

    // Validation
    isValidated: {
        type: Boolean,
        default: false,
    },
    validatedAt: {
        type: Date,
    },
    validatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },

    // Paiement
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Mobile', 'Transfer'],
    },

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Génération automatique du numéro de ticket
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

// Index
ticketSchema.index({ ticketNumber: 1 });
ticketSchema.index({ qrCode: 1 });
ticketSchema.index({ event: 1, member: 1 });
ticketSchema.index({ status: 1, isValidated: 1 });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
