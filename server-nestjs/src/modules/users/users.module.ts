import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
    providers: [UsersService, FavoritesService],
    exports: [UsersService],
    controllers: [FavoritesController],
})
export class UsersModule { }
