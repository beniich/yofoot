import React from 'react';

const MatchCard = ({ match }) => {
    const isLive = match.status === 'live';

    return (
        <div className="flex-none w-[280px] snap-center glass-card rounded-xl p-5 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    {match.league}
                </span>
                {isLive ? (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                        <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Live</span>
                    </div>
                ) : (
                    <span className="text-[10px] font-bold text-white/40">{match.time}</span>
                )}
            </div>

            {/* Teams & Score */}
            <div className="flex items-center justify-between">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-2 w-16">
                    <div className="relative">
                        <div className="size-12 rounded-full bg-white/5 p-2 flex items-center justify-center border border-white/10">
                            <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase">{match.homeTeam.shortName}</span>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center">
                    <div className="text-3xl font-display font-bold text-white tracking-widest">
                        {match.score.home ?? 0} <span className="text-white/20">-</span> {match.score.away ?? 0}
                    </div>
                    {isLive && (
                        <span className="text-[9px] font-bold text-gold animate-pulse mt-1">{match.time}</span>
                    )}
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center gap-2 w-16">
                    <div className="relative">
                        <div className="size-12 rounded-full bg-white/5 p-2 flex items-center justify-center border border-white/10">
                            <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase">{match.awayTeam.shortName}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-center">
                <button className="text-[10px] font-bold text-gold hover:text-gold-light transition-colors uppercase tracking-widest flex items-center gap-1">
                    Match Stats <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default MatchCard;
