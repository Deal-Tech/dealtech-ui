import { ChevronDown, type LucideIcon } from 'lucide-react';

import './bilah-lipat.css';

export interface BilahLipatProps {
  terbuka: boolean;
  onToggle: () => void;
  /** Keterangan di bilah. Isinya boleh berubah mengikuti keadaan buka/tutup. */
  teks: string;
  /** Kata aksi bergaris bawah di ujung keterangan, mis. "Buka Sekarang". */
  aksi?: string;
  /** Ganti panahnya. Lihat catatan di bawah sebelum memakainya. */
  ikon?: LucideIcon;
  className?: string;
}

/**
 * BilahLipat — bilah tipis pembuka/penutup untuk bagian yang panjang.
 *
 * Dipakai di atas bagian yang dilipat, bukan di dalamnya: saat tertutup,
 * bilahnya sendiri yang menyimpan ringkasan isinya, jadi yang tersembunyi tetap
 * terbaca sekilas tanpa harus dibuka.
 *
 * Seluruh bilah bisa diklik, bukan cuma kata aksinya — sasaran klik yang lebar
 * lebih enak dipakai, terutama di layar sentuh.
 */
export function BilahLipat({
  terbuka,
  onToggle,
  teks,
  aksi,
  ikon: Ikon,
  className = '',
}: BilahLipatProps) {
  /* Tanpa ikon khusus, panahnya berputar mengikuti keadaan. Dengan ikon, bilah
     ini dipakai sebagai aksi biasa — panah yang berputar di situ menjanjikan
     lipatan yang tidak ada, jadi putarannya ikut dimatikan. */
  const Gambar = Ikon ?? ChevronDown;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={Ikon ? undefined : terbuka}
      className={`bilah-lipat ${className}`}
    >
      <Gambar
        className={`bilah-lipat__ikon${Ikon || terbuka ? '' : ' bilah-lipat__ikon--tutup'}`}
      />
      <span className="bilah-lipat__teks">{teks}</span>
      {aksi ? <span className="bilah-lipat__aksi">{aksi}</span> : null}
    </button>
  );
}

export default BilahLipat;
