import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { FootballImportModule } from './modules/football-import/football-import.module';
import { ClubsModule } from './modules/clubs/clubs.module';
import { TeamsModule } from './modules/teams/teams.module';
import { PlayersModule } from './modules/players/players.module';
import { MatchesModule } from './modules/matches/matches.module';
import { EventsModule } from './modules/events/events.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { ShopModule } from './modules/shop/shop.module';
import { OrdersModule } from './modules/orders/orders.module';
import { BadgesModule } from './modules/badges/badges.module';
import { LeaguesModule } from './modules/leagues/leagues.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    FootballImportModule,
    ClubsModule,
    TeamsModule,
    PlayersModule,
    MatchesModule,
    EventsModule,
    TicketsModule,
    SubscriptionsModule,
    ShopModule,
    OrdersModule,
    BadgesModule,
    LeaguesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
