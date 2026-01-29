import 'dotenv/config';
import mongoose from 'mongoose';
import Member from '../models/Member.js';
import Event from '../models/Event.js';
import Product from '../models/Product.js';
import Ticket from '../models/Ticket.js';
import Order from '../models/Order.js';
import League from '../models/League.js';
import Team from '../models/Team.js';
import Match from '../models/Match.js';
import NewsArticle from '../models/NewsArticle.js';
import Standing from '../models/Standing.js';

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Member.deleteMany({});
        await Event.deleteMany({});
        await Product.deleteMany({});
        await Ticket.deleteMany({});
        await Order.deleteMany({});
        await League.deleteMany({});
        await Team.deleteMany({});
        await Match.deleteMany({});
        await NewsArticle.deleteMany({});
        await Standing.deleteMany({});

        console.log('Cleared existing data.');

        // 1. Create Members
        const members = await Member.insertMany([
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phone: '123-456-7890',
                role: 'Fan',
                tier: 'VIP',
                status: 'Active',
                avatar: 'https://i.pravatar.cc/150?u=john'
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                phone: '098-765-4321',
                role: 'Player',
                tier: 'Elite',
                status: 'Active',
                avatar: 'https://i.pravatar.cc/150?u=jane'
            }
        ]);
        console.log(`Created ${members.length} members.`);

        // 2. Create Products
        const products = await Product.insertMany([
            {
                name: '23/24 Home Jersey',
                description: 'Official club home jersey for the 2023/24 season.',
                category: 'Jersey',
                price: 85,
                comparePrice: 100,
                mainImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80',
                stock: 50,
                isFeatured: true,
                rating: 4.8,
                salesCount: 124
            },
            {
                name: 'Pro Training Top',
                description: 'Breathable training top used by the first team.',
                category: 'Training',
                price: 55,
                mainImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&q=80',
                stock: 30,
                isFeatured: true,
                rating: 4.6,
                salesCount: 89
            }
        ]);
        console.log(`Created ${products.length} products.`);

        // 3. Create Events
        const events = await Event.insertMany([
            {
                title: 'FC Lions vs. Tigers',
                description: 'The big derby match of the season.',
                category: 'Match',
                startDate: new Date('2024-10-12T19:00:00'),
                venue: 'Main Stadium',
                coverImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
                capacity: 50000,
                ticketPrice: 45,
                status: 'Published'
            },
            {
                title: 'Youth Tournament',
                description: 'Annual youth academy tournament.',
                category: 'Tournament',
                startDate: new Date('2024-11-20T10:00:00'),
                venue: 'Training Complex',
                coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
                capacity: 500,
                ticketPrice: 15,
                status: 'Published'
            }
        ]);
        console.log(`Created ${events.length} events.`);

        // 4. Create Tickets for first member
        await Ticket.create({
            event: events[0]._id,
            member: members[0]._id,
            ticketType: 'VIP',
            price: events[0].ticketPrice * 2,
            seating: { section: 'A', row: '12', seat: '45' },
            status: 'Valid'
        });

        console.log('Created sample tickets.');

        // 5. Create Leagues
        const leagues = await League.insertMany([
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
        ]);
        console.log(`Created ${leagues.length} leagues.`);

        // 6. Create Teams
        const teams = await Team.insertMany([
            {
                apiFootballId: 42,
                name: 'Arsenal',
                logo: 'https://media.api-sports.io/football/teams/42.png',
                country: 'England'
            },
            {
                apiFootballId: 50,
                name: 'Man City',
                logo: 'https://media.api-sports.io/football/teams/50.png',
                country: 'England'
            },
            {
                apiFootballId: 541,
                name: 'Real Madrid',
                logo: 'https://media.api-sports.io/football/teams/541.png',
                country: 'Spain'
            }
        ]);
        console.log(`Created ${teams.length} teams.`);

        // 7. Create Matches
        await Match.insertMany([
            {
                apiFootballId: 1035041,
                league: leagues[0]._id,
                season: 2023,
                homeTeam: { team: teams[0]._id, name: teams[0].name, logo: teams[0].logo },
                awayTeam: { team: teams[1]._id, name: teams[1].name, logo: teams[1].logo },
                matchDate: new Date(),
                status: 'LIVE',
                elapsed: 65,
                score: { fulltime: { home: 1, away: 1 } }
            },
            {
                apiFootballId: 1035042,
                league: leagues[0]._id,
                season: 2023,
                homeTeam: { team: teams[2]._id, name: teams[2].name, logo: teams[2].logo },
                awayTeam: { team: teams[1]._id, name: teams[1].name, logo: teams[1].logo },
                matchDate: new Date(Date.now() + 86400000),
                status: 'SCHEDULED',
            }
        ]);
        console.log('Created sample matches.');

        // 8. Create News
        await NewsArticle.insertMany([
            {
                title: 'Kylian Mbappé rejoint le Real Madrid',
                description: 'C\'est officiel, le prodige français s\'engage pour 5 saisons avec la Casa Blanca.',
                content: 'L\'annonce tant attendue est enfin tombée...',
                category: 'Transfer',
                image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1000&q=80',
                publishedAt: new Date(),
                viewCount: 15400,
                likeCount: 2300,
                isFeatured: true,
                source: 'FootballHub',
                league: leagues[1]._id
            },
            {
                title: 'Premier League : Arsenal en tête de la course',
                description: 'Les Gunners conservent leur avance après une victoire cruciale.',
                content: 'Les hommes de Mikel Arteta ont montré une solidité impressionnante...',
                category: 'Match',
                image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1000&q=80',
                publishedAt: new Date(Date.now() - 7200000),
                viewCount: 8900,
                likeCount: 1200,
                isFeatured: true,
                source: 'Evening Standard',
                league: leagues[0]._id
            }
        ]);
        console.log('Created sample news articles.');

        console.log('Database seeded successfully! 🌱');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
