import type { HTMLAttributes } from 'react';

import './alert.css';

export type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'destructive';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

export function Alert({ variant = 'default', className = '', children, ...props }: AlertProps) {
  return (
    <div role="alert" className={`alert alert--${variant} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertTitle({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`alert__title ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AlertDescription({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`alert__description ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Alert;
