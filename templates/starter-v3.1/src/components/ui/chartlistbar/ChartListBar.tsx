import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton/Skeleton';
import './chartlistbar.css';

// Lebar batang skeleton bervariasi
const BATANG_MEMUAT = [88, 62, 45, 30, 20];

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
  /** Baris skeleton meniru susunan */
  memuat?: boolean;
  barisMemuat?: number;
}

export function ChartListBar({
  action,
  items,
  emptyText = 'Tidak ada data.',
  className = '',
  memuat = false,
  barisMemuat = 3,
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
        {memuat ? (
          Array.from({ length: barisMemuat }, (_, i) => (
            <div key={`memuat-${i}`} className="chartlistbar__row">
              <div className="chartlistbar__row-head">
                <span className="chartlistbar__label">
                  <Skeleton lebar={110 - (i % 3) * 20} />
                </span>
                <span className="chartlistbar__meta">
                  <Skeleton lebar={72} />
                </span>
              </div>
              <div className="chartlistbar__track chartlistbar__track--memuat">
                <Skeleton bentuk="kotak" lebar={`${BATANG_MEMUAT[i % BATANG_MEMUAT.length]}%`} tinggi="100%" />
              </div>
              <p className="chartlistbar__value">
                <Skeleton lebar={44} />
              </p>
            </div>
          ))
        ) : items.length === 0 ? (
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
