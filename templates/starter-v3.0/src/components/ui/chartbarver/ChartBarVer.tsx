import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { chartColors } from '@/lib/chart';
import './chartbarver.css';

export interface ChartBarVerDatum {
  label: string;
  value: number;
}

export interface ChartBarVerProps {
  data: ChartBarVerDatum[];
  color?: string;
  height?: number;
  className?: string;
}

export function ChartBarVer({
  data,
  color,
  height = 260,
  className = '',
}: ChartBarVerProps) {
  const c = chartColors();
  const barColor = color ?? c.primary;

  return (
    <section className={`chartbarver ${className}`}>
      <div className="chartbarver__body" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: c.axis, fontSize: 11 }}
              axisLine={{ stroke: c.grid }}
              tickLine={false}
            />
            <YAxis tick={{ fill: c.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip
              contentStyle={{
                background: c.tooltipBg,
                border: `1px solid ${c.grid}`,
                borderRadius: 8,
                fontSize: 11,
                color: c.tooltipText,
              }}
              labelStyle={{ color: c.axis }}
              cursor={{ fill: c.cursor }}
            />
            <Bar dataKey="value" name="Nilai" fill={barColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ChartBarVer;
