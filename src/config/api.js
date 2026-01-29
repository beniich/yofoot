export const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

export const getWsUrl = () => {
    return import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';
};
