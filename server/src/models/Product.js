import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    // Informations de base
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },

    // Catégorie
    category: {
        type: String,
        enum: ['Jersey', 'Training', 'Accessories', 'Memorabilia', 'Equipment'],
        required: true,
    },

    // Prix
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0,
    },
    comparePrice: {
        type: Number,
        min: 0,
    },
    currency: {
        type: String,
        default: 'MAD',
    },

    // Images
    images: [{
        type: String,
    }],
    mainImage: {
        type: String,
    },

    // Stock
    sku: {
        type: String,
        unique: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },

    // Variantes (tailles, couleurs)
    variants: [{
        name: String,
        value: String,
        sku: String,
        stock: Number,
        priceAdjustment: Number,
    }],

    // Status
    isActive: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },

    // Metadata
    tags: [{
        type: String,
    }],
    weight: Number,
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
            type: String,
            default: 'cm',
        },
    },

    // Stats
    salesCount: {
        type: Number,
        default: 0,
    },
    viewCount: {
        type: Number,
        default: 0,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Virtual pour calculer le discount
productSchema.virtual('discount').get(function () {
    if (this.comparePrice && this.comparePrice > this.price) {
        return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
    }
    return 0;
});

// Index
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Génération auto du SKU
productSchema.pre('save', async function (next) {
    if (!this.sku) {
        const count = await this.constructor.countDocuments();
        this.sku = `PRD${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
