import React, { useState, useEffect } from 'react';
import { matchService } from '../services/matches';
import { MatchCard } from '../components/matches/MatchCard';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await matchService.getUpcoming(20);
                setMatches(data);
            } catch (err) {
                setError('Failed to load matches');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    return (
        <div className="min-h-screen bg-charcoal p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-serif italic font-black text-white mb-2">
                        Upcoming <span className="text-gold">Matches</span>
                    </h1>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em]">Live Scores & Scheduled Fixtures</p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="size-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center font-bold">
                        {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {matches.map((match) => (
                            <MatchCard key={match._id} match={match} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Matches;
