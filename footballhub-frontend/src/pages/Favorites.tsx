import React from 'react';
import { Heart, Trophy, Users, User, Loader2 } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useNavigate } from 'react-router-dom';

export const Favorites: React.FC = () => {
    const { favorites, isLoading, error, refreshFavorites } = useFavorites();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark">
                <div className="text-center">
                    <Loader2 size={48} className="text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Chargement de vos favoris...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-dark p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Erreur</h2>
                    <p className="text-gray-400 mb-4">{error}</p>
                    <button
                        onClick={refreshFavorites}
                        className="px-6 py-2 bg-primary text-black rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    const hasNoFavorites =
        favorites.leagues.length === 0 &&
        favorites.teams.length === 0 &&
        favorites.players.length === 0;

    return (
        <div className="min-h-screen bg-background-dark pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background-dark/95 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <Heart size={20} className="text-primary" fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Mes Favoris</h1>
                            <p className="text-xs text-gray-400">
                                {favorites.leagues.length + favorites.teams.length + favorites.players.length} éléments
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={refreshFavorites}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </header>

            <main className="p-6 space-y-8">
                {hasNoFavorites ? (
                    // État vide
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Heart size={48} className="text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Aucun favori</h2>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Ajoutez des ligues, équipes ou joueurs à vos favoris pour les retrouver facilement ici.
                        </p>
                        <button
                            onClick={() => navigate('/leagues')}
                            className="px-6 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95"
                        >
                            Explorer les ligues
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Ligues Favorites */}
                        {favorites.leagues.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Trophy size={20} className="text-primary" />
                                    <h2 className="text-xl font-bold text-white">Ligues</h2>
                                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-full">
                                        {favorites.leagues.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {favorites.leagues.map((league: any) => (
                                        <div
                                            key={league._id || league.id}
                                            onClick={() => navigate(`/leagues/${league._id || league.id}`)}
                                            className="flex items-center gap-4 p-4 bg-surface-dark rounded-xl border border-white/10 hover:bg-surface-elevated transition-all cursor-pointer group"
                                        >
                                            <img
                                                src={league.logo || 'https://via.placeholder.com/48'}
                                                alt={league.name}
                                                className="w-12 h-12 object-contain"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                                                    {league.name}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    {league.country?.name || league.country || 'International'}
                                                </p>
                                            </div>
                                            <Heart size={20} className="text-red-500" fill="currentColor" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Équipes Favorites */}
                        {favorites.teams.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Users size={20} className="text-primary" />
                                    <h2 className="text-xl font-bold text-white">Équipes</h2>
                                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-full">
                                        {favorites.teams.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {favorites.teams.map((team: any) => (
                                        <div
                                            key={team._id || team.id}
                                            onClick={() => navigate(`/teams/${team._id || team.id}`)}
                                            className="flex items-center gap-4 p-4 bg-surface-dark rounded-xl border border-white/10 hover:bg-surface-elevated transition-all cursor-pointer group"
                                        >
                                            <img
                                                src={team.logo || 'https://via.placeholder.com/48'}
                                                alt={team.name}
                                                className="w-12 h-12 object-contain"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                                                    {team.name}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    {team.country || 'Club'}
                                                </p>
                                            </div>
                                            <Heart size={20} className="text-red-500" fill="currentColor" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Joueurs Favoris */}
                        {favorites.players.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <User size={20} className="text-primary" />
                                    <h2 className="text-xl font-bold text-white">Joueurs</h2>
                                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded-full">
                                        {favorites.players.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {favorites.players.map((player: any) => (
                                        <div
                                            key={player._id || player.id}
                                            onClick={() => navigate(`/players/${player._id || player.id}`)}
                                            className="flex items-center gap-4 p-4 bg-surface-dark rounded-xl border border-white/10 hover:bg-surface-elevated transition-all cursor-pointer group"
                                        >
                                            <img
                                                src={player.photo || 'https://via.placeholder.com/48'}
                                                alt={`${player.firstName} ${player.lastName}`}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white group-hover:text-primary transition-colors">
                                                    {player.firstName} {player.lastName}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    {player.position || 'Joueur'}
                                                </p>
                                            </div>
                                            <Heart size={20} className="text-red-500" fill="currentColor" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Favorites;
