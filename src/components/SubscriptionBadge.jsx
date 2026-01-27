import React from 'react';
import { MOCK_USER } from '../data/mockData';

const SubscriptionBadge = () => {
    const tierConfig = {
        free: {
            label: 'Free Plan',
            color: 'gold',
        },
        pro: {
            label: 'Pro Member',
            color: 'gold',
        },
        premium: {
            label: 'Elite Gold',
            color: 'gold',
        },
    };

    const config = tierConfig[MOCK_USER.subscription] || tierConfig.free;

    return (
        <div className="px-4 pt-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${config.color}/10 border border-${config.color}/30`}>
                <span className="size-1.5 rounded-full bg-gold-light animate-pulse shadow-[0_0_8px_rgba(249,226,126,0.6)]"></span>
                <span className="text-gold-light text-[10px] font-semibold uppercase tracking-[0.1em]">
                    {config.label}
                </span>
            </div>
        </div>
    );
};

export default SubscriptionBadge;
