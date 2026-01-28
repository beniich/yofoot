import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { Card, Badge, Button } from '../components/UI';
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
        <div className="min-h-screen bg-charcoal text-white pb-20 font-sans">
            <Header />

            <main className="px-4 pt-6 flex flex-col gap-6">
                {/* Welcome Section */}
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold text-white font-display">Dashboard</h2>
                    <p className="text-white/60 text-sm">Here's what's happening at your club.</p>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Total Members */}
                    <Card variant="glass" className="p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col gap-1">
                                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Total Members</p>
                                <h3 className="text-3xl font-bold text-white font-display">1,245</h3>
                            </div>
                            <Badge variant="success">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                +12%
                            </Badge>
                        </div>
                        {/* Mini Chart Visualization */}
                        <div className="h-16 w-full bg-gradient-to-t from-gold/10 to-transparent rounded-lg border-b border-gold/30 relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-between px-2 pb-0">
                                {[40, 60, 45, 70, 65, 80, 75].map((h, i) => (
                                    <div key={i} style={{ height: `${h}%` }} className="w-1.5 bg-gold/50 rounded-t-sm" />
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Revenue */}
                        <Card variant="glass" className="p-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                                        <span className="material-symbols-outlined">payments</span>
                                    </div>
                                    <Badge variant="success" className="text-[10px]">+8.5%</Badge>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white font-display">$14.5k</h3>
                                    <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Revenue</p>
                                </div>
                            </div>
                        </Card>

                        {/* Active Events */}
                        <Card variant="glass" className="p-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                        <span className="material-symbols-outlined">event</span>
                                    </div>
                                    <Badge variant="info" className="text-[10px]">New</Badge>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white font-display">3</h3>
                                    <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Active Events</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="primary" onClick={() => navigate('/tickets')}>
                        <span className="material-symbols-outlined">qr_code_scanner</span>
                        Scan Ticket
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/events')}>
                        <span className="material-symbols-outlined">add</span>
                        New Event
                    </Button>
                </div>

                {/* Live Match Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white tracking-tight">Live Matches</h3>
                        <button onClick={() => navigate('/standings')} className="text-gold text-xs font-bold hover:text-gold-light transition-colors">View All</button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {matchesToDisplay.map((match, index) => (
                            <Card key={match.fixture.id || index} variant="elevated" className="p-0 overflow-hidden cursor-pointer" onClick={() => navigate('/stats')}>
                                <div className="bg-white/5 px-4 py-2 flex justify-between items-center border-b border-white/5">
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{match.league.name}</span>
                                    <Badge variant="danger" className="animate-pulse">LIVE • {match.fixture.status.elapsed}'</Badge>
                                </div>
                                <div className="p-5 flex items-center justify-between">
                                    <div className="flex flex-col items-center gap-2 flex-1">
                                        <img src={match.teams.home.logo} alt={match.teams.home.name} className="w-12 h-12 object-contain" />
                                        <span className="text-xs font-bold text-white/80">{match.teams.home.code}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-3xl font-display font-bold text-white">{match.goals.home} - {match.goals.away}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 flex-1">
                                        <img src={match.teams.away.logo} alt={match.teams.away.name} className="w-12 h-12 object-contain" />
                                        <span className="text-xs font-bold text-white/80">{match.teams.away.code}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Recent Activity */}
                <section>
                    <h3 className="text-lg font-bold text-white tracking-tight mb-4">Recent Activity</h3>
                    <Card variant="glass" className="divide-y divide-white/5">
                        {[
                            { icon: 'person_add', color: 'text-blue-400 bg-blue-400/10', title: 'New Member', desc: 'Sarah Jenkins joined', time: '2m' },
                            { icon: 'qr_code', color: 'text-gold bg-gold/10', title: 'Ticket Validated', desc: 'Gate A - Section 104', time: '14m' },
                            { icon: 'shopping_bag', color: 'text-green-400 bg-green-400/10', title: 'New Order', desc: '#ORD-9921 ($85.00)', time: '1h' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.color}`}>
                                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{item.title}</p>
                                    <p className="text-xs text-white/40 truncate">{item.desc}</p>
                                </div>
                                <span className="text-xs font-medium text-white/30">{item.time}</span>
                            </div>
                        ))}
                    </Card>
                </section>
            </main>

            <BottomNavigation />
        </div>
    );
};

export default Home;
