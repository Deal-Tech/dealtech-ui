import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2, type LucideIcon } from 'lucide-react';

type ButtonVariant =
  | 'primary'
  | 'premium'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'ghost'
  | 'action'
  | 'action-danger';

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
  premium:
    'bg-[#334a34] text-white hover:bg-[#2a3d2b] focus:ring-[#334a34]/40 shadow-sm shadow-[#334a34]/20',
  secondary: 'bg-[#efe8d6] text-gray-800 hover:bg-[#e4dcc4] focus:ring-[#e4dcc4]',
  outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-200',
  danger: 'bg-red-800 text-white hover:bg-red-900 focus:ring-red-500',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200',
  action:
    'border border-gray-800 text-gray-800 bg-transparent hover:bg-gray-900 hover:text-white focus:ring-gray-500',
  'action-danger':
    'border border-red-800 text-red-800 bg-transparent hover:bg-red-800 hover:text-white focus:ring-red-500',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 rounded px-3 py-1.5 text-[12px]',
  md: 'h-10 rounded px-4 py-2 text-[13px]',
  lg: 'h-12 rounded px-6 py-2.5 text-[15px]',
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
  ref
) {
  const showIcon = Icon && !loading;

  return (
    <button
      ref={ref}
      className={`relative inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {showIcon && iconPosition === 'left' ? (
        <Icon className={`h-[1.2em] w-[1.2em] ${children ? 'mr-2' : ''}`} />
      ) : null}
      {children ? <span>{children}</span> : null}
      {showIcon && iconPosition === 'right' ? (
        <Icon className={`h-[1.2em] w-[1.2em] ${children ? 'ml-2' : ''}`} />
      ) : null}
    </button>
  );
});

