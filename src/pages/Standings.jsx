import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStandings } from '../services/football';

const Standings = () => {
    const navigate = useNavigate();
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Premier League (39) for 2023 season
        const fetchStandings = async () => {
            try {
                // If the user's backend key is invalid, this will return empty or throw
                // We handle it gracefully
                const result = await getStandings(39, 2023);
                // Result might be the raw standings array if getStandings returns r.data.response[0].league.standings[0]
                // Our service returns r.data from axios.
                // The backend route returns: data.response[0].league.standings[0] (which is an array of ranks)
                // So result should be the array directly.
                if (result && Array.isArray(result)) {
                    setStandings(result);
                } else {
                    console.warn("Unexpected standings format", result);
                }
            } catch (e) {
                console.error("Failed to load standings", e);
            } finally {
                setLoading(false);
            }
        };
        fetchStandings();
    }, []);

    return (
        <div className="bg-[#121212] min-h-screen text-white font-sans pb-24">
            <div className="p-4 border-b border-white/5 flex items-center gap-4 sticky top-0 bg-[#121212]/95 backdrop-blur-md z-10 shadow-lg shadow-black/20">
                <button onClick={() => navigate(-1)} className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-gold hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
                </button>
                <h1 className="text-lg font-serif italic font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold via-white to-gold w-max">Premier League Table</h1>
            </div>

            <div className="p-4 overflow-x-auto">
                <div className="bg-[#1a1a1a] rounded-xl border border-white/5 shadow-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-[10px] uppercase text-gold/80 font-bold tracking-wider">
                            <tr>
                                <th className="py-4 pl-4 w-12 text-center">#</th>
                                <th className="py-4">Club</th>
                                <th className="py-4 text-center w-12">MP</th>
                                <th className="py-4 text-center w-12">GD</th>
                                <th className="py-4 text-center w-12 text-white">Pts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="py-4 text-center"><div className="h-4 w-4 bg-white/10 rounded mx-auto"></div></td>
                                        <td className="py-4"><div className="h-4 w-24 bg-white/10 rounded"></div></td>
                                        <td className="py-4"><div className="h-4 w-6 bg-white/10 rounded mx-auto"></div></td>
                                        <td className="py-4"><div className="h-4 w-6 bg-white/10 rounded mx-auto"></div></td>
                                        <td className="py-4"><div className="h-4 w-6 bg-white/10 rounded mx-auto"></div></td>
                                    </tr>
                                ))
                            ) : standings.length > 0 ? (
                                standings.map((team) => (
                                    <tr key={team.team.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                        <td className={`py-3 pl-4 text-center font-bold text-xs ${team.rank <= 4 ? 'text-green-400' :
                                                team.rank === 5 ? 'text-blue-400' :
                                                    team.rank >= 18 ? 'text-red-400' : 'text-white/40'
                                            }`}>{team.rank}</td>
                                        <td className="py-3 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 p-1.5 flex items-center justify-center border border-white/5 group-hover:border-gold/30 transition-colors">
                                                <img src={team.team.logo} alt={team.team.name} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="font-semibold text-white/90 truncate max-w-[120px] group-hover:text-gold transition-colors">{team.team.name}</span>
                                        </td>
                                        <td className="py-3 text-center text-white/50 font-medium">{team.all.played}</td>
                                        <td className={`py-3 text-center font-medium ${team.goalsDiff > 0 ? 'text-green-400/80' : team.goalsDiff < 0 ? 'text-red-400/80' : 'text-white/50'}`}>{team.goalsDiff > 0 ? `+${team.goalsDiff}` : team.goalsDiff}</td>
                                        <td className="py-3 text-center font-black text-white text-base group-hover:text-gold transition-colors">{team.points}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-white/30 italic">
                                        No standings data available.<br />
                                        <span className="text-xs opacity-50 block mt-2">Check API Key connection</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Standings;
