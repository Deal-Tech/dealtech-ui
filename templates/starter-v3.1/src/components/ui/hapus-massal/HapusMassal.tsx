import { useState } from 'react';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button/Button';
import { KonfirmasiModal } from '@/components/ui/konfirmasi-modal/KonfirmasiModal';

interface Props {
  terpilih: string[];
  /** Jenis data, mis. pelanggan */
  satuan: string;
  nama: (id: string) => string;
  hapus: (id: string) => unknown;
  onBersihkan: () => void;
  onToggle: (id: string) => void;
}

interface Target {
  id: string;
  nama: string;
}

const BATAS_NAMA = 5;
const pesan = (e: unknown) => (e instanceof Error && e.message ? e.message : 'Gagal menghapus');

/** Hapus massal, konfirmasi ketik HAPUS */
export function HapusMassal({ terpilih, satuan, nama, hapus, onBersihkan, onToggle }: Props) {
  const [target, setTarget] = useState<Target[] | null>(null);
  const [galat, setGalat] = useState('');

  const daftar = target ?? [];
  const namaRingkas =
    daftar.length > BATAS_NAMA
      ? `${daftar.slice(0, BATAS_NAMA).map((t) => t.nama).join(', ')}, dan ${daftar.length - BATAS_NAMA} lainnya`
      : daftar.map((t) => t.nama).join(', ');

  return (
    <>
      <Button
        icon={Trash2}
        onClick={() => {
          setGalat('');
          setTarget(terpilih.map((id) => ({ id, nama: nama(id) })));
        }}
      >
        {`Hapus ${terpilih.length}`}
      </Button>
      <KonfirmasiModal
        open={!!target}
        onClose={() => setTarget(null)}
        title={`Hapus ${daftar.length} ${satuan}?`}
        labelKonfirmasi={`Hapus ${daftar.length}`}
        kataKunci="HAPUS"
        peringatan={galat || undefined}
        onKonfirmasi={async () => {
          setGalat('');
          const gagal: Target[] = [];
          const alasan: string[] = [];
          for (const t of daftar) {
            try {
              await hapus(t.id);
            } catch (e) {
              gagal.push(t);
              alasan.push(`${t.nama}: ${pesan(e)}`);
            }
          }
          // Sisakan yang gagal terpilih
          onBersihkan();
          for (const t of gagal) onToggle(t.id);
          if (gagal.length) {
            const teks = `${daftar.length - gagal.length} terhapus, ${gagal.length} gagal. ${alasan.join('; ')}`;
            setTarget(gagal);
            setGalat(teks);
            throw new Error(teks);
          }
        }}
      >
        {`${namaRingkas} akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
      </KonfirmasiModal>
    </>
  );
}
