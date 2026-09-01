import { CheckCircle2, X } from 'lucide-react';

import { Button } from '@/components/ui/button/Button';
import './pilih-banyak.css';

export interface OpsiPilihBanyak {
  value: string;
  label: string;
  warna?: string;
}

export interface PilihBanyakProps {
  opsi: OpsiPilihBanyak[];
  terpilih: string[];
  onToggle: (value: string) => void;
  /** Tampilkan tombol Pilih Semua / Kosongkan. */
  onPilihSemua?: () => void;
  onKosongkan?: () => void;
  kosongText?: string;
  disabled?: boolean;
  className?: string;
}

export function PilihBanyak({
  opsi,
  terpilih,
  onToggle,
  onPilihSemua,
  onKosongkan,
  kosongText = 'Belum ada pilihan.',
  disabled = false,
  className = '',
}: PilihBanyakProps) {
  if (opsi.length === 0) return <p className="pilih-banyak__kosong">{kosongText}</p>;

  return (
    <div className={`pilih-banyak ${className}`}>
      <div className="pilih-banyak__daftar">
        {opsi.map((o) => {
          const aktif = terpilih.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              className={`pilih-banyak__chip ${aktif ? 'is-terpilih' : ''}`}
              aria-pressed={aktif}
              disabled={disabled}
              onClick={() => onToggle(o.value)}
            >
              {o.warna ? (
                <span
                  className="pilih-banyak__swatch"
                  style={{ background: o.warna }}
                  aria-hidden="true"
                />
              ) : null}
              {o.label}
            </button>
          );
        })}
      </div>

      {onPilihSemua || onKosongkan ? (
        <div className="pilih-banyak__aksi">
          {onPilihSemua ? (
            <Button variant="secondary" icon={CheckCircle2} disabled={disabled} onClick={onPilihSemua}>
              Pilih Semua
            </Button>
          ) : null}
          {onKosongkan ? (
            <Button variant="ghost" icon={X} disabled={disabled} onClick={onKosongkan}>
              Kosongkan
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default PilihBanyak;
