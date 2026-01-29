import { Controller, Get, Param } from '@nestjs/common';
import { LeaguesService } from './leagues.service';

@Controller('leagues')
export class LeaguesController {
    constructor(private readonly leaguesService: LeaguesService) { }

    @Get()
    async findAll() {
        return this.leaguesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.leaguesService.findOne(id);
    }
}
