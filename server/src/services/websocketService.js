import { WebSocketServer } from 'ws';
import Match from '../models/Match.js';

class WebSocketService {
    constructor() {
        this.wss = null;
        this.clients = new Map();
    }

    initialize(server) {
        this.wss = new WebSocketServer({
            server,
            path: '/ws',
        });

        this.wss.on('connection', (ws) => {
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

            this.sendToClient(clientId, {
                type: 'connected',
                clientId,
                timestamp: new Date().toISOString(),
            });
        });

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
        if (!client || client.ws.readyState !== 1) return; // 1 = WebSocket.OPEN

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
        setInterval(async () => {
            try {
                const liveMatches = await Match.find({ status: 'LIVE' })
                    .populate('league', 'name logo')
                    .select('homeTeam awayTeam score elapsed status league');

                if (liveMatches.length > 0) {
                    this.broadcast('live-scores', liveMatches);
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

export default new WebSocketService();
