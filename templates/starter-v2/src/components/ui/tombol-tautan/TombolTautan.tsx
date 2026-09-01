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
  /** Ikon di KANAN teks. Untuk panah "lanjut ke sana", arahnya jadi masuk akal. */
  ikonKanan?: boolean;
  className?: string;
}

/**
 * Tautan rute yang tampil sebagai tombol pil. Sengaja `<Link>`, bukan `<Button>`:
 * tujuannya berpindah halaman, jadi harus bisa dibuka di tab baru dan di-hover URL-nya.
 */
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

/**
 * Kembaran `TombolTautan` untuk aksi di halaman yang sama (muat lagi, buka,
 * tutup). Sengaja berbagi CSS yang sama persis: dua berkas gaya untuk satu
 * bentuk tombol adalah cara tercepat membuat keduanya pelan-pelan berbeda.
 */
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
