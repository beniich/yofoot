import { Controller, Get, Query } from '@nestjs/common';
import { LivescoreService } from './livescore.service';

@Controller('matches')
export class MatchesController {
    constructor(private readonly livescoreService: LivescoreService) { }

    @Get('search')
    async search(@Query('q') query: string) {
        return this.livescoreService.search(query);
    }

    @Get('live')
    async getLive() {
        return this.livescoreService.getLiveScores();
    }
}
