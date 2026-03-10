import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'action' | 'action-danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500',
    secondary: 'bg-[#efe8d6] text-gray-800 hover:bg-[#e4dcc4] focus:ring-[#e4dcc4]',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-200',
    danger: 'bg-red-800 text-white hover:bg-red-900 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200',
    action: 'border border-gray-800 text-gray-800 bg-transparent hover:bg-gray-900 hover:text-white focus:ring-gray-500',
    'action-danger': 'border border-red-800 text-red-800 bg-transparent hover:bg-red-800 hover:text-white focus:ring-red-500',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1 text-[13px] rounded',
    md: 'px-4 py-2 text-[14px] rounded-lg',
    lg: 'px-5 py-2.5 text-[16px] rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        children,
        className = '',
        variant = 'primary',
        size = 'md',
        icon: Icon,
        iconPosition = 'left',
        loading = false,
        disabled,
        ...props
    },
    ref,
) {
    const showIcon = Icon && !loading;

    return (
        <button
            ref={ref}
            className={`relative inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {showIcon && iconPosition === 'left' && <Icon className={`w-[1.2em] h-[1.2em] ${children ? 'mr-2' : ''}`} />}
            {children && <span>{children}</span>}
            {showIcon && iconPosition === 'right' && <Icon className={`w-[1.2em] h-[1.2em] ${children ? 'ml-2' : ''}`} />}
        </button>
    );
});
