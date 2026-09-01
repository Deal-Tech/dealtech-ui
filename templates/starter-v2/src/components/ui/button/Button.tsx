import * as React from 'react';
import { Loader2, type LucideIcon } from 'lucide-react';

import './button.css';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'ghost'
  | 'action'
  | 'action-danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    disabled,
    type = 'button',
    ...props
  },
  ref,
) {
  const showIcon = !!Icon && !loading;
  return (
    <button
      ref={ref}
      type={type}
      className={`btn btn--${variant} btn--${size} ${children ? '' : 'btn--icon-only'} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="btn__spinner" /> : null}
      {showIcon && iconPosition === 'left' && Icon ? <Icon className="btn__icon" /> : null}
      {children ? <span>{children}</span> : null}
      {showIcon && iconPosition === 'right' && Icon ? <Icon className="btn__icon" /> : null}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
