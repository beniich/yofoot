import React from 'react';
import { useNavigate } from 'react-router-dom';

const Stats = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#121212] text-white min-h-screen pb-24 font-lexend">
            <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-gold/10">
                <div className="flex items-center justify-between px-4 h-16 max-w-md mx-auto">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-start">
                        <span className="material-symbols-outlined text-gold">arrow_back_ios</span>
                    </button>
                    <h1 className="text-[10px] font-black uppercase tracking-[0.2em] gold-text-shimmer">Premium Analysis</h1>
                    <button onClick={() => navigate('/subscription')} className="w-10 h-10 flex items-center justify-end">
                        <span className="material-symbols-outlined text-gold">workspace_premium</span>
                    </button>
                </div>
            </header>

            <main className="pt-20 px-4 max-w-md mx-auto space-y-6">
                <section className="relative overflow-hidden rounded-[2rem] bg-charcoal-muted p-6 border border-gold/20 shadow-2xl">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="px-3 py-1 rounded-full bg-gold text-charcoal-dark text-[10px] font-black tracking-tighter">LIVE 74'</span>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                        <div className="flex flex-col items-center gap-3 flex-1">
                            <div className="w-16 h-16 rounded-full bg-charcoal-accent flex items-center justify-center border-2 border-gold/30 p-2 shadow-lg">
                                <img alt="Team Home" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChS0Q2uTal2SS4MsixlV8jHf31jTZ62s5NdLDrpMBEFnaKRhBFcjVO7FWW_RBs1geM4-7Omgv8_8xj3kHZjZA29TZIeiz5y-bHjc9HO9XCCsy5LESQszEPORetWx-482fzteGp2M2zl2HStJY9beqi_fem1AvbkcLmU5jadY2FTIeWt9iKtnZ2YP_4Ln7ppZUCYbH8doMPo3fTI20S7dgOI_eZsJnbI9IIC8Nuj1XbGnpHFyRR_hxgKLFjsksQEzAAs_fK70m_0Ok" />
                            </div>
                            <span className="text-[11px] font-bold text-center text-slate-300">REAL MADRID</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 px-4">
                            <div className="text-4xl font-black tracking-tighter flex items-center gap-3">
                                <span className="gold-text-shimmer">2</span>
                                <span className="text-gold/30 font-light">:</span>
                                <span className="gold-text-shimmer">1</span>
                            </div>
                            <div className="h-px w-8 metallic-divider my-1"></div>
                            <span className="text-[9px] uppercase tracking-[0.15em] text-gold/60 font-bold">La Liga</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 flex-1">
                            <div className="w-16 h-16 rounded-full bg-charcoal-accent flex items-center justify-center border-2 border-gold/30 p-2 shadow-lg">
                                <img alt="Team Away" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfMZm3hlfb04aTVgrvJO3Q1696XJ47P0xW6Ouml7thrsqj85Oac_wDILlFWixD-bGipUADZSSvZl1uiepsNQKntQuH18vb4EUxKgIeDnIduwOD9_2r4DkMupYqClMmjqdqOvyyhzP5NQGze7aAqHwQybRHC4syUAo9-ozgwTUhQr6JI8Rn7TU_zGT8tPwGjgxyNN9TVDWfeU46_Q25M_VUz9GDEZ0iX8Sr4_wbJf644S1KK4UgXoIdP2e_izgW0_eGiWXG90sKqYQ" />
                            </div>
                            <span className="text-[11px] font-bold text-center text-slate-300">BARCELONA</span>
                        </div>
                    </div>
                </section>

                <section className="glass-card rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-gold text-xl">temp_preferences_custom</span>
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-gold/80">AI Confidence</h3>
                        </div>
                        <span className="text-gold font-black text-xl italic">88%</span>
                    </div>
                    <div className="relative h-2 bg-charcoal-accent rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold to-gold-light w-[88%] rounded-full gold-glow"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-3 font-medium uppercase tracking-tight">Optimized match engine processing high-fidelity metrics.</p>
                </section>

                <section className="glass-card rounded-2xl p-5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold/50 mb-6">Win Probability</h3>
                    <div className="flex h-16 gap-3 items-end mb-4">
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gold/10 border-t-2 border-gold rounded-t-lg h-[54%] flex flex-col justify-end items-center pb-2 transition-all">
                                <span className="text-xs font-black text-gold">54%</span>
                            </div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Home</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-white/5 border-t-2 border-white/20 rounded-t-lg h-[21%] flex flex-col justify-end items-center pb-2">
                                <span className="text-xs font-black text-slate-400">21%</span>
                            </div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Draw</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-gold/20 border-t-2 border-gold-light rounded-t-lg h-[25%] flex flex-col justify-end items-center pb-2">
                                <span className="text-xs font-black text-gold-light">25%</span>
                            </div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Away</span>
                        </div>
                    </div>
                </section>

                <section className="glass-card rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="material-symbols-outlined text-gold">star</span>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-gold/80">Player Predictions</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-charcoal-accent/50 rounded-2xl p-3 border border-gold/10">
                            <div className="flex flex-col items-center text-center mb-3">
                                <div className="relative mb-2">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold p-0.5">
                                        <img alt="Player 1" className="w-full h-full object-cover rounded-full bg-charcoal-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP5waGxRa9Lt6uMxERvQsJRJgiTtGIljNK_rKANsiBXo2T5TdanlEZ-4lX3lnDFcmJqbQLYswtxg8X-iX9hk49idtrhc5JTquUtn1NbtZL7JDsH4K9pEgLqXcTXwoW7fsU1mTB7Xe0i_l7dOCLTob5fRMMg7zu_S75xBHmKPyVYlDxW6F5zS7Z1MTTKGbsbjYMj1QcHgSzKsvFCS2AY3Yk_6R6JPVTr2566IlWB1xTtGKJ-kGk_o3LxXE-ZKqg8M2hmYkZtxKq3y0" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-gold text-charcoal-dark text-[8px] font-black px-1.5 py-0.5 rounded-full">RM</div>
                                </div>
                                <h4 className="text-[10px] font-bold text-white truncate w-full uppercase">Bellingham</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[8px] uppercase font-black text-slate-500">
                                        <span>xG Pred.</span>
                                        <span className="text-gold">0.42</span>
                                    </div>
                                    <div className="h-1 bg-charcoal-dark rounded-full overflow-hidden">
                                        <div className="h-full bg-gold w-[42%]"></div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[8px] uppercase font-black text-slate-500">
                                        <span>Pass Acc.</span>
                                        <span className="text-gold">92%</span>
                                    </div>
                                    <div className="h-1 bg-charcoal-dark rounded-full overflow-hidden">
                                        <div className="h-full bg-gold w-[92%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-charcoal-accent/50 rounded-2xl p-3 border border-gold/10">
                            <div className="flex flex-col items-center text-center mb-3">
                                <div className="relative mb-2">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold p-0.5">
                                        <img alt="Player 2" className="w-full h-full object-cover rounded-full bg-charcoal-dark" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIem7ymt8sn8LNneh31GBOvu3LTri1rWHFtd1Knd9Z_Pii3BNGDHTPUuddYvlcDBEmkDwRMbGaHxHgJIOPfSd7VflkqxRd-YRy5iz_6dK6Vx2v8vywwr3WjfSWmH29dyqWXP5O0CeaY9yuJyX9yyC4i8TCsbc0nA_ohCczcnvOBzRvKN2j5g6ql09YVgAQkcMN8CnNnOEYx_z6Wd5SQL842UOVUdl54eR95CF8CNx1in8ALcwxkr8ulq-t2s0b4i70T4LKYYQtzIE" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-gold text-charcoal-dark text-[8px] font-black px-1.5 py-0.5 rounded-full">BAR</div>
                                </div>
                                <h4 className="text-[10px] font-bold text-white truncate w-full uppercase">Lewandowski</h4>
                            </div>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[8px] uppercase font-black text-slate-500">
                                        <span>xG Pred.</span>
                                        <span className="text-gold">0.68</span>
                                    </div>
                                    <div className="h-1 bg-charcoal-dark rounded-full overflow-hidden">
                                        <div className="h-full bg-gold w-[68%]"></div>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[8px] uppercase font-black text-slate-500">
                                        <span>Intercept</span>
                                        <span className="text-gold">2.1</span>
                                    </div>
                                    <div className="h-1 bg-charcoal-dark rounded-full overflow-hidden">
                                        <div className="h-full bg-gold w-[45%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="glass-card rounded-2xl p-5">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold/50 mb-4">Predictive Heatmap (Next 15')</h3>
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden pitch-lines heatmap-gold-gradient">
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                            <div className="w-24 h-24 border border-gold rounded-full"></div>
                            <div className="absolute left-0 h-2/3 w-12 border-y border-r border-gold"></div>
                            <div className="absolute right-0 h-2/3 w-12 border-y border-l border-gold"></div>
                            <div className="absolute inset-y-0 left-1/2 w-px bg-gold"></div>
                        </div>
                        <div className="absolute right-10 top-1/4 w-16 h-16 bg-gold/30 blur-xl rounded-full"></div>
                        <div className="absolute left-1/4 bottom-1/3 w-20 h-20 bg-gold-light/20 blur-2xl rounded-full"></div>
                        <div className="absolute right-1/3 bottom-1/4 w-12 h-12 bg-gold/10 blur-lg rounded-full"></div>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-[9px] text-slate-500 font-black uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-gold"></div>
                            <span>Attack Zone</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-charcoal-accent border border-gold/30"></div>
                            <span>Defensive Density</span>
                        </div>
                    </div>
                </section>

                <section className="glass-card rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5">
                        <span className="material-symbols-outlined text-[100px] text-gold">analytics</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-gold">insights</span>
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-gold/80">Premium Insights</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-charcoal-accent/30 p-3 rounded-xl border-l-2 border-gold">
                            <p className="text-[11px] leading-relaxed text-slate-300">
                                <span className="text-gold font-black">Strategic Pivot:</span> Transitioning to a high-block press. Bellingham's positioning is 12% higher than the seasonal average.
                            </p>
                        </div>
                        <div className="bg-charcoal-accent/30 p-3 rounded-xl border-l-2 border-gold/40">
                            <p className="text-[11px] leading-relaxed text-slate-300">
                                <span className="text-gold/70 font-black">Performance Alert:</span> Defensive lines are compressing. Expected goal probability from set pieces has increased to 0.35.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <nav className="fixed bottom-0 inset-x-0 z-[60] bg-charcoal-dark/95 backdrop-blur-2xl border-t border-gold/10 px-6 pb-8 pt-3">
                <div className="max-w-md mx-auto flex justify-between items-center">
                    <button onClick={() => navigate('/stats')} className="flex flex-col items-center gap-1 text-slate-500">
                        <span className="material-symbols-outlined text-2xl">sports_soccer</span>
                        <span className="text-[9px] font-black uppercase tracking-tighter">Matches</span>
                    </button>
                    <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-gold">
                        <span className="material-symbols-outlined text-2xl material-symbols-filled">auto_awesome</span>
                        <span className="text-[9px] font-black uppercase tracking-tighter">Gold Hub</span>
                    </button>
                    <button onClick={() => navigate('/stats')} className="flex flex-col items-center gap-1 text-slate-500">
                        <span className="material-symbols-outlined text-2xl">leaderboard</span>
                        <span className="text-[9px] font-black uppercase tracking-tighter">Stats</span>
                    </button>
                    <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-slate-500">
                        <span className="material-symbols-outlined text-2xl">account_circle</span>
                        <span className="text-[9px] font-black uppercase tracking-tighter">VIP</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Stats;
