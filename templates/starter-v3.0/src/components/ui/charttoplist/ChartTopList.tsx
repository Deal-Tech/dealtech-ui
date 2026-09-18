import type { ReactNode } from 'react';

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
}

export function ChartTopList({
  action,
  items,
  emptyText = 'Tidak ada data.',
  className = '',
}: ChartTopListProps) {
  return (
    <section className={`charttoplist ${className}`}>
      {action ? (
        <div className="charttoplist__header">
          <div className="charttoplist__action">{action}</div>
        </div>
      ) : null}

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
