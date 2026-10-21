import { useEffect, useEffectEvent, useId, useLayoutEffect, useRef, useState, type CSSProperties, type Ref } from 'react';

import type { ButtonVariant } from '@/components/ui/button/Button';
import '@/components/ui/button/button.css';
import './tombol-tuang.css';

// Sama dengan status useMutation
export type StatusTuang = 'idle' | 'pending' | 'success' | 'error';
// Ikon sesuai jenis aksi
export type IkonTuang = 'file' | 'simpan' | 'kunci' | 'unggah' | 'hapus' | 'kirim';

// Tolak: gagal dengan teks
type Fase = 'diam' | 'samar' | 'tuang' | 'tunggu' | 'penuh' | 'centang' | 'kuras' | 'tolak' | 'kembali';

// Selaras dengan durasi di CSS
const JEDA_SAMAR_MS = 60;
const SAMAR_MS = 220;
const JEDA_HURUF_MS = 65;
const TERBANG_HURUF_MS = 560;
// Pesawat: lebih cepat
const JEDA_CEPAT_MS = 30;
const TERBANG_CEPAT_MS = 320;
const JEDA_MUNCUL_MS = 25;
const MUNCUL_HURUF_MS = 320;
const IKON_PULANG_MS = 250;
const PENUH_MS = 650;
const CENTANG_MS = 900;
const CENTANG_TEKS_MS = 1200;
const KURAS_MS = 500;
const TOLAK_MS = 1200;

const durasiTuang = (jumlahHuruf: number, cepat = false) =>
  cepat
    ? jumlahHuruf * JEDA_CEPAT_MS + TERBANG_CEPAT_MS
    : jumlahHuruf * JEDA_HURUF_MS + TERBANG_HURUF_MS;

type Durasi = (jumlahHuruf: number, gaya: Gaya) => number;

const LANGKAH: Partial<Record<Fase, { ke: Fase; ms: Durasi }>> = {
  samar: { ke: 'tuang', ms: (n) => n * JEDA_SAMAR_MS + SAMAR_MS },
  tuang: { ke: 'tunggu', ms: (n, g) => durasiTuang(n, g.cepat) },
  penuh: { ke: 'centang', ms: () => PENUH_MS },
  centang: { ke: 'kembali', ms: (_n, g) => (g.teksBerhasil ? CENTANG_TEKS_MS : CENTANG_MS) },
  // Huruf langsung kembali saat gagal
  kuras: { ke: 'diam', ms: (n) => Math.max(KURAS_MS, n * JEDA_MUNCUL_MS + MUNCUL_HURUF_MS) },
  tolak: { ke: 'kembali', ms: () => TOLAK_MS },
  kembali: { ke: 'diam', ms: (n) => IKON_PULANG_MS + n * JEDA_MUNCUL_MS + MUNCUL_HURUF_MS },
};

interface BentukIkon {
  // Garis tepi sekaligus wadah air
  wadah: string;
  rincian: string[];
  centang: string;
  // Pesawat kertas pengganti centang
  terbang?: string[];
}

