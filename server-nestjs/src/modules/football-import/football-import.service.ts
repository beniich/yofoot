import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class FootballImportService {
    private readonly logger = new Logger(FootballImportService.name);
    private readonly apiUrl = 'https://v3.football.api-sports.io';
    private readonly apiKey = process.env.API_FOOTBALL_KEY;

    constructor(private prisma: PrismaService) { }

    @Cron('0 */6 * * *') // Every 6 hours
    async handleCron() {
        this.logger.log('Starting automated football data import...');
        await this.importLeagues();
        await this.importTeams(39, 2024); // Example: Premier League
    }

    async importLeagues() {
        try {
            this.logger.log('Importing featured leagues...');
            // Logic for featured leagues...
        } catch (error) {
            this.logger.error('Error importing leagues', error.stack);
        }
    }

    async importTeams(leagueId: number, season: number) {
        try {
            this.logger.log(`Importing teams for league ${leagueId}, season ${season}...`);
            const response = await axios.get(`${this.apiUrl}/teams`, {
                params: { league: leagueId, season: season },
                headers: {
                    'x-apisports-key': this.apiKey,
                },
            });

            for (const item of response.data.response) {
                const t = item.team;
                await this.prisma.team.upsert({
                    where: { externalId: t.id.toString() },
                    update: {
                        name: t.name,
                        logo: t.logo,
                    },
                    create: {
                        externalId: t.id.toString(),
                        name: t.name,
                        logo: t.logo,
                    },
                });
            }
            this.logger.log(`Successfully imported ${response.data.response.length} teams`);
        } catch (error) {
            this.logger.error('Error importing teams', error.stack);
        }
    }

    async importMatches(leagueId: number, season: number) {
        // Similar logic for matches...
    }
}
