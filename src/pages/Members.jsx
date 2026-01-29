import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { memberService } from '../services/members';

const Members = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const data = await memberService.getAll();
                const memberList = Array.isArray(data) ? data : (data.members || []);

                // Map backend 'status' to 'isActive' for UI compatibility
                const adaptedData = memberList.map(m => ({
                    ...m,
                    isActive: m.status === 'Active'
                }));
                setMembers(adaptedData);
            } catch (err) {
                console.error(err);
                setMembers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    const toggleMemberStatus = async (id) => {
        // Optimistic update
        const member = members.find(m => m.id === id);
        const newStatus = member.isActive ? 'Inactive' : 'Active';

        setMembers(members.map(m =>
            m.id === id ? { ...m, isActive: !m.isActive, status: newStatus } : m
        ));

        // Call API
        await memberService.update(id, { status: newStatus });
    };

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.id.toString().includes(searchQuery) ||
            member.role.toLowerCase().includes(searchQuery.toLowerCase());

        if (selectedFilter === 'all') return matchesSearch;
        if (selectedFilter === 'elite') return matchesSearch && member.tier === 'ELITE';
        if (selectedFilter === 'pro') return matchesSearch && member.tier === 'PRO';
        if (selectedFilter === 'active') return matchesSearch && member.isActive;
        if (selectedFilter === 'inactive') return matchesSearch && !member.isActive;

        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-charcoal text-white pb-20">
            <Header />

            {/* Page Header */}
            <div className="sticky top-[73px] z-40 bg-charcoal/95 backdrop-blur-xl border-b border-white/5 px-4 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold gold-text-gradient">Members</h1>
                        <p className="text-sm text-white/60 mt-1">Manage your club roster</p>
                    </div>
                    <button className="flex items-center justify-center rounded-full h-12 w-12 bg-gradient-to-br from-gold to-gold-light text-charcoal shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all hover:scale-105 active:scale-95">
                        <span className="material-symbols-outlined font-bold text-2xl">add</span>
                    </button>
                </div>
            </div>

            <main className="px-4 pb-4">
                {/* Search Bar */}
                <div className="py-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold/70">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search by name, ID or role"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 pr-4 bg-surface-dark/40 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all"
                        />
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {[
                        { id: 'all', label: 'All Members', icon: 'group' },
                        { id: 'elite', label: 'Elite', icon: 'workspace_premium' },
                        { id: 'pro', label: 'Pro', icon: 'star' },
                        { id: 'active', label: 'Active', icon: 'check_circle' },
                        { id: 'inactive', label: 'Inactive', icon: 'cancel' }
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

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                    <button className="flex-1 flex items-center justify-center gap-2 rounded-xl h-11 px-4 bg-surface-dark/50 border border-white/10 hover:bg-surface-dark text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-gold text-lg">library_add_check</span>
                        <span>Bulk Actions</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 rounded-xl h-11 px-4 bg-surface-dark/50 border border-white/10 hover:bg-surface-dark text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-gold text-lg">download</span>
                        <span>Export CSV</span>
                    </button>
                </div>

                {/* List Header */}
                <div className="flex justify-between items-center py-3 px-1">
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                        {loading ? 'Loading...' : `${filteredMembers.length} Members`}
                    </span>
                    <span className="text-xs font-medium text-white/40">
                        Last updated: Just now
                    </span>
                </div>

                {/* Members List */}
                <div className="flex flex-col gap-2">
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                className={`flex items-center gap-4 bg-surface-dark/50 hover:bg-surface-dark/80 px-4 py-4 rounded-xl border border-white/5 transition-all hover:border-white/10 ${!member.isActive ? 'opacity-60' : ''
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <div
                                        className={`bg-center bg-no-repeat bg-cover rounded-full h-14 w-14 ring-2 ${member.tier === 'ELITE'
                                            ? 'ring-gold/40'
                                            : member.tier === 'PRO'
                                                ? 'ring-blue-400/40'
                                                : 'ring-white/10'
                                            } ${!member.isActive ? 'grayscale' : ''}`}
                                        style={{ backgroundImage: `url("${member.avatar}")` }}
                                    />
                                    {/* Tier Badge */}
                                    <div
                                        className={`absolute -bottom-1 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm border ${member.tier === 'ELITE'
                                            ? 'bg-gold text-charcoal border-charcoal'
                                            : member.tier === 'PRO'
                                                ? 'bg-blue-400 text-white border-charcoal'
                                                : 'bg-gray-400 text-charcoal border-charcoal'
                                            }`}
                                    >
                                        {member.tier}
                                    </div>
                                </div>

                                {/* Member Info */}
                                <div className="flex flex-col flex-1 justify-center min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-white text-base font-bold leading-normal truncate">
                                            {member.name}
                                        </p>
                                        {member.isVerified && (
                                            <span className="material-symbols-outlined text-gold text-base" title="Verified">
                                                verified
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs font-medium leading-normal mt-0.5 ${member.tier === 'ELITE' ? 'text-gold/80' : 'text-white/60'
                                        }`}>
                                        ID: #{member.id} • Joined {member.joinDate}
                                    </p>
                                    <div className="flex gap-2 mt-1.5">
                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${member.tier === 'ELITE'
                                            ? 'bg-gold/10 text-gold ring-gold/20'
                                            : member.tier === 'PRO'
                                                ? 'bg-blue-400/10 text-blue-300 ring-blue-400/20'
                                                : 'bg-white/5 text-white/60 ring-white/10'
                                            }`}>
                                            {member.role}
                                        </span>
                                    </div>
                                </div>

                                {/* Toggle Switch */}
                                <div className="shrink-0 flex flex-col items-end gap-1">
                                    <label className="relative flex h-7 w-12 cursor-pointer items-center rounded-full border border-white/10 bg-white/5 p-0.5 transition-colors has-[:checked]:bg-gold has-[:checked]:border-gold">
                                        <input
                                            type="checkbox"
                                            checked={member.isActive}
                                            onChange={() => toggleMemberStatus(member.id)}
                                            className="peer sr-only"
                                        />
                                        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-5" />
                                    </label>
                                    <span className={`text-[10px] font-medium mt-1 ${member.isActive ? 'text-gold' : 'text-white/40'
                                        }`}>
                                        {member.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Empty State */}
                    {!loading && filteredMembers.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <span className="material-symbols-outlined text-6xl text-white/20 mb-4">
                                group_off
                            </span>
                            <h3 className="text-lg font-bold text-white/60 mb-2">No members found</h3>
                            <p className="text-sm text-white/40">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </main>

            <BottomNavigation />
        </div>
    );
};

export default Members;
