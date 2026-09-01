import type { ReactNode } from 'react';

import './cardbar-list.css';

export interface CardBarItem {
  label: string;
  value: number;
  color?: string;
}

export interface CardBarListProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  items: CardBarItem[];
  className?: string;
}

export function CardBarList({ title, subtitle, action, items, className = '' }: CardBarListProps) {
  return (
    <section className={`cardbar-list ${className}`}>
      <div className="cardbar-list__header">
        <div className="cardbar-list__heading">
          <h2 className="cardbar-list__title">{title}</h2>
          {subtitle ? <p className="cardbar-list__subtitle">{subtitle}</p> : null}
        </div>
        {action ? <div className="cardbar-list__action">{action}</div> : null}
      </div>

      <div className="cardbar-list__body">
        {items.map((item) => {
          const pct = Math.max(0, Math.min(100, item.value));
          return (
            <div key={item.label} className="cardbar-list__row">
              <div className="cardbar-list__row-head">
                <span className="cardbar-list__label">{item.label}</span>
                <span className="cardbar-list__value">{item.value}%</span>
              </div>
              <div className="cardbar-list__track">
                <div
                  className="cardbar-list__fill"
                  style={{ width: `${pct}%`, background: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CardBarList;
