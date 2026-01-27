import axios from "axios"

const API = "http://localhost:5000/api"

export const getLive = async () => {
    try {
        const r = await axios.get(`${API}/matches/live`)
        return r.data
    } catch (error) {
        console.error("Error fetching live matches", error)
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
