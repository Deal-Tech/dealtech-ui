import { QRCodeSVG } from 'qrcode.react';

import './label-qr.css';

export interface LabelQRProps {
  /** Isi QR, sekaligus baris terakhir label. */
  kode: string;
  judul: string;
  rincian?: string[];
  className?: string;
}

export function LabelQR({ kode, judul, rincian = [], className = '' }: LabelQRProps) {
  return (
    <div className={`label-qr ${className}`}>
      {/* Level M: tahan kerusakan ~15%, tanpa membuat kotaknya terlalu rapat di 13 mm. */}
      <QRCodeSVG value={kode} level="M" marginSize={0} className="label-qr__kode" />
      <div className="label-qr__teks">
        <span className="label-qr__judul">{judul}</span>
        {rincian
          .filter(Boolean)
          .slice(0, 2)
          .map((baris) => (
            <span key={baris} className="label-qr__rincian">
              {baris}
            </span>
          ))}
        <span className="label-qr__nomor">{kode}</span>
      </div>
    </div>
  );
}

export default LabelQR;
