import { PushNotifications, Token, PushNotificationSchema } from '@capacitor/push-notifications';
import { isNative, getApiUrl } from './platform';

export const pushNotifications = {
    async register() {
        if (!isNative()) {
            console.log('Push notifications only work on mobile');
            return;
        }

        // Request permission
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            throw new Error('User denied permissions!');
        }

        // Register with Apple / Google
        await PushNotifications.register();

        // Listen for registration
        PushNotifications.addListener('registration', async (token: Token) => {
            console.log('Push registration success, token: ' + token.value);

            // Send token to backend
            await this.sendTokenToBackend(token.value);
        });

        // Listen for registration errors
        PushNotifications.addListener('registrationError', (error: any) => {
            console.error('Error on registration: ' + JSON.stringify(error));
        });

        // Listen for push notifications
        PushNotifications.addListener(
            'pushNotificationReceived',
            (notification: PushNotificationSchema) => {
                console.log('Push received: ' + JSON.stringify(notification));

                // Show local notification or update UI
                this.handleNotification(notification);
            }
        );

        // Listen for notification actions
        PushNotifications.addListener(
            'pushNotificationActionPerformed',
            (notification: any) => {
                console.log('Push action performed: ' + JSON.stringify(notification));

                // Navigate to appropriate screen
                this.handleNotificationAction(notification);
            }
        );
    },

    async sendTokenToBackend(token: string) {
        try {
            const authToken = localStorage.getItem('token');

            await fetch(`${getApiUrl()}/api/auth/update-push-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ pushToken: token }),
            });

            console.log('✅ Push token sent to backend');
        } catch (error) {
            console.error('Error sending token:', error);
        }
    },

    handleNotification(notification: PushNotificationSchema) {
        // Show toast or update badge
        console.log('Notification received:', notification.title, notification.body);

        // You can dispatch a custom event here
        if (typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent('pushNotification', { detail: notification })
            );
        }
    },

    handleNotificationAction(notification: any) {
        const data = notification.notification.data;

        // Navigate based on notification type
        if (typeof window !== 'undefined') {
            switch (data.type) {
                case 'match_start':
                    window.location.href = `/matches/${data.matchId}`;
                    break;
                case 'goal':
                    window.location.href = `/matches/${data.matchId}`;
                    break;
                case 'match_result':
                    window.location.href = `/matches/${data.matchId}`;
                    break;
                default:
                    window.location.href = '/';
            }
        }
    },

    async getDeliveredNotifications() {
        if (!isNative()) return [];

        const notificationList = await PushNotifications.getDeliveredNotifications();
        return notificationList.notifications;
    },

    async removeDeliveredNotifications() {
        if (!isNative()) return;

        await PushNotifications.removeAllDeliveredNotifications();
    },
};
