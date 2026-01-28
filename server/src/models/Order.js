import mongoose from 'mongoose';
import crypto from 'crypto';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    productSnapshot: {
        name: String,
        price: Number,
        image: String,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
    variant: {
        name: String,
        value: String,
    },
});

const orderSchema = new mongoose.Schema({
    // Numéro de commande
    orderNumber: {
        type: String,
        unique: true,
        required: true,
    },

    // Client
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
    },

    // Articles
    items: [orderItemSchema],

    // Pricing
    subtotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        default: 0,
    },
    shipping: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'MAD',
    },

    // Adresse de livraison
    shippingAddress: {
        firstName: String,
        lastName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
    },

    // Livraison
    shippingMethod: {
        type: String,
        enum: ['Standard', 'Express', 'PickUp'],
        default: 'Standard',
    },
    trackingNumber: {
        type: String,
    },
    estimatedDelivery: {
        type: Date,
    },

    // Status
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
        default: 'Pending',
    },

    // Paiement
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded'],
        default: 'Pending',
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Mobile', 'Transfer'],
    },
    paidAt: {
        type: Date,
    },

    // Notes
    customerNote: {
        type: String,
    },
    internalNote: {
        type: String,
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

// Génération auto du numéro de commande
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = crypto.randomBytes(4).toString('hex').toUpperCase();
        this.orderNumber = `ORD-${timestamp}-${random}`;
    }
    next();
});

// Index
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ member: 1, status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
