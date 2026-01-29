import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users/favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post('league')
    async toggleLeague(@Req() req, @Body('name') name: string) {
        return this.favoritesService.toggleLeague(req.user.userId, name);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getFavorites(@Req() req) {
        return this.favoritesService.getFavorites(req.user.userId);
    }
}
