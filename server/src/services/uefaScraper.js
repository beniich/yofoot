import axios from 'axios';
import * as cheerio from 'cheerio';
import League from '../models/League.js';
import Team from '../models/Team.js';
import Match from '../models/Match.js';
import Player from '../models/Player.js';
import Standing from '../models/Standing.js';

class UEFAScraper {
    constructor() {
        this.baseURL = 'https://www.uefa.com';
        this.apiURL = 'https://match.uefa.com/v5/';
        this.client = axios.create({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            },
        });
    }

    async scrapeChampionsLeague(season = '2024') {
        try {
            console.log('🏆 Scraping Champions League...');
            const competitionId = 1;
            const matchesURL = `${this.apiURL}matches?competitionId=${competitionId}&seasonYear=${season}`;
            const matchesRes = await this.client.get(matchesURL);
            const matches = matchesRes.data;

            for (const match of matches) {
                await this.processUEFAMatch(match, 'Champions League');
            }
            console.log('✅ Champions League scraping completed');
        } catch (error) {
            console.error('❌ Champions League scraping error:', error.message);
        }
    }

    async scrapeEuropaLeague(season = '2024') {
        try {
            console.log('🏆 Scraping Europa League...');
            const competitionId = 2;
            const matchesURL = `${this.apiURL}matches?competitionId=${competitionId}&seasonYear=${season}`;
            const matchesRes = await this.client.get(matchesURL);
            const matches = matchesRes.data;

            for (const match of matches) {
                await this.processUEFAMatch(match, 'Europa League');
            }
            console.log('✅ Europa League scraping completed');
        } catch (error) {
            console.error('❌ Europa League scraping error:', error.message);
        }
    }

    async processUEFAMatch(matchData, leagueName) {
        try {
            const league = await League.findOneAndUpdate(
                { name: leagueName },
                {
                    name: leagueName,
                    type: 'Cup',
                    country: { name: 'Europe', code: 'EU' },
                    isFeatured: true,
                    isActive: true,
                },
                { upsert: true, new: true }
            );

            const homeTeam = await this.processUEFATeam(matchData.homeTeam);
            const awayTeam = await this.processUEFATeam(matchData.awayTeam);

            await Match.findOneAndUpdate(
                { apiFootballId: matchData.id },
                {
                    apiFootballId: matchData.id,
                    league: league._id,
                    season: matchData.season?.year || new Date().getFullYear(),
                    round: matchData.round?.name || matchData.phase,
                    homeTeam: {
                        team: homeTeam._id,
                        name: matchData.homeTeam.name,
                        logo: matchData.homeTeam.logoUrl,
                    },
                    awayTeam: {
                        team: awayTeam._id,
                        name: matchData.awayTeam.name,
                        logo: matchData.awayTeam.logoUrl,
                    },
                    matchDate: new Date(matchData.kickOffTime.dateTime),
                    venue: {
                        name: matchData.stadium?.name,
                        city: matchData.stadium?.city,
                    },
                    status: this.mapUEFAStatus(matchData.status),
                    elapsed: matchData.minute,
                    score: {
                        halftime: {
                            home: matchData.score?.ht?.home || 0,
                            away: matchData.score?.ht?.away || 0,
                        },
                        fulltime: {
                            home: matchData.score?.total?.home || 0,
                            away: matchData.score?.total?.away || 0,
                        },
                    },
                    lastSyncedAt: new Date(),
                },
                { upsert: true, new: true }
            );
        } catch (error) {
            console.error('Error processing UEFA match:', error.message);
        }
    }

    async processUEFATeam(teamData) {
        try {
            const team = await Team.findOneAndUpdate(
                { apiFootballId: teamData.id },
                {
                    apiFootballId: teamData.id,
                    name: teamData.name,
                    code: teamData.code,
                    country: teamData.country?.name,
                    logo: teamData.logoUrl,
                    venue: {
                        name: teamData.stadium?.name,
                        city: teamData.stadium?.city,
                    },
                    lastSyncedAt: new Date(),
                },
                { upsert: true, new: true }
            );
            return team;
        } catch (error) {
            console.error('Error processing UEFA team:', error.message);
            throw error;
        }
    }

    async scrapePlayerStats(playerId) {
        try {
            const playerURL = `${this.apiURL}persons/${playerId}`;
            const response = await this.client.get(playerURL);
            const playerData = response.data;

            const player = await Player.findOneAndUpdate(
                { apiFootballId: playerId },
                {
                    apiFootballId: playerId,
                    firstName: playerData.firstName,
                    lastName: playerData.lastName,
                    commonName: playerData.commonName,
                    photo: playerData.imageUrl,
                    dateOfBirth: playerData.dateOfBirth,
                    nationality: {
                        name: playerData.country?.name,
                        code: playerData.country?.code,
                        flag: playerData.country?.flagUrl,
                    },
                    height: playerData.height,
                    weight: playerData.weight,
                    position: playerData.position,
                    lastSyncedAt: new Date(),
                },
                { upsert: true, new: true }
            );
            return player;
        } catch (error) {
            console.error('Error scraping UEFA player:', error.message);
        }
    }

    async scrapeStandings(competitionId, season) {
        try {
            const standingsURL = `${this.apiURL}standings?competitionId=${competitionId}&seasonYear=${season}`;
            const response = await this.client.get(standingsURL);
            const standingsData = response.data;

            const league = await League.findOne({ apiFootballId: competitionId });
            if (!league) return;

            const rankings = [];
            for (const entry of standingsData.groups[0]?.teams || []) {
                const team = await Team.findOne({ apiFootballId: entry.team.id });
                rankings.push({
                    rank: entry.rank,
                    team: team?._id,
                    teamName: entry.team.name,
                    teamLogo: entry.team.logoUrl,
                    played: entry.played,
                    win: entry.won,
                    draw: entry.drawn,
                    lose: entry.lost,
                    goals: {
                        for: entry.goalsFor,
                        against: entry.goalsAgainst,
                        diff: entry.goalDifference,
                    },
                    points: entry.points,
                });
            }

            await Standing.findOneAndUpdate(
                { league: league._id, season },
                { league: league._id, season, rankings, lastSyncedAt: new Date() },
                { upsert: true, new: true }
            );
        } catch (error) {
            console.error('Error scraping UEFA standings:', error.message);
        }
    }

    mapUEFAStatus(status) {
        const statusMap = {
            'SCHEDULED': 'SCHEDULED',
            'PLAYING': 'LIVE',
            'FINISHED': 'FINISHED',
            'POSTPONED': 'POSTPONED',
            'CANCELLED': 'CANCELLED',
        };
        return statusMap[status] || 'SCHEDULED';
    }

    async fullUEFASync(season = '2024') {
        await this.scrapeChampionsLeague(season);
        await new Promise(r => setTimeout(r, 2000));
        await this.scrapeEuropaLeague(season);
    }
}

export default new UEFAScraper();
