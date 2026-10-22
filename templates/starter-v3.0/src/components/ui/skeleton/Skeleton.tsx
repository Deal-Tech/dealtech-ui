import type { CSSProperties, ReactNode } from 'react';

import './skeleton.css';

// teks: setinggi huruf induknya
export type BentukSkeleton = 'teks' | 'kotak' | 'pil' | 'bulat';

export interface SkeletonProps {
  bentuk?: BentukSkeleton;
  lebar?: number | string;
  tinggi?: number | string;
  /** Elemen asli, ukurannya ditiru. */
  children?: ReactNode;
  /** Selebar wadah, untuk elemen blok. */
  blok?: boolean;
  className?: string;
}

export function Skeleton({
  bentuk = 'teks',
  lebar,
  tinggi,
  children,
  blok = false,
  className = '',
}: SkeletonProps) {
  const gaya: CSSProperties = { width: lebar, height: tinggi };
  const bungkus = children ? 'skeleton--bungkus' : '';
  return (
    <span
      className={`skeleton skeleton--${bentuk} ${bungkus} ${blok ? 'skeleton--blok' : ''} ${className}`}
      style={gaya}
      aria-hidden="true"
      inert
    >
      {children}
    </span>
  );
}

export interface SkeletonTeksProps {
  /** Lebar tiap baris. */
  baris?: (number | string)[];
  className?: string;
}

const BARIS_PARAGRAF = ['100%', '94%', '62%'];

export function SkeletonTeks({ baris = BARIS_PARAGRAF, className = '' }: SkeletonTeksProps) {
  return (
    <div className={`skeleton-teks ${className}`} aria-hidden="true">
      {baris.map((lebar, i) => (
        <div key={i}>
          <Skeleton lebar={lebar} />
        </div>
      ))}
    </div>
  );
}

export interface SkeletonBilaProps extends Omit<SkeletonProps, 'children'> {
  memuat: boolean;
  children: ReactNode;
}

// Isi asli, atau skeleton seukurannya
export function SkeletonBila({ memuat, children, bentuk = 'kotak', ...sisa }: SkeletonBilaProps) {
  if (!memuat) return <>{children}</>;
  return (
    <Skeleton bentuk={bentuk} {...sisa}>
      {children}
    </Skeleton>
  );
}

export interface SkeletonHalamanProps {
  /** Dibacakan pembaca layar. */
  teks?: string;
  className?: string;
  children: ReactNode;
}

export function SkeletonHalaman({ teks = 'Memuat…', className = '', children }: SkeletonHalamanProps) {
  return (
    <div className={className} aria-busy="true">
      {children}
      {/* Terakhir, agar space-y utuh */}
      <span className="skeleton-sr" role="status">
        {teks}
      </span>
    </div>
  );
}

export default Skeleton;
