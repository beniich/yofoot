import React from 'react';
import { useNavigate } from 'react-router-dom';

const BetConfirmation = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#f5f8f5] dark:bg-[#102210] font-display text-white transition-colors duration-300 min-h-screen">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden confetti-gradient">
                {/* Top Navigation */}
                <div className="flex items-center p-4 justify-between">
                    <div className="text-white flex size-12 shrink-0 items-center cursor-pointer" onClick={() => navigate('/')}>
                        <span className="material-symbols-outlined text-3xl">close</span>
                    </div>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12 uppercase tracking-widest">Confirmation</h2>
                </div>

                {/* Success Header & Animated Icon Area */}
                <div className="flex flex-col items-center justify-center pt-8 pb-4">
                    <div className="relative flex items-center justify-center mb-6">
                        {/* Large Checkmark Circle */}
                        <div className="size-24 rounded-full bg-success/20 flex items-center justify-center border-2 border-success">
                            <span className="material-symbols-outlined text-success text-6xl font-bold">check</span>
                        </div>
                        {/* Subtle Glow */}
                        <div className="absolute size-32 bg-success/10 rounded-full blur-xl -z-10"></div>
                    </div>
                    <h1 className="text-white tracking-tight text-[36px] font-extrabold leading-tight px-4 text-center">Success!</h1>
                    <p className="text-success/80 text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">Your bet has been placed successfully!</p>
                </div>

                {/* Bet Summary Card */}
                <div className="px-4 py-2 container">
                    <div className="flex flex-col items-stretch justify-start rounded-xl shadow-2xl bg-[#183418] border border-white/5 overflow-hidden">
                        {/* Match Visual/Header */}
                        <div className="w-full h-32 bg-center bg-no-repeat bg-cover relative flex items-end p-4" style={{ backgroundImage: 'linear-gradient(0deg, #183418 0%, transparent 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuA7UZu77vkfA92olD4QuecX8ZtyMKU1FluvzBeYEgh9J5Xh5V4frtLoYS9314skqb-0TVj2dVnvmIZ_uIiyMm92JfElseLPyCjVrpFaaGvFxMIzch02CfVml25xi-uVcdxwmz7EGPmaKy1rutb1OLxMhbi06cRPbaO9JYLYJHd8MputogV4xmEGjoO6Pecb6H30k31Pgt3LWph9bTejE1nolOxNhgMkQ1e3N3FYxTBbzsipAKkIMcQW8tk2SuT6Mf-qtLN4a3kVF6E")' }}>
                            <div className="flex flex-col">
                                <span className="text-success text-xs font-bold tracking-widest uppercase">Football Hub AI Prediction</span>
                                <h3 className="text-white text-xl font-bold">Real Madrid vs. Barcelona</h3>
                            </div>
                        </div>

                        <div className="flex w-full flex-col items-stretch justify-center gap-4 p-5">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <p className="text-success/60 text-xs font-medium uppercase tracking-tighter">Your Pick</p>
                                    <p className="text-white text-2xl font-bold leading-tight">Real Madrid Win</p>
                                </div>
                                <div className="bg-success/10 border border-success/20 rounded-lg px-3 py-1 text-center">
                                    <p className="text-success/60 text-[10px] font-bold uppercase">Odds</p>
                                    <p className="text-success text-lg font-extrabold">2.10</p>
                                </div>
                            </div>
                            <div className="h-px bg-white/10 w-full"></div>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <p className="text-white/60 text-sm">Total Stake</p>
                                    <p className="text-white text-xl font-bold">$100.00</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-success/60 text-sm font-medium">Potential Payout</p>
                                    <div className="bg-success text-background-dark px-4 py-2 rounded-lg font-black text-xl shadow-[0_0_15px_rgba(13,242,13,0.4)] text-[#102210]">
                                        $210.00
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Engagement Section */}
                <div className="px-4 py-6 mt-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col items-center">
                        <p className="text-white text-sm font-medium mb-4">Share this pick with the community</p>
                        <div className="flex gap-6">
                            {/* Hub Chat */}
                            <button className="flex flex-col items-center gap-2 group">
                                <div className="size-12 rounded-full bg-success flex items-center justify-center text-background-dark group-active:scale-95 transition-transform text-[#102210]">
                                    <span className="material-symbols-outlined material-symbols-filled">forum</span>
                                </div>
                                <span className="text-[10px] text-white/60 uppercase font-bold">Hub Chat</span>
                            </button>
                            {/* WhatsApp */}
                            <button className="flex flex-col items-center gap-2 group">
                                <div className="size-12 rounded-full bg-[#25D366] flex items-center justify-center text-white group-active:scale-95 transition-transform">
                                    <span className="material-symbols-outlined">send</span>
                                </div>
                                <span className="text-[10px] text-white/60 uppercase font-bold">WhatsApp</span>
                            </button>
                            {/* Twitter/X */}
                            <button className="flex flex-col items-center gap-2 group">
                                <div className="size-12 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 group-active:scale-95 transition-transform">
                                    <span className="material-symbols-outlined">share</span>
                                </div>
                                <span className="text-[10px] text-white/60 uppercase font-bold">Twitter</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Spacer for content */}
                <div className="flex-grow"></div>

                {/* Bottom Actions */}
                <div className="p-6 flex flex-col gap-3 pb-10">
                    <button onClick={() => navigate('/stats')} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-4 bg-success text-background-dark text-lg font-bold leading-normal shadow-[0_4px_20px_rgba(13,242,13,0.3)] hover:brightness-110 active:scale-[0.98] transition-all text-[#102210]">
                        <span className="truncate">Back to Matches</span>
                    </button>
                    <button onClick={() => navigate('/profile')} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-4 bg-white/5 text-white text-lg font-semibold leading-normal border border-white/10 hover:bg-white/10 active:scale-[0.98] transition-all">
                        <span className="truncate">Go to My Bets</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BetConfirmation;
