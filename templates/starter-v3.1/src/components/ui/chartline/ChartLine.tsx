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

import { chartColors, seriesColors } from '@/lib/chart';
import './chartline.css';

export interface ChartLineSeries {
  key: string;
  label: string;
  color?: string;
}

export interface ChartLineProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartLineSeries[];
  height?: number;
  className?: string;
  /** Garis bayangan, sumbu X tetap. */
  memuat?: boolean;
}

// Bentuk garis saat memuat
const POLA_MEMUAT = [0.35, 0.55, 0.42, 0.7, 0.5, 0.82, 0.62];
const KUNCI_MEMUAT = '__memuat';

export function ChartLine({
  data,
  xKey,
  series,
  height = 300,
  className = '',
  memuat = false,
}: ChartLineProps) {
  const c = chartColors();
  const seri = seriesColors();
  const label = data.length ? data.map((d) => d[xKey]) : POLA_MEMUAT.map(() => '');
  const dataMemuat = label.map((x, i) => ({
    [xKey]: x,
    [KUNCI_MEMUAT]: POLA_MEMUAT[i % POLA_MEMUAT.length],
  }));

  return (
    <section className={`chartline ${memuat ? 'chartline--memuat' : ''} ${className}`} aria-busy={memuat || undefined}>
      <div className="chartline__body" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={memuat ? dataMemuat : data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
            <XAxis
              dataKey={xKey}
              tick={{ fill: c.axis, fontSize: 11 }}
              axisLine={{ stroke: c.grid }}
              tickLine={false}
            />
            <YAxis
              tick={memuat ? false : { fill: c.axis, fontSize: 11 }}
              domain={memuat ? [0, 1] : undefined}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            {memuat ? (
              <Line
                type="monotone"
                dataKey={KUNCI_MEMUAT}
                className="chartline__muat"
                stroke={c.grid}
                strokeWidth={3}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            ) : null}
            {memuat ? null : (
            <Tooltip
              contentStyle={{
                background: c.tooltipBg,
                border: `1px solid ${c.grid}`,
                borderRadius: 8,
                fontSize: 11,
                color: c.tooltipText,
              }}
              labelStyle={{ color: c.axis }}
              cursor={{ stroke: c.grid }}
            />
            )}
            {memuat ? null : <Legend wrapperStyle={{ fontSize: 11 }} />}
            {!memuat && series.map((s, i) => {
              const stroke = s.color ?? seri[i % seri.length];
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
