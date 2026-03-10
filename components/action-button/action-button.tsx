import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';

type ActionVariant = 'default' | 'danger';

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ActionVariant;
    icon?: LucideIcon;
    /** Optional label next to icon */
    children?: React.ReactNode;
}

const variantStyles: Record<ActionVariant, string> = {
    default: 'border border-gray-800 text-gray-800 bg-transparent hover:bg-gray-900 hover:text-white focus:ring-gray-500',
    danger: 'border border-red-800 text-red-800 bg-transparent hover:bg-red-800 hover:text-white focus:ring-red-500',
};

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(function ActionButton(
    { children, className = '', variant = 'default', icon: Icon, disabled, ...props },
    ref,
) {
    return (
        <button
            ref={ref}
            className={`
                inline-flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium rounded
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variantStyles[variant]}
                ${className}
            `}
            disabled={disabled}
            {...props}
        >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {children}
        </button>
    );
});

export default ActionButton;
