import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal/Modal';
import { pasangPenanganGangguan, type GangguanSistem } from '@/lib/api';
import './modal-galat.css';

async function salin(teks: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(teks);
      return true;
    }
  } catch {
    /* jatuh ke cara lama di bawah */
  }

  // navigator.clipboard hanya ada di https atau localhost.
  const kotak = document.createElement('textarea');
  kotak.value = teks;
  kotak.setAttribute('readonly', '');
  kotak.style.position = 'fixed';
  kotak.style.opacity = '0';
  document.body.appendChild(kotak);
  kotak.select();
  let berhasil = false;
  try {
    berhasil = document.execCommand('copy');
  } catch {
    berhasil = false;
  }
  document.body.removeChild(kotak);
  return berhasil;
}

const WAKTU = () =>
  new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function ModalGalat() {
  const [gangguan, setGangguan] = useState<(GangguanSistem & { waktu: string }) | null>(null);
  const [tersalin, setTersalin] = useState(false);

  useEffect(() => {
    pasangPenanganGangguan((g) => setGangguan({ ...g, waktu: WAKTU() }));
  }, []);

  const tutup = useCallback(() => {
    setGangguan(null);
    setTersalin(false);
  }, []);

  if (!gangguan) return null;

  // Yang disalin sengaja lebih lengkap daripada yang tampil: pengguna cukup
  // melihat kode dan halamannya, tapi yang menerima tempelan ini tim teknis —
  // dan endpoint serta request id itulah yang membuatnya ketemu di log.
  const ringkasan = [
    `Kode Error : ${gangguan.kode}`,
    `Waktu      : ${gangguan.waktu}`,
    `Halaman    : ${gangguan.halaman}`,
    `Endpoint   : ${gangguan.jalur}`,
    gangguan.requestId ? `Request ID : ${gangguan.requestId}` : null,
    `Pesan      : ${gangguan.pesan}`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <Modal
      open
      onClose={tutup}
      title="Terjadi Gangguan Sistem"
      className="modal-galat"
      footer={
        <>
          <Button variant="secondary" onClick={tutup}>
            Tutup
          </Button>
          <Button
            icon={tersalin ? Check : Copy}
            onClick={async () => {
              if (await salin(ringkasan)) {
                setTersalin(true);
                window.setTimeout(() => setTersalin(false), 2500);
              }
            }}
          >
            {tersalin ? 'Tersalin' : 'Salin rincian'}
          </Button>
        </>
      }
    >
      <div className="modal-galat__kepala">
        <span className="modal-galat__lencana">
          <AlertTriangle className="modal-galat__ikon" />
        </span>
        <p className="modal-galat__pesan">{gangguan.pesan}</p>
      </div>

      <p className="modal-galat__arahan">
        Data yang Anda kerjakan <strong>tidak tersimpan</strong>. Silakan coba lagi sebentar
        lagi. Kalau masih gagal, tekan <strong>Salin rincian</strong> lalu kirimkan ke tim
        teknis — dari kode itu penyebabnya bisa langsung ditemukan.
      </p>

      <div className="modal-galat__kode">
        <span className="modal-galat__kode-label">Kode Error</span>
        <code className="modal-galat__kode-nilai">{gangguan.kode}</code>
      </div>

      <dl className="modal-galat__rincian">
        <div>
          <dt>Waktu</dt>
          <dd>{gangguan.waktu}</dd>
        </div>
        <div>
          <dt>Halaman</dt>
          <dd>{gangguan.halaman}</dd>
        </div>
      </dl>
    </Modal>
  );
}
