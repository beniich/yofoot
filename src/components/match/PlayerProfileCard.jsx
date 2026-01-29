import React from 'react';
import { X, TrendingUp, Award, Activity, Calendar } from 'lucide-react';

export const PlayerProfileCard = ({
    player,
    onClose,
}) => {
    if (!player) return null;

    const statAttributes = [
        { label: 'Pace', value: player.rating?.pace || 0, color: 'bg-blue-500' },
        { label: 'Shooting', value: player.rating?.shooting || 0, color: 'bg-red-500' },
        { label: 'Passing', value: player.rating?.passing || 0, color: 'bg-green-500' },
        { label: 'Dribbling', value: player.rating?.dribbling || 0, color: 'bg-purple-500' },
        { label: 'Defending', value: player.rating?.defending || 0, color: 'bg-yellow-500' },
        { label: 'Physical', value: player.rating?.physical || 0, color: 'bg-orange-500' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl my-auto">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                    <X size={24} className="text-white" />
                </button>

                {/* Header with Player Photo */}
                <div className="relative h-64 bg-gradient-to-br from-gold/20 to-gold/5 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    {/* Player Image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            {/* Overall Rating Badge */}
                            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-gold to-yellow-500 rounded-2xl flex flex-col items-center justify-center shadow-xl rotate-[-5deg] border-4 border-black">
                                <span className="text-4xl font-black text-black">
                                    {player.rating?.overall || 0}
                                </span>
                                <span className="text-xs font-bold text-black/70">OVR</span>
                            </div>

                            {/* Player Photo */}
                            <div className="w-48 h-48 rounded-full border-4 border-gold overflow-hidden shadow-2xl bg-black">
                                <img
                                    src={player.photo || 'https://via.placeholder.com/150'}
                                    alt={player.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Jersey Number */}
                            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gold rounded-2xl flex items-center justify-center shadow-xl rotate-[5deg] border-4 border-black">
                                <span className="text-3xl font-black text-black">
                                    {player.number}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Player Info */}
                <div className="p-6 space-y-6">
                    {/* Name and Basic Info */}
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-white mb-2">
                            {player.name}
                        </h2>
                        <div className="flex items-center justify-center gap-4 text-gray-400">
                            {player.nationality && (
                                <div className="flex items-center gap-2">
                                    <img
                                        src={player.nationality.flag}
                                        alt={player.nationality.name}
                                        className="w-6 h-4 object-cover rounded"
                                    />
                                    <span className="text-sm">{player.nationality.name}</span>
                                </div>
                            )}
                            <span className="text-sm">•</span>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span className="text-sm">{player.age} ans</span>
                            </div>
                            <span className="text-sm">•</span>
                            <span className="text-sm font-bold text-gold">
                                {player.position}
                            </span>
                        </div>
                    </div>

                    {/* Team */}
                    {player.team && (
                        <div className="flex items-center justify-center gap-3 py-3 px-4 bg-white/5 rounded-xl border border-white/10">
                            <img
                                src={player.team.logo}
                                alt={player.team.name}
                                className="w-8 h-8 object-contain"
                            />
                            <span className="font-bold text-white">{player.team.name}</span>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-2xl font-bold text-gold">
                                {player.stats?.goals || 0}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Buts</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-2xl font-bold text-gold">
                                {player.stats?.assists || 0}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Passes D.</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-2xl font-bold text-gold">
                                {player.stats?.appearances || 0}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Matchs</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-2xl font-bold text-gold">
                                {player.stats?.rating?.toFixed(1) || '0.0'}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Note Moy.</div>
                        </div>
                    </div>

                    {/* Attribute Bars */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                            <Activity size={18} className="text-gold" />
                            <span>Attributs</span>
                        </div>
                        {statAttributes.map((attr) => (
                            <div key={attr.label} className="space-y-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">{attr.label}</span>
                                    <span className="font-bold text-white">{attr.value}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${attr.color} rounded-full transition-all duration-500`}
                                        style={{ width: `${attr.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cards */}
                    {(player.stats?.yellowCards > 0 || player.stats?.redCards > 0) && (
                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                            <span className="text-sm text-gray-400">Cartons:</span>
                            {player.stats.yellowCards > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-6 bg-yellow-400 rounded-sm" />
                                    <span className="text-sm font-bold text-white">
                                        {player.stats.yellowCards}
                                    </span>
                                </div>
                            )}
                            {player.stats.redCards > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-6 bg-red-500 rounded-sm" />
                                    <span className="text-sm font-bold text-white">
                                        {player.stats.redCards}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
