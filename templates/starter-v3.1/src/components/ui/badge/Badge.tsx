import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import './badge.css';

export type BadgeVariant = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'gray';

export interface BadgeProps {
  children: ReactNode;
  icon: LucideIcon;
  variant?: BadgeVariant;
  color?: string;
  className?: string;
}

export function Badge({ children, icon: Icon, variant = 'gray', color, className = '' }: BadgeProps) {
  return (
    <span
      className={`badge badge--${variant} ${className}`}
      style={color ? { backgroundColor: color } : undefined}
    >
      <Icon className="badge__icon" />
      {children}
    </span>
  );
}

export default Badge;
