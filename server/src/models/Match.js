import mongoose from "mongoose"

const matchSchema = new mongoose.Schema({
    fixtureId: { type: Number, required: true, unique: true },
    leagueId: Number,
    homeTeam: String,
    awayTeam: String,
    score: {
        home: Number,
        away: Number
    },
    status: String,
    startTime: Date,
    lastUpdated: { type: Date, default: Date.now }
})

export default mongoose.model("Match", matchSchema)
