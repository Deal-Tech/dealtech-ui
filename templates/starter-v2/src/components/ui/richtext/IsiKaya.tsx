import { useMemo } from 'react';

import { sanitasiHtml } from './RichText';
import './richtext.css';

export interface IsiKayaProps {
  html: string;
  className?: string;
}

/** Menampilkan isi yang ditulis lewat `RichText`. */
export function IsiKaya({ html, className = '' }: IsiKayaProps) {
  const bersih = useMemo(() => sanitasiHtml(html ?? ''), [html]);

  // Penyaring di klien ini LAPISAN KEDUA, bukan pengaman utama: pertahanan
  // sebenarnya di server Go, yang menyaring setiap kali isi ini ditulis.
  return (
    <div
      className={`richtext-isi ${className}`}
      dangerouslySetInnerHTML={{ __html: bersih }}
    />
  );
}

export default IsiKaya;
