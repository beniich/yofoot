import 'dotenv/config';
import mongoose from 'mongoose';
import Member from '../models/Member.js';
import Event from '../models/Event.js';
import Product from '../models/Product.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/footballhub', {
            // options not needed for Mongoose 6+ typically, but keeping safe defaults if needed, 
            // although 'useNewUrlParser' is deprecated in newer drivers, it's safer to remove if unsure.
            // Keeping it simple as Mongoose 8 simplifies connection
        });

        console.log('✅ Connected to MongoDB');

        // Clear existing data (drop collections to reset indexes)
        console.log('🗑️  Clearing existing data...');
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        for (const name of ['members', 'events', 'products', 'tickets', 'users']) {
            if (collectionNames.includes(name)) {
                await mongoose.connection.db.dropCollection(name);
                console.log(`   Dropped ${name}`);
            }
        }

        // ============================================================
        // CREATE ADMIN USER
        // ============================================================

        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@footballhub.ma',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'FootballHub',
            role: 'admin',
            country: 'Morocco',
            city: 'Casablanca',
            isEmailVerified: true,
        });

        console.log('✅ Admin user created');

        // ============================================================
        // CREATE MEMBERS (Moroccan Names)
        // ============================================================

        const members = await Member.create([
            {
                membershipNumber: 'MEM000001',
                firstName: 'Youssef',
                lastName: 'Benali',
                email: 'youssef.benali@email.ma',
                phone: '+212 6 12 34 56 78',
                role: 'Player',
                tier: 'VIP',
                status: 'Active',
                city: 'Casablanca',
                country: 'Morocco',
                dateOfBirth: new Date('1995-03-15'),
            },
            {
                membershipNumber: 'MEM000002',
                firstName: 'Fatima',
                lastName: 'Zahra',
                email: 'fatima.zahra@email.ma',
                phone: '+212 6 98 76 54 32',
                role: 'Fan',
                tier: 'Elite',
                status: 'Active',
                city: 'Rabat',
                country: 'Morocco',
                dateOfBirth: new Date('1998-07-22'),
            },
            {
                membershipNumber: 'MEM000003',
                firstName: 'Mohamed',
                lastName: 'Alami',
                email: 'mohamed.alami@email.ma',
                phone: '+212 6 55 44 33 22',
                role: 'Staff',
                tier: 'Standard',
                status: 'Active',
                city: 'Marrakech',
                country: 'Morocco',
                dateOfBirth: new Date('1990-11-08'),
            },
        ]);

        console.log(`✅ Created ${members.length} members`);

        // ============================================================
        // CREATE EVENTS
        // ============================================================

        const events = await Event.create([
            {
                title: 'Match Raja vs Wydad - Derby Casablancais',
                description: 'Le grand derby de Casablanca au Stade Mohammed V',
                category: 'Match',
                startDate: new Date('2024-12-15T20:00:00'),
                venue: 'Stade Mohammed V',
                address: {
                    city: 'Casablanca',
                    country: 'Morocco',
                },
                capacity: 50000,
                ticketPrice: 150,
                status: 'Published',
                isFeatured: true,
                organizer: adminUser._id,
                tags: ['Derby', 'Botola', 'Raja', 'Wydad'],
            },
            {
                title: 'Tournoi de Football Junior',
                description: 'Tournoi pour les jeunes de 12-16 ans',
                category: 'Tournament',
                startDate: new Date('2024-12-20T14:00:00'),
                endDate: new Date('2024-12-22T18:00:00'),
                venue: 'Complexe Sportif Moulay Abdallah',
                address: {
                    city: 'Rabat',
                    country: 'Morocco',
                },
                capacity: 200,
                ticketPrice: 50,
                status: 'Published',
                organizer: adminUser._id,
                tags: ['Junior', 'Formation', 'Tournoi'],
            },
        ]);

        console.log(`✅ Created ${events.length} events`);

        // ============================================================
        // CREATE PRODUCTS (Moroccan Teams)
        // ============================================================

        const products = await Product.create([
            {
                name: 'Maillot Raja Casablanca 2024/25 - Domicile',
                description: 'Maillot officiel du Raja Athletic Club saison 2024/25',
                category: 'Jersey',
                price: 450,
                comparePrice: 550,
                stock: 100,
                images: ['/images/products/raja-home-jersey.jpg'],
                sizes: [
                    { size: 'S', stock: 20 },
                    { size: 'M', stock: 30 },
                    { size: 'L', stock: 30 },
                    { size: 'XL', stock: 20 },
                ],
                colors: ['Vert', 'Blanc'],
                isFeatured: true,
                isActive: true,
                rating: 4.8,
                reviewCount: 156,
                tags: ['Raja', 'Maillot', 'Officiel'],
            },
            {
                name: 'Écharpe Wydad Athletic Club',
                description: 'Écharpe officielle WAC avec logo brodé',
                category: 'Accessories',
                price: 120,
                stock: 200,
                images: ['/images/products/wydad-scarf.jpg'],
                colors: ['Rouge', 'Blanc'],
                isFeatured: true,
                isActive: true,
                rating: 4.5,
                reviewCount: 89,
                tags: ['Wydad', 'Écharpe', 'Accessoire'],
            },
            {
                name: 'Ballon de Football Professionnel',
                description: 'Ballon utilisé en Botola Pro',
                category: 'Equipment',
                price: 350,
                stock: 50,
                images: ['/images/products/professional-ball.jpg'],
                isFeatured: false,
                isActive: true,
                rating: 4.9,
                reviewCount: 234,
                tags: ['Ballon', 'Botola', 'Professionnel'],
            },
            {
                name: 'Casquette Équipe Nationale Marocaine',
                description: 'Casquette officielle des Lions de l\'Atlas',
                category: 'Accessories',
                price: 180,
                stock: 150,
                images: ['/images/products/morocco-cap.jpg'],
                colors: ['Rouge', 'Vert'],
                isFeatured: true,
                isActive: true,
                rating: 4.7,
                reviewCount: 112,
                tags: ['Maroc', 'Lions', 'Casquette'],
            },
        ]);

        console.log(`✅ Created ${products.length} products`);

        // ============================================================
        // CREATE TICKETS
        // ============================================================

        const tickets = [];
        for (let i = 0; i < 10; i++) {
            const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}-${i.toString().padStart(4, '0')}`;
            const qrData = {
                ticket: ticketNumber,
                event: events[0]._id.toString(),
                member: members[i % members.length]._id.toString(),
                timestamp: Date.now(),
            };
            const qrCode = Buffer.from(JSON.stringify(qrData)).toString('base64');

            const ticket = await Ticket.create({
                ticketNumber,
                qrCode,
                event: events[0]._id,
                member: members[i % members.length]._id,
                ticketType: i % 3 === 0 ? 'VIP' : 'Standard',
                price: i % 3 === 0 ? 300 : 150,
                seating: {
                    section: `Section ${String.fromCharCode(65 + (i % 4))}`,
                    row: `${Math.floor(i / 4) + 1}`,
                    seat: `${(i % 10) + 1}`,
                },
                status: 'Valid',
            });

            tickets.push(ticket);

            // Update member
            await Member.findByIdAndUpdate(members[i % members.length]._id, {
                $push: { tickets: ticket._id },
                $inc: { totalSpent: ticket.price },
            });
        }

        console.log(`✅ Created ${tickets.length} tickets`);

        // ============================================================
        // SUMMARY
        // ============================================================

        console.log('\n🎉 =====================================');
        console.log('   Database Seeded Successfully!');
        console.log('   =====================================');
        console.log(`   Admin User: admin@footballhub.ma / admin123`);
        console.log(`   Members: ${members.length}`);
        console.log(`   Events: ${events.length}`);
        console.log(`   Products: ${products.length}`);
        console.log(`   Tickets: ${tickets.length}`);
        console.log('   =====================================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

// Run seeding
seedDatabase();
