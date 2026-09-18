import type { LucideIcon } from 'lucide-react';

import { fmtCount } from '@/lib/format';
import './tab-button.css';

export interface TabItem {
  key: string;
  label: string;
  short?: string;
  icon?: LucideIcon;
  count?: number;
}

export interface TabButtonProps {
  tabs: TabItem[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}

export function TabButton({ tabs, value, onChange, className = '' }: TabButtonProps) {
  return (
    <div className={`tab-button ${className}`}>
      <nav className="tab-button__nav">
        {tabs.map((item) => {
          const active = value === item.key;
          const Icon = item.icon;
          const count = typeof item.count === 'number' ? fmtCount(item.count) : null;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              aria-current={active ? 'page' : undefined}
              className={`tab-button__item ${active ? 'tab-button__item--active' : ''}`}
            >
              {Icon ? <Icon className="tab-button__icon" /> : null}

              {item.short ? (
                <>
                  <span className="tab-button__label tab-button__label--short">{item.short}</span>
                  <span className="tab-button__label tab-button__label--full">{item.label}</span>
                </>
              ) : (
                <span className="tab-button__label">{item.label}</span>
              )}

              {count !== null ? (
                <span
                  className="tab-button__count"
                  data-long={String(count).length > 2 ? '' : undefined}
                >
                  {count}
                </span>
              ) : null}

              {active ? <span className="tab-button__indicator" /> : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default TabButton;
