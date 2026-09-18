import type { ReactNode } from 'react';

import './chartlistbar.css';

export interface ChartListBarItem {
  label: string;
  value: number;
  valueLabel?: string;
  meta?: string;
  color?: string;
}

export interface ChartListBarProps {
  action?: ReactNode;
  items: ChartListBarItem[];
  emptyText?: string;
  className?: string;
}

export function ChartListBar({
  action,
  items,
  emptyText = 'Tidak ada data.',
  className = '',
}: ChartListBarProps) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <section className={`chartlistbar ${className}`}>
      {action ? (
        <div className="chartlistbar__header">
          <div className="chartlistbar__action">{action}</div>
        </div>
      ) : null}

      <div className="chartlistbar__body">
        {items.length === 0 ? (
          <div className="chartlistbar__empty">{emptyText}</div>
        ) : (
          items.map((item, i) => {
            const pct = Math.max(0, Math.min(100, (item.value / max) * 100));
            return (
              <div key={`${item.label}-${i}`} className="chartlistbar__row">
                <div className="chartlistbar__row-head">
                  <span className="chartlistbar__label">{item.label}</span>
                  {item.meta ? <span className="chartlistbar__meta">{item.meta}</span> : null}
                </div>
                <div className="chartlistbar__track">
                  <div
                    className="chartlistbar__fill"
                    style={{ width: `${pct}%`, background: item.color }}
                  />
                </div>
                {item.valueLabel ? (
                  <p className="chartlistbar__value">{item.valueLabel}</p>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default ChartListBar;
