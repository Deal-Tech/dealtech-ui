import type { LucideIcon } from 'lucide-react';

import { CountUp } from '@/components/ui/count-up/CountUp';
import { fmtCompact } from '@/lib/format';
import './stat-card.css';

export type NadaStat = 'naik' | 'turun' | 'datar';

export interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  helper?: string | null;
  nada?: NadaStat;
  helperTitle?: string;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  helper = null,
  nada = 'datar',
  helperTitle,
}: StatCardProps) {
  const display = typeof value === 'number' ? fmtCompact(value) : value;
  const len = String(display).length;
  const sizeClass =
    len > 20
      ? 'stat-card__value--xxs'
      : len > 16
        ? 'stat-card__value--xs'
        : len > 12
          ? 'stat-card__value--sm'
          : '';

  return (
    <div className="stat-card">
      <span className="stat-card__icon">
        <Icon className="h-5 w-5" />
      </span>
      <div className="stat-card__body">
        <span className="stat-card__title">{title}</span>
        <span className={`stat-card__value ${sizeClass}`}>
          <CountUp value={display} />
        </span>
      </div>
      {helper ? (
        <span className={`stat-card__badge stat-card__badge--${nada}`} title={helperTitle}>
          {helper}
        </span>
      ) : null}
    </div>
  );
}

export default StatCard;
