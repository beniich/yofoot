import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LeaguesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.league.findMany({
            where: { isFeatured: true },
        });
    }

    async findOne(id: string) {
        return this.prisma.league.findUnique({
            where: { id },
        });
    }
}
