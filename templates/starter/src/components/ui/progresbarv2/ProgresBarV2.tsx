interface ProgresBarV2Props {
  value: number;
  className?: string;
}

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const getColor = (percent: number) => {
  if (percent === 100) return '#10b981';
  if (percent >= 50) return '#3b82f6';
  return '#ef4444';
};

const ProgresBarV2 = ({ value, className = '' }: ProgresBarV2Props) => {
  const percent = clamp(value);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: getColor(percent),
          }}
        />
      </div>
      <span className="text-xs tabular-nums text-gray-500">{percent}%</span>
    </div>
  );
};

export default ProgresBarV2;
