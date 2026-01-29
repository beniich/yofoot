import React, { useState, useEffect } from 'react';
import { Search, Filter, Globe, Star } from 'lucide-react';
import { LeagueCard } from '../components/leagues/LeagueCard';
import { SafeArea } from '../components/SafeArea';
import { hapticFeedback } from '../utils/haptics';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../config/api';

export default function Leagues() {
    const navigate = useNavigate();
    const [leagues, setLeagues] = useState([]);
    const [filteredLeagues, setFilteredLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [activeTab, setActiveTab] = useState('featured');

    // Fetch leagues
    useEffect(() => {
        fetchLeagues();
    }, [activeTab]);

    const fetchLeagues = async () => {
        try {
            setLoading(true);
            const endpoint = activeTab === 'featured'
                ? `${getApiUrl()}/leagues/featured`
                : `${getApiUrl()}/leagues?limit=100`;

            const response = await axios.get(endpoint);
            const data = activeTab === 'featured' ? response.data : response.data.leagues;

            setLeagues(data);
            setFilteredLeagues(data);
        } catch (error) {
            console.error('Error fetching leagues:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter leagues
    useEffect(() => {
        let filtered = leagues;

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter((league) =>
                league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (league.country?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by country
        if (selectedCountry !== 'all') {
            filtered = filtered.filter((league) => league.country?.name === selectedCountry);
        }

        setFilteredLeagues(filtered);
    }, [searchQuery, selectedCountry, leagues]);

    // Get unique countries
    const countries = Array.from(
        new Set(leagues.map((league) => league.country?.name).filter(Boolean))
    ).sort();

    const handleLeagueClick = (leagueId) => {
        hapticFeedback.light();
        navigate(`/leagues/${leagueId}`);
    };

    const handleTabChange = (tab) => {
        hapticFeedback.selection();
        setActiveTab(tab);
        setSearchQuery('');
        setSelectedCountry('all');
    };

    return (
        <SafeArea className="min-h-screen bg-charcoal pb-20">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-charcoal/95 backdrop-blur-xl border-b border-white/10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Ligues</h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Suivez vos compétitions préférées
                            </p>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <Filter size={20} className="text-gold" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher une ligue..."
                            className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={() => handleTabChange('featured')}
                            className={`flex-1 h-10 rounded-xl font-medium transition-all ${activeTab === 'featured'
                                    ? 'bg-gold text-charcoal-dark'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Star size={16} />
                                <span>Populaires</span>
                            </div>
                        </button>
                        <button
                            onClick={() => handleTabChange('all')}
                            className={`flex-1 h-10 rounded-xl font-medium transition-all ${activeTab === 'all'
                                    ? 'bg-gold text-charcoal-dark'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Globe size={16} />
                                <span>Toutes</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="px-6 pb-4 border-t border-white/10 pt-4 animate-slide-down">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Pays
                        </label>
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold"
                        >
                            <option value="all" className="bg-charcoal text-white">Tous les pays</option>
                            {countries.map((country) => (
                                <option key={country} value={country} className="bg-charcoal text-white">
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </header>

            {/* Content */}
            <main className="px-6 py-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-24 bg-white/5 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : filteredLeagues.length > 0 ? (
                    <div className="space-y-4">
                        {filteredLeagues.map((league) => (
                            <LeagueCard
                                key={league._id}
                                league={league}
                                onClick={() => handleLeagueClick(league._id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Search size={32} className="text-gray-600" />
                        </div>
                        <p className="text-gray-400 text-center">
                            Aucune ligue trouvée
                        </p>
                    </div>
                )}
            </main>
        </SafeArea>
    );
}
