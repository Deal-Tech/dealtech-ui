import { forwardRef, type ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

import './action-button.css';

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'default' | 'danger';
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(function ActionButton(
  { icon: Icon, variant = 'default', className = '', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`action-button action-button--${variant} ${className}`}
      {...props}
    >
      <Icon className="action-button__icon" />
    </button>
  );
});

ActionButton.displayName = 'ActionButton';

export default ActionButton;
