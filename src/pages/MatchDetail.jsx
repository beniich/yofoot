import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, BarChart3, Clock, Trophy } from 'lucide-react';
import { FootballField } from '../components/match/FootballField';
import { PlayerProfileCard } from '../components/match/PlayerProfileCard';
import { MatchStatistics } from '../components/match/MatchStatistics';
import { MatchTimeline } from '../components/match/MatchTimeline';
import { SafeArea } from '../components/SafeArea';
import { hapticFeedback } from '../utils/haptics';
import { getApiUrl } from '../config/api';
import axios from 'axios';

export default function MatchDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [lineups, setLineups] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [activeTab, setActiveTab] = useState('lineups');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMatchData();
    }, [id]);

    const fetchMatchData = async () => {
        try {
            setLoading(true);

            const [matchRes, lineupsRes] = await Promise.all([
                axios.get(`${getApiUrl()}/matches/${id}`),
                axios.get(`${getApiUrl()}/matches/${id}/lineups`).catch(() => ({ data: null }))
            ]);

            setMatch(matchRes.data);
            setLineups(lineupsRes.data);
        } catch (error) {
            console.error('Error fetching match data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        hapticFeedback.light();
        navigate(-1);
    };

    const handleTabChange = (tab) => {
        hapticFeedback.light();
        setActiveTab(tab);
    };

    const handlePlayerClick = (player) => {
        hapticFeedback.medium();
        setSelectedPlayer(player);
    };

    if (loading || !match) {
        return (
            <div className="min-h-screen bg-charcoal flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const tabs = [
        { id: 'lineups', label: 'Composition', icon: Users },
        { id: 'stats', label: 'Statistiques', icon: BarChart3 },
        { id: 'timeline', label: 'Timeline', icon: Clock },
        { id: 'h2h', label: 'Historique', icon: Trophy },
    ];

    return (
        <SafeArea className="min-h-screen bg-charcoal pb-20">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-charcoal/95 backdrop-blur-xl border-b border-white/10">
                <div className="px-6 py-4">
                    <button
                        onClick={handleBack}
                        className="mb-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-white" />
                    </button>

                    {/* Match Header */}
                    <div className="flex items-center justify-between mb-6">
                        {/* Home Team */}
                        <div className="flex-1 flex flex-col items-center">
                            <img
                                src={match.homeTeam.logo}
                                alt={match.homeTeam.name}
                                className="w-16 h-16 object-contain mb-2"
                            />
                            <span className="text-sm font-bold text-white text-center">
                                {match.homeTeam.name}
                            </span>
                        </div>

                        {/* Score */}
                        <div className="flex flex-col items-center px-6">
                            {match.status === 'LIVE' && (
                                <div className="px-3 py-1 bg-red-500 rounded-full mb-2 animate-pulse">
                                    <span className="text-xs font-bold text-white">LIVE</span>
                                </div>
                            )}
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-black text-white">
                                    {match.score?.fulltime?.home ?? 0}
                                </span>
                                <span className="text-2xl text-gray-500">-</span>
                                <span className="text-4xl font-black text-white">
                                    {match.score?.fulltime?.away ?? 0}
                                </span>
                            </div>
                            {match.status === 'LIVE' && (
                                <div className="mt-2 text-sm text-gold font-bold">
                                    {match.elapsed}'
                                </div>
                            )}
                        </div>

                        {/* Away Team */}
                        <div className="flex-1 flex flex-col items-center">
                            <img
                                src={match.awayTeam.logo}
                                alt={match.awayTeam.name}
                                className="w-16 h-16 object-contain mb-2"
                            />
                            <span className="text-sm font-bold text-white text-center">
                                {match.awayTeam.name}
                            </span>
                        </div>
                    </div>

                    {/* Match Info */}
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-4">
                        <span>{match.league?.name}</span>
                        <span>•</span>
                        <span>{match.venue?.name || 'Stade'}</span>
                        <span>•</span>
                        <span>{new Date(match.matchDate).toLocaleDateString('fr-FR')}</span>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isActive
                                            ? 'bg-gold text-charcoal'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span className="text-sm">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'lineups' && (
                    <div className="space-y-8">
                        {lineups ? (
                            <>
                                {/* Home Team Lineup */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <img
                                            src={match.homeTeam.logo}
                                            alt={match.homeTeam.name}
                                            className="w-8 h-8 object-contain"
                                        />
                                        <h2 className="text-xl font-bold text-white">
                                            {match.homeTeam.name}
                                        </h2>
                                        <span className="text-sm text-gray-400">
                                            ({lineups.home.formation})
                                        </span>
                                    </div>

                                    <FootballField
                                        players={lineups.home.players}
                                        formation={lineups.home.formation}
                                        teamColor="#3B82F6"
                                        onPlayerClick={handlePlayerClick}
                                    />
                                </div>

                                {/* Away Team Lineup */}
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <img
                                            src={match.awayTeam.logo}
                                            alt={match.awayTeam.name}
                                            className="w-8 h-8 object-contain"
                                        />
                                        <h2 className="text-xl font-bold text-white">
                                            {match.awayTeam.name}
                                        </h2>
                                        <span className="text-sm text-gray-400">
                                            ({lineups.away.formation})
                                        </span>
                                    </div>

                                    <FootballField
                                        players={lineups.away.players}
                                        formation={lineups.away.formation}
                                        teamColor="#EF4444"
                                        onPlayerClick={handlePlayerClick}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-2xl">
                                <Users size={48} className="text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">Compositions non disponibles pour ce match</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'stats' && (
                    match.statistics ? (
                        <MatchStatistics
                            homeTeam={{
                                name: match.homeTeam.name,
                                logo: match.homeTeam.logo,
                                stats: match.statistics.homeTeam,
                            }}
                            awayTeam={{
                                name: match.awayTeam.name,
                                logo: match.awayTeam.logo,
                                stats: match.statistics.awayTeam,
                            }}
                        />
                    ) : (
                        <div className="py-20 text-center">
                            <BarChart3 size={48} className="text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">Statistiques non disponibles</p>
                        </div>
                    )
                )}

                {activeTab === 'timeline' && (
                    match.goals ? (
                        <MatchTimeline
                            events={match.goals}
                            homeTeam={match.homeTeam}
                            awayTeam={match.awayTeam}
                        />
                    ) : (
                        <div className="py-20 text-center">
                            <Clock size={48} className="text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">Aucun événement enregistré</p>
                        </div>
                    )
                )}

                {activeTab === 'h2h' && (
                    <div className="text-center py-20">
                        <Trophy size={64} className="text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">Historique à venir...</p>
                    </div>
                )}
            </div>

            {/* Player Profile Modal */}
            {selectedPlayer && (
                <PlayerProfileCard
                    player={selectedPlayer}
                    onClose={() => setSelectedPlayer(null)}
                />
            )}
        </SafeArea>
    );
}