// Garis ikon dari lucide
const BENTUK: Record<IkonTuang, BentukIkon> = {
  file: {
    wadah: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    rincian: ['M14 2v6h6'],
    centang: 'M7.5 14.5l3 3 6-6.5',
  },
  simpan: {
    wadah: 'M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
    rincian: ['M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7', 'M7 3v4a1 1 0 0 0 1 1h7'],
    centang: 'M7.5 13.5l3 3 6-6.5',
  },
  kunci: {
    wadah: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z',
    rincian: ['M7 11V7a5 5 0 0 1 10 0v4'],
    centang: 'M8.5 16.5l2.5 2.5 4.5-5',
  },
  // Awan + panah naik
  unggah: {
    wadah: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z',
    rincian: ['M12 17v-5', 'M9.5 14.5 12 12l2.5 2.5'],
    centang: 'M8.5 14.5l2.5 2.5 4.5-5',
  },
  // Tempat sampah, tutup terpisah
  hapus: {
    wadah: 'M5 6h14v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z',
    rincian: ['M3 6h18', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
    centang: 'M8.5 14l2.5 2.5 4.5-5',
  },
  // Amplop, lalu terbang jadi pesawat
  kirim: {
    wadah: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    rincian: ['m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'],
    centang: 'M8.5 15l2.5 2.5 4.5-5',
    terbang: [
      'M14.5 21.7a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.64-.63l-19 6.5a.5.5 0 0 0-.02.93l7.93 3.18a2 2 0 0 1 1.11 1.11z',
      'm21.85 2.15-10.94 10.94',
    ],
  },
};

// Garis angin di belakang pesawat
const ANGIN = ['M2 20h5', 'M1 16h3', 'M4 23.5h4'];

// Ombak berulang tiap 12 unit
const OMBAK = 'M0 1Q3-1 6 1T12 1T18 1T24 1T30 1T36 1T42 1T48 1V26H0Z';

interface Kabar {
  // Ikon penuh, mis. unduh file
  onPenuh?: () => void;
  // Pindah halaman; tombol tetap centang
  onTuntas?: () => void;
  // Animasi beres, berhasil atau gagal
  onSelesai?: (berhasil: boolean) => void;
}

interface Gaya {
  // Huruf jadi titik dulu
  samarkan: boolean;
  // Ikon pesawat: tuang lebih cepat
  cepat: boolean;
  teksBerhasil?: string;
  teksGagal?: string;
}

interface Props extends Kabar {
  children: string;
  ikon: IkonTuang;
  status: StatusTuang;
  variant?: ButtonVariant;
  type?: 'button' | 'submit';
  form?: string;
  className?: string;
  disabled?: boolean;
  // 0–1, mis. unggah; air ikut naik
  progres?: number | null;
  // Login: huruf jadi titik dulu
  samarkan?: boolean;
  // Tampil sebentar saat centang
  teksBerhasil?: string;
  // Tampil sebentar saat gagal
  teksGagal?: string;
  onClick?: () => void;
}

// Skala ikon saat di tengah
const SKALA_IKON = 1.2;
const JARAK_TEKS_PX = 8;

function faseTampil(fase: Fase, status: StatusTuang, adaTeksGagal: boolean): Fase {
  const mengisi = fase === 'samar' || fase === 'tuang' || fase === 'tunggu';
  if (mengisi && status === 'error') return adaTeksGagal ? 'tolak' : 'kuras';
  if (fase === 'tunggu' && status === 'success') return 'penuh';
  return fase;
}

function useFaseTuang(status: StatusTuang, jumlahHuruf: number, kabar: Kabar, gaya: Gaya) {
  const [fase, setFase] = useState<Fase>('diam');
  const [statusLalu, setStatusLalu] = useState(status);
  // Diisi saat lewat centang
  const berhasilRef = useRef(false);
  // Mulai saat proses berjalan
  if (status !== statusLalu) {
    setStatusLalu(status);
    if (fase === 'diam' && status !== 'idle') setFase(gaya.samarkan ? 'samar' : 'tuang');
  }
  const tampil = faseTampil(fase, status, !!gaya.teksGagal);
  const { teksBerhasil, cepat } = gaya;

  // Hasil true: tahan di centang
  const kabari = useEffectEvent((dari: Fase, ke: Fase): boolean => {
    if (dari === 'penuh') kabar.onPenuh?.();
    if (dari === 'centang') berhasilRef.current = true;
    if (ke === 'diam') {
      kabar.onSelesai?.(berhasilRef.current);
      berhasilRef.current = false;
    }
    if (dari !== 'centang' || !kabar.onTuntas) return false;
    kabar.onTuntas();
    return true;
  });

  useEffect(() => {
    const langkah = LANGKAH[tampil];
    if (!langkah) return;
    const timer = window.setTimeout(() => {
      if (!kabari(tampil, langkah.ke)) setFase(langkah.ke);
    }, langkah.ms(jumlahHuruf, { samarkan: false, cepat, teksBerhasil }));
    return () => window.clearTimeout(timer);
  }, [tampil, jumlahHuruf, cepat, teksBerhasil]);

  return { tampil, aktif: fase !== 'diam' };
}

// Ikon + teks hasil di tengah
function ukurTeksHasil(teks: HTMLElement, ikon: SVGSVGElement, kotakIkon: DOMRect, namaVar: string) {
  const lebarIkon = kotakIkon.width * SKALA_IKON;
  teks.style.setProperty('--ruang-ikon', `${lebarIkon + JARAK_TEKS_PX}px`);
  const tujuanX = teks.getBoundingClientRect().left + lebarIkon / 2;
  ikon.style.setProperty(namaVar, `${tujuanX - (kotakIkon.left + kotakIkon.width / 2)}px`);
}

interface ElemenHasil {
  berhasil: HTMLElement | null;
  gagal: HTMLElement | null;
}

// Lebar asli huruf, titik dirapikan
function ukurLebar(wadah: HTMLElement) {
  wadah.style.setProperty('--lebar-teks', `${wadah.getBoundingClientRect().width}px`);
  for (const huruf of Array.from(wadah.children) as HTMLElement[]) {
    huruf.style.setProperty('--lebar', `${huruf.getBoundingClientRect().width}px`);
  }
}

// Geser ikon ke tengah
function ukurIkon(tombol: HTMLElement, ikon: SVGSVGElement, teks: ElemenHasil) {
  const kotakTombol = tombol.getBoundingClientRect();
  const kotakIkon = ikon.getBoundingClientRect();
  const geser = kotakTombol.left + kotakTombol.width / 2 - (kotakIkon.left + kotakIkon.width / 2);
  ikon.style.setProperty('--geser-ikon', `${geser}px`);
  if (teks.berhasil) ukurTeksHasil(teks.berhasil, ikon, kotakIkon, '--geser-ikon-berhasil');
  if (teks.gagal) ukurTeksHasil(teks.gagal, ikon, kotakIkon, '--geser-ikon-gagal');
  return geser;
}

// Arahkan huruf ke ikon
function ukurHuruf(ikon: SVGSVGElement, wadah: HTMLElement, geser: number, maju: boolean) {
  const kotakIkon = ikon.getBoundingClientRect();
  const pusatX = kotakIkon.left + kotakIkon.width / 2;
  const tujuanY = kotakIkon.top + kotakIkon.height * (maju ? 0.5 : 0.35);
  const daftar = Array.from(wadah.children) as HTMLElement[];
  const durasi = durasiTuang(daftar.length, maju);
  const jeda = maju ? JEDA_CEPAT_MS : JEDA_HURUF_MS;
  const terbang = maju ? TERBANG_CEPAT_MS : TERBANG_HURUF_MS;
  daftar.forEach((huruf, i) => {
    // Pesawat maju: titik menyusul posisinya
    const bagian = maju ? Math.min(1, (i * jeda + terbang) / durasi) : 0;
    const tujuanX = pusatX + geser * bagian;
    const kotak = huruf.getBoundingClientRect();
    huruf.style.setProperty('--dx', `${tujuanX - (kotak.left + kotak.width / 2)}px`);
    huruf.style.setProperty('--dy', `${tujuanY - (kotak.top + kotak.height / 2)}px`);
  });
}

function GambarIkon({ ref, bentuk }: { ref: Ref<SVGSVGElement>; bentuk: BentukIkon }) {
  const idKlip = useId();
  return (
    <svg ref={ref} className="btn__icon tombol-tuang__ikon" viewBox="0 0 24 24" aria-hidden="true">
      <clipPath id={idKlip}>
        <path d={bentuk.wadah} />
      </clipPath>
      <g clipPath={`url(#${idKlip})`}>
        {/* Air tetap datar saat miring */}
        <g className="tombol-tuang__datar">
          <g className="tombol-tuang__cair">
            <path className="tombol-tuang__ombak tombol-tuang__ombak--belakang" d={OMBAK} />
            <path className="tombol-tuang__ombak" d={OMBAK} />
          </g>
        </g>
      </g>
      <path className="tombol-tuang__garis" d={bentuk.wadah} />
      {bentuk.rincian.map((d) => (
        <path key={d} className="tombol-tuang__garis tombol-tuang__rincian" d={d} />
      ))}
      {bentuk.terbang ? (
        <g className="tombol-tuang__terbang">
          {ANGIN.map((d, i) => (
            <path key={d} className="tombol-tuang__angin" style={{ '--i': i } as CSSProperties} d={d} />
          ))}
          <g className="tombol-tuang__pesawat">
            {bentuk.terbang.map((d) => (
              <path key={d} className="tombol-tuang__garis" d={d} />
            ))}
          </g>
        </g>
      ) : (
        <path className="tombol-tuang__centang" d={bentuk.centang} />
      )}
    </svg>
  );
}

interface TeksHasilProps {
  ref: Ref<HTMLSpanElement>;
  teks?: string;
  jenis: 'berhasil' | 'gagal';
}

function TeksHasil({ ref, teks, jenis }: TeksHasilProps) {
  if (!teks) return null;
  return (
    <span ref={ref} className={`tombol-tuang__hasil tombol-tuang__hasil--${jenis}`} aria-hidden="true">
      {teks}
    </span>
  );
}

// Tombol cukup lebar untuk hasil
function UkurHasil({ teks }: { teks?: string }) {
  if (!teks) return null;
  return (
    <span className="tombol-tuang__ukur" aria-hidden="true">
      {teks}
    </span>
  );
}

// Teks dituang ke dalam ikon
export function TombolTuang(props: Props) {
  const { children, ikon, status, variant = 'normal', type = 'button', form, className = '', disabled, progres, onClick } = props;
  const { samarkan = false, teksBerhasil, teksGagal, onPenuh, onTuntas, onSelesai } = props;
  const adaProgres = progres !== undefined && progres !== null;
  const tombolRef = useRef<HTMLButtonElement>(null);
  const ikonRef = useRef<SVGSVGElement>(null);
  const wadahRef = useRef<HTMLSpanElement>(null);
  const teksBerhasilRef = useRef<HTMLSpanElement>(null);
  const teksGagalRef = useRef<HTMLSpanElement>(null);
  const daftarHuruf = Array.from(children);
  const cepat = !!BENTUK[ikon].terbang;
  const { tampil, aktif } = useFaseTuang(
    status,
    daftarHuruf.length,
    { onPenuh, onTuntas, onSelesai },
    { samarkan, cepat, teksBerhasil, teksGagal },
  );

  useLayoutEffect(() => {
    if (samarkan && wadahRef.current) ukurLebar(wadahRef.current);
  }, [samarkan, children]);

  // Ikon diukur sekali, huruf saat dituang
  const geserRef = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (tampil === 'diam') geserRef.current = null;
    if (!tombolRef.current || !ikonRef.current || !wadahRef.current) return;
    if (tampil !== 'diam' && geserRef.current === null) {
      geserRef.current = ukurIkon(tombolRef.current, ikonRef.current, {
        berhasil: teksBerhasilRef.current,
        gagal: teksGagalRef.current,
      });
    }
    if (tampil === 'tuang') ukurHuruf(ikonRef.current, wadahRef.current, geserRef.current ?? 0, cepat);
  }, [tampil, cepat]);

  return (
    <button
      ref={tombolRef}
      type={type}
      form={form}
      className={`btn btn--${variant} tombol-tuang tombol-tuang--${ikon}${samarkan ? ' tombol-tuang--samar' : ''}${aktif ? ' btn--loading' : ''} ${className}`}
      data-fase={tampil}
      data-progres={adaProgres ? '' : undefined}
      data-teks-berhasil={teksBerhasil ? '' : undefined}
      style={
        {
          '--durasi-tuang': `${durasiTuang(daftarHuruf.length, cepat)}ms`,
          ...(adaProgres ? { '--progres': Math.min(1, Math.max(0, progres)) } : {}),
        } as CSSProperties
      }
      disabled={disabled || aktif}
      aria-busy={aktif}
      onClick={onClick}
    >
      <span className="tombol-tuang__tumpuk">
        <span className="tombol-tuang__baris">
          <GambarIkon ref={ikonRef} bentuk={BENTUK[ikon]} />
          <span className="sr-only">{children}</span>
          <span ref={wadahRef} className="tombol-tuang__teks" aria-hidden="true">
            {daftarHuruf.map((huruf, i) => (
              <span key={i} className="tombol-tuang__huruf" style={{ '--i': i } as CSSProperties}>
                <span className="tombol-tuang__isi">{huruf}</span>
              </span>
            ))}
          </span>
        </span>
        <UkurHasil teks={teksBerhasil} />
        <UkurHasil teks={teksGagal} />
      </span>
      <TeksHasil ref={teksBerhasilRef} teks={teksBerhasil} jenis="berhasil" />
      <TeksHasil ref={teksGagalRef} teks={teksGagal} jenis="gagal" />
    </button>
  );
}
