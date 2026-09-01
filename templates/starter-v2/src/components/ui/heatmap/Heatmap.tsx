import './heatmap.css';

export interface HeatmapProps {
  title: string;
  subtitle?: string;
  rows: string[];
  cols: string[];
  values: number[][];
  color?: string;
  className?: string;
}

export function Heatmap({
  title,
  subtitle,
  rows,
  cols,
  values,
  color = 'var(--app-primary)',
  className = '',
}: HeatmapProps) {
  const max = Math.max(1, ...values.flat());
  const cellBg = (v: number): string | undefined => {
    if (v <= 0) return undefined; // kosong → pakai default CSS
    const pct = Math.round((0.18 + (v / max) * 0.82) * 100);
    return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
  };

  return (
    <section className={`heatmap ${className}`}>
      <div className="heatmap__header">
        <h2 className="heatmap__title">{title}</h2>
        {subtitle ? <p className="heatmap__subtitle">{subtitle}</p> : null}
      </div>

      <div className="heatmap__body">
        <div className="heatmap__scroll">
          <table className="heatmap__table">
            <thead>
              <tr>
                <th />
                {cols.map((col) => (
                  <th key={col} className="heatmap__col-head">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row}>
                  <td className="heatmap__row-head">{row}</td>
                  {cols.map((col, ci) => {
                    const v = values[ri]?.[ci] ?? 0;
                    return (
                      <td key={col} className="heatmap__cell-td">
                        <div
                          className="heatmap__cell"
                          style={{ backgroundColor: cellBg(v) }}
                          title={`${row} · ${col}: ${v}`}
                        >
                          {v > 0 ? <span className="heatmap__cell-val">{v}</span> : null}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="heatmap__legend">
          <span>Intensitas:</span>
          <span className="heatmap__legend-item">
            <span className="heatmap__legend-swatch heatmap__legend-swatch--empty" />0
          </span>
          <span className="heatmap__legend-item">
            <span
              className="heatmap__legend-swatch"
              style={{ backgroundColor: `color-mix(in srgb, ${color} 30%, transparent)` }}
            />
            Rendah
          </span>
          <span className="heatmap__legend-item">
            <span
              className="heatmap__legend-swatch"
              style={{ backgroundColor: `color-mix(in srgb, ${color} 60%, transparent)` }}
            />
            Sedang
          </span>
          <span className="heatmap__legend-item">
            <span className="heatmap__legend-swatch" style={{ backgroundColor: color }} />
            Tinggi
          </span>
        </div>
      </div>
    </section>
  );
}

export default Heatmap;
