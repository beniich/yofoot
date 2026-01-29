import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';

// Services
import cronJobs from './jobs/cronJobs.js';
import syncService from './services/syncService.js';
import websocketService from './services/websocketService.js';

// Load routes
import memberRoutes from './routes/members.js';
import eventRoutes from './routes/events.js';
import ticketRoutes from './routes/tickets.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import aiRoutes from './routes/ai.js';
import authRoutes from './routes/auth.js';
import stripeRoutes from './routes/stripe.js';
import leagueRoutes from './routes/leagues.js';
import matchRoutes from './routes/matches.js';
import newsRoutes from './routes/news.js';
import standingRoutes from './routes/standings.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/members', memberRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/leagues', leagueRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/standings', standingRoutes);

// Admin Sync Routes
app.post('/api/admin/sync/full', async (req, res) => {
  try {
    syncService.fullSync(); // Run in background
    res.json({ message: 'Full sync started in background' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/sync/status', (req, res) => {
  res.json({
    sync: syncService.getSyncStatus(),
    cron: cronJobs.getJobsStatus(),
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('FootballHub API is running...');
});

// Database connection & Server Start
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // Initialize services
    websocketService.initialize(server);
    cronJobs.initializeJobs();

    // Initial sync if configured
    if (process.env.INITIAL_SYNC === 'true') {
      console.log('🚀 Running initial sync...');
      setTimeout(() => {
        syncService.syncFeaturedLeagues();
      }, 5000);
    }

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔌 WebSocket enabled at /ws`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('⏸️  Shutting down gracefully...');
  cronJobs.stopAllJobs();
  mongoose.connection.close();
  process.exit(0);
});
