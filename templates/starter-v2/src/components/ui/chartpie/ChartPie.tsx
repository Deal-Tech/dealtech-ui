import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { SERIES_COLORS, chartColors } from '@/lib/chart';
import './chartpie.css';

export interface ChartPieDatum {
  name: string;
  value: number;
  color?: string;
}

export interface ChartPieProps {
  title: string;
  subtitle?: string;
  data: ChartPieDatum[];
  height?: number;
  valueFormatter?: (v: number) => string;
  showSummary?: boolean;
  showLegend?: boolean;
  className?: string;
}

export function ChartPie({
  title,
  subtitle,
  data,
  height = 240,
  valueFormatter = (v) => String(v),
  showSummary = true,
  showLegend = false,
  className = '',
}: ChartPieProps) {
  const c = chartColors();
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const colorAt = (d: ChartPieDatum, i: number) => d.color ?? SERIES_COLORS[i % SERIES_COLORS.length];

  return (
    <section className={`chartpie ${className}`}>
      <div className="chartpie__header">
        <h2 className="chartpie__title">{title}</h2>
        {subtitle ? <p className="chartpie__subtitle">{subtitle}</p> : null}
      </div>

      <div className="chartpie__body">
        <div className="chartpie__chart" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={colorAt(d, i)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => valueFormatter(Number(value))}
                contentStyle={{
                  background: c.tooltipBg,
                  border: `1px solid ${c.grid}`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: c.tooltipText,
                }}
                labelStyle={{ color: c.axis }}
                itemStyle={{ color: c.tooltipText }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {showLegend ? (
          <ul className="chartpie__legend">
            {data.map((d, i) => (
              <li key={d.name} className="chartpie__legend-item">
                <span className="chartpie__swatch" style={{ background: colorAt(d, i) }} />
                <span className="chartpie__legend-name">{d.name}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {showSummary ? (
          <div className="chartpie__summary">
            {data.map((d, i) => (
              <div key={d.name} className="chartpie__summary-item">
                <div className="chartpie__summary-head">
                  <span className="chartpie__dot" style={{ background: colorAt(d, i) }} />
                  <span className="chartpie__summary-name">{d.name}</span>
                </div>
                <p className="chartpie__summary-value">{valueFormatter(d.value)}</p>
                <p className="chartpie__summary-pct">{((d.value / total) * 100).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default ChartPie;
