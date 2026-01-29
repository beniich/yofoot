import React from 'react';

/**
 * Visualizes player activity on the field using a grid-based heat map
 */
export const PlayerHeatMap = ({
    data = [],
    playerName,
}) => {
    // Create grid (10x10)
    const gridSize = 10;
    const heatGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));

    // Populate grid with data
    data.forEach((point) => {
        const gridX = Math.floor((point.x / 100) * gridSize);
        const gridY = Math.floor((point.y / 100) * gridSize);

        if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
            heatGrid[gridY][gridX] += point.intensity || 1;
        }
    });

    // Find max value for normalization
    const maxValue = Math.max(...heatGrid.flat(), 1);

    // Get color based on intensity
    const getHeatColor = (value) => {
        if (value === 0) return 'rgba(0, 0, 0, 0)';

        const intensity = value / maxValue;

        if (intensity < 0.2) return 'rgba(59, 130, 246, 0.3)'; // Blue
        if (intensity < 0.4) return 'rgba(34, 197, 94, 0.4)';  // Green
        if (intensity < 0.6) return 'rgba(251, 191, 36, 0.5)'; // Yellow
        if (intensity < 0.8) return 'rgba(249, 115, 22, 0.6)'; // Orange
        return 'rgba(239, 68, 68, 0.7)'; // Red
    };

    return (
        <div className="relative w-full aspect-[16/9] bg-gradient-to-b from-green-600 to-green-700 rounded-2xl overflow-hidden shadow-xl border border-white/10">
            {/* Field Lines (simplified) */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect
                    x="2%" y="2%" width="96%" height="96%"
                    fill="none" stroke="white" strokeWidth="2" opacity="0.3"
                />
                <line
                    x1="50%" y1="2%" x2="50%" y2="98%"
                    stroke="white" strokeWidth="2" opacity="0.3"
                />
                <circle
                    cx="50%" cy="50%" r="10%"
                    fill="none" stroke="white" strokeWidth="2" opacity="0.3"
                />
            </svg>

            {/* Heat Map Grid */}
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                {heatGrid.map((row, rowIndex) =>
                    row.map((value, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className="transition-all duration-300"
                            style={{
                                backgroundColor: getHeatColor(value),
                            }}
                        />
                    ))
                )}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <div className="text-xs text-white mb-2 font-bold">{playerName || 'Joueur'}</div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-300">Faible</span>
                    <div className="flex gap-0.5">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(59, 130, 246, 0.5)' }} />
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(34, 197, 94, 0.5)' }} />
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(251, 191, 36, 0.6)' }} />
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(249, 115, 22, 0.7)' }} />
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }} />
                    </div>
                    <span className="text-[10px] text-gray-300">Élevée</span>
                </div>
            </div>

            {/* Title */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-lg border border-white/20">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Heat Map - Activité</span>
            </div>
        </div>
    );
};
