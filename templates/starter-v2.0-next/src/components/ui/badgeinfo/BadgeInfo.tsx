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
  /** Ikon bawaan varian, ikon sendiri, atau `false` untuk tanpa ikon. */
  icon?: LucideIcon | false;
  className?: string;
}

export function BadgeInfo({ children, variant = 'success', icon, className = '' }: BadgeInfoProps) {
  const Icon = icon === false ? null : (icon ?? DEFAULT_ICON[variant]);

  return (
    <div
      role="status"
      className={`badgeinfo badgeinfo--${variant} ${Icon ? '' : 'badgeinfo--polos'} ${className}`}
    >
      {Icon ? <Icon className="badgeinfo__icon" /> : null}
      <span className="badgeinfo__text">{children}</span>
    </div>
  );
}

export default BadgeInfo;
