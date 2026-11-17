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

  return (
    <div
      className={`richtext-isi ${className}`}
      dangerouslySetInnerHTML={{ __html: bersih }}
    />
  );
}

export default IsiKaya;
