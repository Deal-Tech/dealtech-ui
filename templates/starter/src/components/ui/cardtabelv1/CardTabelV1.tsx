import type { ReactNode } from 'react';
import Badge from '../badge/Badge';

type CardTabelProgress = {
  completed: number;
  total: number;
  percent: number;
};

type CardTabelItem = {
  label: string;
  helperText?: string;
  value?: ReactNode;
  variant?: 'default' | 'badge' | 'progress';
  status?: string;
  progress?: CardTabelProgress;
};

interface CardTabelV1Props {
  title: string;
  subtitle?: string;
  items: CardTabelItem[];
  columns?: 2 | 4;
  className?: string;
}

const cardClass = 'overflow-hidden rounded border border-gray-200 bg-white shadow-sm';
const cardHeaderClass = 'border-b border-gray-100 px-5 py-4 sm:px-6';
const cardBodyClass = 'px-5 py-4 sm:px-6';

const ReadonlyField = ({ label, value, helperText }: { label: string; value?: ReactNode; helperText?: string }) => (
  <div>
    <label className="mb-1 block text-xs font-medium text-neutral-500">{label}</label>
    <div className="flex min-h-[42px] items-center rounded border border-neutral-300/50 bg-gray-50 px-3 text-sm text-gray-700">
      {value ?? '-'}
    </div>
    {helperText ? <p className="mt-1 text-[11px] text-neutral-400">{helperText}</p> : null}
  </div>
);

const BadgeField = ({ label, status, helperText }: { label: string; status: string; helperText?: string }) => (
  <div>
    <label className="mb-1 block text-xs font-medium text-neutral-500">{label}</label>
    <div className="flex min-h-[42px] items-center">
      <Badge status={status} />
    </div>
    {helperText ? <p className="mt-1 text-[11px] text-neutral-400">{helperText}</p> : null}
  </div>
);

const ProgressField = ({
  label,
  progress,
  helperText,
}: {
  label: string;
  progress: CardTabelProgress;
  helperText?: string;
}) => {
  const background = progress.percent >= 80 ? '#16a34a' : progress.percent >= 40 ? '#334a34' : '#f59e0b';

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-neutral-500">{label}</label>
      <div className="rounded border border-neutral-300/50 bg-gray-50 px-3 py-3">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500">
            {progress.completed}/{progress.total} berkas
          </span>
          <span className="text-xs font-medium text-gray-700 tabular-nums">{progress.percent}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress.percent}%`, background }}
          />
        </div>
      </div>
      {helperText ? <p className="mt-1 text-[11px] text-neutral-400">{helperText}</p> : null}
    </div>
  );
};

const CardTabelV1 = ({ title, subtitle, items, columns = 4, className = '' }: CardTabelV1Props) => {
  const gridClass = columns === 2 ? 'grid-cols-1 gap-4 md:grid-cols-2' : 'grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4';

  return (
    <section className={`${cardClass} ${className}`.trim()}>
      <div className={cardHeaderClass}>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p> : null}
      </div>
      <div className={cardBodyClass}>
        <div className={`grid ${gridClass}`}>
          {items.map((item, index) => {
            if (item.variant === 'badge' && item.status) {
              return (
                <BadgeField
                  key={`${item.label}-${index}`}
                  label={item.label}
                  status={item.status}
                  helperText={item.helperText}
                />
              );
            }

            if (item.variant === 'progress' && item.progress) {
              return (
                <ProgressField
                  key={`${item.label}-${index}`}
                  label={item.label}
                  progress={item.progress}
                  helperText={item.helperText}
                />
              );
            }

            return (
              <ReadonlyField
                key={`${item.label}-${index}`}
                label={item.label}
                value={item.value}
                helperText={item.helperText}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export type { CardTabelItem, CardTabelProgress, CardTabelV1Props };
export default CardTabelV1;
