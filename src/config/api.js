import { Capacitor } from '@capacitor/core';

export const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    if (Capacitor.isNativePlatform()) {
        // Pour l'émulateur Android, on utilise 10.0.2.2 pour accéder au localhost de la machine hôte
        return 'http://10.0.2.2:5000/api';
    }

    return 'http://localhost:5000/api';
};

export const getWsUrl = () => {
    if (import.meta.env.VITE_WS_URL) {
        return import.meta.env.VITE_WS_URL;
    }

    if (Capacitor.isNativePlatform()) {
        return 'ws://10.0.2.2:5000/ws';
    }

    return 'ws://localhost:5000/ws';
};
