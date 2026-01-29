import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class StandingsService {
    private readonly logger = new Logger(StandingsService.name);
    private readonly apiUrl = 'https://v3.football.api-sports.io';

    constructor(private configService: ConfigService) { }

    async getStandings(leagueId: string, season: string) {
        try {
            const apiKey = this.configService.get<string>('API_FOOTBALL_KEY');
            const response = await axios.get(`${this.apiUrl}/standings`, {
                params: { league: leagueId, season: season },
                headers: { 'x-apisports-key': apiKey },
            });

            const data = response.data.response[0];
            if (!data) return null;

            // Transform API-Football format to the format expected by the frontend
            return {
                league: {
                    name: data.league.name,
                    logo: data.league.logo,
                },
                season: data.league.season,
                rankings: data.league.standings[0].map((s: any) => ({
                    rank: s.rank,
                    teamName: s.team.name,
                    teamLogo: s.team.logo,
                    played: s.all.played,
                    win: s.all.win,
                    draw: s.all.draw,
                    lose: s.all.lose,
                    points: s.points,
                    goalsDiff: s.goalsDiff,
                })),
            };
        } catch (error) {
            this.logger.error(`Error fetching standings: ${error.message}`);
            return null;
        }
    }
}
