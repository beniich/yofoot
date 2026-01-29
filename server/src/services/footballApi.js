import axios from 'axios';
import League from '../models/League.js';
import Team from '../models/Team.js';
import Match from '../models/Match.js';
import Standing from '../models/Standing.js';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const API_BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    },
});

class FootballApiService {
    // ============================================================
    // LEAGUES
    // ============================================================

    async syncLeagues() {
        try {
            const response = await apiClient.get('/leagues', {
                params: { current: true },
            });

            const leagues = response.data.response;
            const syncedLeagues = [];

            for (const leagueData of leagues) {
                const league = await League.findOneAndUpdate(
                    { apiFootballId: leagueData.league.id },
                    {
                        apiFootballId: leagueData.league.id,
                        name: leagueData.league.name,
                        type: leagueData.league.type,
                        logo: leagueData.league.logo,
                        country: {
                            name: leagueData.country.name,
                            code: leagueData.country.code,
                            flag: leagueData.country.flag,
                        },
                        currentSeason: {
                            year: leagueData.seasons[0]?.year,
                            start: leagueData.seasons[0]?.start,
                            end: leagueData.seasons[0]?.end,
                            current: leagueData.seasons[0]?.current,
                        },
                        lastSyncedAt: new Date(),
                    },
                    { upsert: true, new: true }
                );

                syncedLeagues.push(league);
            }

            console.log(`✅ Synced ${syncedLeagues.length} leagues`);
            return syncedLeagues;
        } catch (error) {
            console.error('Error syncing leagues:', error);
            throw error;
        }
    }

    async getLeagueById(leagueId) {
        try {
            const response = await apiClient.get('/leagues', {
                params: { id: leagueId },
            });

            return response.data.response[0];
        } catch (error) {
            console.error('Error fetching league:', error);
            throw error;
        }
    }

    // ============================================================
    // TEAMS
    // ============================================================

    async syncTeamsByLeague(leagueId, season) {
        try {
            const response = await apiClient.get('/teams', {
                params: {
                    league: leagueId,
                    season: season,
                },
            });

            const teams = response.data.response;
            const syncedTeams = [];

            for (const teamData of teams) {
                const team = await Team.findOneAndUpdate(
                    { apiFootballId: teamData.team.id },
                    {
                        apiFootballId: teamData.team.id,
                        name: teamData.team.name,
                        code: teamData.team.code,
                        country: teamData.team.country,
                        founded: teamData.team.founded,
                        logo: teamData.team.logo,
                        venue: {
                            name: teamData.venue.name,
                            address: teamData.venue.address,
                            city: teamData.venue.city,
                            capacity: teamData.venue.capacity,
                            surface: teamData.venue.surface,
                            image: teamData.venue.image,
                        },
                        lastSyncedAt: new Date(),
                    },
                    { upsert: true, new: true }
                );

                syncedTeams.push(team);
            }

            console.log(`✅ Synced ${syncedTeams.length} teams`);
            return syncedTeams;
        } catch (error) {
            console.error('Error syncing teams:', error);
            throw error;
        }
    }

    // ============================================================
    // MATCHES
    // ============================================================

