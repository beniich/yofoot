import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLive } from '../services/football';

const MOCK_LIVE_MATCHES = [
    {
        fixture: { id: 1, status: { elapsed: 65 } },
        league: { name: "Premier League" },
        teams: {
            home: { name: "Arsenal", code: "ARS", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTGswkHtiFkxki80b_s3OaVHSIBqeky1m5xsfTQhnhm1Pa2Yy7jKEird2X9JDFQjh9tqWUgZnvQrHlMei51E_EdDS46izSmpCo2OwY2CmedMGy4dXo5IVirGpD1Y2gXWe3ZvL2p8TfK-4sN0AuHwK1gM5EmYNVdcqBxmWIiW4OaeA27zOolcVVVqQ_GDTOC5t314TnpeQ7IoOg-uOdhVkiNObQ0R3wwvJBbWnSTChi6FJfdtk2655P2ajh2O1trYC3lVre0mvG0GM" },
            away: { name: "Man City", code: "MCI", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiU5hm1c5TTXkH2tqN6thb4OBHlWizhhaGtuV709Q_lrliDBmn9j6yNi8Esi0XFlD0jjXfQ6bzB_O91y1X71ntXWgguIbHvX6thjdEhoFR4giHGvPZprVhj8H3fkUq-_Rr5iyglo3AcDsQmhMhwiY-7YkhCY0K5sdz3Nl6IfR1lbtNiMEZp7DM3dpZnmiFi7qf3h0pwTmPCYqImrQSv6FO55_9PTgHVBlRWFcztG37HgXCpfAsfvFCevHKFf5fTQZeoGVmGlA0lyw" }
        },
        goals: { home: 2, away: 1 }
    },
    {
        fixture: { id: 2, status: { elapsed: 12 } },
        league: { name: "La Liga" },
        teams: {
            home: { name: "Real Madrid", code: "RMA", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCV5YRnMuutW37J5F5hsDoh7GD7jKor2w6YM8Ta1-1Jw0528_uIi6YCVsETskP2iVvOFv85Vt6X92IkOD2II1M32Spm1zLltxpZwGeU5EDmdIfKxY30WeeEZ822-GswTw0I6f_Dv-9PP6NDkBnKYU9mu93ds-xGW40r1Lo5FdJqP-7dlzNsAwrg2YJqEPoPpBm30aZNMOWdq9jydOupWr0LgpUQ9PGll-CmuxzgFJstLPsRQTNlFdM0vMugcBXMc2eqQORBBWL_wvc" },
            away: { name: "Barcelona", code: "BAR", logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRmFXJ6KjZUwYA6EnNZHi1kXDhyE1lTNxTGMKL06efjKb14gxT5nKA4EJ3jFivm6RkQuWn1kDS2_9eF98Jy1aj79mHK2qzk4ZvBuQk-UxAjfsYwAufepdx1KOFnlFxFZaH08UUmmz2WBgYpHHc-XIW2EwTq6mHbc0CkaOGB_obm9BlVW32VDYa36ebpmstjqUFZP62kmfKIqpoKsvfeYR2p1GzNUH9cPp-gzkYfxaM5vBiqwbpAU64YS_fH0LwRqmEbww-1i7NG6Q" }
        },
        goals: { home: 0, away: 0 }
    }
];

const Home = () => {
    const navigate = useNavigate();
    const [liveMatches, setLiveMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await getLive();
                console.log("Live matches data:", data);
                if (data && data.length > 0) {
                    setLiveMatches(data);
                } else {
                    setLiveMatches(MOCK_LIVE_MATCHES);
                }
            } catch (error) {
                console.error("Failed to load live matches:", error);
                setLiveMatches(MOCK_LIVE_MATCHES);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const matchesToDisplay = liveMatches.length > 0 ? liveMatches : MOCK_LIVE_MATCHES;

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-charcoal text-white transition-colors duration-300 font-sans">
            <header className="sticky top-0 z-50 flex items-center bg-charcoal/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-white/5">
                <div className="flex size-10 shrink-0 items-center">
                    <div className="gold-gradient flex items-center justify-center rounded-lg size-10 shadow-lg shadow-gold/20">
                        <span className="material-symbols-outlined !text-charcoal font-bold">sports_soccer</span>
                    </div>
                </div>
                <h2 className="font-serif italic text-xl font-semibold leading-tight tracking-tight flex-1 ml-3 gold-text-gradient">FootballHub</h2>
                <div className="flex items-center gap-2">
                    <button className="relative flex size-10 items-center justify-center rounded-full bg-white/5 text-gold transition-all hover:bg-white/10">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-gold-light border border-charcoal"></span>
                    </button>
                </div>
            </header>

            <div className="px-4 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30">
                    <span className="size-1.5 rounded-full bg-gold-light animate-pulse shadow-[0_0_8px_rgba(249,226,126,0.6)]"></span>
                    <span className="text-gold-light text-[10px] font-semibold uppercase tracking-[0.1em]">Free Plan</span>
                </div>
            </div>

            <nav className="mt-4 px-4">
                <div className="flex border-b border-white/10 justify-between items-end">
                    <button className="flex flex-col items-center justify-center border-b-[2px] border-gold text-gold gap-1 pb-3 pt-2.5 flex-1">
                        <span className="material-symbols-outlined material-symbols-filled">stadium</span>
                        <p className="text-[10px] font-semibold uppercase tracking-wider">Matches</p>
                    </button>
                    <button onClick={() => navigate('/ai-agent')} className="flex flex-col items-center justify-center border-b-[2px] border-transparent text-white/40 gap-1 pb-3 pt-2.5 flex-1">
                        <span className="material-symbols-outlined opacity-60">psychology</span>
                        <p className="text-[10px] font-semibold uppercase tracking-wider">AI Agent</p>
                    </button>
                    <button onClick={() => navigate('/chat')} className="flex flex-col items-center justify-center border-b-[2px] border-transparent text-white/40 gap-1 pb-3 pt-2.5 flex-1">
                        <span className="material-symbols-outlined opacity-60">forum</span>
                        <p className="text-[10px] font-semibold uppercase tracking-wider">Rooms</p>
                    </button>
                    <button onClick={() => navigate('/subscription')} className="flex flex-col items-center justify-center border-b-[2px] border-transparent text-white/40 gap-1 pb-3 pt-2.5 flex-1">
                        <span className="material-symbols-outlined opacity-60">workspace_premium</span>
                        <p className="text-[10px] font-semibold uppercase tracking-wider">Premium</p>
                    </button>
                </div>
            </nav>

            <section className="mt-8">
                <div className="flex items-center justify-between px-4 mb-5">
                    <h3 className="font-serif text-xl font-semibold leading-tight flex items-center gap-3">
                        Live Matches
                        <span className="flex h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]"></span>
                    </h3>
                    <button onClick={() => navigate('/standings')} className="text-gold-light text-[11px] font-semibold uppercase tracking-widest border-b border-gold-light/30">Standings</button>
                </div>
                <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 gap-4 px-4">
                    {loading ? (
                        [...Array(2)].map((_, i) => (
                            <div key={i} className="snap-center min-w-[300px] h-32 rounded-xl bg-white/5 animate-pulse border border-white/5 shrink-0"></div>
                        ))
                    ) : (
                        matchesToDisplay.map((match, index) => (
                            <div key={match.fixture.id || index} className="snap-center flex flex-col gap-4 p-5 rounded-xl charcoal-gradient border border-white/10 min-w-[300px] shadow-2xl shrink-0 cursor-pointer hover:border-gold/20 transition-colors" onClick={() => navigate('/stats')}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest truncate max-w-[150px]">{match.league.name}</span>
                                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/40">
                                        <span className="text-[10px] font-bold text-gold-light uppercase tracking-tighter italic whitespace-nowrap">{match.fixture.status.elapsed}'</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                                        <div className="size-14 rounded-full bg-white/5 flex items-center justify-center p-2.5 border border-white/5">
                                            <img alt={match.teams.home.name} className="size-full object-contain filter grayscale brightness-125" src={match.teams.home.logo} />
                                        </div>
                                        <p className="text-xs font-semibold tracking-widest text-white/80 truncate w-full text-center">{match.teams.home.code || match.teams.home.name.substring(0, 3).toUpperCase()}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <p className="text-3xl font-serif font-bold text-white tracking-widest whitespace-nowrap">
                                            {match.goals.home ?? 0} - {match.goals.away ?? 0}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
                                        <div className="size-14 rounded-full bg-white/5 flex items-center justify-center p-2.5 border border-white/5">
                                            <img alt={match.teams.away.name} className="size-full object-contain filter grayscale brightness-125" src={match.teams.away.logo} />
                                        </div>
                                        <p className="text-xs font-semibold tracking-widest text-white/80 truncate w-full text-center">{match.teams.away.code || match.teams.away.name.substring(0, 3).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section className="mt-6 px-4 pb-20">
                <h3 className="font-serif text-xl font-semibold leading-tight mb-5">Top AI Prediction</h3>
                <div onClick={() => navigate('/ai-agent')} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gold/20 via-charcoal to-charcoal p-[1px] shadow-2xl cursor-pointer hover:border-gold/30 transition-all">
                    <div className="bg-slate-dark/40 backdrop-blur-md rounded-[11px] p-5 flex flex-col gap-5 border border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                                <span className="material-symbols-outlined !text-gold-light text-sm">bolt</span>
                                <span className="text-gold-light text-[10px] font-bold uppercase tracking-widest">High Confidence</span>
                            </div>
                            <span className="text-white/30 text-[10px] font-medium tracking-wide">Updated 5m ago</span>
                        </div>
                        <div className="flex items-center gap-5">
                            <div className="flex-1">
                                <p className="text-white/40 text-[10px] font-semibold uppercase tracking-[0.15em] mb-1">Recommended Bet</p>
                                <p className="text-lg font-serif font-semibold leading-tight text-white mb-1.5">Inter Milan vs AC Milan</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-gold font-bold text-sm">Inter to Win & Over 2.5</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center size-20 rounded-full border border-gold/30 bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                                <p className="text-gold-light text-2xl font-serif font-bold">84%</p>
                                <p className="text-[8px] font-bold text-gold/60 uppercase tracking-widest">Prob.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={(e) => { e.stopPropagation(); navigate('/stats'); }} className="flex-1 gold-gradient text-charcoal font-bold py-3.5 rounded-lg text-xs uppercase tracking-[0.1em] shadow-lg shadow-gold/20 transition-transform active:scale-95">
                                View Full Analysis
                            </button>
                            <button className="flex items-center justify-center aspect-square bg-white/5 border border-white/10 rounded-lg px-4 hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined !text-gold">share</span>
                            </button>
                        </div>
                    </div>
                    <div className="absolute -right-12 -bottom-12 size-40 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
                </div>
            </section>

            <div className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 pb-8">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <button className="flex flex-col items-center gap-1.5 text-gold">
                        <span className="material-symbols-outlined material-symbols-filled">grid_view</span>
                        <span className="text-[10px] font-semibold uppercase tracking-widest">Home</span>
                    </button>
                    <button onClick={() => navigate('/standings')} className="flex flex-col items-center gap-1.5 text-white/40">
                        <span className="material-symbols-outlined !text-white/40">leaderboard</span>
                        <span className="text-[10px] font-semibold uppercase tracking-widest">Table</span>
                    </button>
                    <button onClick={() => navigate('/chat')} className="flex flex-col items-center gap-1.5 text-white/40">
                        <span className="material-symbols-outlined !text-white/40">groups</span>
                        <span className="text-[10px] font-semibold uppercase tracking-widest">Chat</span>
                    </button>
                    <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1.5 text-white/40">
                        <span className="material-symbols-outlined !text-white/40">person</span>
                        <span className="text-[10px] font-semibold uppercase tracking-widest">Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
