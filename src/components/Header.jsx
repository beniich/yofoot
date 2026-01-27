import React from 'react';
import { MOCK_USER } from '../data/mockData';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 flex items-center bg-charcoal/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-white/5">
            <div className="flex size-10 shrink-0 items-center">
                <img src="/logo.png" alt="FootballHub" className="size-10 object-contain" />
            </div>

            <h2 className="font-serif italic text-xl font-semibold leading-tight tracking-tight flex-1 ml-3 gold-text-gradient">
                FootballHub
            </h2>

            <div className="flex items-center gap-2">
                <button className="relative flex size-10 items-center justify-center rounded-full bg-white/5 text-gold transition-all hover:bg-white/10">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-gold-light border border-charcoal"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
