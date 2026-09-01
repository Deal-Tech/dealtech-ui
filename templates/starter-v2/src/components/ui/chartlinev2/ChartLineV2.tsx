import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { SERIES_COLORS, chartColors } from '@/lib/chart';
import './chartlinev2.css';

export interface ChartLineV2Series {
  key: string;
  label: string;
  color?: string;
}

export interface ChartLineV2Props {
  title: string;
  subtitle?: string;
  data: Array<Record<string, string | number>>;
  xKey: string;
  series: ChartLineV2Series[];
  height?: number;
  showTable?: boolean;
  className?: string;
}

export function ChartLineV2({
  title,
  subtitle,
  data,
  xKey,
  series,
  height = 300,
  showTable = true,
  className = '',
}: ChartLineV2Props) {
  const c = chartColors();
  const colorAt = (s: ChartLineV2Series, i: number) =>
    s.color ?? SERIES_COLORS[i % SERIES_COLORS.length];

  const summary = series.map((s, i) => {
    const values = data.map((row) => Number(row[s.key] ?? 0));
    const total = values.reduce((a, b) => a + b, 0);
    const bestIdx = values.length ? values.indexOf(Math.max(...values)) : -1;
    return {
      label: s.label,
      color: colorAt(s, i),
      total,
      bestLabel: bestIdx >= 0 ? String(data[bestIdx][xKey]) : '-',
      bestValue: bestIdx >= 0 ? values[bestIdx] : 0,
    };
  });

  return (
    <section className={`chartlinev2 ${className}`}>
      <div className="chartlinev2__header">
        <h2 className="chartlinev2__title">{title}</h2>
        {subtitle ? <p className="chartlinev2__subtitle">{subtitle}</p> : null}
      </div>

      <div className="chartlinev2__body">
        <div className="chartlinev2__legend">
          {series.map((s, i) => (
            <span key={s.key} className="chartlinev2__legend-item">
              <span className="chartlinev2__legend-dot" style={{ background: colorAt(s, i) }} />
              {s.label}
            </span>
          ))}
        </div>

        <div className="chartlinev2__chart" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
              <XAxis
                dataKey={xKey}
                tick={{ fill: c.axis, fontSize: 11 }}
                axisLine={{ stroke: c.grid }}
                tickLine={{ stroke: c.grid }}
              />
              <YAxis
                tick={{ fill: c.axis, fontSize: 11 }}
                axisLine={{ stroke: c.grid }}
                tickLine={{ stroke: c.grid }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  background: c.tooltipBg,
                  border: `1px solid ${c.grid}`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: c.tooltipText,
                }}
                labelStyle={{ color: c.axis, fontWeight: 600 }}
                cursor={{ stroke: c.grid }}
              />
              {series.map((s, i) => {
                const stroke = colorAt(s, i);
                return (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.label}
                    stroke={stroke}
                    strokeWidth={2.5}
                    dot={{ fill: c.dotFill, stroke, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke, strokeWidth: 2, fill: stroke }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {showTable ? (
          <div className="chartlinev2__table-scroll">
            <table className="chartlinev2__table">
              <thead>
                <tr>
                  <th className="chartlinev2__th">No</th>
                  <th className="chartlinev2__th">Item</th>
                  <th className="chartlinev2__th chartlinev2__th--right">Total Qty</th>
                  <th className="chartlinev2__th chartlinev2__th--right">Bulan Terbaik</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((row, i) => (
                  <tr key={row.label} className="chartlinev2__row">
                    <td className="chartlinev2__td chartlinev2__td--muted">{i + 1}</td>
                    <td className="chartlinev2__td">
                      <span className="chartlinev2__item">
                        <span
                          className="chartlinev2__item-dot"
                          style={{ background: row.color }}
                        />
                        {row.label}
                      </span>
                    </td>
                    <td className="chartlinev2__td chartlinev2__td--right chartlinev2__td--strong">
                      {row.total}
                    </td>
                    <td className="chartlinev2__td chartlinev2__td--right chartlinev2__td--muted">
                      {row.bestLabel} ({row.bestValue})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default ChartLineV2;
