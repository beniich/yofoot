import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, Search } from 'lucide-react';
import { NewsCard } from '../components/news/NewsCard';
import { SafeArea } from '../components/SafeArea';
import { hapticFeedback } from '../utils/haptics';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../config/api';

export default function News() {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [featuredArticles, setFeaturedArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const categories = [
        { value: 'all', label: 'Tout', icon: '📰' },
        { value: 'Match', label: 'Matchs', icon: '⚽' },
        { value: 'Transfer', label: 'Transferts', icon: '🔄' },
        { value: 'Injury', label: 'Blessures', icon: '🏥' },
        { value: 'Interview', label: 'Interviews', icon: '🎤' },
        { value: 'General', label: 'Général', icon: '📢' },
    ];

    // Fetch featured articles
    useEffect(() => {
        fetchFeaturedArticles();
    }, []);

    // Fetch articles
    useEffect(() => {
        fetchArticles();
    }, [selectedCategory, page]);

    const fetchFeaturedArticles = async () => {
        try {
            const response = await axios.get(`${getApiUrl()}/news/featured`);
            setFeaturedArticles(response.data || []);
        } catch (error) {
            console.error('Error fetching featured articles:', error);
        }
    };

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 10 };

            if (selectedCategory !== 'all') {
                params.category = selectedCategory;
            }

            if (searchQuery) {
                params.search = searchQuery;
            }

            const response = await axios.get(`${getApiUrl()}/news`, { params });
            const data = response.data;

            if (page === 1) {
                setArticles(data.articles || []);
            } else {
                setArticles((prev) => [...prev, ...(data.articles || [])]);
            }

            setHasMore(data.currentPage < data.totalPages);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        hapticFeedback.selection();
        setSelectedCategory(category);
        setPage(1);
        setArticles([]);
    };

    const handleArticleClick = (articleId) => {
        hapticFeedback.light();
        navigate(`/news/${articleId}`);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <SafeArea className="min-h-screen bg-charcoal pb-20">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-charcoal/95 backdrop-blur-xl border-b border-white/10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Actualités</h1>
                            <p className="text-sm text-gray-400 mt-1">
                                Les dernières news du football
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gold/20 border border-gold/30 rounded-full">
                            <TrendingUp size={16} className="text-gold" />
                            <span className="text-xs font-bold text-gold">Hot</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher une actualité..."
                            className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                        />
                    </div>

                    {/* Category Pills */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-4 pb-2">
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => handleCategoryChange(category.value)}
                                className={`flex-shrink-0 flex items-center gap-2 h-10 px-4 rounded-full font-medium transition-all ${selectedCategory === category.value
                                        ? 'bg-gold text-charcoal-dark'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <span>{category.icon}</span>
                                <span className="text-sm">{category.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="px-6 py-6">
                {/* Featured Section */}
                {featuredArticles.length > 0 && selectedCategory === 'all' && !searchQuery && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-gold" />
                            À la Une
                        </h2>
                        <div className="space-y-4">
                            {featuredArticles.slice(0, 2).map((article) => (
                                <NewsCard
                                    key={article._id}
                                    article={article}
                                    variant="featured"
                                    onClick={() => handleArticleClick(article._id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Articles Grid */}
                <div>
                    {selectedCategory !== 'all' && (
                        <h2 className="text-xl font-bold text-white mb-4">
                            {categories.find((c) => c.value === selectedCategory)?.label}
                        </h2>
                    )}

                    {loading && page === 1 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-64 bg-white/5 rounded-2xl animate-pulse"
                                />
                            ))}
                        </div>
                    ) : articles.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-4">
                                {articles.map((article) => (
                                    <NewsCard
                                        key={article._id}
                                        article={article}
                                        onClick={() => handleArticleClick(article._id)}
                                    />
                                ))}
                            </div>

                            {/* Load More */}
                            {hasMore && (
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="w-full mt-6 h-12 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Chargement...' : 'Charger plus'}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Newspaper size={32} className="text-gray-600" />
                            </div>
                            <p className="text-gray-400 text-center">
                                Aucune actualité trouvée
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </SafeArea>
    );
}
