import { LabelQR } from '@/components/ui/label-qr/LabelQR';

import './lembar-cetak.css';

export interface BarisLabel {
  kode: string;
  judul: string;
  /** Satu larik satu baris, maksimal dua. */
  rincian?: string[];
}

export const LABEL_PER_LEMBAR_A4 = 102;

export function lembarA4(jumlahLabel: number): number {
  return Math.max(1, Math.ceil(jumlahLabel / LABEL_PER_LEMBAR_A4));
}

export interface LembarCetakProps {
  label: BarisLabel[];
  judul: string;
  subjudul?: string;
  className?: string;
}

export function LembarCetak({ label, judul, subjudul, className = '' }: LembarCetakProps) {
  return (
    <div className={`lembar-cetak ${className}`}>
      <div className="lembar-cetak__kepala">
        <span className="lembar-cetak__judul">{judul}</span>
        {subjudul ? <span className="lembar-cetak__subjudul">{subjudul}</span> : null}
      </div>

      <div className="lembar-cetak__grid">
        {label.map((l, i) => (
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
