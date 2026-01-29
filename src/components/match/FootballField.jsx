import React from 'react';

export const FootballField = ({
    players,
    formation = '4-3-3',
    teamColor = '#F9D406',
    onPlayerClick,
}) => {
    return (
        <div className="relative w-full aspect-[16/9] bg-gradient-to-b from-green-600 to-green-700 rounded-2xl overflow-hidden shadow-2xl">
            {/* Field Lines */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Border */}
                <rect
                    x="2%"
                    y="2%"
                    width="96%"
                    height="96%"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.6"
                />

                {/* Center Line */}
                <line
                    x1="50%"
                    y1="2%"
                    x2="50%"
                    y2="98%"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.6"
                />

                {/* Center Circle */}
                <circle
                    cx="50%"
                    cy="50%"
                    r="10%"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.6"
                />

                {/* Center Spot */}
                <circle
                    cx="50%"
                    cy="50%"
                    r="0.5%"
                    fill="white"
                    opacity="0.8"
                />

                {/* Left Penalty Area */}
                <rect
                    x="2%"
                    y="30%"
                    width="16%"
                    height="40%"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.6"
                />

                {/* Left Goal Area */}
                <rect
                    x="2%"
                    y="40%"
                    width="8%"
                    height="20%"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.6"
                />

                {/* Right Penalty Area */}
                <rect
                    x="82%"
                    y="30%"
                    width="16%"
                    height="40%"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.6"
                />

                {/* Right Goal Area */}
                <rect
                    x="90%"
                    y="40%"
                    width="8%"
                    height="20%"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.6"
                />

                {/* Left Penalty Spot */}
                <circle
                    cx="11%"
                    cy="50%"
                    r="0.5%"
                    fill="white"
                    opacity="0.8"
                />

                {/* Right Penalty Spot */}
                <circle
                    cx="89%"
                    cy="50%"
                    r="0.5%"
                    fill="white"
                    opacity="0.8"
                />
            </svg>

            {/* Players */}
            {players.map((player) => (
                <button
                    key={player.id}
                    onClick={() => onPlayerClick?.(player)}
                    className="absolute group cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    style={{
                        left: `${player.x}%`,
                        top: `${player.y}%`,
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    {/* Player Circle */}
                    <div className="relative">
                        {/* Glow Effect */}
                        <div
                            className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity"
                            style={{ backgroundColor: teamColor }}
                        />

                        {/* Player Avatar */}
                        <div
                            className="relative w-12 h-12 rounded-full border-3 flex items-center justify-center overflow-hidden shadow-lg"
                            style={{ borderColor: teamColor }}
                        >
                            {player.photo ? (
                                <img
                                    src={player.photo}
                                    alt={player.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
                                    style={{ backgroundColor: teamColor }}
                                >
                                    {player.number}
                                </div>
                            )}
                        </div>

                        {/* Jersey Number Badge */}
                        <div
                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black shadow-md"
                            style={{ backgroundColor: teamColor }}
                        >
                            {player.number}
                        </div>

                        {/* Rating Badge (if available) */}
                        {player.rating && (
                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-black/80 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-yellow-400">
                                {player.rating.toFixed(1)}
                            </div>
                        )}
                    </div>

                    {/* Player Name */}
                    <div className="mt-1 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        <span className="text-xs font-medium text-white">
                            {player.name}
                        </span>
                    </div>

                    {/* Position Label */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold" style={{ color: teamColor }}>
                            {player.position}
                        </span>
                    </div>
                </button>
            ))}

            {/* Formation Label */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-sm font-bold text-white">{formation}</span>
            </div>
        </div>
    );
};
