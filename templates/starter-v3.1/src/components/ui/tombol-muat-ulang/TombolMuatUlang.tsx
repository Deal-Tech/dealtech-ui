import { useEffect, useRef, useState } from 'react';
import { Check, RefreshCw } from 'lucide-react';

import type { ButtonVariant } from '@/components/ui/button/Button';
import type { AksiTuang } from '@/components/ui/tombol-tuang/useAksiTuang';
import '@/components/ui/button/button.css';
import './tombol-muat-ulang.css';

type Fase = 'diam' | 'putar' | 'centang';

// Selaras dengan durasi di CSS
const PUTAR_MS = 225;
const CENTANG_MS = 225;

export interface TombolMuatUlangProps {
  /** Ambil ulang data; dijalankan sesudah animasi. */
  onClick: AksiTuang;
  children?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
}

/**
 * Tombol Refresh: ikon berputar, jadi centang, lalu data dimuat ulang.
 */
export function TombolMuatUlang({
  onClick,
  children = 'Refresh',
  variant = 'ghost',
  disabled = false,
  className = '',
}: TombolMuatUlangProps) {
  const [fase, setFase] = useState<Fase>('diam');
  const aksiRef = useRef(onClick);

  useEffect(() => {
    aksiRef.current = onClick;
  });

  useEffect(() => {
    if (fase === 'diam') return undefined;
    const timer = window.setTimeout(() => {
      if (fase === 'putar') {
        setFase('centang');
        return;
      }
      setFase('diam');
      // Galat ditangani halaman
      void Promise.resolve()
        .then(aksiRef.current)
        .catch(() => undefined);
    }, fase === 'putar' ? PUTAR_MS : CENTANG_MS);
    return () => window.clearTimeout(timer);
  }, [fase]);

  const aktif = fase !== 'diam';
  const Ikon = fase === 'centang' ? Check : RefreshCw;

  return (
    <button
      type="button"
      className={`btn btn--${variant} tombol-muat-ulang ${aktif ? 'btn--loading' : ''} ${className}`}
      data-fase={fase}
      disabled={disabled || aktif}
      aria-busy={aktif}
      onClick={() => setFase('putar')}
    >
      <Ikon key={fase === 'centang' ? 'centang' : 'muat'} className="btn__icon tombol-muat-ulang__ikon" />
      <span>{children}</span>
    </button>
  );
}

export default TombolMuatUlang;
