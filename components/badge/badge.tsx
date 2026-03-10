import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    /** The content of the badge */
    children: React.ReactNode;
    /** The color variant of the badge */
    variant?: BadgeVariant;
    /** Optional class name */
    className?: string;
}

export const Badge = ({ children, variant = 'default', className = '', ...props }: BadgeProps) => {
    const baseStyles = 'inline-flex items-center justify-center text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap';

    const variants: Record<BadgeVariant, string> = {
        default: 'bg-gray-100 text-gray-600',
        primary: 'bg-blue-500/10 text-blue-600',
        success: 'bg-green-500/10 text-green-600',
        warning: 'bg-yellow-500/10 text-yellow-600',
        danger: 'bg-red-500/10 text-red-600',
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </span>
    );
};

export default Badge;
