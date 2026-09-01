import { Loader2 } from 'lucide-react';

import './memuat.css';

export interface MemuatProps {
  /** Teks di sebelah pemutar. */
  teks?: string;
  /**
   * `layar` — setinggi layar penuh, untuk gerbang sebelum aplikasi tampil.
   * `halaman` — setinggi isi halaman, untuk halaman detail yang datanya belum datang.
   */
  ukuran?: 'layar' | 'halaman';
  className?: string;
}

/**
 * Penanda sedang memuat — satu bentuk untuk seluruh aplikasi.
 *
 * Halaman DETAIL: pakai ini menggantikan seluruh isi. Halaman DAFTAR: jangan,
 * pakai `emptyText` pada tabelnya supaya kerangkanya tetap terlihat.
 */
export function Memuat({ teks = 'Memuat…', ukuran = 'halaman', className = '' }: MemuatProps) {
  return (
    <div className={`memuat memuat--${ukuran} ${className}`} role="status" aria-live="polite">
      <Loader2 className="memuat__putar" aria-hidden="true" />
      <span>{teks}</span>
    </div>
  );
}

export default Memuat;
