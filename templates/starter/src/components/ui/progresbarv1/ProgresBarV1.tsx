interface ProgresBarV1Props {
  label?: string;
  value?: number;
  current?: number;
  total?: number;
  className?: string;
}

const clamp = (value: number) => Math.max(0, Math.min(100, value));

const getColor = (percent: number) => {
  if (percent >= 80) return '#16a34a';
  if (percent >= 40) return '#334a34';
  return '#f59e0b';
};

const ProgresBarV1 = ({
  label = 'Progress',
  value,
  current = 0,
  total = 0,
  className = '',
}: ProgresBarV1Props) => {
  const normalizedTotal = total > 0 ? total : 0;
  const computedPercent = normalizedTotal > 0 ? Math.round((current / normalizedTotal) * 100) : 0;
  const percent = clamp(value ?? computedPercent);
  const summary = normalizedTotal > 0 ? `${current}/${normalizedTotal}` : '-';

  return (
    <div className={`min-w-[180px] ${className}`}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs text-gray-500">{label} {summary !== '-' ? `(${summary})` : ''}</span>
        <span className="text-xs font-medium text-gray-700 tabular-nums">{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percent}%`,
            background: getColor(percent),
          }}
        />
      </div>
    </div>
  );
};

export default ProgresBarV1;
