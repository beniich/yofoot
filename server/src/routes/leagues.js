import express from "express"
import api from "../services/footballApi.js"

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const { data } = await api.get("/leagues")
        res.json(data.response)
    } catch (error) {
        console.error("Error fetching leagues:", error.message)
        res.status(500).json({ error: "Leagues failed" })
    }
})

export default router
