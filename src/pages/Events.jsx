import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import Button, { Card, Badge, Input, EmptyState } from '../components/UI';
import { getEvents, getEventStats } from '../services/events';

const Events = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({ total: 0, attendees: 0, free: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [eventsData, statsData] = await Promise.all([
                getEvents(),
                getEventStats()
            ]);

            // Adapt service data structure to UI if needed
            const adaptedEvents = eventsData.map(e => ({
                ...e,
                coverImage: e.image,
                startDate: `${e.date}T${e.time}:00`,
                status: 'UPCOMING' // Default as not in service mock yet
            }));

            setEvents(adaptedEvents);
            setStats(statsData);
            setLoading(false);
        };
        fetchData();
    }, []);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchQuery.toLowerCase());
        // removed city check as it might not be in mock service

        if (selectedFilter === 'all') return matchesSearch;
        return matchesSearch && event.category.toLowerCase() === selectedFilter;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCategoryColor = (category) => {
        const colors = {
            MATCH: 'bg-red-500/20 text-red-400 border-red-500/30',
            TOURNAMENT: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            TRAINING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            SOCIAL: 'bg-green-500/20 text-green-400 border-green-500/30'
        };
        return colors[category] || colors.MATCH;
    };

    return (
        <div className="min-h-screen bg-charcoal text-white pb-20">
            <Header />

            {/* Page Header */}
            <div className="sticky top-[73px] z-40 bg-charcoal/95 backdrop-blur-xl border-b border-white/5 px-4 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold gold-text-gradient">Events</h1>
                        <p className="text-sm text-white/60 mt-1">Discover upcoming matches & activities</p>
                    </div>
                    <button className="flex items-center justify-center rounded-full h-12 w-12 bg-gradient-to-br from-gold to-gold-light text-charcoal shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all hover:scale-105 active:scale-95">
                        <span className="material-symbols-outlined font-bold text-2xl">add</span>
                    </button>
                </div>
            </div>

            <main className="px-4 pb-4">
                {/* Search Bar */}
                <div className="py-4">
                    <Input
                        icon="search"
                        placeholder="Search events, venues..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {[
                        { id: 'all', label: 'All Events', icon: 'calendar_month' },
                        { id: 'match', label: 'Matches', icon: 'sports_soccer' },
                        { id: 'tournament', label: 'Tournaments', icon: 'emoji_events' },
                        { id: 'training', label: 'Training', icon: 'fitness_center' },
                        { id: 'social', label: 'Social', icon: 'groups' }
                    ].map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setSelectedFilter(filter.id)}
                            className={`flex h-9 shrink-0 items-center justify-center gap-2 rounded-full px-4 transition-all ${selectedFilter === filter.id
                                ? 'bg-gradient-to-r from-gold to-gold-light text-charcoal font-bold shadow-lg shadow-gold/20'
                                : 'bg-surface-dark border border-white/10 text-white/70 hover:bg-surface-dark/80 hover:border-white/20'
                                }`}
                        >
                            <span className="material-symbols-outlined text-sm">{filter.icon}</span>
                            <span className="text-sm font-medium">{filter.label}</span>
                        </button>
                    ))}
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <Card variant="glass" className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold gold-text-gradient">
                                {loading ? '-' : stats.total}
                            </p>
                            <p className="text-xs text-white/60 mt-1">Total Events</p>
                        </div>
                    </Card>
                    <Card variant="glass" className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-400">
                                {loading ? '-' : stats.attendees}
                            </p>
                            <p className="text-xs text-white/60 mt-1">Attendees</p>
                        </div>
                    </Card>
                    <Card variant="glass" className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-400">
                                {loading ? '-' : stats.free}
                            </p>
                            <p className="text-xs text-white/60 mt-1">Free Events</p>
                        </div>
                    </Card>
                </div>

                {/* Events Grid */}
                <div className="flex flex-col gap-6">
                    {loading ? (
                        <div className="space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <Card
                                key={event.id}
                                variant="glass"
                                className="overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-gold/10 transition-all hover:scale-[1.02]"
                            >
                                {/* Event Image */}
                                <div className="relative h-48">
                                    <img
                                        src={event.coverImage}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

                                    {/* Category Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                                            {event.category}
                                        </span>
                                    </div>

                                    {/* Event Info Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-300">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-gold text-base">
                                                    calendar_month
                                                </span>
                                                {formatDate(event.startDate)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-gold text-base">
                                                    location_on
                                                </span>
                                                {event.venue}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="p-5 border-t border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-white/60">
                                                group
                                            </span>
                                            <span className="text-sm text-white/80">
                                                {event.attendees} / {event.capacity} attending
                                            </span>
                                        </div>
                                        <span className="text-2xl font-bold gold-text-gradient">
                                            {event.price === 0 ? 'FREE' : `$${event.price}`}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
                                                style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <Button variant="primary" className="flex-1">
                                            <span className="material-symbols-outlined text-lg">
                                                confirmation_number
                                            </span>
                                            Get Ticket
                                        </Button>
                                        <button className="flex items-center justify-center h-11 w-11 rounded-xl border-2 border-white/10 hover:border-gold/50 transition-colors">
                                            <span className="material-symbols-outlined text-white/60">
                                                share
                                            </span>
                                        </button>
                                        <button className="flex items-center justify-center h-11 w-11 rounded-xl border-2 border-white/10 hover:border-gold/50 transition-colors">
                                            <span className="material-symbols-outlined text-white/60">
                                                favorite_border
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <EmptyState
                            icon="event_busy"
                            title="No events found"
                            description="Try adjusting your search or filters"
                            action={
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedFilter('all');
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            }
                        />
                    )}
                </div>
            </main>

            <BottomNavigation />
        </div>
    );
};

export default Events;
