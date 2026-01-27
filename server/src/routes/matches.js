import express from "express"
import api from "../services/footballApi.js"

const router = express.Router()

router.get("/live", async (req, res) => {
    try {
        const { data } = await api.get("/fixtures?live=all")
        res.json(data.response)
    } catch (error) {
        console.error("Error fetching live matches:", error.message)
        res.status(500).json({ error: "Live matches failed" })
    }
})

export default router
