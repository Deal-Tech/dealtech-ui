interface BadgeProps {
  status: string;
  className?: string;
}

const STATUS_MAP: Record<string, { bg: string; text: string }> = {
  Open: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
  Tersedia: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
  Booking: { bg: 'bg-yellow-500/10', text: 'text-yellow-600' },
  Pemberkasan: { bg: 'bg-indigo-500/10', text: 'text-indigo-600' },
  Analis: { bg: 'bg-purple-500/10', text: 'text-purple-600' },
  SP3K: { bg: 'bg-orange-500/10', text: 'text-orange-600' },
  Akad: { bg: 'bg-green-500/10', text: 'text-green-600' },
  Hold: { bg: 'bg-gray-500/10', text: 'text-gray-600' },
  Aset: { bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  Batal: { bg: 'bg-red-500/10', text: 'text-red-600' },
  Superior: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
  Menengah: { bg: 'bg-green-500/10', text: 'text-green-600' },
  Executive: { bg: 'bg-amber-500/10', text: 'text-amber-600' },
  Premier: { bg: 'bg-rose-500/10', text: 'text-rose-600' },
};

const DEFAULT_STYLE = { bg: 'bg-gray-100', text: 'text-gray-600' };

const Badge = ({ status, className = '' }: BadgeProps) => {
  const style = STATUS_MAP[status] || DEFAULT_STYLE;

  return (
    <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${style.bg} ${style.text} ${className}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default Badge;

