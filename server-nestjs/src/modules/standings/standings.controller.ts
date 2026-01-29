import { Controller, Get, Param } from '@nestjs/common';
import { StandingsService } from './standings.service';

@Controller('standings')
export class StandingsController {
    constructor(private readonly standingsService: StandingsService) { }

    @Get(':leagueId/:season')
    async getStandings(
        @Param('leagueId') leagueId: string,
        @Param('season') season: string,
    ) {
        return this.standingsService.getStandings(leagueId, season);
    }
}
