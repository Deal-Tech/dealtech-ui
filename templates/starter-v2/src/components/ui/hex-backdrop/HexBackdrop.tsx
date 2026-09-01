import { useId } from 'react';

import './hex-backdrop.css';

const UBIN = { lebar: 69.282, tinggi: 120 } as const;

/** Heksagon pointy-top, R = 40: lebar ubin √3·R, tinggi 3·R. */
const JALUR = [
  'M34.641 0 L69.282 20 L69.282 60 L34.641 80 L0 60 L0 20 Z',
  'M0 60 L34.641 80 L34.641 120 L0 140 L-34.641 120 L-34.641 80 Z',
  'M69.282 60 L103.923 80 L103.923 120 L69.282 140 L34.641 120 L34.641 80 Z',
].join(' ');

/**
 * Latar sarang lebah DealTech — glow radial + pola heksagon. Dipakai bersama
 * `LogoShape` di atas wadah berlatar `--color-hero-base`.
 */
export default function HexBackdrop({ className }: { className?: string }) {
  // id pola wajib unik per instance: satu halaman bisa memuat komponen ini berkali-kali.
  const idPola = useId();

  return (
    <div className={`hex-backdrop${className ? ` ${className}` : ''}`} aria-hidden="true">
      <div className="hex-backdrop__glow" />

      <svg className="hex-backdrop__grid" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={idPola}
            width={UBIN.lebar}
            height={UBIN.tinggi}
            patternUnits="userSpaceOnUse"
          >
            <path d={JALUR} fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${idPola})`} />
      </svg>
    </div>
  );
}
