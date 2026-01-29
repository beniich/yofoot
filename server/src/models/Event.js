import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: String,
    category: {
        type: String,
        enum: ['Match', 'Training', 'Tournament', 'Meeting', 'Social'],
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: Date,
    venue: {
        type: String,
        required: true,
    },
    address: {
        city: String,
        country: String,
    },
    coverImage: String,
    images: [String],

    // Capacité
    capacity: {
        type: Number,
        default: 0,
    },
    ticketPrice: {
        type: Number,
        default: 0,
    },

    // Status
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Ongoing', 'Completed', 'Cancelled'],
        default: 'Draft',
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
    }],
}, {
    timestamps: true,
});

export default mongoose.model('Event', eventSchema);
