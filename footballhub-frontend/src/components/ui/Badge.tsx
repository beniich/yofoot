import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    size?: 'sm' | 'md';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full tracking-wide';

    const variants = {
        primary: 'bg-primary/20 text-primary border border-primary/20',
        success: 'bg-green-500/20 text-green-500 border border-green-500/20',
        warning: 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/20',
        danger: 'bg-red-500/20 text-red-500 border border-red-500/20',
        info: 'bg-blue-500/20 text-blue-500 border border-blue-500/20',
        neutral: 'bg-white/10 text-gray-400 border border-white/10',
    };

    const sizes = {
        sm: 'text-[10px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
    };

    return (
        <span
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
        >
            {children}
        </span>
    );
};
