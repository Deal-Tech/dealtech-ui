import * as React from 'react';
import { Loader2, type LucideIcon } from 'lucide-react';

import './button.css';

/** Satu ukuran saja: kecil. */
export type ButtonVariant = 'normal' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className = '',
    variant = 'normal',
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
      className={`btn btn--${variant} ${loading ? 'btn--loading' : ''} ${
        children ? '' : 'btn--icon-only'
      } ${className}`}
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
