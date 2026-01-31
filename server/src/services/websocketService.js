const WebSocket = require('ws');
const Match = require('../models/Match');

class WebSocketService {
    constructor() {
        this.wss = null;
        this.clients = new Map();
    }

    initialize(server) {
        this.wss = new WebSocket.Server({
            server,
            path: '/ws',
        });

        this.wss.on('connection', (ws, req) => {
            const clientId = this.generateClientId();

            console.log(`✅ WebSocket client connected: ${clientId}`);

            this.clients.set(clientId, {
                ws,
                subscriptions: new Set(),
            });

            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    await this.handleMessage(clientId, data);
                } catch (error) {
                    console.error('WebSocket message error:', error);
                }
            });

            ws.on('close', () => {
                console.log(`❌ WebSocket client disconnected: ${clientId}`);
                this.clients.delete(clientId);
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });

            // Send welcome message
            this.sendToClient(clientId, {
                type: 'connected',
                clientId,
                timestamp: new Date().toISOString(),
            });
        });

        // Start broadcasting live scores
        this.startLiveBroadcast();

        console.log('✅ WebSocket server initialized');
    }

    async handleMessage(clientId, data) {
        const { type, payload } = data;

        switch (type) {
            case 'subscribe':
                this.handleSubscribe(clientId, payload);
                break;

            case 'unsubscribe':
                this.handleUnsubscribe(clientId, payload);
                break;

            case 'ping':
                this.sendToClient(clientId, { type: 'pong' });
                break;

            default:
                console.log(`Unknown message type: ${type}`);
        }
    }

    handleSubscribe(clientId, payload) {
        const client = this.clients.get(clientId);
        if (!client) return;

        const { channel } = payload;
        client.subscriptions.add(channel);

        console.log(`Client ${clientId} subscribed to ${channel}`);

        this.sendToClient(clientId, {
            type: 'subscribed',
            channel,
        });
    }

    handleUnsubscribe(clientId, payload) {
        const client = this.clients.get(clientId);
        if (!client) return;

        const { channel } = payload;
        client.subscriptions.delete(channel);

        console.log(`Client ${clientId} unsubscribed from ${channel}`);

        this.sendToClient(clientId, {
            type: 'unsubscribed',
            channel,
        });
    }

    sendToClient(clientId, data) {
        const client = this.clients.get(clientId);
        if (!client || client.ws.readyState !== WebSocket.OPEN) return;

        try {
            client.ws.send(JSON.stringify(data));
        } catch (error) {
            console.error('Error sending to client:', error);
        }
    }

    broadcast(channel, data) {
        let count = 0;

        this.clients.forEach((client, clientId) => {
            if (client.subscriptions.has(channel) || channel === 'all') {
                this.sendToClient(clientId, {
                    type: 'broadcast',
                    channel,
                    data,
                    timestamp: new Date().toISOString(),
                });
                count++;
            }
        });

        return count;
    }

    async startLiveBroadcast() {
        // Broadcast live scores every 10 seconds
        setInterval(async () => {
            try {
                const liveMatches = await Match.find({ status: 'LIVE' })
                    .populate('league', 'name logo')
                    .select('homeTeam awayTeam score elapsed status league');

                if (liveMatches.length > 0) {
                    const count = this.broadcast('live-scores', liveMatches);
                    console.log(`📡 Broadcasted live scores to ${count} clients`);
                }
            } catch (error) {
                console.error('Live broadcast error:', error);
            }
        }, 10000);

        console.log('🔴 Live broadcast started');
    }

    generateClientId() {
        return `client_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }

    getStats() {
        const subscriptions = {};

        this.clients.forEach((client) => {
            client.subscriptions.forEach((channel) => {
                subscriptions[channel] = (subscriptions[channel] || 0) + 1;
            });
        });

        return {
            totalClients: this.clients.size,
            subscriptions,
        };
    }
}

// Singleton
const websocketService = new WebSocketService();
export default websocketService;
