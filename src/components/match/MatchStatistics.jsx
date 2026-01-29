import React from 'react';
import { TrendingUp, Target, Zap, Shield, Activity } from 'lucide-react';

export const MatchStatistics = ({
    homeTeam,
    awayTeam,
}) => {
    const stats = [
        {
            label: 'Possession',
            icon: Activity,
            home: homeTeam.stats.possession || 0,
            away: awayTeam.stats.possession || 0,
            unit: '%',
        },
        {
            label: 'Tirs',
            icon: Target,
            home: homeTeam.stats.shots || 0,
            away: awayTeam.stats.shots || 0,
        },
        {
            label: 'Tirs cadrés',
            icon: Zap,
            home: homeTeam.stats.shotsOnTarget || 0,
            away: awayTeam.stats.shotsOnTarget || 0,
        },
        {
            label: 'Corners',
            icon: TrendingUp,
            home: homeTeam.stats.corners || 0,
            away: awayTeam.stats.corners || 0,
        },
        {
            label: 'Fautes',
            icon: Shield,
            home: homeTeam.stats.fouls || 0,
            away: awayTeam.stats.fouls || 0,
        },
        {
            label: 'Hors-jeu',
            icon: Activity,
            home: homeTeam.stats.offsides || 0,
            away: awayTeam.stats.offsides || 0,
        },
        {
            label: 'Précision passes',
            icon: Target,
            home: homeTeam.stats.passAccuracy || 0,
            away: awayTeam.stats.passAccuracy || 0,
            unit: '%',
        },
    ];

    return (
        <div className="space-y-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                const total = stat.home + stat.away;
                const homePercentage = total > 0 ? (stat.home / total) * 100 : 50;
                const awayPercentage = total > 0 ? (stat.away / total) * 100 : 50;

                return (
                    <div key={index} className="space-y-2">
                        {/* Label */}
                        <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-400">
                            <Icon size={16} />
                            <span>{stat.label}</span>
                        </div>

                        {/* Values */}
                        <div className="flex items-center justify-between text-lg font-bold text-white">
                            <span>{stat.home}{stat.unit || ''}</span>
                            <span>{stat.away}{stat.unit || ''}</span>
                        </div>

                        {/* Bar */}
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                style={{ width: `${homePercentage}%` }}
                            />
                            <div
                                className="bg-gradient-to-l from-red-500 to-red-600 transition-all duration-500"
                                style={{ width: `${awayPercentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}

            {/* Cards */}
            <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Cartons</span>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-4 bg-yellow-400 rounded-sm" />
                            <span className="font-bold text-white">
                                {homeTeam.stats.yellowCards || 0}
                            </span>
                        </div>
                        {(homeTeam.stats.redCards || 0) > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-4 bg-red-500 rounded-sm" />
                                <span className="font-bold text-white">
                                    {homeTeam.stats.redCards}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {(awayTeam.stats.redCards || 0) > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white">
                                    {awayTeam.stats.redCards}
                                </span>
                                <div className="w-3 h-4 bg-red-500 rounded-sm" />
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                                {awayTeam.stats.yellowCards || 0}
                            </span>
                            <div className="w-3 h-4 bg-yellow-400 rounded-sm" />
                        </div>
                        <span className="text-sm text-gray-400">Cartons</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
