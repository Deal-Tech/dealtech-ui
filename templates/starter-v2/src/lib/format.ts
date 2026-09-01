export function fmtCompact(value: number | string): string {
  const n = Number(value) || 0;
  const abs = Math.abs(n);
  const f = (v: number) => {
    const s = v.toFixed(1).replace('.', ',');
    return s.endsWith(',0') ? s.slice(0, -2) : s;
  };
  if (abs >= 1e12) return f(n / 1e12) + 'T'; // triliun
  if (abs >= 1e9) return f(n / 1e9) + 'M'; // miliar
  if (abs >= 1e6) return f(n / 1e6) + 'jt'; // juta
  if (abs >= 1e3) return f(n / 1e3) + 'rb'; // ribu
  return String(n);
}

export function fmtCount(value: number): number | string {
  const n = Number(value) || 0;
  return n > 99 ? '99+' : n;
}

export default fmtCompact;
