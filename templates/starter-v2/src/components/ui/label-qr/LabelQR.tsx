import { QRCodeSVG } from 'qrcode.react';

import './label-qr.css';

export interface LabelQRProps {
  /** Isi QR, sekaligus baris terakhir label. */
  kode: string;
  judul: string;
  /**
   * Satu larik satu baris, maksimal dua. Ruang teksnya cuma 16,8 mm — ukuran
   * dan warna digabung jadi satu baris pasti kena elipsis.
   */
  rincian?: string[];
  className?: string;
}

/**
 * Label 33 × 15 mm: QR di kiri, judul + rincian + kode di kanan.
 *
 * QR digambar dari kodenya, tidak pernah disimpan sebagai berkas gambar — label
 * yang sudah tertempel di kardus tetap cocok walau dicetak ulang kapan pun.
 * SVG, bukan canvas, supaya tajam di DPI berapa pun.
 */
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
