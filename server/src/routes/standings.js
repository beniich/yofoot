import express from "express"
import api from "../services/footballApi.js"

const router = express.Router()

router.get("/:league/:season", async (req, res) => {
    try {
        const { league, season } = req.params

        const { data } = await api.get(
            `/standings?league=${league}&season=${season}`
        )

        if (data.response && data.response.length > 0) {
            res.json(data.response[0].league.standings[0])
        } else {
            res.json([])
        }

    } catch (error) {
        console.error("Error fetching standings:", error.message)
        res.status(500).json({ error: "Standings failed" })
    }
})

export default router
