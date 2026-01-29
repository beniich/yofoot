import React from 'react';

export const LeagueCard = ({ league, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/10 p-5 cursor-pointer hover:border-gold/30 transition-all active:scale-95"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/10">
                    {league.logo ? (
                        <img
                            src={league.logo}
                            alt={league.name}
                            className="w-12 h-12 object-contain"
                        />
                    ) : (
                        <span className="text-3xl text-gold">⚽</span>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-white mb-1 truncate group-hover:text-gold transition-colors">
                        {league.name}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        {league.country?.flag && (
                            <img
                                src={league.country.flag}
                                alt={league.country.name}
                                className="w-5 h-3 object-cover rounded"
                            />
                        )}
                        <span>{league.country?.name}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                        <span className="material-symbols-outlined text-sm">groups</span>
                        <span>{league.followersCount?.toLocaleString() || 0} followers</span>
                    </div>
                </div>

                <div className="text-gray-600 group-hover:text-gold transition-colors">
                    <span className="material-symbols-outlined">trending_up</span>
                </div>
            </div>
        </div>
    );
};
