import mongoose from 'mongoose';
import 'dotenv/config';
import League from '../models/League.js';
import Team from '../models/Team.js';
import Match from '../models/Match.js';
import NewsArticle from '../models/NewsArticle.js';
import Standing from '../models/Standing.js';

const MOCK_LEAGUES = [
    {
        apiFootballId: 39,
        name: 'Premier League',
        type: 'League',
        logo: 'https://media.api-sports.io/football/leagues/39.png',
        country: { name: 'England', code: 'GB', flag: 'https://media.api-sports.io/flags/gb.svg' },
        isFeatured: true,
        priority: 10,
        followersCount: 15420
    },
    {
        apiFootballId: 140,
        name: 'La Liga',
        type: 'League',
        logo: 'https://media.api-sports.io/football/leagues/140.png',
        country: { name: 'Spain', code: 'ES', flag: 'https://media.api-sports.io/flags/es.svg' },
        isFeatured: true,
        priority: 9,
        followersCount: 12300
    },
    {
        apiFootballId: 61,
        name: 'Ligue 1',
        type: 'League',
        logo: 'https://media.api-sports.io/football/leagues/61.png',
        country: { name: 'France', code: 'FR', flag: 'https://media.api-sports.io/flags/fr.svg' },
        isFeatured: true,
        priority: 8,
        followersCount: 8500
    }
];

const MOCK_NEWS = [
    {
        title: 'Mbappé brille pour ses débuts avec le Real Madrid',
        description: 'L\'attaquant français a marqué un doublé lors de son premier match en Liga.',
        content: 'Kylian Mbappé a répondu aux attentes en inscrivant deux buts magnifiques...',
        category: 'Match',
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000',
        publishedAt: new Date(),
        viewCount: 1250,
        likeCount: 450,
        isFeatured: true,
        source: 'FootballHub News'
    },
    {
        title: 'Transferts : Manchester City cible un nouveau milieu',
        description: 'Pep Guardiola souhaite renforcer son entrejeu avant la fin du mercato.',
        category: 'Transfer',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000',
        publishedAt: new Date(Date.now() - 3600000),
        viewCount: 850,
        likeCount: 120,
        source: 'TransferMarket'
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🌱 Starting Seeding...');

        // Clear existing
        await League.deleteMany({});
        await Team.deleteMany({});
        await Match.deleteMany({});
        await NewsArticle.deleteMany({});
        await Standing.deleteMany({});

        // Seed Leagues
        const createdLeagues = await League.insertMany(MOCK_LEAGUES);
        console.log(`✅ Seeded ${createdLeagues.length} leagues`);

        // Seed News
        const newsWithLeagues = MOCK_NEWS.map((news, i) => ({
            ...news,
            league: createdLeagues[i % createdLeagues.length]._id
        }));
        await NewsArticle.insertMany(newsWithLeagues);
        console.log(`✅ Seeded ${MOCK_NEWS.length} news articles`);

        // Mock Teams
        const teams = await Team.insertMany([
            { name: 'Arsenal', logo: 'https://media.api-sports.io/football/teams/42.png', country: 'England' },
            { name: 'Man City', logo: 'https://media.api-sports.io/football/teams/50.png', country: 'England' }
        ]);

        // Mock Match
        await Match.create({
            league: createdLeagues[0]._id,
            homeTeam: { team: teams[0]._id, name: teams[0].name, logo: teams[0].logo },
            awayTeam: { team: teams[1]._id, name: teams[1].name, logo: teams[1].logo },
            matchDate: new Date(),
            status: 'LIVE',
            elapsed: 65,
            score: { fulltime: { home: 2, away: 1 } }
        });
        console.log('✅ Seeded 1 live match');

        console.log('🚀 Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
