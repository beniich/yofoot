import React from 'react';

export const MatchCard = ({ match, onClick }) => {
    const isLive = match.status === 'LIVE';
    const isFinished = match.status === 'FINISHED';

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString([], { day: '2-digit', month: 'short' });
    };

    return (
        <div
            onClick={onClick}
            className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/10 p-5 cursor-pointer hover:border-gold/30 transition-all active:scale-95"
        >
            {isLive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-pulse" />
            )}

            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                {match.league?.logo && (
                    <img
                        src={match.league.logo}
                        alt={match.league.name}
                        className="w-5 h-5 object-contain"
                    />
                )}
                <span className="text-xs text-gray-400 font-medium">
                    {match.league?.name}
                </span>
                {isLive && (
                    <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">
                        LIVE
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 mb-2 rounded-xl bg-white/5 flex items-center justify-center">
                        {match.homeTeam?.logo ? (
                            <img
                                src={match.homeTeam.logo}
                                alt={match.homeTeam.name}
                                className="w-12 h-12 object-contain"
                            />
                        ) : (
                            <span className="text-2xl">🏴</span>
                        )}
                    </div>
                    <span className="text-sm font-medium text-white text-center line-clamp-1">
                        {match.homeTeam?.name}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    {isFinished || isLive ? (
                        <>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-white">
                                    {match.score?.fulltime?.home ?? 0}
                                </span>
                                <span className="text-xl text-gray-500">-</span>
                                <span className="text-3xl font-bold text-white">
                                    {match.score?.fulltime?.away ?? 0}
                                </span>
                            </div>
                            {isFinished && (
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">FT</span>
                            )}
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="text-lg font-bold text-gold">
                                {formatTime(match.matchDate)}
                            </div>
                            <div className="text-[10px] text-gray-500 uppercase">
                                {formatDate(match.matchDate)}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center flex-1">
                    <div className="w-16 h-16 mb-2 rounded-xl bg-white/5 flex items-center justify-center">
                        {match.awayTeam?.logo ? (
                            <img
                                src={match.awayTeam.logo}
                                alt={match.awayTeam.name}
                                className="w-12 h-12 object-contain"
                            />
                        ) : (
                            <span className="text-2xl">🏴</span>
                        )}
                    </div>
                    <span className="text-sm font-medium text-white text-center line-clamp-1">
                        {match.awayTeam?.name}
                    </span>
                </div>
            </div>

            {match.venue && (
                <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-3 border-t border-white/5 font-medium uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span className="truncate">{match.venue.name}{match.venue.city ? `, ${match.venue.city}` : ''}</span>
                </div>
            )}
        </div>
    );
};
