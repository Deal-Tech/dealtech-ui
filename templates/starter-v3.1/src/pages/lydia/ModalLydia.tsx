import { useId, useState } from 'react';

import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { Button } from '@/components/ui/button/Button';
import { InputLongText } from '@/components/ui/inputlongtext/InputLongText';
import { InputText } from '@/components/ui/inputtext/InputText';
import { Modal } from '@/components/ui/modal/Modal';
import { TombolTuang, type StatusTuang } from '@/components/ui/tombol-tuang/TombolTuang';
import { ApiError } from '@/lib/api';
import { MAKS_SARAN, simpanPengaturanLydia, type PengaturanLydia } from '@/services/lydia';

const MAKS_NAMA = 40;

interface PengaturanModalProps {
  pengaturan: PengaturanLydia;
  onClose: () => void;
  onTersimpan: (p: PengaturanLydia) => void;
}

/** Kustomisasi nama, sapaan, instruksi, saran. */
export function PengaturanLydiaModal({ pengaturan, onClose, onTersimpan }: PengaturanModalProps) {
  const idForm = useId();
  const [nama, setNama] = useState(pengaturan.nama);
  const [sapaan, setSapaan] = useState(pengaturan.sapaan);
  const [deskripsi, setDeskripsi] = useState(pengaturan.deskripsi);
  const [instruksi, setInstruksi] = useState(pengaturan.instruksi);
  const [saran, setSaran] = useState(pengaturan.saran.join('\n'));
  const [galat, setGalat] = useState<{ nama?: string; sapaan?: string; umum?: string }>({});
  const [status, setStatus] = useState<StatusTuang>('idle');
  const sibuk = status === 'pending' || status === 'success';

  const simpan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sibuk) return;

    const g: typeof galat = {};
    if (!nama.trim()) g.nama = 'Nama asisten wajib diisi.';
    if (!sapaan.trim()) g.sapaan = 'Sapaan pembuka wajib diisi.';
    setGalat(g);
    if (Object.keys(g).length > 0) return;

    setStatus('pending');
    try {
      const hasil = await simpanPengaturanLydia({
        nama: nama.trim(),
        sapaan: sapaan.trim(),
        deskripsi: deskripsi.trim(),
        instruksi: instruksi.trim(),
        saran: saran
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, MAKS_SARAN),
      });
      onTersimpan(hasil);
      setStatus('success');
    } catch (err) {
      setGalat({ umum: err instanceof ApiError ? err.message : 'Pengaturan Lydia gagal disimpan.' });
      setStatus('error');
    }
  };

  return (
    <Modal
      open
      onClose={() => (sibuk ? undefined : onClose())}
      title={`Atur ${pengaturan.nama}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={sibuk}>
            Batal
          </Button>
          <TombolTuang type="submit" form={idForm} ikon="simpan" status={status} onTuntas={onClose}>
            Simpan
          </TombolTuang>
        </>
      }
    >
      <form id={idForm} onSubmit={simpan} className="lydia-form">
        <InputText
          label="Nama asisten"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          error={galat.nama}
          maxLength={MAKS_NAMA}
          required
        />
        <InputText
          label="Sapaan pembuka"
          value={sapaan}
          onChange={(e) => setSapaan(e.target.value)}
          error={galat.sapaan}
          maxLength={160}
          required
        />
        <InputLongText
          label="Deskripsi sapaan"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows={2}
          maxLength={240}
          hint="Tampil di bawah sapaan saat chat masih kosong."
        />
        <InputLongText
          label="Instruksi untuk AI"
          value={instruksi}
          onChange={(e) => setInstruksi(e.target.value)}
          rows={4}
          hint="Dikirim ke backend sebagai instruksi sistem: peran, gaya bahasa, dan batasan jawaban."
        />
        <InputLongText
          label="Saran pertanyaan"
          value={saran}
          onChange={(e) => setSaran(e.target.value)}
          rows={4}
          hint={`Satu saran per baris, maksimal ${MAKS_SARAN}. Tampil saat chat masih kosong.`}
        />
        {galat.umum ? <BadgeInfo variant="error">{galat.umum}</BadgeInfo> : null}
      </form>
    </Modal>
  );
}
