import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { getApiUrl } from '@/utils/platform';
import { useAuthStore } from '@/store/authStore';

// Mode Démo : désactiver les appels backend
const DEMO_MODE = true;

// Données mockées pour le mode démo
const MOCK_RESPONSES: Record<string, any> = {
    '/api/auth/login': {
        success: true,
        message: 'Login successful',
        token: 'demo-jwt-token-12345',
        user: {
            id: 'demo-user-1',
            username: 'demo_user',
            email: 'demo@footballhub.ma',
            role: 'user',
            avatar: null,
            isActive: true,
            preferences: {
                theme: 'system',
                language: 'fr',
                notifications: {
                    matchStart: true,
                    matchResult: true,
                    goals: true,
                },
            },
        },
    },
    '/api/auth/register': {
        success: true,
        message: 'Registration successful',
        token: 'demo-jwt-token-12345',
        user: {
            id: 'demo-user-new',
            username: 'nouveau_user',
            email: 'nouveau@footballhub.ma',
            role: 'user',
            isActive: true,
        },
    },
    '/api/auth/me': {
        success: true,
        user: {
            id: 'demo-user-1',
            username: 'demo_user',
            email: 'demo@footballhub.ma',
            role: 'user',
            isActive: true,
        },
    },
};

const apiClient = axios.create({
    baseURL: DEMO_MODE ? '' : getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

// Intercepteur de requêtes
apiClient.interceptors.request.use(
    async (config) => {
        // Mode Démo : intercepter et mocker
        if (DEMO_MODE) {
            console.log('🚀 MODE DEMO: Requête mockée', config.url);
            return config;
        }

        const { accessToken } = useAuthStore.getState();
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur de réponses
apiClient.interceptors.response.use(
    (response) => {
        // Mode Démo : retourner des données mockées
        if (DEMO_MODE && response.config.url) {
            const mockData = MOCK_RESPONSES[response.config.url];
            if (mockData) {
                console.log('✅ MODE DEMO: Réponse mockée', mockData);
                return {
                    ...response,
                    data: mockData,
                };
            }
        }
        return response;
    },
    async (error: AxiosError) => {
        // Mode Démo : toujours réussir
        if (DEMO_MODE) {
            const mockData = MOCK_RESPONSES[error.config?.url || ''] || { success: true };
            console.log('✅ MODE DEMO: Erreur ignorée, réponse mockée', mockData);
            return Promise.resolve({
                data: mockData,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: error.config!,
            });
        }

        const originalRequest = error.config;

        // Gestion du refresh token
        if (error.response?.status === 401 && originalRequest) {
            const { refreshToken, setTokens, logout } = useAuthStore.getState();

            if (refreshToken) {
                try {
                    const response = await axios.post(`${getApiUrl()}/api/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                        response.data;

                    setTokens(newAccessToken, newRefreshToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }

                    return apiClient(originalRequest);
                } catch (refreshError) {
                    logout();
                    toast.error('Session expirée. Veuillez vous reconnecter.');
                    return Promise.reject(refreshError);
                }
            }
        }

        // Afficher les erreurs
        const message =
            error.response?.data?.message ||
            error.message ||
            'Une erreur est survenue';

        if (error.response?.status !== 401) {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
