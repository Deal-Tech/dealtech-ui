import { useEffect, useState, type ReactNode } from 'react';

import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { InputText } from '@/components/ui/inputtext/InputText';
import { Button } from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal/Modal';
import {
  TombolTuang,
  type IkonTuang,
  type StatusTuang,
} from '@/components/ui/tombol-tuang/TombolTuang';

export interface KonfirmasiModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Teks atau isi penjelasan. */
  children?: ReactNode;
  /** Label tombol konfirmasi. */
  labelKonfirmasi?: string;
  labelBatal?: string;
  ikon?: IkonTuang;
  /** Peringatan merah di atas isi. */
  peringatan?: string;
  /** Lempar galat bila gagal; modal tetap terbuka. */
  onKonfirmasi: () => Promise<void> | void;
  /** Wajib diketik, mis. HAPUS */
  kataKunci?: string;
}

/** Modal konfirmasi aksi berisiko, mis. hapus. */
export function KonfirmasiModal({
  open,
  onClose,
  title,
  children,
  labelKonfirmasi = 'Hapus',
  labelBatal = 'Batal',
  ikon = 'hapus',
  peringatan,
  onKonfirmasi,
  kataKunci,
}: KonfirmasiModalProps) {
  const [status, setStatus] = useState<StatusTuang>('idle');
  const [ketik, setKetik] = useState('');
  const sibuk = status === 'pending' || status === 'success';
  const terkunci = !!kataKunci && ketik.trim().toUpperCase() !== kataKunci.toUpperCase();

  useEffect(() => {
    if (open) {
      setStatus('idle');
      setKetik('');
    }
  }, [open]);

  const jalankan = async () => {
    if (sibuk || terkunci) return;
    setStatus('pending');
    try {
      await onKonfirmasi();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => (sibuk ? undefined : onClose())}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={sibuk}>
            {labelBatal}
          </Button>
          <TombolTuang ikon={ikon} status={status} disabled={terkunci} onClick={() => void jalankan()} onTuntas={onClose}>
            {labelKonfirmasi}
          </TombolTuang>
        </>
      }
    >
      <div className="flex flex-col gap-3 text-sm">
        {peringatan ? <BadgeInfo variant="error">{peringatan}</BadgeInfo> : null}
        {typeof children === 'string' ? <p className="m-0">{children}</p> : children}
        {kataKunci ? (
          <InputText
            label={`Ketik ${kataKunci} untuk melanjutkan`}
            value={ketik}
            onChange={(e) => setKetik(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void jalankan();
            }}
            placeholder={kataKunci}
            autoComplete="off"
            autoFocus
            disabled={sibuk}
          />
        ) : null}
      </div>
    </Modal>
  );
}

export default KonfirmasiModal;
