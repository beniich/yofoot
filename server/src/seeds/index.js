import 'dotenv/config';
import mongoose from 'mongoose';
import Member from '../models/Member.js';
import Event from '../models/Event.js';
import Product from '../models/Product.js';
import Ticket from '../models/Ticket.js';
import Order from '../models/Order.js';

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

        console.log('Database seeded successfully! 🌱');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
