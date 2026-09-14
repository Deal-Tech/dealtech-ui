import type { ReactNode } from 'react';

import './cardbar-chart.css';

export interface CardBarChartDatum {
  label: string;
  value: number;
}

export interface CardBarChartProps {
  action?: ReactNode;
  data: CardBarChartDatum[];
  max?: number;
  unit?: string;
  className?: string;
}

export function CardBarChart({
  action,
  data,
  max,
  unit = '',
  className = '',
}: CardBarChartProps) {
  const peak = max ?? Math.max(1, ...data.map((d) => d.value));

  return (
    <section className={`cardbar-chart ${className}`}>
      {action ? (
        <div className="cardbar-chart__header">
          <div className="cardbar-chart__action">{action}</div>
        </div>
      ) : null}

      <div className="cardbar-chart__body">
        <div className="cardbar-chart__bars">
          {data.map((d) => {
            const height = Math.max(0, Math.min(100, (d.value / peak) * 100));
            return (
              <div key={d.label} className="cardbar-chart__col">
                <div className="cardbar-chart__track">
                  <div className="cardbar-chart__fill" style={{ height: `${height}%` }} />
                  <span className="cardbar-chart__tip">
                    {d.value}
                    {unit}
                  </span>
                </div>
                <span className="cardbar-chart__label">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CardBarChart;
