import { forwardRef, useEffect, useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { Check, ExternalLink, Unlink } from 'lucide-react';

import { Button } from '@/components/ui/button/Button';
import { InputText } from '@/components/ui/inputtext/InputText';

const LEBAR_GELEMBUNG = 320;
const JARAK_GELEMBUNG = 8;
const TEPI_PANAH = 14;

export type PosisiGelembung = { top: number; left: number; lebar: number; panah: number };

// Baris terakhir tautan multi-baris.
export function rectTerakhir(sumber: Element | Range): DOMRect {
  const daftar = sumber.getClientRects();
  return daftar.length > 0 ? daftar[daftar.length - 1] : sumber.getBoundingClientRect();
}

export function hitungPosisiGelembung(wadah: HTMLElement, jangkar: DOMRect): PosisiGelembung {
  const kotak = wadah.getBoundingClientRect();
  const lebar = Math.min(LEBAR_GELEMBUNG, kotak.width);
  const tengah = jangkar.left - kotak.left + jangkar.width / 2;
  const left = Math.max(0, Math.min(tengah - lebar / 2, kotak.width - lebar));
  return {
    top: jangkar.bottom - kotak.top + JARAK_GELEMBUNG,
    left,
    lebar,
    panah: Math.max(TEPI_PANAH, Math.min(tengah - left, lebar - TEPI_PANAH)),
  };
}

interface GelembungTautanProps {
  posisi: PosisiGelembung;
  url: string;
  sudahAda: boolean;
  fokusOtomatis: boolean;
  onUrlChange: (url: string) => void;
  onTerapkan: () => void;
  onBuka: () => void;
  onHapus: () => void;
  onBatal: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const GelembungTautan = forwardRef<HTMLDivElement, GelembungTautanProps>(function GelembungTautan(
  { posisi, url, sudahAda, fokusOtomatis, onUrlChange, onTerapkan, onBuka, onHapus, onBatal, onMouseEnter, onMouseLeave },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fokusOtomatis) inputRef.current?.focus();
  }, [fokusOtomatis, posisi.top, posisi.left]);

  const tanganiTombol = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onTerapkan();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onBatal();
    }
  };

  const gaya = {
    top: posisi.top,
    left: posisi.left,
    width: posisi.lebar,
    '--panah-x': `${posisi.panah}px`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className="richtext__gelembung"
      role="dialog"
      aria-label={sudahAda ? 'Ubah tautan' : 'Tambah tautan'}
      style={gaya}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="richtext__gelembung-url">
        <InputText
          ref={inputRef}
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={tanganiTombol}
          placeholder="https://contoh.com atau /halaman"
          aria-label="URL tautan"
        />
      </div>
      <Button icon={Check} title="Terapkan" aria-label="Terapkan tautan" onClick={onTerapkan} />
      {sudahAda ? (
        <>
          <Button variant="ghost" icon={ExternalLink} title="Buka tautan" aria-label="Buka tautan" onClick={onBuka} />
          <Button variant="ghost" icon={Unlink} title="Hapus tautan" aria-label="Hapus tautan" onClick={onHapus} />
        </>
      ) : null}
    </div>
  );
});

export default GelembungTautan;
