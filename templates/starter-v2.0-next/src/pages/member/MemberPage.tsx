import { useMemo, useState } from 'react';
import { Download, Eye, Pencil, Trash2 } from 'lucide-react';

import ActionButton from '@/components/ui/action-button/ActionButton';
import { Button } from '@/components/ui/button/Button';
import { PageTitle } from '@/components/ui/pagetitle/PageTitle';
import { TableToolbar } from '@/components/ui/table-toolbar/TableToolbar';
import { TableListV1 } from '@/components/ui/tablelist-v1/TableListV1';
import { PER_HALAMAN_BAWAAN, usePilihan } from '@/lib/daftar';

const KOLOM = [
  { key: 'kode', label: 'Kode User', width: '140px' },
  { key: 'nama', label: 'Nama' },
  { key: 'hp', label: 'No HP', width: '170px' },
  { key: 'email', label: 'Email' },
  { key: 'aksi', label: 'Aksi', align: 'right' as const, width: '150px' },
];

interface Member {
  kode: string;
  nama: string;
  hp: string;
  email: string;
}

const DATA: Member[] = [
  { kode: 'USR-1001', nama: 'Dewi Anggraini', hp: '0812-3344-5566', email: 'dewi.a@contoh.com' },
  { kode: 'USR-1002', nama: 'Bagus Prasetyo', hp: '0813-7788-1120', email: 'bagus.p@contoh.com' },
  { kode: 'USR-1003', nama: 'Rina Kusuma', hp: '0821-4455-9087', email: 'rina.k@contoh.com' },
  { kode: 'USR-1004', nama: 'Farhan Maulana', hp: '0857-2233-6614', email: 'farhan.m@contoh.com' },
  { kode: 'USR-1005', nama: 'Sinta Rahayu', hp: '0896-1177-4432', email: 'sinta.r@contoh.com' },
  { kode: 'USR-1006', nama: 'Andi Nugroho', hp: '0811-9090-2345', email: 'andi.n@contoh.com' },
  { kode: 'USR-1007', nama: 'Putri Lestari', hp: '0838-5566-7788', email: 'putri.l@contoh.com' },
  { kode: 'USR-1008', nama: 'Hendra Wijaya', hp: '0852-3311-8899', email: 'hendra.w@contoh.com' },
  { kode: 'USR-1009', nama: 'Maya Safitri', hp: '0877-6543-2109', email: 'maya.s@contoh.com' },
  { kode: 'USR-1010', nama: 'Rizky Ramadhan', hp: '0819-2244-3366', email: 'rizky.r@contoh.com' },
  { kode: 'USR-1011', nama: 'Nadia Puspita', hp: '0812-8080-1199', email: 'nadia.p@contoh.com' },
  { kode: 'USR-1012', nama: 'Yoga Pratama', hp: '0856-4433-2211', email: 'yoga.p@contoh.com' },
];

export default function MemberPage() {
  const [cari, setCari] = useState('');
  const [perHalaman, setPerHalaman] = useState(PER_HALAMAN_BAWAAN);
  const [halaman, setHalaman] = useState(1);

  const cocok = useMemo(() => {
    const k = cari.trim().toLowerCase();
    if (!k) return DATA;
    return DATA.filter((d) =>
      [d.kode, d.nama, d.hp, d.email].some((nilai) => nilai.toLowerCase().includes(k)),
    );
  }, [cari]);

  // perHalaman 0 = "Semua" pada TableToolbar.
  const ukuran = perHalaman > 0 ? perHalaman : cocok.length || 1;
  const totalHalaman = Math.max(1, Math.ceil(cocok.length / ukuran));
  const halamanAman = Math.min(halaman, totalHalaman);
  const mulai = (halamanAman - 1) * ukuran;
  const terlihat = cocok.slice(mulai, mulai + ukuran);

  const pilihan = usePilihan(terlihat.map((d) => d.kode));

  const baris = terlihat.map((d) => ({
    kode: d.kode,
    nama: d.nama,
    hp: d.hp,
    email: d.email,
    aksi: (
      <div className="tablelist-v1__aksi">
        <ActionButton icon={Eye} aria-label={`Lihat ${d.nama}`} />
        <ActionButton icon={Pencil} aria-label={`Ubah ${d.nama}`} />
        <ActionButton icon={Trash2} variant="danger" aria-label={`Hapus ${d.nama}`} />
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      <PageTitle title="Daftar Member" subtitle="Semua akun member yang terdaftar." />

      <TableListV1
        columns={KOLOM}
        rows={baris}
        rowKey={(row) => String(row.kode)}
        pilihan={pilihan}
        aksiMassal={
          <>
            <Button variant="ghost" icon={Download}>
              Ekspor
            </Button>
            <Button icon={Trash2}>Hapus</Button>
          </>
        }
        toolbar={
          <TableToolbar
            cari={cari}
            onCari={(v) => {
              setCari(v);
              setHalaman(1);
            }}
            perHalaman={perHalaman}
            onPerHalaman={(v) => {
              setPerHalaman(v);
              setHalaman(1);
            }}
            placeholderCari="Cari kode, nama, no HP, atau email…"
          />
        }
        paginasi={{
          halaman: halamanAman,
          totalHalaman,
          info: `Menampilkan ${cocok.length === 0 ? 0 : mulai + 1}–${mulai + terlihat.length} dari ${
            cocok.length
          } member`,
          onNavigasi: setHalaman,
        }}
        minBaris={8}
        emptyText="Tidak ada member yang cocok."
      />
    </div>
  );
}
