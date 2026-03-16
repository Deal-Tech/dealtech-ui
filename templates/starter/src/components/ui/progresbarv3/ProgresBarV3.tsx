interface ProgresBarV3Props {
  value: number;
  color?: string;
  trackColor?: string;
  className?: string;
}

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const ProgresBarV3 = ({
  value,
  color = '#334a34',
  trackColor = '#f3f4f6',
  className = '',
}: ProgresBarV3Props) => {
  const percent = clamp(value);

  return (
    <div className={`h-1 w-24 overflow-hidden rounded-full ${className}`} style={{ backgroundColor: trackColor }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${percent}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};

export default ProgresBarV3;

