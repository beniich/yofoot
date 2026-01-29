import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SafeArea } from '../components/SafeArea';
import { getApiUrl } from '../config/api';
import axios from 'axios';

const Standings = () => {
    const { leagueId = "39", season = "2023" } = useParams(); // Default to PL 2023
    const [standings, setStandings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                // Since we might not have the DB ID for the request, let's try to get by API ID if supported or use a mock
                const response = await axios.get(`${getApiUrl()}/standings/${leagueId}/${season}`);
                setStandings(response.data);
            } catch (error) {
                console.error("Failed to fetch standings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStandings();
    }, [leagueId, season]);

    if (loading) return <div className="p-10 text-center">Chargement...</div>;

    return (
        <SafeArea className="min-h-screen bg-charcoal p-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Classement</h1>
                    {standings?.league && (
                        <div className="flex items-center gap-3">
                            <img src={standings.league.logo} alt="" className="w-8 h-8 object-contain" />
                            <span className="text-gray-400">{standings.league.name} - {standings.season}</span>
                        </div>
                    )}
                </header>

                <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Équipe</th>
                                <th className="px-4 py-3 text-center">J</th>
                                <th className="px-4 py-3 text-center">G</th>
                                <th className="px-4 py-3 text-center">N</th>
                                <th className="px-4 py-3 text-center">P</th>
                                <th className="px-4 py-3 text-center font-bold text-white">Pts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {standings?.rankings?.map((entry) => (
                                <tr key={entry.rank} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4 font-bold text-gray-500">{entry.rank}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={entry.teamLogo} alt="" className="w-6 h-6 object-contain" />
                                            <span className="font-medium text-white">{entry.teamName}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center text-gray-400">{entry.played}</td>
                                    <td className="px-4 py-4 text-center text-gray-400">{entry.win}</td>
                                    <td className="px-4 py-4 text-center text-gray-400">{entry.draw}</td>
                                    <td className="px-4 py-4 text-center text-gray-400">{entry.lose}</td>
                                    <td className="px-4 py-4 text-center font-bold text-gold">{entry.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SafeArea>
    );
};

export default Standings;
