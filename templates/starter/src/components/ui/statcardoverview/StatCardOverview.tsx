import type { LucideIcon } from 'lucide-react';

type StatCardOverviewProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  badge?: string;
};

const StatCardOverview = ({ title, value, icon: Icon, badge }: StatCardOverviewProps) => {
  return (
    <article className="rounded p-4 text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #334a34, #4a6b4b)' }}>
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-white/15 p-3 text-white">
          <Icon size={24} />
        </div>

        <div className="flex min-w-0 flex-col overflow-hidden">
          <span className="truncate text-[13px] font-medium text-white/70">{title}</span>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="truncate text-xl font-bold text-white">{value}</span>
            {badge ? (
              <span className="rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-bold text-green-200">
                {badge}
              </span>
            ) : null}
          </div>
        </div>        
      </div>
    </article>
  );
};

export default StatCardOverview;
