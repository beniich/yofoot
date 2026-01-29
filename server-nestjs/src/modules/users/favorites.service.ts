import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoritesService {
    constructor(private prisma: PrismaService) { }

    async toggleLeague(userId: string, leagueName: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const leagues = user.favoriteLeagues || [];
        const index = leagues.indexOf(leagueName);

        if (index > -1) {
            leagues.splice(index, 1);
        } else {
            leagues.push(leagueName);
        }

        return await this.prisma.user.update({
            where: { id: userId },
            data: { favoriteLeagues: { set: leagues } },
        });
    }

    async getFavorites(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { favoriteLeagues: true, favoriteTeams: true },
        });
        return user;
    }
}
