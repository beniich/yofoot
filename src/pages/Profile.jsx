import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // If no user is logged in, show a generic "Guest" state or redirect to auth
    // For a profile page, it's better to show a "Guest" view with a call to action
    const displayUser = user || {
        name: 'Guest User',
        email: 'Join to access premium features',
        subscription: 'none',
        tier: 'Visitor'
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const stats = [
        { label: 'Predictions Made', value: '0', icon: 'psychology' }, // Would fetch real stats potentially
        { label: 'Success Rate', value: '-', icon: 'trending_up' },
        { label: 'Days Active', value: '1', icon: 'calendar_today' },
    ];

    const menuItems = [
        { label: 'Account Settings', icon: 'settings', path: '/settings' },
        { label: 'Subscription', icon: 'workspace_premium', path: '/subscription' },
        { label: 'Notifications', icon: 'notifications', path: '/notifications' },
        { label: 'Help & Support', icon: 'help', path: '/help' },
        { label: 'About', icon: 'info', path: '/about' },
    ];

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col bg-charcoal">
                <nav className="sticky top-0 z-50 bg-charcoal/80 backdrop-blur-md border-b border-white/5">
                    <div className="flex items-center p-4 justify-between max-w-lg mx-auto w-full">
                        <h2 className="text-lg font-bold tracking-tight text-white">Profile</h2>
                    </div>
                </nav>
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
                    <div className="size-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                        <span className="material-symbols-outlined text-4xl text-white/20">person</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Welcome to FootballHub</h2>
                        <p className="text-white/50 text-sm max-w-xs mx-auto">Sign in to track your stats, access premium AI predictions, and join the community.</p>
                    </div>
                    <button
                        onClick={() => navigate('/auth')}
                        className="w-full max-w-xs gold-gradient text-charcoal font-bold py-3.5 rounded-xl uppercase tracking-wider shadow-lg shadow-gold/10 hover:shadow-gold/20 active:scale-[0.98] transition-all"
                    >
                        Sign In / Register
                    </button>
                </div>
                <BottomNavigation />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-charcoal">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-charcoal/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center p-4 justify-between max-w-lg mx-auto w-full">
                    <h2 className="text-lg font-bold tracking-tight text-white">Profile</h2>
                    <button>
                        <span className="material-symbols-outlined text-white/60 hover:text-white transition-colors">more_horiz</span>
                    </button>
                </div>
            </nav>

            <div className="flex-1 px-4 py-6 pb-24 overflow-y-auto no-scrollbar">
                {/* User Card */}
                <div className="relative p-[2px] rounded-2xl overflow-hidden mb-6 group">
                    <div className="absolute inset-0 gold-gradient opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-charcoal-light rounded-[14px] p-6 h-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="size-20 rounded-full gold-gradient flex items-center justify-center text-charcoal text-3xl font-black shadow-lg shadow-gold/20">
                                {displayUser.username ? displayUser.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-white text-xl font-bold mb-1 font-display tracking-tight">{displayUser.username || 'User'}</h2>
                                <p className="text-white/50 text-sm mb-2 font-light">{displayUser.email}</p>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30">
                                    <span className="material-symbols-outlined text-gold text-sm material-symbols-filled">
                                        workspace_premium
                                    </span>
                                    <span className="text-gold text-[10px] font-bold uppercase tracking-wider">
                                        {displayUser.plan === 'free' ? 'Free Plan' : displayUser.plan}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {displayUser.plan === 'free' && (
                            <button
                                onClick={() => navigate('/subscription')}
                                className="w-full gold-gradient text-charcoal py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-gold/10 active:scale-[0.98]"
                            >
                                Upgrade to Premium
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-charcoal-light rounded-2xl p-4 border border-white/5 text-center hover:border-gold/20 transition-colors">
                            <span className="material-symbols-outlined text-gold text-2xl mb-2 block mx-auto opacity-80">
                                {stat.icon}
                            </span>
                            <p className="text-white text-xl font-bold mb-1 font-display">{stat.value}</p>
                            <p className="text-white/40 text-[9px] uppercase tracking-wider font-bold">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => item.path && navigate(item.path)}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-charcoal-light border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group active:scale-[0.99]"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-white/40 group-hover:text-gold transition-colors">{item.icon}</span>
                                <span className="text-white text-sm font-medium">{item.label}</span>
                            </div>
                            <span className="material-symbols-outlined text-white/20 text-sm">arrow_forward_ios</span>
                        </button>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all mt-6 group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-red-500/60 group-hover:text-red-500 transition-colors">logout</span>
                            <span className="text-red-500/80 group-hover:text-red-500 font-medium text-sm">Sign Out</span>
                        </div>
                    </button>
                </div>
            </div>

            <BottomNavigation />
        </div>
    );
};

export default Profile;
