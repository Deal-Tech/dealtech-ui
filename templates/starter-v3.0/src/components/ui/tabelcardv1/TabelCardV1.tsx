import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

import { Badge, type BadgeVariant } from '@/components/ui/badge/Badge';
import './tabelcardv1.css';

export interface TabelCardItem {
  title: string;
  subtitle?: string;
  badge: { label: string; icon: LucideIcon; variant?: BadgeVariant; color?: string };
  meta?: string;
  initials?: string;
}

export interface TabelCardV1Props {
  count?: number | null;
  action?: ReactNode;
  items: TabelCardItem[];
  emptyText?: string;
  className?: string;
}

export function TabelCardV1({
  count = null,
  action,
  items,
  emptyText = 'Tidak ada data.',
  className = '',
}: TabelCardV1Props) {
  return (
    <section className={`tabelcardv1 ${className}`}>
      {count !== null || action ? (
        <div className="tabelcardv1__header">
          {count !== null ? <span className="tabelcardv1__count">{count}</span> : null}
          {action ? <div className="tabelcardv1__action">{action}</div> : null}
        </div>
      ) : null}

      <div className="tabelcardv1__body">
        {items.length === 0 ? (
          <div className="tabelcardv1__empty">{emptyText}</div>
        ) : (
          items.map((item, i) => (
            <div key={`${item.title}-${i}`} className="tabelcardv1__item">
              <p className="tabelcardv1__item-title">{item.title}</p>
              {item.subtitle ? (
                <p className="tabelcardv1__item-subtitle">{item.subtitle}</p>
              ) : null}
              <div className="tabelcardv1__item-meta">
                <Badge icon={item.badge.icon} variant={item.badge.variant} color={item.badge.color}>
                  {item.badge.label}
                </Badge>
                {item.meta ? <span className="tabelcardv1__item-date">{item.meta}</span> : null}
                {item.initials ? (
                  <span className="tabelcardv1__avatar">{item.initials}</span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default TabelCardV1;
