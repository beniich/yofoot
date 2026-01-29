import React, { useState, useEffect } from 'react';
import { Calendar, Play, Clock, Search, Heart } from 'lucide-react';
import { MatchCard } from '../components/matches/MatchCard';
import { SafeArea } from '../components/SafeArea';
import { hapticFeedback } from '../utils/haptics';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../config/api';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Matches() {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('live');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCompetition, setSelectedCompetition] = useState('all');
    const [favorites, setFavorites] = useState([]);

    // Fetch matches
    useEffect(() => {
        fetchMatches();
        fetchFavorites();

        // Auto-refresh live matches every 30 seconds
        if (activeTab === 'live' && autoRefresh && !searchQuery) {
            const interval = setInterval(fetchMatches, 30000);
            return () => clearInterval(interval);
        }
    }, [activeTab, selectedDate, autoRefresh, searchQuery]);

    const fetchMatches = async () => {
        try {
            setLoading(true);
            if (searchQuery) {
                endpoint = `${getApiUrl()}/matches/search?q=${searchQuery}`;
            } else {
                switch (activeTab) {
                    case 'live':
                        endpoint = `${getApiUrl()}/matches/live`;
                        break;
                    case 'upcoming':
                        endpoint = `${getApiUrl()}/matches/upcoming?limit=20`;
                        break;
                    case 'finished':
                        endpoint = `${getApiUrl()}/matches?status=FINISHED&limit=20`;
                        break;
                    default:
                        endpoint = `${getApiUrl()}/matches/live`;
                }
            }

            const response = await axios.get(endpoint);
            const data = response.data.matches || response.data;
            setMatches(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching matches:', error);
            setMatches([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        hapticFeedback.selection();
        setActiveTab(tab);
    };

    const handleMatchClick = (matchId) => {
        hapticFeedback.light();
        navigate(`/matches/${matchId}`);
    };

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const response = await axios.get(`${getApiUrl()}/users/favorites`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data.favoriteLeagues || []);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const toggleFavorite = async (name) => {
        try {
            hapticFeedback.medium();
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/auth');
                return;
            }
            await axios.post(`${getApiUrl()}/users/favorites/league`, { name }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchFavorites();
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    // Date selector
    const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i - 3));

    return (
        <SafeArea className="min-h-screen bg-charcoal pb-20">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-charcoal/95 backdrop-blur-xl border-b border-white/10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Matchs</h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Scores et résultats en direct
                            </p>
                        </div>
                        {activeTab === 'live' && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-red-500">LIVE</span>
                            </div>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher un match ou une équipe (ex: Romania)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleTabChange('live')}
                            className={`flex-1 h-12 rounded-xl font-medium transition-all ${activeTab === 'live'
                                ? 'bg-red-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Play size={16} />
                                <span>Live</span>
                            </div>
                        </button>
                        <button
                            onClick={() => handleTabChange('upcoming')}
                            className={`flex-1 h-12 rounded-xl font-medium transition-all ${activeTab === 'upcoming'
                                ? 'bg-gold text-charcoal-dark'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Clock size={16} />
                                <span>À venir</span>
                            </div>
                        </button>
                        <button
                            onClick={() => handleTabChange('finished')}
                            className={`flex-1 h-12 rounded-xl font-medium transition-all ${activeTab === 'finished'
                                ? 'bg-gold text-charcoal-dark'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Calendar size={16} />
                                <span>Terminés</span>
                            </div>
                        </button>
                    </div>

                    {/* Date Selector (only for finished matches) */}
                    {activeTab === 'finished' && !searchQuery && (
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-4 pb-2">
                            {dates.map((date) => {
                                const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                                return (
                                    <button
                                        key={date.toISOString()}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all ${isSelected
                                            ? 'bg-gold text-charcoal-dark'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-xs font-medium uppercase">
                                            {format(date, 'EEE', { locale: fr })}
                                        </span>
                                        <span className="text-lg font-bold">
                                            {format(date, 'd')}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Competition Filter (only when searching or multiple competitions present) */}
                    {matches.length > 0 && (searchQuery || activeTab === 'live') && (
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-4 pb-2">
                            <button
                                onClick={() => setSelectedCompetition('all')}
                                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCompetition === 'all'
                                    ? 'bg-white text-charcoal'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                Tous
                            </button>
                            {[...new Set(matches.map(m => m.league?.name || m.competition || 'Autres'))].map((comp) => {
                                const isFav = favorites.includes(comp);
                                return (
                                    <div key={comp} className="flex-shrink-0 flex items-center gap-1">
                                        <button
                                            onClick={() => setSelectedCompetition(comp)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCompetition === comp
                                                ? 'bg-gold text-charcoal'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                                }`}
                                        >
                                            {comp}
                                        </button>
                                        {selectedCompetition === comp && (
                                            <button
                                                onClick={() => toggleFavorite(comp)}
                                                className={`p-2 rounded-xl transition-all ${isFav ? 'text-red-500 bg-red-500/10' : 'text-gray-400 bg-white/5'}`}
                                            >
                                                <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </header>

            {/* Content */}
            <main className="px-6 py-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-48 bg-white/5 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : matches.length > 0 ? (
                    <div className="space-y-4">
                        {matches
                            .filter(m => selectedCompetition === 'all' || (m.league?.name || m.competition || 'Autres') === selectedCompetition)
                            .map((match) => (
                                <MatchCard
                                    key={match._id || match.id}
                                    match={match}
                                    onClick={() => handleMatchClick(match._id || match.id)}
                                />
                            ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Calendar size={32} className="text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-center">
                            {activeTab === 'live'
                                ? 'Aucun match en direct'
                                : activeTab === 'upcoming'
                                    ? 'Aucun match à venir'
                                    : 'Aucun match terminé'}
                        </p>
                    </div>
                )}

                {/* Auto-refresh toggle for live matches */}
                {activeTab === 'live' && matches.length > 0 && (
                    <div className="mt-6 flex items-center justify-center">
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${autoRefresh
                                ? 'bg-gold/20 border border-gold text-gold'
                                : 'bg-white/5 border border-white/10 text-gray-400'
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-gold animate-pulse' : 'bg-gray-600'}`} />
                            <span className="text-sm font-medium">
                                Actualisation auto {autoRefresh ? 'activée' : 'désactivée'}
                            </span>
                        </button>
                    </div>
                )}
            </main>
        </SafeArea>
    );
}
