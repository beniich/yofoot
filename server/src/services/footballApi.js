const axios = require('axios');

class FootballApi {
    constructor() {
        this.baseUrl = 'https://api-football-v1.p.rapidapi.com/v3';
        this.apiKey = process.env.RAPIDAPI_KEY;
        this.host = process.env.RAPIDAPI_HOST || 'api-football-v1.p.rapidapi.com';
    }

    get headers() {
        return {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': this.host,
        };
    }

    async getLeagueById(id) {
        try {
            const response = await axios.get(`${this.baseUrl}/leagues`, {
                headers: this.headers,
                params: { id },
            });
            return response.data.response[0];
        } catch (error) {
            console.error(`Error fetching league ${id}:`, error.message);
            return null;
        }
    }

    async syncFixturesByLeague(leagueId, season) {
        try {
            const response = await axios.get(`${this.baseUrl}/fixtures`, {
                headers: this.headers,
                params: { league: leagueId, season },
            });
            return response.data.response;
        } catch (error) {
            console.error(`Error fetching fixtures for league ${leagueId}:`, error.message);
            return [];
        }
    }

    async getLiveMatches() {
        try {
            const response = await axios.get(`${this.baseUrl}/fixtures`, {
                headers: this.headers,
                params: { live: 'all' },
            });
            return response.data.response;
        } catch (error) {
            console.error('Error fetching live matches:', error.message);
            return [];
        }
    }

    async syncStandingsByLeague(leagueId, season) {
        try {
            const response = await axios.get(`${this.baseUrl}/standings`, {
                headers: this.headers,
                params: { league: leagueId, season },
            });
            return response.data.response;
        } catch (error) {
            console.error(`Error fetching standings for league ${leagueId}:`, error.message);
            return [];
        }
    }

    mapFixtureStatus(shortStatus) {
        const statusMap = {
            'TBD': 'SCHEDULED',
            'NS': 'SCHEDULED',
            '1H': 'LIVE',
            'HT': 'HALFTIME',
            '2H': 'LIVE',
            'ET': 'LIVE',
            'BT': 'LIVE',
            'P': 'LIVE',
            'SUSP': 'SUSPENDED',
            'INT': 'INTERRUPTED',
            'FT': 'FINISHED',
            'AET': 'FINISHED',
            'PEN': 'FINISHED',
            'PST': 'POSTPONED',
            'CANC': 'CANCELLED',
            'ABD': 'ABANDONED',
            'AWD': 'Technical Loss',
            'WO': 'WalkOver',
            'LIVE': 'LIVE',
        };
        return statusMap[shortStatus] || 'SCHEDULED';
    }
}

// Singleton
const footballApi = new FootballApi();
module.exports = footballApi;
