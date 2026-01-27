import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BetSlip = () => {
    const navigate = useNavigate();
    const [stake, setStake] = useState('100');

    return (
        <div className="bg-charcoal font-display text-white selection:bg-gold/30 min-h-screen flex flex-col items-center">
            <div className="relative flex min-h-screen w-full max-w-[480px] mx-auto flex-col bg-charcoal overflow-x-hidden border-x border-white/5">
                <div className="flex items-center bg-charcoal p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gold/20">
                    <div className="text-white flex size-12 shrink-0 items-center">
                        <span onClick={() => navigate(-1)} className="material-symbols-outlined cursor-pointer hover:text-gold transition-colors">arrow_back_ios</span>
                    </div>
                    <h2 className="text-gold text-lg font-bold leading-tight tracking-widest uppercase flex-1 text-center">Bet Slip</h2>
                    <div className="flex w-12 items-center justify-end">
                        <button className="flex cursor-pointer items-center justify-center rounded-lg h-12 bg-transparent text-white/50 hover:text-red-500 transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 px-4 py-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-4 rounded-xl bg-charcoal-light border border-white/10 p-4 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-gold text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border border-gold/30 bg-gold/10">European Cup</span>
                                    <span className="text-white/40 text-xs font-normal">Today, 21:00</span>
                                </div>
                                <p className="text-white text-lg font-bold leading-tight mt-1">Real Madrid vs Barcelona</p>
                            </div>
                            <div className="w-16 h-16 bg-center bg-no-repeat bg-contain rounded-lg flex-shrink-0 grayscale opacity-80" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC3vMLTxEFKU4_6but7K5Xbwap7dFzcVwl6jV3zPNJdL2DMLiLthFr3S0QWYqw44ROiRrDCht_UAwTaDh0LzLgaeMYYMkVdVq0hIBqJeIQtgp8MLe7pP9aDPNxHNP3NCINgjX0sAMEj5iqp4rdlISaO7B43vSczLbyjhEuFXUrACdehqc0FCvvK_jswOAyFc_M66Oi850uUowt92LhjVJNf1YG0x1lcNur2XmCaPlxjK8zKR1YXtbw_IsZmKwkUVyplx_M7LFPHzAo")' }}></div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gold/5 border border-gold/20">
                            <div className="flex flex-col">
                                <p className="text-gold/70 text-[10px] font-bold uppercase tracking-wider">Selection</p>
                                <p className="text-white text-sm font-semibold">Real Madrid to win</p>
                            </div>
                            <div className="flex items-center gap-1 text-gold">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span className="text-lg font-bold">2.10</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-end px-1">
                                <p className="text-white/80 text-sm font-medium">Set Stake</p>
                                <p className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">Max: $5,000</p>
                            </div>
                            <div className="flex w-full items-stretch rounded-xl overflow-hidden border-2 border-gold/40 bg-charcoal-light focus-within:border-gold transition-all duration-300">
                                <input
                                    className="flex w-full min-w-0 flex-1 border-0 bg-transparent h-14 placeholder:text-white/10 px-4 text-gold text-2xl font-bold focus:ring-0 focus:outline-none"
                                    placeholder="0.00"
                                    type="number"
                                    value={stake}
                                    onChange={(e) => setStake(e.target.value)}
                                />
                                <div className="text-gold flex items-center justify-center pr-4">
                                    <span className="material-symbols-outlined">attach_money</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <button className="flex-1 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:border-gold/50 active:scale-95 transition-all group">
                                <p className="text-white/60 group-hover:text-gold text-sm font-semibold">+10</p>
                            </button>
                            <button className="flex-1 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:border-gold/50 active:scale-95 transition-all group">
                                <p className="text-white/60 group-hover:text-gold text-sm font-semibold">+20</p>
                            </button>
                            <button className="flex-1 h-10 flex items-center justify-center rounded-lg bg-gold/10 border border-gold active:scale-95 transition-all">
                                <p className="text-gold text-sm font-bold">+50</p>
                            </button>
                            <button className="flex-1 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:border-gold/50 active:scale-95 transition-all group">
                                <p className="text-white/60 group-hover:text-gold text-sm font-semibold">Max</p>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 rounded-xl p-6 bg-gold/5 border-2 border-gold items-center justify-center text-center shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
                            <p className="text-gold/60 text-xs font-bold uppercase tracking-[0.2em]">Potential Return</p>
                            <p className="text-gold tracking-tight text-4xl font-bold leading-tight drop-shadow-sm">${(parseFloat(stake || 0) * 2.10).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 px-1">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-white/90 text-sm font-medium">Accept Odds Changes</p>
                                <p className="text-white/30 text-xs">Automatically accept if odds increase</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input defaultChecked className="sr-only peer" type="checkbox" />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-charcoal after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                            </label>
                        </div>
                        <div className="h-[1px] bg-white/5 my-1"></div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-gold/50 text-sm">account_balance_wallet</span>
                                <p className="text-white/50 text-sm">Current Balance</p>
                            </div>
                            <p className="text-white text-sm font-bold">$1,240.50</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-white/40 text-sm">Balance After Bet</p>
                            <p className="text-gold/50 text-sm font-medium">$1,140.50</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-charcoal/95 backdrop-blur-xl border-t border-gold/20 sticky bottom-0">
                    <button onClick={() => navigate('/bet-confirmation')} className="w-full gold-metallic flex-1 bg-gold text-charcoal h-14 rounded-xl font-black text-lg flex items-center justify-center gap-2 uppercase tracking-widest active:scale-[0.98] transition-all hover:brightness-110">
                        <span>Place Bet</span>
                        <span className="material-symbols-outlined font-bold">bolt</span>
                    </button>
                    <div className="h-6"></div>
                </div>
            </div>
        </div>
    );
};

export default BetSlip;
