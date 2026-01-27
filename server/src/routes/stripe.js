import express from "express"
import Stripe from "stripe"
import User from "../models/User.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET || "sk_test_placeholder")

// Plans configuration
const PLANS = {
    'pro': {
        price_id: process.env.STRIPE_PRICE_PRO || 'price_123_pro', // Replace with real Stripe Price ID
        name: 'Pro Analyst'
    },
    'elite': {
        price_id: process.env.STRIPE_PRICE_ELITE || 'price_456_elite', // Replace with real Stripe Price ID
        name: 'Elite Gold'
    }
}

// Create Checkout Session
router.post("/checkout", auth, async (req, res) => {
    try {
        const { planId } = req.body
        const user = req.user

        const plan = PLANS[planId]
        if (!plan) return res.status(400).json({ error: "Invalid plan" })

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                {
                    price: plan.price_id,
                    quantity: 1
                }
            ],
            customer_email: user.email,
            client_reference_id: user.id,
            metadata: {
                userId: user.id,
                planId: planId
            },
            success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/profile?payment=success&plan=${planId}`,
            cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/subscription?payment=cancelled`
        })

        res.json({ url: session.url })

    } catch (error) {
        console.error("Stripe Checkout Error:", error)
        res.status(500).json({ error: "Checkout failed" })
    }
})

// Webhook for successful payments
// Note: This endpoint should be raw body, usually configured in index.js specifically
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"]
    let event

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object
        const { userId, planId } = session.metadata

        console.log(`💰 Payment successful for User ${userId} - Plan: ${planId}`)

        // Update User Plan in DB
        await User.findByIdAndUpdate(userId, { plan: planId })
        // Could also trigger email or other actions
    }

    res.json({ received: true })
})

export default router
