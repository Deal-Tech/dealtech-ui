import type { ReactNode } from 'react';

import './charttoplist.css';

export interface ChartTopListItem {
  name: string;
  meta?: string;
  value?: string;
}

export interface ChartTopListProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  items: ChartTopListItem[];
  emptyText?: string;
  className?: string;
}

export function ChartTopList({
  title,
  subtitle,
  action,
  items,
  emptyText = 'Tidak ada data.',
  className = '',
}: ChartTopListProps) {
  return (
    <section className={`charttoplist ${className}`}>
      <div className="charttoplist__header">
        <div className="charttoplist__heading">
          <h2 className="charttoplist__title">{title}</h2>
          {subtitle ? <p className="charttoplist__subtitle">{subtitle}</p> : null}
        </div>
        {action ? <div className="charttoplist__action">{action}</div> : null}
      </div>

      <div className="charttoplist__body">
        {items.length === 0 ? (
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
