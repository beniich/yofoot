import React from 'react';

export const SafeArea = ({ children, className = '' }) => {
    return (
        <div className={`pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] ${className}`}>
            {children}
        </div>
    );
};
