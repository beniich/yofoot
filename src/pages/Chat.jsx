import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Check if user has premium for the "Premium Lounge" access
    const isPremium = user?.plan === 'pro' || user?.plan === 'elite';

    const topLeaguesRooms = [
        {
            id: 1,
            name: "Premier League Live",
            members: "2.4k",
            status: "Live Match Chat",
            image: "https://resources.premierleague.com/premierleague/badges/t1.svg",
            type: "Public",
            color: "bg-[#3d195b]"
        },
        {
            id: 2,
            name: "La Liga Discussion",
            members: "1.1k",
            status: "Transfers & News",
            image: "https://assets.laliga.com/assets/public/logos/laliga-v-white.svg",
            type: "Public",
            color: "bg-[#000000]"
        }
    ];

    const fanClubs = [
        { id: 'rm', name: 'Real Madrid', online: '852', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png' },
        { id: 'mu', name: 'Man United', online: '1.2k', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png' }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display">
            <div className="max-w-md mx-auto relative min-h-screen flex flex-col shadow-2xl bg-background-light dark:bg-background-dark">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
                    <div className="flex items-center p-4 justify-between">
                        <div className="flex items-center gap-3">
                            <span onClick={() => navigate(-1)} className="material-symbols-outlined text-primary cursor-pointer">arrow_back_ios</span>
                            <h1 className="text-xl font-bold tracking-tight">Community</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </button>
                            <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors relative">
                                <span className="material-symbols-outlined text-xl">notifications</span>
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background-dark"></span>
                            </button>
                        </div>
                    </div>
                    {/* Categories Chips */}
                    <div className="flex gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
                        <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-primary px-5 shadow-lg shadow-primary/20 cursor-pointer">
                            <p className="text-white text-sm font-semibold">All Rooms</p>
                        </div>
                        <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-slate-200 dark:bg-surface-dark px-5 cursor-pointer">
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Top Leagues</p>
                        </div>
                        <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-slate-200 dark:bg-surface-dark px-5 cursor-pointer">
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">Fan Clubs</p>
                        </div>
                        <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-slate-200 dark:bg-surface-dark px-5 cursor-pointer">
                            <p className="text-premium text-sm font-medium">Premium</p>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto pb-32">
                    {/* Section: Top Leagues */}
                    <section>
                        <div className="flex items-center justify-between px-4 pt-6 pb-3">
                            <h2 className="text-lg font-bold">Top Leagues</h2>
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider cursor-pointer">See All</span>
                        </div>
                        <div className="space-y-1">
                            {topLeaguesRooms.map(room => (
                                <div key={room.id} className="flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-surface-dark px-4 py-3 cursor-pointer transition-colors group">
                                    <div className="relative">
                                        <div
                                            className={`bg-center bg-no-repeat aspect-square bg-contain rounded-xl size-14 ring-1 ring-slate-200 dark:ring-slate-700 ${room.color} p-2`}
                                            style={{ backgroundImage: `url("${room.image}")` }}
                                        ></div>
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 size-3 rounded-full border-2 border-background-dark animate-pulse"></div>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-base font-semibold dark:text-white">{room.name}</p>
                                            <span className="bg-slate-200 dark:bg-slate-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase text-slate-500 dark:text-slate-400">{room.type}</span>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{room.members} active members • {room.status}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section: Premium Exclusive */}
                    <section className="mt-4">
                        <div className="flex items-center justify-between px-4 pt-4 pb-3">
                            <h2 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                                Premium Lounge
                                <span className="material-symbols-outlined text-premium text-lg text-gold">star</span>
                            </h2>
                        </div>
                        <div className="px-4">
                            <div className="bg-gradient-to-br from-surface-dark to-background-dark rounded-2xl p-0.5 border border-gold/30 shadow-xl">
                                <div className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-background-dark/40">
                                    <div className="relative">
                                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-14 bg-gold/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-3xl text-gold">diamond</span>
                                        </div>
                                        {!isPremium && (
                                            <div className="absolute -top-2 -left-2 bg-gold text-black size-6 rounded-full flex items-center justify-center border-2 border-background-dark shadow-md">
                                                <span className="material-symbols-outlined text-sm font-bold">lock</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-base font-semibold text-white">Elite Pro Predictions</p>
                                            <span className="bg-gold/20 text-gold text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-gold/30">Premium</span>
                                        </div>
                                        <p className="text-slate-400 text-xs mt-0.5">AI Insights • Expert Analysis</p>
                                    </div>
                                    <button
                                        onClick={() => !isPremium && navigate('/subscription')}
                                        className={`${isPremium ? 'bg-emerald-500' : 'bg-primary'} hover:brightness-110 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all active:scale-95`}
                                    >
                                        {isPremium ? 'Enter' : 'Upgrade'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Fan Clubs */}
                    <section className="mt-8">
                        <div className="flex items-center justify-between px-4 pb-3">
                            <h2 className="text-lg font-bold dark:text-white">Fan Clubs</h2>
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider cursor-pointer">Explore</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 px-4">
                            {fanClubs.map(club => (
                                <div key={club.id} className="bg-slate-100 dark:bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-contain rounded-full size-12 mb-3 shadow-md"
                                        style={{ backgroundImage: `url("${club.logo}")` }}
                                    ></div>
                                    <p className="font-bold text-sm dark:text-white">{club.name}</p>
                                    <p className="text-[10px] text-slate-500 mt-1">{club.online} Online</p>
                                    <button className="mt-3 w-full bg-background-light dark:bg-background-dark text-primary dark:text-white border border-primary/20 hover:bg-primary hover:text-white transition-colors text-xs font-bold py-1.5 rounded-lg">Join</button>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                {/* ChatRoom Interface Overlay (Mini Preview/Active Bar) */}
                <div className="absolute bottom-20 left-4 right-4 bg-primary rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-bounce-subtle cursor-pointer ring-4 ring-background-dark z-40 hover:scale-[1.02] transition-transform">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            <div className="size-8 rounded-full border-2 border-primary bg-slate-700 flex items-center justify-center text-xs text-white">U1</div>
                            <div className="size-8 rounded-full border-2 border-primary bg-slate-600 flex items-center justify-center text-xs text-white">U2</div>
                            <div className="size-8 rounded-full border-2 border-primary flex items-center justify-center bg-slate-800 text-[10px] font-bold text-white">+12</div>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-white text-sm font-bold leading-none">Man City vs Arsenal</p>
                            <p className="text-white/70 text-[10px] mt-1">K. De Bruyne: "What a goal! 🚀"</p>
                        </div>
                    </div>
                    <div className="bg-white/20 p-2 rounded-xl">
                        <span className="material-symbols-outlined text-white text-xl">open_in_full</span>
                    </div>
                </div>

                <BottomNavigation />
            </div>
        </div>
    );
};

export default Chat;
