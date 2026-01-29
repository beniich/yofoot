import axios from "axios"
import { getApiUrl } from "../config/api"

const API = getApiUrl()

export const getLive = async () => {
    try {
        const r = await axios.get(`${API}/matches/live`)
        return r.data
    } catch (error) {
        console.error("Error fetching live matches", error)
        return []
    }
}

export const searchMatches = async (query) => {
    try {
        const r = await axios.get(`${API}/matches/search?q=${query}`)
        return r.data
    } catch (error) {
        console.error("Error searching matches", error)
        return []
    }
}

export const getLeagues = async () => {
    try {
        const r = await axios.get(`${API}/leagues`)
        return r.data
    } catch (error) {
        console.error("Error fetching leagues", error)
        return []
    }
}

export const getStandings = async (league, season) => {
    try {
        const r = await axios.get(`${API}/standings/${league}/${season}`)
        return r.data
    } catch (error) {
        console.error("Error fetching standings", error)
        return []
    }
}
