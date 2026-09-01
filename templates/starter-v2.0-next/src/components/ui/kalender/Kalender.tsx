import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import './kalender.css';

const HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export interface KalenderSel {
  /** `YYYY-MM-DD`. */
  kunci: string;
  tanggal: number;
  bulanIni: boolean;
  hariIni: boolean;
  minggu: boolean;
}

export function kunciTanggal(d: Date): string {
  const b = `${d.getMonth() + 1}`.padStart(2, '0');
  const t = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${b}-${t}`;
}

export function susunKisi(tahun: number, bulan: number, kunciHariIni?: string): KalenderSel[] {
  const awal = new Date(tahun, bulan, 1);
  const mundur = (awal.getDay() + 6) % 7;
  const mulai = new Date(tahun, bulan, 1 - mundur);

  const akhirBulan = new Date(tahun, bulan + 1, 0);
  const maju = (7 - ((akhirBulan.getDay() + 6) % 7) - 1 + 7) % 7;
  const selesai = new Date(tahun, bulan + 1, maju);

  const kunciKini = kunciHariIni ?? kunciTanggal(new Date());
  const sel: KalenderSel[] = [];
  for (const d = new Date(mulai); d <= selesai; d.setDate(d.getDate() + 1)) {
    const kunci = kunciTanggal(d);
    sel.push({
      kunci,
      tanggal: d.getDate(),
      bulanIni: d.getMonth() === bulan,
      hariIni: kunci === kunciKini,
      minggu: d.getDay() === 0,
    });
  }
  return sel;
}

export interface KalenderProps {
  tahun: number;
  bulan: number;
  onGantiBulan: (tahun: number, bulan: number) => void;
  badge?: Record<string, number>;
  aktif?: string | null;
  mulai?: string | null;
  selesai?: string | null;
  onPilih?: (kunci: string) => void;
  hanyaBerbadge?: boolean;
  min?: string | null;
  hariIni?: string | null;
  disabled?: boolean;
}

export function Kalender({
  tahun,
  bulan,
  onGantiBulan,
  badge = {},
  aktif = null,
  mulai = null,
  selesai = null,
  onPilih,
  hanyaBerbadge = false,
  min = null,
  hariIni = null,
  disabled = false,
}: KalenderProps) {
  const kisi = useMemo(() => susunKisi(tahun, bulan, hariIni ?? undefined), [tahun, bulan, hariIni]);

  const bulanIni = `${tahun}-${`${bulan + 1}`.padStart(2, '0')}`;
  const bulanMin = min ? min.slice(0, 7) : null;
  const mundurTertutup = !!bulanMin && bulanIni <= bulanMin;

  const geser = (arah: number) => {
    if (arah < 0 && mundurTertutup) return;
    const d = new Date(tahun, bulan + arah, 1);
    onGantiBulan(d.getFullYear(), d.getMonth());
  };

  return (
    <div className="kalender">
      <div className="kalender__bar">
        <button
          type="button"
          className="kalender__geser"
          onClick={() => geser(-1)}
          disabled={disabled || mundurTertutup}
          aria-label="Bulan sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="kalender__bulan">
          {BULAN[bulan]} {tahun}
        </span>
        <button
          type="button"
          className="kalender__geser"
          onClick={() => geser(1)}
          disabled={disabled}
          aria-label="Bulan berikutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="kalender__kepala">
        {HARI.map((h, i) => (
          <span
            key={h}
            className={`kalender__hari${i === 6 ? ' kalender__hari--minggu' : ''}`}
          >
            {h}
          </span>
        ))}
      </div>

      <div className="kalender__kisi">
        {kisi.map((s) => {
          const jumlah = badge[s.kunci] ?? 0;
          const lewat = !!min && s.kunci < min;
          const bisaKlik =
            !disabled && !lewat && !!onPilih && (!hanyaBerbadge || jumlah > 0);

          const ujung = s.kunci === mulai || s.kunci === selesai;
          const antara =
            !!mulai && !!selesai && s.kunci > mulai && s.kunci < selesai;

          const kelas = [
            'kalender__sel',
            s.bulanIni ? '' : 'kalender__sel--luar',
            lewat ? 'kalender__sel--lewat' : '',
            s.hariIni ? 'kalender__sel--kini' : '',
            s.minggu ? 'kalender__sel--minggu' : '',
            ujung ? 'kalender__sel--ujung' : '',
            antara ? 'kalender__sel--antara' : '',
            s.kunci === aktif ? 'kalender__sel--aktif' : '',
            bisaKlik ? 'kalender__sel--bisa' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={s.kunci}
              type="button"
              className={kelas}
              disabled={!bisaKlik}
              onClick={bisaKlik ? () => onPilih?.(s.kunci) : undefined}
            >
              {jumlah > 0 ? (
                <span className="kalender__badge">{jumlah > 99 ? '99+' : jumlah}</span>
              ) : null}
              <span className="kalender__angka">{s.tanggal}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
