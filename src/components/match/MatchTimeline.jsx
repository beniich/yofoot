import React from 'react';
import { Target, ArrowRightLeft, AlertCircle, Flag } from 'lucide-react';

export const MatchTimeline = ({
    events = [],
    homeTeam,
    awayTeam,
}) => {
    const getEventIcon = (type) => {
        switch (type) {
            case 'goal':
                return <Target size={16} className="text-gold" />;
            case 'substitution':
                return <ArrowRightLeft size={16} className="text-blue-400" />;
            case 'card':
                return <AlertCircle size={16} className="text-yellow-400" />;
            case 'var':
                return <Flag size={16} className="text-purple-400" />;
            default:
                return null;
        }
    };

    const getEventLabel = (type, detail) => {
        switch (type) {
            case 'goal':
                return detail || 'But';
            case 'substitution':
                return 'Remplacement';
            case 'card':
                return detail || 'Carton';
            case 'var':
                return 'VAR';
            default:
                return '';
        }
    };

    return (
        <div className="relative">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10" />

            {/* Events */}
            <div className="space-y-6">
                {events.map((event, index) => {
                    const isHome = event.team === 'home';

                    return (
                        <div
                            key={index}
                            className={`relative flex items-center gap-4 ${isHome ? 'flex-row' : 'flex-row-reverse'
                                }`}
                        >
                            {/* Event Content */}
                            <div className={`flex-1 ${isHome ? 'text-right' : 'text-left'}`}>
                                <div className="inline-block px-4 py-3 bg-white/5 rounded-xl border border-white/10 max-w-xs">
                                    <div className="flex items-center gap-2 mb-1">
                                        {isHome && getEventIcon(event.type)}
                                        <span className="text-sm font-bold text-white">
                                            {event.player}
                                        </span>
                                        {!isHome && getEventIcon(event.type)}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {getEventLabel(event.type, event.detail)}
                                    </div>
                                </div>
                            </div>

                            {/* Time Badge */}
                            <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-gold rounded-full border-4 border-charcoal shadow-lg flex-shrink-0">
                                <span className="text-sm font-bold text-black">
                                    {event.minute}'
                                </span>
                            </div>

                            {/* Spacer */}
                            <div className="flex-1" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
