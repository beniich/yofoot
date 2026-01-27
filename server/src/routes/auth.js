import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body

        // Check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ error: "User already exists" })

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            username,
            email,
            password: hashedPassword
        })

        await user.save()

        // Create token
        const token = jwt.sign(
            { id: user._id, email: user.email, plan: user.plan },
            process.env.JWT_SECRET || "supersecret",
            { expiresIn: "7d" }
        )

        res.json({ token, user: { id: user._id, username, email, plan: user.plan } })

    } catch (error) {
        console.error("Registration error:", error)
        res.status(500).json({ error: "Registration failed" })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ error: "User not found" })

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(400).json({ error: "Invalid password" })

        const token = jwt.sign(
            { id: user._id, email: user.email, plan: user.plan },
            process.env.JWT_SECRET || "supersecret",
            { expiresIn: "7d" }
        )

        res.json({ token, user: { id: user._id, username: user.username, email, plan: user.plan } })

    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ error: "Login failed" })
    }
})

export default router
