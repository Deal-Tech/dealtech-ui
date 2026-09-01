import { LabelQR } from '@/components/ui/label-qr/LabelQR';

import './lembar-cetak.css';

export interface BarisLabel {
  kode: string;
  judul: string;
  /** Satu larik satu baris, maksimal dua. */
  rincian?: string[];
}

/**
 * Kapasitas satu lembar A4 — 6 kolom × 17 baris.
 *
 * DIUKUR, bukan dihitung: ubah apa pun di `lembar-cetak.css`, ukur ulang.
 */
export const LABEL_PER_LEMBAR_A4 = 102;

export function lembarA4(jumlahLabel: number): number {
  return Math.max(1, Math.ceil(jumlahLabel / LABEL_PER_LEMBAR_A4));
}

export interface LembarCetakProps {
  label: BarisLabel[];
  /** Kepala lembar — hanya muncul di kertas. */
  judul: string;
  subjudul?: string;
  className?: string;
}

/**
 * Lembar label: kisi pratinjau di layar, dan **isi cetakan yang sebenarnya** —
 * tombol Cetak memanggil `window.print()` pada halaman ini.
 */
export function LembarCetak({ label, judul, subjudul, className = '' }: LembarCetakProps) {
  return (
    <div className={`lembar-cetak ${className}`}>
      <div className="lembar-cetak__kepala">
        <span className="lembar-cetak__judul">{judul}</span>
        {subjudul ? <span className="lembar-cetak__subjudul">{subjudul}</span> : null}
      </div>

      <div className="lembar-cetak__grid">
        {label.map((l, i) => (
          // Pembungkus jadi acuan lebar label saat pratinjau.
          <div key={`${l.kode}-${i}`} className="lembar-cetak__sel">
            <LabelQR
              className="label-qr--pratinjau"
              kode={l.kode}
              judul={l.judul}
              rincian={l.rincian}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LembarCetak;
