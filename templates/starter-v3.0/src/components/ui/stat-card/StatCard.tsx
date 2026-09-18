import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

import { fmtCompact } from '@/lib/format';
import './stat-card.css';

/** Angka menghitung naik saat pertama tampil. Hormati prefers-reduced-motion. */
function AngkaNaik({ value, duration = 650 }: { value: string | number; duration?: number }) {
  const raw = String(value);
  const m = raw.match(/-?\d[\d.,]*/);
  const target = m ? Number(m[0].replace(/\./g, '').replace(',', '.')) : NaN;
  const bisa = !!m && Number.isFinite(target);
  const awalan = bisa && m ? raw.slice(0, m.index) : '';
  const akhiran = bisa && m ? raw.slice((m.index ?? 0) + m[0].length) : '';
  const desimal = bisa && m && m[0].includes(',') ? (m[0].split(',')[1]?.length ?? 0) : 0;
  const fmt = (n: number) =>
    n.toLocaleString('id-ID', {
      minimumFractionDigits: desimal,
      maximumFractionDigits: desimal,
    });

  const [tampil, setTampil] = useState<string | number>(
    bisa ? `${awalan}${fmt(0)}${akhiran}` : value,
  );
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!bisa || !m) {
      setTampil(value);
      return undefined;
    }
    const redam =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (redam) {
      setTampil(value);
      return undefined;
    }
    const mulai = performance.now();
    const detak = (kini: number) => {
      const p = Math.min((kini - mulai) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      if (p < 1) {
        setTampil(`${awalan}${fmt(target * eased)}${akhiran}`);
        rafRef.current = requestAnimationFrame(detak);
      } else {
        setTampil(value);
      }
    };
    rafRef.current = requestAnimationFrame(detak);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{tampil}</>;
}

export type NadaStat = 'naik' | 'turun' | 'datar';

export interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  helper?: string | null;
  nada?: NadaStat;
  helperTitle?: string;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  helper = null,
  nada = 'datar',
  helperTitle,
}: StatCardProps) {
  const display = typeof value === 'number' ? fmtCompact(value) : value;
  const len = String(display).length;
  const sizeClass =
    len > 20
      ? 'stat-card__value--xxs'
      : len > 16
        ? 'stat-card__value--xs'
        : len > 12
          ? 'stat-card__value--sm'
          : '';

  return (
    <div className="stat-card">
      <span className="stat-card__icon">
        <Icon className="h-5 w-5" />
      </span>
      <div className="stat-card__body">
        <span className="stat-card__title">{title}</span>
        <span className={`stat-card__value ${sizeClass}`}>
          <AngkaNaik value={display} />
        </span>
      </div>
      {helper ? (
        <span className={`stat-card__badge stat-card__badge--${nada}`} title={helperTitle}>
          {helper}
        </span>
      ) : null}
    </div>
  );
}

export default StatCard;
