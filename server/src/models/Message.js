import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: String,
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        maxlength: 500
    },
    type: {
        type: String,
        enum: ['text', 'image', 'system'],
        default: 'text'
    },
    edited: {
        type: Boolean,
        default: false
    },
    editedAt: Date
}, {
    timestamps: true
});

// Indexes for performance
messageSchema.index({ room: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
