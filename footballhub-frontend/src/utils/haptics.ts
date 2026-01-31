import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { isNative } from './platform';

export const hapticFeedback = {
    light: async () => {
        if (!isNative()) return;
        try {
            await Haptics.impact({ style: ImpactStyle.Light });
        } catch (e) {
            console.error('Haptics error', e);
        }
    },

    medium: async () => {
        if (!isNative()) return;
        try {
            await Haptics.impact({ style: ImpactStyle.Medium });
        } catch (e) {
            console.error('Haptics error', e);
        }
    },

    heavy: async () => {
        if (!isNative()) return;
        try {
            await Haptics.impact({ style: ImpactStyle.Heavy });
        } catch (e) {
            console.error('Haptics error', e);
        }
    },

    success: async () => {
        if (!isNative()) return;
        try {
            await Haptics.notification({ type: NotificationType.Success });
        } catch (e) {
            console.error('Haptics error', e);
        }
    },

    error: async () => {
        if (!isNative()) return;
        try {
            await Haptics.notification({ type: NotificationType.Error });
        } catch (e) {
            console.error('Haptics error', e);
        }
    },

    warning: async () => {
        if (!isNative()) return;
        try {
            await Haptics.notification({ type: NotificationType.Warning });
        } catch (e) {
            console.error('Haptics error', e);
        }
    },

    vibrate: async () => {
        if (!isNative()) return;
        try {
            await Haptics.vibrate();
        } catch (e) {
            console.error('Haptics error', e);
        }
    }
};
