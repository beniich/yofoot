import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { createServer } from "http"

import matches from "./routes/matches.js"
import leagues from "./routes/leagues.js"
import standings from "./routes/standings.js"
import auth from "./routes/auth.js"
import stripeRoutes from "./routes/stripe.js"
import { initSocket } from "./socket.js"

dotenv.config()

const app = express()
const server = createServer(app)
const io = initSocket(server)

// Make io available in routes
app.use((req, res, next) => {
    req.io = io
    next()
})

app.use(cors())

// IMPORTANT: Stripe webhook needs raw body, usually handled before express.json() for that specific route
// But for simplicity in this setup, we'll keep express.json() global and note that production Webhook handling 
// often requires careful body parsing middleware ordering. 
// For now, our /api/stripe/webhook expects parsed JSON or needs specific setup.
// To keep it simple for now, we assume standard JSON flow for checkout creation.
app.use(express.json())

// Routes
app.use("/api/auth", auth)
app.use("/api/matches", matches)
app.use("/api/leagues", leagues)
app.use("/api/standings", standings)
app.use("/api/stripe", stripeRoutes)

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/footballhub"
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err.message))

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log("Backend running on port " + PORT)
})
