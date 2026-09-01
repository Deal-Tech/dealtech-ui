import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';

import './tombol-tautan.css';

export type TombolTautanVarian = 'primary' | 'putih' | 'garis' | 'garis-merek';
export type TombolTautanUkuran = 'sm' | 'md' | 'lg';

export interface TombolTautanProps extends Omit<LinkProps, 'className'> {
  varian?: TombolTautanVarian;
  ukuran?: TombolTautanUkuran;
  icon?: LucideIcon;
  ikonKanan?: boolean;
  className?: string;
}

export function TombolTautan({
  varian = 'primary',
  ukuran = 'md',
  icon: Ikon,
  ikonKanan = false,
  className = '',
  children,
  ...props
}: TombolTautanProps) {
  const ikon = Ikon ? <Ikon className="tombol-tautan__ikon" aria-hidden="true" /> : null;
  return (
    <Link
      className={`tombol-tautan tombol-tautan--${varian} tombol-tautan--${ukuran} ${className}`}
      {...props}
    >
      {ikonKanan ? null : ikon}
      <span>{children}</span>
      {ikonKanan ? ikon : null}
    </Link>
  );
}

export interface TombolAksiProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  varian?: TombolTautanVarian;
  ukuran?: TombolTautanUkuran;
  icon?: LucideIcon;
  className?: string;
}

export function TombolAksi({
  varian = 'primary',
  ukuran = 'md',
  icon: Ikon,
  className = '',
  children,
  ...props
}: TombolAksiProps) {
  return (
    <button
      type="button"
      className={`tombol-tautan tombol-tautan--${varian} tombol-tautan--${ukuran} ${className}`}
      {...props}
    >
      {Ikon ? <Ikon className="tombol-tautan__ikon" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}

export default TombolTautan;