    async syncFixturesByLeague(leagueId, season) {
        try {
            const dbLeague = await League.findOne({ apiFootballId: leagueId });
            if (!dbLeague) {
                throw new Error('League not found in database');
            }

            const response = await apiClient.get('/fixtures', {
                params: {
                    league: leagueId,
                    season: season,
                },
            });

            const fixtures = response.data.response;
            const syncedMatches = [];

            for (const fixtureData of fixtures) {
                const homeTeam = await Team.findOne({
                    apiFootballId: fixtureData.teams.home.id,
                });
                const awayTeam = await Team.findOne({
                    apiFootballId: fixtureData.teams.away.id,
                });

                const match = await Match.findOneAndUpdate(
                    { apiFootballId: fixtureData.fixture.id },
                    {
                        apiFootballId: fixtureData.fixture.id,
                        league: dbLeague._id,
                        season: season,
                        round: fixtureData.league.round,

                        homeTeam: {
                            team: homeTeam?._id,
                            name: fixtureData.teams.home.name,
                            logo: fixtureData.teams.home.logo,
                        },
                        awayTeam: {
                            team: awayTeam?._id,
                            name: fixtureData.teams.away.name,
                            logo: fixtureData.teams.away.logo,
                        },

                        matchDate: new Date(fixtureData.fixture.date),
                        timezone: fixtureData.fixture.timezone,

                        venue: {
                            name: fixtureData.fixture.venue?.name,
                            city: fixtureData.fixture.venue?.city,
                        },

                        status: this.mapFixtureStatus(fixtureData.fixture.status.short),
                        elapsed: fixtureData.fixture.status.elapsed,

                        score: {
                            halftime: {
                                home: fixtureData.score.halftime?.home,
                                away: fixtureData.score.halftime?.away,
                            },
                            fulltime: {
                                home: fixtureData.score.fulltime?.home,
                                away: fixtureData.score.fulltime?.away,
                            },
                        },

                        lastSyncedAt: new Date(),
                    },
                    { upsert: true, new: true }
                );

                syncedMatches.push(match);
            }

            console.log(`✅ Synced ${syncedMatches.length} matches`);
            return syncedMatches;
        } catch (error) {
            console.error('Error syncing fixtures:', error);
            throw error;
        }
    }

    async getLiveMatches() {
        try {
            const response = await apiClient.get('/fixtures', {
                params: { live: 'all' },
            });

            return response.data.response;
        } catch (error) {
            console.error('Error fetching live matches:', error);
            throw error;
        }
    }

    // ============================================================
    // STANDINGS
    // ============================================================

    async syncStandingsByLeague(leagueId, season) {
        try {
            const dbLeague = await League.findOne({ apiFootballId: leagueId });
            if (!dbLeague) {
                throw new Error('League not found in database');
            }

            const response = await apiClient.get('/standings', {
                params: {
                    league: leagueId,
                    season: season,
                },
            });

            const standingsData = response.data.response[0]?.league?.standings[0];
            if (!standingsData) return null;

            const rankings = [];

            for (const entry of standingsData) {
                const team = await Team.findOne({ apiFootballId: entry.team.id });

                rankings.push({
                    rank: entry.rank,
                    team: team?._id,
                    teamName: entry.team.name,
                    teamLogo: entry.team.logo,

                    played: entry.all.played,
                    win: entry.all.win,
                    draw: entry.all.draw,
                    lose: entry.all.lose,

                    goals: {
                        for: entry.all.goals.for,
                        against: entry.all.goals.against,
                        diff: entry.goalsDiff,
                    },

                    points: entry.points,
                    form: entry.form,
                    status: entry.status,
                    description: entry.description,
                });
            }

            const standing = await Standing.findOneAndUpdate(
                { league: dbLeague._id, season: season },
                {
                    league: dbLeague._id,
                    season: season,
                    rankings: rankings,
                    lastSyncedAt: new Date(),
                },
                { upsert: true, new: true }
            );

            console.log(`✅ Synced standings for league ${leagueId}`);
            return standing;
        } catch (error) {
            console.error('Error syncing standings:', error);
            throw error;
        }
    }

    // ============================================================
    // HELPERS
    // ============================================================

    mapFixtureStatus(statusCode) {
        const statusMap = {
            'NS': 'SCHEDULED',
            'TBD': 'SCHEDULED',
            '1H': 'LIVE',
            'HT': 'LIVE',
            '2H': 'LIVE',
            'ET': 'LIVE',
            'P': 'LIVE',
            'FT': 'FINISHED',
            'AET': 'FINISHED',
            'PEN': 'FINISHED',
            'PST': 'POSTPONED',
            'CANC': 'CANCELLED',
            'ABD': 'CANCELLED',
        };

        return statusMap[statusCode] || 'SCHEDULED';
    }
}

export default new FootballApiService();
