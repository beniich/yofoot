import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Favorites {
    leagues: any[];
    teams: any[];
    players: any[];
}

interface UseFavoritesReturn {
    favorites: Favorites;
    isLoading: boolean;
    error: string | null;
    refreshFavorites: () => Promise<void>;
    isFavorite: (type: 'league' | 'team' | 'player', id: string) => boolean;
    toggleFavorite: (type: 'league' | 'team' | 'player', id: string) => Promise<boolean>;
}

export const useFavorites = (): UseFavoritesReturn => {
    const [favorites, setFavorites] = useState<Favorites>({
        leagues: [],
        teams: [],
        players: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Récupérer tous les favoris
    const fetchFavorites = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem('token');

            if (!token) {
                setFavorites({ leagues: [], teams: [], players: [] });
                setIsLoading(false);
                return;
            }

            const response = await axios.get(`${API_URL}/api/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFavorites(response.data);
        } catch (err: any) {
            console.error('Error fetching favorites:', err);
            setError(err.response?.data?.message || 'Failed to fetch favorites');
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    // Charger les favoris au montage
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // Rafraîchir les favoris
    const refreshFavorites = useCallback(async () => {
        await fetchFavorites();
    }, [fetchFavorites]);

    // Vérifier si un élément est favori
    const isFavorite = useCallback((type: 'league' | 'team' | 'player', id: string): boolean => {
        const key = `${type}s` as keyof Favorites;
        return favorites[key]?.some((item: any) => item._id === id || item.id === id) || false;
    }, [favorites]);

    // Basculer le statut favori
    const toggleFavorite = useCallback(async (
        type: 'league' | 'team' | 'player',
        id: string
    ): Promise<boolean> => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await axios.post(
                `${API_URL}/api/favorites/toggle/${type}/${id}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Mettre à jour l'état local
            const newFavoriteStatus = response.data.isFavorite;
            const key = `${type}s` as keyof Favorites;

            if (newFavoriteStatus) {
                // Ajouter (on pourrait fetch l'objet complet ici)
                // Pour l'instant, on rafraîchit tout
                await fetchFavorites();
            } else {
                // Retirer
                setFavorites(prev => ({
                    ...prev,
                    [key]: prev[key].filter((item: any) => item._id !== id && item.id !== id)
                }));
            }

            return newFavoriteStatus;
        } catch (err: any) {
            console.error('Error toggling favorite:', err);
            throw err;
        }
    }, [API_URL, fetchFavorites]);

    return {
        favorites,
        isLoading,
        error,
        refreshFavorites,
        isFavorite,
        toggleFavorite
    };
};

export default useFavorites;
