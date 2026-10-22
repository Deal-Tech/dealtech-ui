import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ClipboardEvent,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';

import type { StatusTuang } from '@/components/ui/tombol-tuang/TombolTuang';
import './kode-otp.css';

type Fase = 'isi' | 'tumpuk' | 'hasil';

// Selaras dengan durasi di CSS
const TUMPUK_MS = 700;
const HASIL_MS = 1400;

const PERISAI =
  'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z';

export interface KodeOtpProps {
  /** Sama dengan status useMutation. */
  status: StatusTuang;
  onLengkap: (kode: string) => void;
  /** Dipanggil setelah animasi hasil selesai. */
  onSelesai?: (berhasil: boolean) => void;
  panjang?: number;
  disabled?: boolean;
  className?: string;
}

const hanyaAngka = (teks: string) => teks.replace(/\D/g, '');

function useFaseOtp(
  status: StatusTuang,
  kosongkan: () => void,
  onSelesai?: (berhasil: boolean) => void,
) {
  const [fase, setFase] = useState<Fase>('isi');
  const mulaiRef = useRef(0);

  const mulai = () => {
    mulaiRef.current = performance.now();
    setFase('tumpuk');
  };

  // Gagal: kotak kosong lagi
  const selesai = useEffectEvent(() => {
    const berhasil = status === 'success';
    if (!berhasil) kosongkan();
    onSelesai?.(berhasil);
  });

  // Tunggu kotak menumpuk dulu
  useEffect(() => {
    if (fase !== 'tumpuk') return undefined;
    if (status === 'idle') {
      setFase('isi');
      return undefined;
    }
    if (status === 'pending') return undefined;
    const sisa = Math.max(0, TUMPUK_MS - (performance.now() - mulaiRef.current));
    const timer = window.setTimeout(() => setFase('hasil'), sisa);
    return () => window.clearTimeout(timer);
  }, [fase, status]);

  useEffect(() => {
    if (fase !== 'hasil') return undefined;
    const timer = window.setTimeout(() => {
      setFase('isi');
      selesai();
    }, HASIL_MS);
    return () => window.clearTimeout(timer);
  }, [fase]);

  return { fase, mulai };
}

/** Kotak kode sekali pakai, menumpuk jadi perisai. */
export function KodeOtp({
  status,
  onLengkap,
  onSelesai,
  panjang = 6,
  disabled = false,
  className = '',
}: KodeOtpProps) {
  const [angka, setAngka] = useState<string[]>(() => Array.from({ length: panjang }, () => ''));
  const kotakRef = useRef<(HTMLInputElement | null)[]>([]);

  const fokus = (i: number) => kotakRef.current[Math.min(Math.max(i, 0), panjang - 1)]?.focus();

  const kosongkan = () => {
    setAngka(Array.from({ length: panjang }, () => ''));
    // Kotak baru aktif setelah render
    window.setTimeout(() => fokus(0), 0);
  };

  const { fase, mulai } = useFaseOtp(status, kosongkan, onSelesai);
  const terkunci = disabled || fase !== 'isi';

  const terapkan = (baru: string[]) => {
    setAngka(baru);
    if (baru.every(Boolean)) {
      mulai();
      onLengkap(baru.join(''));
    }
  };

  const isi = (dari: number, teks: string) => {
    const digit = hanyaAngka(teks).slice(0, panjang - dari).split('');
    if (digit.length === 0) return;
    const baru = [...angka];
    digit.forEach((d, j) => {
      baru[dari + j] = d;
    });
    terapkan(baru);
    fokus(dari + digit.length);
  };

  const tekan = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const baru = [...angka];
      const target = angka[i] ? i : i - 1;
      if (target < 0) return;
      baru[target] = '';
      setAngka(baru);
      fokus(target);
    } else if (e.key === 'ArrowLeft') fokus(i - 1);
    else if (e.key === 'ArrowRight') fokus(i + 1);
  };

  const tempel = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    isi(i, e.clipboardData.getData('text'));
  };

  const hasil = status === 'success' ? 'berhasil' : status === 'error' ? 'gagal' : undefined;

  return (
    <div
      className={`kode-otp ${className}`}
      data-fase={fase}
      data-hasil={fase === 'hasil' ? hasil : undefined}
      style={{ '--n': panjang } as CSSProperties}
    >
      <div className="kode-otp__kotak-wadah" role="group" aria-label="Kode verifikasi">
        {angka.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              kotakRef.current[i] = el;
            }}
            className="kode-otp__kotak"
            style={{ '--i': i } as CSSProperties}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            aria-label={`Angka ke-${i + 1}`}
            maxLength={panjang}
            value={d}
            disabled={terkunci}
            onChange={(e) => isi(i, e.target.value.slice(-1))}
            onKeyDown={(e) => tekan(i, e)}
            onPaste={(e) => tempel(i, e)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>

      <div className="kode-otp__perisai" aria-live="polite">
        <svg className="kode-otp__ikon" viewBox="0 0 24 24" aria-hidden="true">
          <path className="kode-otp__badan" d={PERISAI} />
          <path className="kode-otp__tanda kode-otp__tanda--centang" d="m9 12.5 2 2 4-4.5" />
          <path className="kode-otp__tanda kode-otp__tanda--silang" d="m9.5 9.5 5 5m0-5-5 5" />
        </svg>
        <span className="sr-only">
          {fase === 'hasil' ? (hasil === 'gagal' ? 'Kode ditolak' : 'Kode diterima') : ''}
        </span>
      </div>
    </div>
  );
}

export default KodeOtp;
