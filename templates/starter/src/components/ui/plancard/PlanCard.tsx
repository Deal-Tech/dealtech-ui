interface PlanCardProps {
  badge?: string;
  value: string;
  caption?: string;
  className?: string;
}

const PlanCard = ({
  badge = '5 Tahun',
  value,
  caption = 'per bulan',
  className = '',
}: PlanCardProps) => {
  return (
    <div
      className={`group relative rounded-lg p-5 text-center text-white shadow-sm transition-all hover:shadow-md ${className}`}
      style={{ background: 'linear-gradient(135deg, #334a34, #4a6b4b)' }}
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-white px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#334a34] shadow-sm">
        {badge}
      </div>
      <div className="mt-2">
        <span className="block text-lg font-bold text-white tabular-nums">{value}</span>
        <span className="mt-1 block text-[11px] uppercase tracking-tight text-white/80">{caption}</span>
      </div>
    </div>
  );
};

export default PlanCard;
