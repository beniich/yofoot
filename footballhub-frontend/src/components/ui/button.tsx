import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

    const variants = {
        primary: 'bg-primary text-black hover:bg-primary/90 focus:ring-primary shadow-lg shadow-primary/20',
        secondary: 'bg-surface-elevated text-white hover:bg-surface-elevated/80 border border-white/10 focus:ring-gray-500',
        outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary',
        ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 focus:ring-gray-500',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/20',
    };

    const sizes = {
        sm: 'text-xs px-3 py-1.5 gap-1.5',
        md: 'text-sm px-5 py-2.5 gap-2',
        lg: 'text-base px-8 py-3.5 gap-2.5',
        icon: 'p-2.5',
    };

    return (
        <button
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin" size={size === 'lg' ? 20 : 16} />}
            {!isLoading && leftIcon}
            <span>{children}</span>
            {!isLoading && rightIcon}
        </button>
    );
};
