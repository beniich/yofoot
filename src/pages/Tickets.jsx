import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import Button, { Card, Badge, Modal, EmptyState } from '../components/UI';
import { ticketService } from '../services/tickets';

const Tickets = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const data = await ticketService.getAll();
                const ticketList = Array.isArray(data) ? data : (data.tickets || []);

                // Adapt flat service data to nested event structure used by UI
                const adaptedTickets = ticketList.map(t => ({
                    id: t.id || t._id,
                    ticketNumber: t.ticketNumber,
                    ticketType: t.type || t.ticketType || 'STANDARD',
                    qrCode: t.qrCode || 'QR_CODE_DATA',
                    isValidated: t.isValidated,
                    purchaseDate: t.createdAt || '2024-09-01',
                    event: t.event && typeof t.event === 'object' ? {
                        id: t.event._id || t.event.id,
                        title: t.event.title,
                        category: t.event.category || 'MATCH',
                        coverImage: t.event.coverImage || t.image,
                        startDate: t.event.startDate,
                        venue: t.event.venue,
                        city: t.event.address?.city || 'Unknown',
                        price: t.event.ticketPrice,
                        status: t.status === 'upcoming' || t.status === 'Valid' ? 'UPCOMING' : 'ENDED',
                        section: t.seating?.section || 'General',
                        row: t.seating?.row || '-',
                        seat: t.seating?.seat || '-'
                    } : {
                        id: t.eventId,
                        title: t.eventName || 'Event Details Loading...',
                        category: 'MATCH',
                        coverImage: t.image,
                        startDate: `${t.date}T${t.time}:00`,
                        venue: t.venue,
                        city: t.location ? t.location.split(',')[0] : 'Unknown',
                        status: t.status === 'upcoming' ? 'UPCOMING' : 'ENDED',
                        section: t.section || 'General',
                        row: t.row || '-',
                        seat: t.seat || '-'
                    }
                }));

                setTickets(adaptedTickets);
            } catch (err) {
                console.error("Failed to load tickets", err);
                setTickets([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const upcomingTickets = tickets.filter(t => t.event.status === 'UPCOMING');
    const pastTickets = tickets.filter(t => t.event.status === 'ENDED');
    const displayTickets = activeTab === 'upcoming' ? upcomingTickets : pastTickets;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTicketTypeColor = (type) => {
        const colors = {
            VIP: 'from-purple-500 to-purple-600',
            ELITE: 'from-gold to-gold-light',
            STANDARD: 'from-blue-500 to-blue-600',
            'EARLY_BIRD': 'from-green-500 to-green-600'
        };
        return colors[type] || colors.STANDARD;
    };

    const downloadTicket = (ticket) => {
        // Simulate download
        console.log('Downloading ticket:', ticket.ticketNumber);
        alert(`Ticket ${ticket.ticketNumber} downloaded!`);
    };

    const shareTicket = (ticket) => {
        // Simulate share
        console.log('Sharing ticket:', ticket.ticketNumber);
        if (navigator.share) {
            navigator.share({
                title: ticket.event.title,
                text: `Check out my ticket for ${ticket.event.title}!`,
                url: window.location.href
            });
        } else {
            alert('Share functionality not available');
        }
    };

    return (
        <div className="min-h-screen bg-charcoal text-white pb-20">
            <Header />

            {/* Page Header */}
            <div className="sticky top-[73px] z-40 bg-charcoal/95 backdrop-blur-xl border-b border-white/5 px-4 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold gold-text-gradient">My Tickets</h1>
                        <p className="text-sm text-white/60 mt-1">
                            {loading ? 'Loading tickets...' : `${upcomingTickets.length} upcoming • ${pastTickets.length} past`}
                        </p>
                    </div>
                    <Link to="/scanner" className="flex items-center justify-center rounded-full h-12 w-12 bg-gradient-to-br from-gold to-gold-light text-charcoal shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all hover:scale-105 active:scale-95">
                        <span className="material-symbols-outlined font-bold text-2xl">qr_code_scanner</span>
                    </Link>
                </div>
            </div>

            <main className="px-4 pb-4">
                {/* Tabs */}
                <div className="flex gap-2 py-4">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`flex-1 h-11 rounded-xl font-bold transition-all ${activeTab === 'upcoming'
                            ? 'bg-gradient-to-r from-gold to-gold-light text-charcoal shadow-lg shadow-gold/20'
                            : 'bg-surface-dark border border-white/10 text-white/70 hover:bg-surface-dark/80'
                            }`}
                    >
                        Upcoming ({upcomingTickets.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`flex-1 h-11 rounded-xl font-bold transition-all ${activeTab === 'past'
                            ? 'bg-gradient-to-r from-gold to-gold-light text-charcoal shadow-lg shadow-gold/20'
                            : 'bg-surface-dark border border-white/10 text-white/70 hover:bg-surface-dark/80'
                            }`}
                    >
                        Past ({pastTickets.length})
                    </button>
                </div>

                {/* Tickets List */}
                <div className="flex flex-col gap-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="h-40 rounded-xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : displayTickets.length > 0 ? (
                        displayTickets.map((ticket) => (
                            <Card key={ticket.id} variant="glass" className="overflow-hidden">
                                {/* Ticket Header Gradient */}
                                <div className={`h-2 bg-gradient-to-r ${getTicketTypeColor(ticket.ticketType)}`} />

                                {/* Ticket Content */}
                                <div className="p-5">
                                    {/* Event Image & Info */}
                                    <div className="flex gap-4 mb-4">
                                        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                                            <img
                                                src={ticket.event.coverImage}
                                                alt={ticket.event.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {ticket.isValidated && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-green-400 text-3xl">
                                                        check_circle
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="text-lg font-bold text-white line-clamp-2">
                                                    {ticket.event.title}
                                                </h3>
                                                <Badge variant="primary" className="shrink-0">
                                                    {ticket.ticketType}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-white/40 font-mono mb-2">
                                                {ticket.ticketNumber}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Event Details */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-white/80">
                                            <span className="material-symbols-outlined text-gold text-base">
                                                calendar_month
                                            </span>
                                            <span>{formatDate(ticket.event.startDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-white/80">
                                            <span className="material-symbols-outlined text-gold text-base">
                                                location_on
                                            </span>
                                            <span>{ticket.event.venue}, {ticket.event.city}</span>
                                        </div>
                                        {ticket.event.section !== 'General' && (
                                            <div className="flex items-center gap-2 text-sm text-white/80">
                                                <span className="material-symbols-outlined text-gold text-base">
                                                    event_seat
                                                </span>
                                                <span>
                                                    Section {ticket.event.section} • Row {ticket.event.row} • Seat {ticket.event.seat}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-white/10 my-4" />

                                    {/* Actions */}
                                    {!ticket.isValidated ? (
                                        <div className="flex gap-3">
                                            <Button
                                                variant="primary"
                                                className="flex-1"
                                                onClick={() => setSelectedTicket(ticket)}
                                            >
                                                <span className="material-symbols-outlined text-lg">qr_code</span>
                                                Show QR Code
                                            </Button>
                                            <button
                                                onClick={() => downloadTicket(ticket)}
                                                className="flex items-center justify-center h-11 w-11 rounded-xl border-2 border-white/10 hover:border-gold/50 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-white/60">download</span>
                                            </button>
                                            <button
                                                onClick={() => shareTicket(ticket)}
                                                className="flex items-center justify-center h-11 w-11 rounded-xl border-2 border-white/10 hover:border-gold/50 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-white/60">share</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 py-3 bg-green-500/10 rounded-xl border border-green-500/20">
                                            <span className="material-symbols-outlined text-green-400">check_circle</span>
                                            <span className="text-sm font-bold text-green-400">Ticket Validated</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <EmptyState
                            icon={activeTab === 'upcoming' ? 'confirmation_number' : 'history'}
                            title={activeTab === 'upcoming' ? 'No upcoming tickets' : 'No past tickets'}
                            description={activeTab === 'upcoming'
                                ? 'Get tickets for upcoming events to see them here'
                                : 'Your attended events will appear here'}
                            action={
                                activeTab === 'upcoming' && (
                                    <Button variant="primary" onClick={() => window.location.href = '/events'}>
                                        Browse Events
                                    </Button>
                                )
                            }
                        />
                    )}
                </div>
            </main>

            {/* QR Code Modal */}
            {selectedTicket && (
                <Modal
                    isOpen={!!selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    title="Your Ticket"
                    className="max-w-sm"
                >
                    <div className="flex flex-col items-center gap-6">
                        {/* QR Code */}
                        <div className="bg-white p-6 rounded-2xl shadow-2xl">
                            <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-xl">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-8xl text-charcoal mb-2">
                                        qr_code_2
                                    </span>
                                    <p className="text-xs text-charcoal/60 font-mono">
                                        {selectedTicket.ticketNumber}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Event Info */}
                        <div className="text-center w-full">
                            <h4 className="font-bold text-lg mb-1">{selectedTicket.event.title}</h4>
                            <p className="text-sm text-white/60 mb-1">{formatDate(selectedTicket.event.startDate)}</p>
                            <p className="text-xs text-white/40 font-mono">{selectedTicket.ticketNumber}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 w-full">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => downloadTicket(selectedTicket)}
                            >
                                <span className="material-symbols-outlined text-base">download</span>
                                Download
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => shareTicket(selectedTicket)}
                            >
                                <span className="material-symbols-outlined text-base">share</span>
                                Share
                            </Button>
                        </div>

                        {/* Instructions */}
                        <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 w-full">
                            <p className="text-xs text-gold text-center">
                                <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
                                Present this QR code at the venue entrance
                            </p>
                        </div>
                    </div>
                </Modal>
            )}

            <BottomNavigation />
        </div>
    );
};

export default Tickets;
