import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { SERIES_COLORS, chartColors } from '@/lib/chart';
import './chartline.css';

export interface ChartLineSeries {
  key: string;
  label: string;
  color?: string;
}

export interface ChartLineProps {
  title: string;
  subtitle?: string;
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartLineSeries[];
  height?: number;
  className?: string;
}

export function ChartLine({
  title,
  subtitle,
  data,
  xKey,
  series,
  height = 300,
  className = '',
}: ChartLineProps) {
  const c = chartColors();

  return (
    <section className={`chartline ${className}`}>
      <div className="chartline__header">
        <h2 className="chartline__title">{title}</h2>
        {subtitle ? <p className="chartline__subtitle">{subtitle}</p> : null}
      </div>
      <div className="chartline__body" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fill: c.axis, fontSize: 12 }}
              axisLine={{ stroke: c.grid }}
              tickLine={false}
            />
            <YAxis tick={{ fill: c.axis, fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip
              contentStyle={{
                background: c.tooltipBg,
                border: `1px solid ${c.grid}`,
                borderRadius: 8,
                fontSize: 12,
                color: c.tooltipText,
              }}
              labelStyle={{ color: c.axis }}
              cursor={{ stroke: c.grid }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {series.map((s, i) => {
              const stroke = s.color ?? SERIES_COLORS[i % SERIES_COLORS.length];
              return (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={stroke}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2, fill: c.dotFill, stroke }}
                  activeDot={{ r: 5 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ChartLine;
