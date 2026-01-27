import React from 'react';

const PredictionCard = ({ prediction }) => {
    return (
        <div className="w-full glass-card rounded-2xl p-6 relative overflow-hidden border-gold/30">
            <div className="absolute top-0 right-0 px-3 py-1 bg-gold text-charcoal text-[9px] font-black uppercase tracking-wider rounded-bl-xl">
                Premium Insight
            </div>

            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-1">
                        AI Prediction
                    </h3>
                    <p className="text-xl font-display font-medium text-white leading-tight max-w-[70%]">
                        {prediction.prediction}
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="relative size-14 mb-1">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                className="text-white/10"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="transparent"
                                r="24"
                                cx="28"
                                cy="28"
                            />
                            <circle
                                className="text-gold"
                                strokeWidth="3"
                                strokeDasharray={24 * 2 * Math.PI}
                                strokeDashoffset={24 * 2 * Math.PI * (1 - prediction.confidence / 100)}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="24"
                                cx="28"
                                cy="28"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{prediction.confidence}%</span>
                        </div>
                    </div>
                    <span className="text-[9px] font-bold text-gold uppercase tracking-widest">Confidence</span>
                </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-gold text-sm">psychology</span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Reasoning</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                    {prediction.reasoning}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40 uppercase font-bold">Odds</span>
                    <span className="text-lg font-display font-bold text-gold">{prediction.odds}</span>
                </div>
                <div className="flex gap-2">
                    <button className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-sm">share</span>
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-gold text-charcoal text-xs font-bold uppercase tracking-wide hover:bg-gold-light transition-colors">
                        Analyze
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PredictionCard;
