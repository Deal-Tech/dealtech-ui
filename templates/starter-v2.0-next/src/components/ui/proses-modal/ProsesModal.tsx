import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Loader2, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal/Modal';
import { ProgressBar } from '@/components/ui/progress-bar/ProgressBar';
import './proses-modal.css';

export type AksiProses = 'generate' | 'unduh' | 'validasi';

export interface TugasProses {
  aksi: AksiProses;
  judul: string;
  format?: string;
  tahap: 'proses' | 'selesai';
  progress: number;
}

export interface OpsiUnduh {
  label: string;
  format: string;
  icon?: LucideIcon;
}

const TAHAP_GENERATE = [
  { sampai: 30, label: 'Mengumpulkan data…' },
  { sampai: 65, label: 'Menyusun dokumen…' },
  { sampai: 95, label: 'Membuat berkas…' },
  { sampai: 100, label: 'Menyelesaikan…' },
];

const TAHAP_UNDUH = [
  { sampai: 40, label: 'Menyiapkan berkas…' },
  { sampai: 100, label: 'Mengunduh…' },
];

const TAHAP_VALIDASI = [
  { sampai: 35, label: 'Memeriksa kelengkapan NIK & No. KK…' },
  { sampai: 75, label: 'Mencocokkan dengan format DTKS…' },
  { sampai: 100, label: 'Menyusun hasil validasi…' },
];

const TAHAP: Record<AksiProses, Array<{ sampai: number; label: string }>> = {
  generate: TAHAP_GENERATE,
  unduh: TAHAP_UNDUH,
  validasi: TAHAP_VALIDASI,
};

const AWALAN_JUDUL: Record<AksiProses, string> = {
  generate: 'Generate',
  unduh: 'Unduh',
  validasi: 'Validasi',
};

function labelTahap(t: TugasProses): string {
  const daftar = TAHAP[t.aksi];
  return daftar.find((x) => t.progress < x.sampai)?.label ?? daftar[daftar.length - 1].label;
}

export function useProses() {
  const [tugas, setTugas] = useState<TugasProses | null>(null);
  const sedangProses = tugas?.tahap === 'proses';

  useEffect(() => {
    if (!sedangProses) return undefined;
    const id = window.setInterval(() => {
      setTugas((t) => {
        if (!t || t.tahap !== 'proses') return t;
        const langkah = t.progress < 70 ? 7 : 3;
        const next = Math.min(100, t.progress + langkah);
        return next >= 100 ? { ...t, progress: 100, tahap: 'selesai' } : { ...t, progress: next };
      });
    }, 120);
    return () => window.clearInterval(id);
  }, [sedangProses]);

  const mulai = useCallback((aksi: AksiProses, judul: string, format?: string) => {
    setTugas({ aksi, judul, format, tahap: 'proses', progress: 0 });
  }, []);

  const tutup = useCallback(() => setTugas(null), []);

  return { tugas, mulai, tutup };
}

export interface ProsesModalProps {
  tugas: TugasProses | null;
  onClose: () => void;
  formatUnduh?: OpsiUnduh[];
  onUnduh?: (format: string) => void;
  pesanSelesai?: string;
}

export function ProsesModal({
  tugas,
  onClose,
  formatUnduh = [],
  onUnduh,
  pesanSelesai,
}: ProsesModalProps) {
  const judul = tugas ? `${AWALAN_JUDUL[tugas.aksi]} ${tugas.judul}` : '';

  const selesai = tugas?.tahap === 'selesai';
  const tawarkanUnduh = selesai && tugas?.aksi === 'generate' && formatUnduh.length > 0 && onUnduh;

  return (
    <Modal
      open={tugas !== null}
      onClose={onClose}
      title={judul}
      footer={
        !selesai ? (
          <Button variant="secondary" onClick={onClose}>
            Batalkan
          </Button>
        ) : tawarkanUnduh ? (
          <>
            {formatUnduh.map((f, i) => (
              <Button
                key={f.format}
                variant={i === formatUnduh.length - 1 ? 'primary' : 'secondary'}
                icon={f.icon}
                onClick={() => onUnduh?.(f.format)}
              >
                {f.label}
              </Button>
            ))}
          </>
        ) : (
          <Button onClick={onClose}>Tutup</Button>
        )
      }
    >
      {tugas ? (
        <div className="proses-modal">
          <div className="proses-modal__head">
            <span
              className={`proses-modal__icon ${selesai ? 'proses-modal__icon--selesai' : ''}`}
            >
              {selesai ? <CheckCircle2 /> : <Loader2 className="proses-modal__spinner" />}
            </span>
            <div>
              <p className="proses-modal__judul">
                {!selesai
                  ? labelTahap(tugas)
                  : (pesanSelesai ??
                    (tugas.aksi === 'generate'
                      ? 'Dokumen siap diunduh'
                      : tugas.aksi === 'validasi'
                        ? 'Validasi selesai'
                        : `Berkas ${tugas.format ?? ''} berhasil diunduh`))}
              </p>
              <p className="proses-modal__sub">
                {tugas.judul}
                {tugas.format ? ` · ${tugas.format}` : ''}
              </p>
            </div>
          </div>

          <ProgressBar value={tugas.progress} showValue label="Kemajuan" />

          {!selesai ? (
            <p className="proses-modal__nota">Jangan tutup jendela ini sampai proses selesai.</p>
          ) : null}
        </div>
      ) : null}
    </Modal>
  );
}

export default ProsesModal;
