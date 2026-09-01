import { Loader2 } from 'lucide-react';

import './memuat.css';

export interface MemuatProps {
  /** Teks di sebelah pemutar. */
  teks?: string;
  ukuran?: 'layar' | 'halaman';
  className?: string;
}

export function Memuat({ teks = 'Memuat…', ukuran = 'halaman', className = '' }: MemuatProps) {
  return (
    <div className={`memuat memuat--${ukuran} ${className}`} role="status" aria-live="polite">
      <Loader2 className="memuat__putar" aria-hidden="true" />
      <span>{teks}</span>
    </div>
  );
}

export default Memuat;
