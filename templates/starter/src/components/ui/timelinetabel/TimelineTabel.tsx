import type { ReactNode } from 'react';

type TimelineTabelItem = {
  label: string;
  target?: ReactNode;
  actual?: ReactNode;
  status: string;
};

interface TimelineTabelProps {
  items: TimelineTabelItem[];
  columns?: 4 | 5;
  className?: string;
}

const STATUS_MAP: Record<string, string> = {
  'Belum': 'bg-gray-500/10 text-gray-600',
  'Selesai': 'bg-emerald-500/10 text-emerald-600',
  'Tepat Waktu': 'bg-green-500/10 text-green-600',
  'Terlambat': 'bg-red-500/10 text-red-600',
};

function StatusChip({ status }: { status: string }) {
  const classes = STATUS_MAP[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${classes}`}>
      {status.toUpperCase()}
    </span>
  );
}

const TimelineTabel = ({ items, columns = 4, className = '' }: TimelineTabelProps) => {
  const gridClass =
    columns === 5
      ? 'grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5'
      : 'grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4';

  return (
    <div className={`grid ${gridClass} ${className}`.trim()}>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`}>
          <label className="mb-1 block text-xs font-medium text-neutral-500">{item.label}</label>
          <div className="rounded border border-neutral-300/50 bg-gray-50 px-3 py-3">
            <div className="flex items-center justify-between gap-2 border-b border-gray-200/70 py-1.5 first:pt-0 last:border-0 last:pb-0">
              <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Target</span>
              <span className="text-xs text-gray-700 tabular-nums">{item.target ?? '-'}</span>
            </div>
            <div className="flex items-center justify-between gap-2 border-b border-gray-200/70 py-1.5 first:pt-0 last:border-0 last:pb-0">
              <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Actual</span>
              <span className="text-xs text-gray-700 tabular-nums">{item.actual ?? '-'}</span>
            </div>
            <div className="flex items-center justify-between gap-2 py-1.5 first:pt-0 last:pb-0">
              <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Status</span>
              <StatusChip status={item.status} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export type { TimelineTabelItem, TimelineTabelProps };
export default TimelineTabel;
