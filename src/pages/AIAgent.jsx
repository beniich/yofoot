import React from 'react';
import { useNavigate } from 'react-router-dom';

const AIAgent = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col font-display bg-[#121212] text-white">
            <nav className="sticky top-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center p-4 justify-between max-w-lg mx-auto w-full">
                    <div className="flex items-center gap-3">
                        <span onClick={() => navigate(-1)} className="material-symbols-outlined text-white/60 cursor-pointer">arrow_back_ios</span>
                        <h2 className="text-lg font-bold tracking-tight text-white">Premium AI Agent</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                        <span className="material-symbols-outlined text-white/60">more_horiz</span>
                    </div>
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto px-4 py-2 max-w-lg mx-auto w-full space-y-6 pb-32">
                <div className="mt-2 container">
                    <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-sm">bolt</span>
                                <p className="text-white text-sm font-bold leading-tight">Daily Limit: 2/5 Predictions Left</p>
                            </div>
                            <p className="text-white/50 text-xs font-normal">Upgrade to Elite Gold for unlimited insights.</p>
                        </div>
                        <a onClick={() => navigate('/subscription')} className="text-xs font-bold leading-normal tracking-wide flex items-center gap-1 text-primary hover:underline cursor-pointer">
                            UPGRADE NOW
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="bg-charcoal-light border border-white/10 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] shadow-lg">
                        <p className="text-sm font-medium">Predict the result for PSG vs Marseille tonight in Ligue 1.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full border border-primary/20">
                            <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
                        </div>
                        <p className="text-white/50 text-[13px] font-medium">Gold AI Analyst</p>
                    </div>

                    <div className="flex flex-col items-stretch justify-start rounded-2xl overflow-hidden border border-white/10 bg-charcoal-light shadow-2xl">
                        <div className="relative w-full h-48 bg-center bg-no-repeat bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDGiyqlenaMYaHcBLQqJlrKDnxwRWDtUIP5vjDABkQEjOSEn0W0xKGSVmsKb6LVGN9oyZkqioexv20FPdeb4Lzlb5c_Fn6AZFmeCrkQnXVeJFxWoXnLnVXY70DNrw8efqvd5pD3PsNKPwrjla5Et86Nx0nc4q28lCjab7kBwcFy3tdGEEWD9q6QaZZab01AsoShOj2qXCteURowPjShSPskZWeyP8_4-x-1GN8TQtUE1IK5lpptt7V0eIaxMyRoZr-_3ANFjWZ3T3U")' }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                <div>
                                    <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">Match Prediction</p>
                                    <h3 className="text-white text-2xl font-bold leading-tight uppercase tracking-tight">PSG vs Marseille</h3>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-white text-xs font-bold">Ligue 1</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white/40 text-[10px] font-medium uppercase tracking-widest">Predicted Outcome</span>
                                    <p className="text-white text-xl font-bold">PSG to Win</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="bg-primary text-black text-[9px] font-black px-2 py-0.5 rounded italic">PREMIUM PICK</span>
                                        <span className="border border-primary/30 text-primary text-[10px] font-bold px-2 py-0.5 rounded">ODDS: 1.65</span>
                                    </div>
                                </div>
                                <div className="relative flex items-center justify-center size-20">
                                    <svg className="size-20 -rotate-90">
                                        <circle className="text-white/5" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeWidth="6"></circle>
                                        <circle className="text-primary" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" strokeDasharray="213.6" strokeDashoffset="32" strokeLinecap="round" strokeWidth="6"></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-lg font-bold leading-none text-white">85%</span>
                                        <span className="text-[8px] text-primary uppercase font-bold">Conf.</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-white/80 text-sm font-medium">AI Confidence Meter</p>
                                    <p className="text-primary text-sm font-bold">85%</p>
                                </div>
                                <div className="rounded-full bg-charcoal-accent h-2 w-full overflow-hidden">
                                    <div className="h-full rounded-full gold-gradient gold-glow" style={{ width: '85%' }}></div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-primary text-sm">insights</span>
                                    <p className="text-white text-sm font-bold">Why this result?</p>
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    PSG has won 80% of home games this season. Key attacker Mbappé is in peak form with 5 goals in 3 matches. Marseille has defensive vulnerabilities in away fixtures, conceding an average of 1.8 goals per game.
                                </p>
                            </div>

                            <button onClick={() => navigate('/stats')} className="w-full gold-gradient text-black py-3 rounded-xl font-extrabold text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg gold-glow">
                                View Detailed Data Breakdown
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-30">
                    <div className="size-1.5 bg-primary rounded-full animate-bounce"></div>
                    <div className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="size-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
            </main>

            <footer className="sticky bottom-0 bg-[#121212]/95 backdrop-blur-xl border-t border-white/5 p-4 pb-8">
                <div className="max-w-lg mx-auto w-full">
                    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                        <button className="whitespace-nowrap px-4 py-2 bg-charcoal-light rounded-full text-xs font-bold border border-white/10 text-white/70 hover:border-primary/50">Who wins tonight?</button>
                        <button className="whitespace-nowrap px-4 py-2 bg-charcoal-light rounded-full text-xs font-bold border border-white/10 text-white/70 hover:border-primary/50">Best value bets</button>
                        <button className="whitespace-nowrap px-4 py-2 bg-charcoal-light rounded-full text-xs font-bold border border-white/10 text-white/70 hover:border-primary/50">Injury updates</button>
                    </div>
                    <div className="relative flex items-center gap-2">
                        <div className="relative flex-1">
                            <input className="w-full bg-charcoal-light border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-1 focus:ring-primary/50 focus:border-primary text-white placeholder:text-white/30" placeholder="Ask about any match..." type="text" />
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">auto_awesome</span>
                        </div>
                        <button className="gold-gradient text-black size-12 flex items-center justify-center rounded-xl shadow-lg gold-glow active:scale-95 transition-transform">
                            <span className="material-symbols-outlined font-bold">send</span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AIAgent;
