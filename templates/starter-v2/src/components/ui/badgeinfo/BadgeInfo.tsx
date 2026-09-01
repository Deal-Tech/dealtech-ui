import type { ReactNode } from 'react';
import { CheckCircle2, CircleAlert, Info, TriangleAlert, type LucideIcon } from 'lucide-react';

import './badgeinfo.css';

export type BadgeInfoVariant = 'success' | 'error' | 'info' | 'warning';

const DEFAULT_ICON: Record<BadgeInfoVariant, LucideIcon> = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
  warning: TriangleAlert,
};

export interface BadgeInfoProps {
  children: ReactNode;
  variant?: BadgeInfoVariant;
  icon?: LucideIcon;
  className?: string;
}

export function BadgeInfo({ children, variant = 'success', icon, className = '' }: BadgeInfoProps) {
  const Icon = icon ?? DEFAULT_ICON[variant];
  return (
    <div role="status" className={`badgeinfo badgeinfo--${variant} ${className}`}>
      <Icon className="badgeinfo__icon" />
      <span className="badgeinfo__text">{children}</span>
    </div>
  );
}

export default BadgeInfo;
