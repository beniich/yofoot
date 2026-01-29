import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: String,
    avatar: String,

    // Membership
    membershipNumber: {
        type: String,
        unique: true,
    },
    role: {
        type: String,
        enum: ['Player', 'Staff', 'Fan', 'Admin'],
        default: 'Fan',
    },
    tier: {
        type: String,
        enum: ['VIP', 'Elite', 'Standard'],
        default: 'Standard',
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Active',
    },

    // Stats
    joinDate: {
        type: Date,
        default: Date.now,
    },
    totalSpent: {
        type: Number,
        default: 0,
    },

    // Relations
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

// Virtual pour nom complet
memberSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Auto-génération du numéro de membre
memberSchema.pre('save', async function (next) {
    if (!this.membershipNumber) {
        const count = await this.constructor.countDocuments();
        this.membershipNumber = `MEM${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

export default mongoose.model('Member', memberSchema);
