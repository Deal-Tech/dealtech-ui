import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { chartColors } from '@/lib/chart';
import './chartbar-ganda.css';

export interface ChartBarGandaDatum {
  label: string;
  a: number;
  b: number;
}

export interface ChartBarGandaProps {
  title: string;
  subtitle?: string;
  data: ChartBarGandaDatum[];
  /** Nama seri pertama, mis. "Bagus". */
  namaA: string;
  /** Nama seri kedua, mis. "Gagal". */
  namaB: string;
  warnaA?: string;
  warnaB?: string;
  height?: number;
  className?: string;
}

/**
 * Dua batang bersebelahan per titik, bukan bertumpuk: pertanyaannya "berapa yang
 * gagal dibanding yang jadi" — perbandingan dua nilai, bukan pembagian satu.
 */
export function ChartBarGanda({
  title,
  subtitle,
  data,
  namaA,
  namaB,
  warnaA,
  warnaB,
  height = 280,
  className = '',
}: ChartBarGandaProps) {
  const c = chartColors();

  return (
    <section className={`chartbar-ganda ${className}`}>
      <div className="chartbar-ganda__header">
        <h2 className="chartbar-ganda__title">{title}</h2>
        {subtitle ? <p className="chartbar-ganda__subtitle">{subtitle}</p> : null}
      </div>
      <div className="chartbar-ganda__body" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: c.axis, fontSize: 12 }}
              axisLine={{ stroke: c.grid }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: c.axis, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
              allowDecimals={false}
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
            <Legend wrapperStyle={{ fontSize: 12, color: c.axis }} />
            <Bar dataKey="a" name={namaA} fill={warnaA ?? c.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="b" name={namaB} fill={warnaB ?? '#9ca3af'} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ChartBarGanda;
