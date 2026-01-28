import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    // Informations personnelles
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
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
        type: String,
        trim: true,
    },
    dateOfBirth: {
        type: Date,
    },

    // Adresse
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'Morocco',
        },
    },

    // Membership
    membershipNumber: {
        type: String,
        unique: true,
        required: true,
    },
    membershipType: {
        type: String,
        enum: ['Basic', 'Premium', 'VIP'],
        default: 'Basic',
    },
    membershipStatus: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Active',
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    expiryDate: {
        type: Date,
    },

    // Photo
    avatar: {
        type: String,
        default: null,
    },

    // Références
    tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
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

// Virtual pour le nom complet
memberSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Index pour recherche rapide
memberSchema.index({ email: 1, membershipNumber: 1 });
memberSchema.index({ membershipStatus: 1, membershipType: 1 });

// Middleware pour générer le numéro de membre
memberSchema.pre('save', async function (next) {
    if (!this.membershipNumber) {
        const count = await this.constructor.countDocuments();
        this.membershipNumber = `MEM${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

const Member = mongoose.model('Member', memberSchema);
export default Member;
