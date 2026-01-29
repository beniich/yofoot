import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: String,
    category: {
        type: String,
        enum: ['Jersey', 'Training', 'Accessories', 'Memorabilia', 'Equipment'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    comparePrice: Number,
    images: [String],
    mainImage: String,
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
    isActive: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    salesCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Product', productSchema);
