import React from 'react';

export const NewsCard = ({ article, variant = 'default', onClick }) => {
    const isFeatured = variant === 'featured';

    const formatTime = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    return (
        <div
            onClick={onClick}
            className={`group relative overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/10 cursor-pointer hover:border-gold/30 transition-all active:scale-[0.98] ${isFeatured ? 'md:col-span-2' : ''
                }`}
        >
            <div className={`relative overflow-hidden ${isFeatured ? 'h-64' : 'h-48'}`}>
                {article.image ? (
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                        <span className="text-6xl opacity-20">📰</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-gold text-charcoal-dark text-[10px] font-black rounded-full uppercase tracking-tighter">
                        {article.category}
                    </span>
                </div>

                {article.league && (
                    <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/20">
                        {article.league.logo && (
                            <img
                                src={article.league.logo}
                                alt={article.league.name}
                                className="w-4 h-4 object-contain"
                            />
                        )}
                        <span className="text-[10px] text-white font-bold uppercase">
                            {article.league.name}
                        </span>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className={`font-bold text-white mb-2 line-clamp-2 group-hover:text-gold transition-colors ${isFeatured ? 'text-2xl' : 'text-lg'
                        }`}>
                        {article.title}
                    </h3>

                    {isFeatured && article.description && (
                        <p className="text-sm text-white/70 line-clamp-2 mb-3 font-medium">
                            {article.description}
                        </p>
                    )}

                    <div className="flex items-center gap-4 text-[10px] text-white/50 font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span>{formatTime(article.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            <span>{article.viewCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">favorite</span>
                            <span>{article.likeCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
