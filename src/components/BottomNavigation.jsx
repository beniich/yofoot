import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'Home', icon: 'home', path: '/' },
        { label: 'Events', icon: 'calendar_month', path: '/events' },
        { label: 'Tickets', icon: 'confirmation_number', path: '/tickets' },
        { label: 'Shop', icon: 'shopping_bag', path: '/shop' },
        { label: 'Profile', icon: 'person', path: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal/90 backdrop-blur-xl border-t border-white/5 pb-safe">
            <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${isActive ? 'text-gold scale-105' : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            <span className={`material-symbols-outlined transition-all ${isActive ? 'material-symbols-filled scale-110' : ''}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_#D4AF37]"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavigation;
