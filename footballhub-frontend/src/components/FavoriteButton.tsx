import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';

interface FavoriteButtonProps {
    type: 'league' | 'team' | 'player';
    id: string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
    onToggle?: (isFavorite: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    type,
    id,
    size = 'md',
    showLabel = false,
    className = '',
    onToggle
}) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Tailles
    const sizes = {
        sm: { icon: 16, padding: 'p-1.5', text: 'text-xs' },
        md: { icon: 20, padding: 'p-2', text: 'text-sm' },
        lg: { icon: 24, padding: 'p-3', text: 'text-base' }
    };

    const sizeConfig = sizes[size];

    // Vérifier le statut favori au chargement
    useEffect(() => {
        checkFavoriteStatus();
    }, [id, type]);

    const checkFavoriteStatus = async () => {
        try {
            setIsChecking(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setIsChecking(false);
                return;
            }

            const response = await axios.get(
                `${API_URL}/api/favorites/${type}s/check/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setIsFavorite(response.data.isFavorite);
        } catch (error) {
            console.error('Error checking favorite status:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem('token');

        if (!token) {
            alert('Veuillez vous connecter pour ajouter des favoris');
            return;
        }

        try {
            setIsLoading(true);

            const response = await axios.post(
                `${API_URL}/api/favorites/toggle/${type}/${id}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const newFavoriteStatus = response.data.isFavorite;
            setIsFavorite(newFavoriteStatus);

            // Callback
            if (onToggle) {
                onToggle(newFavoriteStatus);
            }

            // Feedback visuel
            if (newFavoriteStatus) {
                // Animation d'ajout
                console.log('✅ Added to favorites');
            } else {
                console.log('❌ Removed from favorites');
            }
        } catch (error: any) {
            console.error('Error toggling favorite:', error);

            if (error.response?.status === 401) {
                alert('Session expirée. Veuillez vous reconnecter.');
            } else {
                alert('Erreur lors de la modification des favoris');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isChecking) {
        return (
            <button
                disabled
                className={`inline-flex items-center gap-2 rounded-lg transition-all ${sizeConfig.padding} ${className}`}
            >
                <div className="animate-pulse">
                    <Heart size={sizeConfig.icon} className="text-gray-400" />
                </div>
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`
        inline-flex items-center gap-2 rounded-lg transition-all
        ${sizeConfig.padding}
        ${isFavorite
                    ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 cursor-pointer'}
        ${className}
      `}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
            <Heart
                size={sizeConfig.icon}
                className={`transition-all ${isLoading ? 'animate-pulse' : ''}`}
                fill={isFavorite ? 'currentColor' : 'none'}
            />

            {showLabel && (
                <span className={`font-medium ${sizeConfig.text}`}>
                    {isFavorite ? 'Favori' : 'Ajouter'}
                </span>
            )}
        </button>
    );
};

export default FavoriteButton;
