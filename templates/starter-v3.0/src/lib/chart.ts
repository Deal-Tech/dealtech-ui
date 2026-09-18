export const SERIES_COLORS = [
  '#01498b', // primary
  '#012c54', // primary darker
  '#0a6bc4', // accent
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
    primary: '#01498b',
    tooltipBg: '#ffffff',
    tooltipText: '#000000',
    cursor: 'rgba(0,0,0,0.04)',
    dotFill: '#ffffff',
  };
}
