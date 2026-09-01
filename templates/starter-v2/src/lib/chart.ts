export const SERIES_COLORS = [
  '#066aca', // primary
  '#0a3f73', // primary darker
  '#1184df', // accent
  '#111111', // hitam
  '#9ca3af', // netral lembut
];

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
    primary: '#066aca',
    tooltipBg: '#ffffff',
    tooltipText: '#000000',
    cursor: 'rgba(0,0,0,0.04)',
    dotFill: '#ffffff',
  };
}
