import React, { useState } from 'react';
import { Play, Share2, Heart, Eye } from 'lucide-react';
import { hapticFeedback } from '../utils/haptics';

export const VideoPlayer = ({
    video,
    onLike,
    onShare,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);

    if (!video) return null;

    const getEmbedUrl = () => {
        switch (video.provider) {
            case 'youtube':
                return `https://www.youtube.com/embed/${video.providerId}?autoplay=1`;
            case 'dailymotion':
                return `https://www.dailymotion.com/embed/video/${video.providerId}?autoplay=1`;
            default:
                return video.url;
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePlay = () => {
        hapticFeedback.medium();
        setIsPlaying(true);
    };

    const handleLike = (e) => {
        e.stopPropagation();
        hapticFeedback.light();
        onLike?.();
    };

    const handleShare = (e) => {
        e.stopPropagation();
        hapticFeedback.light();
        onShare?.();
    };

    return (
        <div className="relative w-full rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            {/* Video Player or Thumbnail */}
            {isPlaying ? (
                <div className="relative w-full aspect-video">
                    <iframe
                        src={getEmbedUrl()}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title}
                    />
                </div>
            ) : (
                <div className="relative w-full aspect-video cursor-pointer" onClick={handlePlay}>
                    {/* Thumbnail */}
                    <img
                        src={video.thumbnail || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800'}
                        alt={video.title}
                        className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group hover:bg-black/20 transition-all duration-500">
                        {/* Play Button */}
                        <div className="w-20 h-20 rounded-full bg-gold/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-gold transition-all duration-300 shadow-2xl">
                            <Play size={40} className="text-black ml-1" fill="currentColor" />
                        </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-xl border border-white/10">
                        <span className="text-xs font-bold text-white">
                            {formatDuration(video.duration)}
                        </span>
                    </div>

                    {/* Match Score Label */}
                    {video.match && (
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-xl border border-white/10">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                                Highlights: {video.match.homeTeam} vs {video.match.awayTeam}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Video Info */}
            <div className="p-5 bg-gradient-to-br from-charcoal to-black">
                <h3 className="text-lg font-black text-white mb-4 line-clamp-2">
                    {video.title}
                </h3>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <Eye size={16} className="text-gold" />
                            <span>{video.views?.toLocaleString() || 0}</span>
                        </div>
                        <span>•</span>
                        <span>{video.type || 'Highlight'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95 border border-white/10"
                        >
                            <Heart size={18} className="text-red-500" fill={video.isLiked ? "currentColor" : "none"} />
                            <span className="text-sm font-bold text-white">
                                {video.likes || 0}
                            </span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all active:scale-95 border border-white/10"
                        >
                            <Share2 size={18} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
