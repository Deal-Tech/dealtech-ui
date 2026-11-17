import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton/Skeleton';
import './charttoplist.css';

export interface ChartTopListItem {
  name: string;
  meta?: string;
  value?: string;
}

export interface ChartTopListProps {
  action?: ReactNode;
  items: ChartTopListItem[];
  emptyText?: string;
  className?: string;
  /** Baris skeleton meniru susunan */
  memuat?: boolean;
  barisMemuat?: number;
}

export function ChartTopList({
  action,
  items,
  emptyText = 'Tidak ada data.',
  className = '',
  memuat = false,
  barisMemuat = 4,
}: ChartTopListProps) {
  return (
    <section className={`charttoplist ${className}`}>
      {action ? (
        <div className="charttoplist__header">
          <div className="charttoplist__action">{action}</div>
        </div>
      ) : null}

      <div className="charttoplist__body">
        {memuat ? (
          Array.from({ length: barisMemuat }, (_, i) => (
            <div key={`memuat-${i}`} className="charttoplist__row">
              <span className="charttoplist__rank">{i + 1}</span>
              <div className="charttoplist__info">
                <p className="charttoplist__name">
                  <Skeleton lebar={140 - (i % 3) * 25} />
                </p>
                <p className="charttoplist__meta">
                  <Skeleton lebar={64} />
                </p>
              </div>
              <span className="charttoplist__value">
                <Skeleton lebar={72} />
              </span>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="charttoplist__empty">{emptyText}</div>
        ) : (
          items.map((item, i) => (
            <div key={`${item.name}-${i}`} className="charttoplist__row">
              <span className="charttoplist__rank">{i + 1}</span>
              <div className="charttoplist__info">
                <p className="charttoplist__name">{item.name}</p>
                {item.meta ? <p className="charttoplist__meta">{item.meta}</p> : null}
              </div>
              {item.value ? <span className="charttoplist__value">{item.value}</span> : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default ChartTopList;
