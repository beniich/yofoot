import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plan: { type: String, enum: ['free', 'pro', 'elite'], default: 'free' },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("User", userSchema)
