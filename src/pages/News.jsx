import React, { useState, useEffect } from 'react';
import { newsService } from '../services/news';
import { NewsCard } from '../components/news/NewsCard';

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await newsService.getAll({ limit: 12 });
                setArticles(data.articles || []);
            } catch (err) {
                setError('Failed to load news');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="min-h-screen bg-charcoal p-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-serif italic font-black text-white mb-2">
                        Football <span className="text-gold">Daily</span>
                    </h1>
                    <p className="text-white/50 text-xs font-bold uppercase tracking-[0.2em]">Latest Headlines & Transfer News</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article, index) => (
                            <NewsCard
                                key={article._id}
                                article={article}
                                variant={index === 0 ? 'featured' : 'default'}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
