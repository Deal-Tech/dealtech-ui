import { Lock, Wand2 } from 'lucide-react';

import './kode-otomatis.css';

export interface KodeOtomatisProps {
  label: string;
  kode: string;
  tetap: boolean;
  keterangan?: string;
}

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
