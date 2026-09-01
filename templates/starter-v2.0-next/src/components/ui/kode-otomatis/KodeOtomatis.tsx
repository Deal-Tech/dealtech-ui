import { Lock, Wand2 } from 'lucide-react';

import './kode-otomatis.css';

export interface KodeOtomatisProps {
  label: string;
  /** Kode yang ditampilkan. Saat menambah: pratinjau; saat mengubah: kode aslinya. */
  kode: string;
  /** true = kode sudah final; false = barangnya belum ada, jadi masih perkiraan. */
  tetap: boolean;
  /** Kalimat tambahan di bawah kode. Alasannya, bukan pengulangan aturannya. */
  keterangan?: string;
}

/**
 * Kode buatan sistem, ditampilkan sebagai keterangan — bukan `<input disabled>`,
 * yang tetap terlihat seperti sesuatu yang seharusnya bisa diisi.
 *
 * Saat menambah barang kodenya masih PERKIRAAN: server bisa menambah angka
 * pembeda, jadi kalimatnya menyebut "kira-kira".
 */
export function KodeOtomatis({ label, kode, tetap, keterangan }: KodeOtomatisProps) {
  return (
    <div className="kode-otomatis">
      <span className="kode-otomatis__label">{label}</span>

      <div className="kode-otomatis__kotak">
        {tetap ? (
          <Lock className="kode-otomatis__ikon" aria-hidden />
        ) : (
          <Wand2 className="kode-otomatis__ikon" aria-hidden />
        )}
        <code className="kode-otomatis__kode">{kode || '—'}</code>
        <span className="kode-otomatis__tanda">
          {tetap ? 'dibuat sistem' : 'kira-kira jadi ini'}
        </span>
      </div>

      {keterangan ? <p className="kode-otomatis__ket">{keterangan}</p> : null}
    </div>
  );
}

export default KodeOtomatis;
