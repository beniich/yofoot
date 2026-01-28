import React from 'react';

/**
 * Button Component - Unified design system button
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {ReactNode} icon - Optional icon element
 * @param {ReactNode} children - Button content
 * @param {string} className - Additional CSS classes
 * @param {function} onClick - Click handler
 */
export const Button = ({
    variant = 'primary',
    size = 'md',
    icon,
    children,
    className = '',
    onClick,
    disabled = false,
    ...props
}) => {
    const variants = {
        primary: 'bg-gradient-to-br from-gold to-gold-light text-charcoal font-bold shadow-lg shadow-gold/20 hover:shadow-gold/40',
        secondary: 'bg-surface-dark hover:bg-surface-dark/80 text-white border border-white/10',
        outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-charcoal',
        ghost: 'text-white hover:bg-white/10',
    };

    const sizes = {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center justify-center gap-2 rounded-xl font-bold 
                transition-all duration-200 active:scale-95 hover:scale-[1.02]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            {...props}
        >
            {icon && <span className="material-symbols-outlined">{icon}</span>}
            {children}
        </button>
    );
};

/**
 * Card Component - Container with consistent styling
 * @param {string} variant - 'default' | 'glass' | 'elevated'
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 */
export const Card = ({ variant = 'default', children, className = '', ...props }) => {
    const variants = {
        default: 'bg-surface-dark border border-white/10',
        glass: 'bg-surface-dark/70 backdrop-blur-xl border border-white/10',
        elevated: 'bg-surface-dark shadow-2xl shadow-black/50',
    };

    return (
        <div
            className={`rounded-2xl overflow-hidden transition-all ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

/**
 * Badge Component - Status indicators
 * @param {string} variant - 'primary' | 'success' | 'warning' | 'danger' | 'info'
 * @param {ReactNode} children - Badge content
 */
export const Badge = ({ variant = 'primary', children, className = '' }) => {
    const variants = {
        primary: 'bg-gold/20 text-gold border-gold/30',
        success: 'bg-green-500/20 text-green-400 border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        danger: 'bg-red-500/20 text-red-400 border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

/**
 * Input Component - Form input with consistent styling
 */
export const Input = ({
    icon,
    placeholder,
    value,
    onChange,
    type = 'text',
    className = '',
    ...props
}) => {
    return (
        <div className="relative">
            {icon && (
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gold/70">
                    {icon}
                </span>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`
                    w-full h-12 ${icon ? 'pl-12' : 'pl-4'} pr-4 
                    bg-surface-dark/40 border border-white/10 rounded-xl 
                    text-white placeholder:text-white/40 
                    focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 
                    transition-all
                    ${className}
                `}
                {...props}
            />
        </div>
    );
};

/**
 * Toggle Switch Component
 */
export const Toggle = ({ checked, onChange, label, className = '' }) => {
    return (
        <div className={`flex flex-col items-end gap-1 ${className}`}>
            <label className="relative flex h-7 w-12 cursor-pointer items-center rounded-full border border-white/10 bg-white/5 p-0.5 transition-colors has-[:checked]:bg-gold has-[:checked]:border-gold">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="peer sr-only"
                />
                <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-5" />
            </label>
            {label && (
                <span className={`text-[10px] font-medium mt-1 ${checked ? 'text-gold' : 'text-white/40'}`}>
                    {label}
                </span>
            )}
        </div>
    );
};

/**
 * Modal Component
 */
export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fadeIn">
            <Card variant="glass" className={`w-full max-w-md ${className}`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold gold-text-gradient">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    {children}
                </div>
            </Card>
        </div>
    );
};

/**
 * Loading Spinner Component
 */
export const Spinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className={`${sizes[size]} ${className}`}>
            <div className="h-full w-full rounded-full border-4 border-white/20 border-t-gold animate-spin" />
        </div>
    );
};

/**
 * Empty State Component
 */
export const EmptyState = ({ icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-6xl text-white/20 mb-4">
                {icon}
            </span>
            <h3 className="text-lg font-bold text-white/60 mb-2">{title}</h3>
            <p className="text-sm text-white/40 mb-6">{description}</p>
            {action}
        </div>
    );
};

export default Button;
