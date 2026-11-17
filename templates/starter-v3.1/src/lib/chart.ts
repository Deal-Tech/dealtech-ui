// Ikut warna tema aktif
function varTema(nama: string, cadangan: string): string {
  if (typeof document === 'undefined') return cadangan;
  return getComputedStyle(document.documentElement).getPropertyValue(nama).trim() || cadangan;
}

export function seriesColors(): string[] {
  return [
    varTema('--color-primary', '#01498b'),
    varTema('--color-primary-darker', '#012c54'),
    varTema('--color-accent', '#0a6bc4'),
    '#111111', // hitam
    '#9ca3af', // netral lembut
  ];
}

export interface ChartColors {
  grid: string;
  axis: string;
  primary: string;
  tooltipBg: string;
  tooltipText: string;
  cursor: string;
  dotFill: string;
}

export function chartColors(): ChartColors {
  return {
    grid: 'rgba(0,0,0,0.09)',
    axis: 'rgba(0,0,0,0.58)',
    primary: varTema('--color-primary', '#01498b'),
    tooltipBg: '#ffffff',
    tooltipText: '#000000',
    cursor: 'rgba(0,0,0,0.04)',
    dotFill: '#ffffff',
  };
}
