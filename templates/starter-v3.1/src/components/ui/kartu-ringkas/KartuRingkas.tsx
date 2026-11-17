import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton/Skeleton';
import './kartu-ringkas.css';

export type NadaKartu = 'netral' | 'primer' | 'sukses' | 'awas' | 'bahaya';

export interface KartuRingkasProps {
  judul: string;
  status: string;
  info?: string;
  ikon: LucideIcon;
  nada?: NadaKartu;
  /** Tanpa tujuan, kartu statis */
  ke?: string;
}

/** Kartu ringkas gaya kartu meja */
export function KartuRingkas({ judul, status, info, ikon: Ikon, nada = 'netral', ke }: KartuRingkasProps) {
  const isi = (
    <>
      <span className="kartu-ringkas__ikon" aria-hidden="true">
        <Ikon />
      </span>
      <span className="kartu-ringkas__teks">
        <span className="kartu-ringkas__judul">{judul}</span>
        <span className="kartu-ringkas__ket">
          <span className="kartu-ringkas__status">{status}</span>
          {info ? ` - ${info}` : null}
        </span>
      </span>
      {ke ? <ArrowUpRight className="kartu-ringkas__panah" aria-hidden="true" /> : null}
    </>
  );
  const kelas = `kartu-ringkas kartu-ringkas--${nada}`;
  const title = [judul, status, info].filter(Boolean).join(' - ');
  return ke ? (
    <Link to={ke} className={kelas} title={title}>
      {isi}
    </Link>
  ) : (
    <div className={kelas} title={title}>
      {isi}
    </div>
  );
}

/** Kartu ringkas saat memuat */
export function KartuRingkasSkeleton() {
  return (
    <div className="kartu-ringkas kartu-ringkas--memuat" aria-hidden="true">
      <span className="kartu-ringkas__ikon">
        <Skeleton bentuk="kotak" lebar="100%" tinggi="100%" />
      </span>
      <span className="kartu-ringkas__teks">
        <span className="kartu-ringkas__judul">
          <Skeleton lebar="72%" />
        </span>
        <span className="kartu-ringkas__ket">
          <Skeleton lebar="48%" />
        </span>
      </span>
    </div>
  );
}

/** Skeleton penuh baris, minimal sekian kartu */
export function GridKartuRingkasSkeleton({ minimal = 4, lebarMin = 240 }: { minimal?: number; lebarMin?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [kolom, setKolom] = useState(minimal);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ukur = () => setKolom(Math.max(1, getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length));
    ukur();
    const ro = new ResizeObserver(ukur);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const jumlah = Math.ceil(minimal / kolom) * kolom;
  return (
    <div ref={ref} className="kartu-ringkas-grid" style={{ '--kartu-ringkas-min': `${lebarMin}px` } as CSSProperties}>
      {Array.from({ length: jumlah }, (_, i) => (
        <KartuRingkasSkeleton key={i} />
      ))}
    </div>
  );
}

export function GridKartuRingkas({ children, lebarMin = 240 }: { children: ReactNode; lebarMin?: number }) {
  return (
    <div className="kartu-ringkas-grid" style={{ '--kartu-ringkas-min': `${lebarMin}px` } as CSSProperties}>
      {children}
    </div>
  );
}

export default KartuRingkas;
