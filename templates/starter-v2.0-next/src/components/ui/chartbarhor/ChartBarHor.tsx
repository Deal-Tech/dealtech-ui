import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { chartColors } from '@/lib/chart';
import './chartbarhor.css';

export interface ChartBarHorDatum {
  label: string;
  value: number;
  color?: string;
}

export interface ChartBarHorProps {
  title: string;
  subtitle?: string;
  data: ChartBarHorDatum[];
  color?: string;
  height?: number;
  className?: string;
}

export function ChartBarHor({
  title,
  subtitle,
  data,
  color,
  height = 280,
  className = '',
}: ChartBarHorProps) {
  const c = chartColors();
  const barColor = color ?? c.primary;

  return (
    <section className={`chartbarhor ${className}`}>
      <div className="chartbarhor__header">
        <h2 className="chartbarhor__title">{title}</h2>
        {subtitle ? <p className="chartbarhor__subtitle">{subtitle}</p> : null}
      </div>
      <div className="chartbarhor__body" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <XAxis type="number" tick={{ fill: c.axis, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fill: c.axis, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={92}
            />
            <Tooltip
              contentStyle={{
                background: c.tooltipBg,
                border: `1px solid ${c.grid}`,
                borderRadius: 8,
                fontSize: 12,
                color: c.tooltipText,
              }}
              labelStyle={{ color: c.axis }}
              cursor={{ fill: c.cursor }}
            />
            <Bar dataKey="value" name="Nilai" radius={[0, 4, 4, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color ?? barColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ChartBarHor;
