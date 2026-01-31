import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'Outline';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    onClick,
}) => {
    const baseStyles = 'rounded-2xl transition-all';

    const variants = {
        default: 'bg-surface-dark border border-white/5 shadow-xl',
        glass: 'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl',
        Outline: 'bg-transparent border border-white/10',
    };

    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-8',
    };

    return (
        <div
            onClick={onClick}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${onClick ? 'cursor-pointer hover:border-primary/50 hover:shadow-primary/5 active:scale-[0.99]' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};
