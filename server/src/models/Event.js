import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    // Informations de base
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        enum: ['Match', 'Tournament', 'Training', 'Meeting', 'Social'],
        required: true,
    },

    // Date et lieu
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
    },
    venue: {
        type: String,
        required: [true, 'Venue is required'],
    },
    address: {
        street: String,
        city: {
            type: String,
            required: true,
        },
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'Morocco',
        },
    },

    // Médias
    coverImage: {
        type: String,
        default: null,
    },
    images: [{
        type: String,
    }],

    // Capacité et billets
    maxCapacity: {
        type: Number,
        default: 0,
    },
    ticketsAvailable: {
        type: Number,
        default: 0,
    },
    ticketPrice: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        default: 'MAD',
    },

    // Status
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Ongoing', 'Completed', 'Cancelled'],
        default: 'Draft',
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },

    // Organisateur
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },

    // Participants
    attendees: [{
        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
        },
        registeredAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['Registered', 'Attended', 'NoShow'],
            default: 'Registered',
        },
    }],

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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Virtual pour le nombre de participants
eventSchema.virtual('attendeeCount').get(function () {
    return this.attendees.length;
});

// Virtual pour vérifier si l'événement est complet
eventSchema.virtual('isFull').get(function () {
    return this.maxCapacity > 0 && this.attendees.length >= this.maxCapacity;
});

// Index
eventSchema.index({ startDate: 1, status: 1 });
eventSchema.index({ category: 1, isPublic: 1 });
eventSchema.index({ 'address.city': 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;
