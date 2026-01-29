import admin from 'firebase-admin';
import User from '../models/User.js';
import Match from '../models/Match.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = path.join(__dirname, '../../config/firebase-service-account.json');

// Initialize Firebase Admin if service account exists
if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized');
} else {
    console.warn('⚠️ Firebase service account not found at', serviceAccountPath);
}

class NotificationService {
    /**
     * Send notification to a specific user
     */
    async sendToUser(userId, notification) {
        try {
            const user = await User.findById(userId);
            if (!user || !user.pushToken) return;

            const message = {
                token: user.pushToken,
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data || {},
                android: {
                    priority: 'high',
                    notification: { sound: 'default', color: '#F9D406' },
                },
                apns: {
                    payload: { aps: { sound: 'default', badge: 1 } },
                },
            };

            return await admin.messaging().send(message);
        } catch (error) {
            console.error('❌ Notification error:', error);
        }
    }

    /**
     * Send notification to multiple users
     */
    async sendToMultiple(userIds, notification) {
        try {
            const users = await User.find({
                _id: { $in: userIds },
                pushToken: { $exists: true, $ne: null },
            });

            const tokens = users.map((u) => u.pushToken);
            if (tokens.length === 0) return;

            const message = {
                tokens,
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data || {},
            };

            return await admin.messaging().sendMulticast(message);
        } catch (error) {
            console.error('❌ Multicast error:', error);
        }
    }

    /**
     * Notify users when a match starts
     */
    async notifyMatchStart(matchId) {
        const match = await Match.findById(matchId)
            .populate('homeTeam.team')
            .populate('awayTeam.team');

        if (!match) return;

        const users = await User.find({
            $or: [
                { favoriteTeams: { $in: [match.homeTeam.team._id, match.awayTeam.team._id] } },
                { favoriteLeagues: match.league },
            ],
        });

        await this.sendToMultiple(
            users.map((u) => u._id),
            {
                title: '⚽ Match en direct !',
                body: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
                data: { type: 'match_start', matchId: match._id.toString() },
            }
        );
    }

    async notifyGoal(matchId, goalData) {
        const match = await Match.findById(matchId);
        if (!match) return;

        // Use topic for match-specific live updates
        const message = {
            topic: `match_${matchId}`,
            notification: {
                title: '⚽ BUUUUT !',
                body: `${goalData.player} (${goalData.team}) - ${match.homeTeam.name} ${match.score?.fulltime?.home} - ${match.score?.fulltime?.away} ${match.awayTeam.name}`,
            },
            data: { type: 'goal', matchId: matchId.toString() },
        };

        return await admin.messaging().send(message);
    }
}

export default new NotificationService();
