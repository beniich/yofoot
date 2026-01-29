import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
    (config) => {
        // Ajouter le token si disponible
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Rediriger vers login si non authentifié
            localStorage.removeItem('authToken');
            // window.location.href = '/login'; // Commented out to prevent redirect loop during mock dev
        }
        return Promise.reject(error);
    }
);

export default api;
