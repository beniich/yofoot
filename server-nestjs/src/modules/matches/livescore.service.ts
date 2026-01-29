import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class LivescoreService {
    private readonly logger = new Logger(LivescoreService.name);
    private readonly baseUrl = 'https://free-livescore-api.p.rapidapi.com';

    constructor(private configService: ConfigService) { }

    private get headers() {
        return {
            'x-rapidapi-host': this.configService.get<string>('LIVESCORE_API_HOST'),
            'x-rapidapi-key': this.configService.get<string>('LIVESCORE_API_KEY'),
        };
    }

    /**
     * Search for teams or competitions (soccer)
     */
    async search(query: string, sport: string = 'soccer') {
        try {
            this.logger.log(`Searching for "${query}" in ${sport}...`);
            const response = await axios.get(`${this.baseUrl}/livescore-get-search`, {
                params: {
                    sportname: sport,
                    search: query,
                },
                headers: this.headers,
            });
            return response.data;
        } catch (error) {
            this.logger.error(`Error searching livescore API: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get live scores for soccer
     */
    async getLiveScores(sport: string = 'soccer') {
        try {
            this.logger.log(`Fetching live scores for ${sport}...`);
            // Assuming endpoint follow the same pattern if not specified
            const response = await axios.get(`${this.baseUrl}/livescore-get-live`, {
                params: { sportname: sport },
                headers: this.headers,
            });
            return response.data;
        } catch (error) {
            this.logger.error(`Error fetching live scores: ${error.message}`);
            return null;
        }
    }
}
