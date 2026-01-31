// ============================================================================
// FIREBASE NOTIFICATION SERVICE - Backend
// ============================================================================

import admin from 'firebase-admin';
import User from '../models/User.js';
import Match from '../models/Match.js';

class NotificationService {
    constructor() {
        this.initialized = false;
    }

    // ============================================================
    // INITIALIZE FIREBASE
    // ============================================================
    initialize() {
        try {
            // Vérifier si Firebase est déjà initialisé
            if (this.initialized) {
                console.log('✅ Firebase already initialized');
                return;
            }

            // Charger les credentials depuis les variables d'environnement
            const firebaseConfig = {
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
            };

            // Vérifier que les credentials sont présents
            if (!firebaseConfig.projectId || !firebaseConfig.clientEmail || !firebaseConfig.privateKey) {
                console.warn('⚠️  Firebase credentials not configured. Push notifications disabled.');
                return;
            }

            admin.initializeApp({
                credential: admin.credential.cert(firebaseConfig)
            });

            this.initialized = true;
            console.log('✅ Firebase Admin initialized successfully');
        } catch (error) {
            console.error('❌ Firebase initialization error:', error);
        }
    }

    // ============================================================
    // SEND NOTIFICATION TO USER
    // ============================================================
    async sendToUser(userId, notification) {
        if (!this.initialized) {
            console.log('⚠️  Firebase not initialized. Skipping notification.');
            return null;
        }

        try {
            const user = await User.findById(userId);

            if (!user || !user.pushToken) {
                console.log('User has no push token');
                return null;
            }

            // Vérifier les préférences de notification
            if (!user.preferences?.notifications?.push) {
                console.log('User has disabled push notifications');
                return null;
            }

            const message = {
                token: user.pushToken,
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data || {},
                android: {
                    priority: 'high',
                    notification: {
                        sound: 'default',
                        color: '#F9D406',
                        channelId: 'footballhub_notifications'
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1,
                        },
                    },
                },
            };

            const response = await admin.messaging().send(message);
            console.log('✅ Notification sent:', response);
            return response;
        } catch (error) {
            console.error('❌ Notification error:', error);

            // Si le token est invalide, le retirer
            if (error.code === 'messaging/invalid-registration-token' ||
                error.code === 'messaging/registration-token-not-registered') {
                await User.findByIdAndUpdate(userId, { pushToken: null });
                console.log('Removed invalid push token');
            }

            return null;
        }
    }

    // ============================================================
    // SEND TO MULTIPLE USERS
    // ============================================================
    async sendToMultiple(userIds, notification) {
        if (!this.initialized) {
            console.log('⚠️  Firebase not initialized. Skipping notifications.');
            return null;
        }

        try {
            const users = await User.find({
                _id: { $in: userIds },
                pushToken: { $exists: true, $ne: null },
                'preferences.notifications.push': true
            });

            if (users.length === 0) {
                console.log('No users with valid push tokens');
                return null;
            }

            const tokens = users.map((u) => u.pushToken);

            const message = {
                tokens,
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data || {},
                android: {
                    priority: 'high',
                    notification: {
                        sound: 'default',
                        color: '#F9D406',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1,
                        },
                    },
                },
            };

            const response = await admin.messaging().sendMulticast(message);
            console.log(`✅ Sent to ${response.successCount}/${tokens.length} devices`);

            // Nettoyer les tokens invalides
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(tokens[idx]);
                    }
                });

                if (failedTokens.length > 0) {
                    await User.updateMany(
                        { pushToken: { $in: failedTokens } },
                        { $set: { pushToken: null } }
                    );
                    console.log(`Removed ${failedTokens.length} invalid tokens`);
                }
            }

            return response;
        } catch (error) {
            console.error('❌ Multicast error:', error);
            return null;
        }
    }

    // ============================================================
    // TOPIC-BASED NOTIFICATIONS
    // ============================================================
    async sendToTopic(topic, notification) {
        if (!this.initialized) {
            console.log('⚠️  Firebase not initialized. Skipping notification.');
            return null;
        }

        try {
            const message = {
                topic,
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data || {},
                android: {
                    priority: 'high',
                    notification: {
                        sound: 'default',
                        color: '#F9D406',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1,
                        },
                    },
                },
            };

            const response = await admin.messaging().send(message);
            console.log('✅ Topic notification sent:', response);
            return response;
        } catch (error) {
            console.error('❌ Topic notification error:', error);
            return null;
        }
    }

    // ============================================================
    // MATCH NOTIFICATIONS
    // ============================================================

    async notifyMatchStart(matchId) {
        if (!this.initialized) return;

        try {
            const match = await Match.findById(matchId)
                .populate('league', 'name')
                .populate('homeTeam.team', 'name')
                .populate('awayTeam.team', 'name');

            if (!match) return;

            // Trouver les utilisateurs qui ont mis en favori les équipes ou la ligue
            const users = await User.find({
                $or: [
                    { favoriteTeams: { $in: [match.homeTeam.team._id, match.awayTeam.team._id] } },
                    { favoriteLeagues: match.league._id },
                ],
                'notificationSettings.matchStart': true
            });

            if (users.length === 0) return;

            await this.sendToMultiple(
                users.map((u) => u._id),
                {
                    title: '⚽ Match en direct !',
                    body: `${match.homeTeam.team.name} vs ${match.awayTeam.team.name}`,
                    data: {
                        type: 'match_start',
                        matchId: match._id.toString(),
                        leagueId: match.league._id.toString()
                    },
                }
            );

            console.log(`✅ Match start notification sent to ${users.length} users`);
        } catch (error) {
            console.error('Error sending match start notification:', error);
        }
    }

    async notifyGoal(matchId, goalData) {
        if (!this.initialized) return;

        try {
            const match = await Match.findById(matchId)
                .populate('homeTeam.team', 'name')
                .populate('awayTeam.team', 'name');

            if (!match) return;

            // Notifier via topic pour tous les abonnés au match
            await this.sendToTopic(`match_${matchId}`, {
                title: '⚽ BUUUUT !',
                body: `${goalData.player} (${goalData.team}) - ${match.homeTeam.team.name} ${match.score.fulltime.home} - ${match.score.fulltime.away} ${match.awayTeam.team.name}`,
                data: {
                    type: 'goal',
                    matchId: matchId.toString(),
                    scorer: goalData.player,
                    team: goalData.team
                },
            });

            console.log('✅ Goal notification sent');
        } catch (error) {
            console.error('Error sending goal notification:', error);
        }
    }

    async notifyMatchResult(matchId) {
        if (!this.initialized) return;

        try {
            const match = await Match.findById(matchId)
                .populate('homeTeam.team', 'name')
                .populate('awayTeam.team', 'name');

            if (!match) return;

            const users = await User.find({
                favoriteTeams: { $in: [match.homeTeam.team._id, match.awayTeam.team._id] },
                'notificationSettings.matchResult': true
            });

            if (users.length === 0) return;

            await this.sendToMultiple(
                users.map((u) => u._id),
                {
                    title: '🏁 Match terminé',
                    body: `${match.homeTeam.team.name} ${match.score.fulltime.home} - ${match.score.fulltime.away} ${match.awayTeam.team.name}`,
                    data: {
                        type: 'match_result',
                        matchId: matchId.toString(),
                        homeScore: match.score.fulltime.home.toString(),
                        awayScore: match.score.fulltime.away.toString()
                    },
                }
            );

            console.log(`✅ Match result notification sent to ${users.length} users`);
        } catch (error) {
            console.error('Error sending match result notification:', error);
        }
    }

    // ============================================================
    // SUBSCRIBE/UNSUBSCRIBE TO TOPICS
    // ============================================================
    async subscribeToTopic(token, topic) {
        if (!this.initialized) return;

        try {
            await admin.messaging().subscribeToTopic(token, topic);
            console.log(`✅ Subscribed to topic: ${topic}`);
        } catch (error) {
            console.error('Error subscribing to topic:', error);
        }
    }

    async unsubscribeFromTopic(token, topic) {
        if (!this.initialized) return;

        try {
            await admin.messaging().unsubscribeFromTopic(token, topic);
            console.log(`✅ Unsubscribed from topic: ${topic}`);
        } catch (error) {
            console.error('Error unsubscribing from topic:', error);
        }
    }
}

// Singleton
const notificationService = new NotificationService();

export default notificationService;
