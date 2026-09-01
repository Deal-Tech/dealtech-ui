import { Printer } from 'lucide-react';

import { Button } from '@/components/ui/button/Button';
import { LABEL_PER_LEMBAR_A4, lembarA4 } from '@/components/ui/lembar-cetak/LembarCetak';

import './tombol-cetak.css';

export interface TombolCetakProps {
  jumlah: number;
  /** Tanpa keterangan di bawah tombol — untuk baris yang rata bawah. */
  ringkas?: boolean;
}

/**
 * Tombol cetak: langsung `window.print()`, tanpa berkas perantara.
 *
 * Jalur PDF-lewat-iframe pernah dicoba dan dibuang — CSP aplikasi ini memblokir
 * `blob:` sebagai bingkai, dan jangan dilonggarkan demi tombol cetak.
 */
export function TombolCetak({ jumlah, ringkas = false }: TombolCetakProps) {
  return (
    <div className="tombol-cetak">
      <div className="tombol-cetak__baris">
        <Button icon={Printer} disabled={jumlah === 0} onClick={() => window.print()}>
          Cetak
        </Button>
      </div>

      {!ringkas && jumlah > 0 ? (
        <p className="tombol-cetak__ket">
          {jumlah} label — <strong>{lembarA4(jumlah)} lembar A4</strong>, {LABEL_PER_LEMBAR_A4} label
          per lembar. Garis putus-putus adalah tempat menggunting. Ukuran kertas dipilih di dialog
          cetak; di kertas yang lebih panjang seperti F4, lembarnya bisa lebih sedikit.
        </p>
      ) : null}
    </div>
  );
}

export default TombolCetak;
