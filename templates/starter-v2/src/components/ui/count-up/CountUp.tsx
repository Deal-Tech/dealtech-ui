import { useEffect, useRef, useState } from 'react';

export interface CountUpProps {
  value: string | number;
  duration?: number;
}

export function CountUp({ value, duration = 650 }: CountUpProps) {
  const raw = String(value);
  const m = raw.match(/-?\d[\d.,]*/);
  const target = m ? Number(m[0].replace(/\./g, '').replace(',', '.')) : NaN;
  const animatable = !!m && Number.isFinite(target);
  const prefix = animatable && m ? raw.slice(0, m.index) : '';
  const suffix = animatable && m ? raw.slice((m.index ?? 0) + m[0].length) : '';
  const decimals = animatable && m && m[0].includes(',') ? m[0].split(',')[1]?.length ?? 0 : 0;
  const fmt = (n: number) =>
    n.toLocaleString('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const [display, setDisplay] = useState<string | number>(
    animatable ? `${prefix}${fmt(0)}${suffix}` : value,
  );
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!animatable || !m) {
      setDisplay(value);
      return undefined;
    }
    const reduce =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(value);
      return undefined;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      if (p < 1) {
        setDisplay(`${prefix}${fmt(target * eased)}${suffix}`);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(value); // tampilkan string asli persis di akhir
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display}</>;
}

export default CountUp;
