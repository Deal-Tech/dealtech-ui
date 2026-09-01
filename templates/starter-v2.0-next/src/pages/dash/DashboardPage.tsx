import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Check,
  CircleAlert,
  Component,
  Eye,
  LayoutDashboard,
  Package,
  Pencil,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';

import ActionButton from '@/components/ui/action-button/ActionButton';
import { Badge } from '@/components/ui/badge/Badge';
import { StatCard } from '@/components/ui/stat-card/StatCard';
import { TableToolbar } from '@/components/ui/table-toolbar/TableToolbar';
import { TableListV1 } from '@/components/ui/tablelist-v1/TableListV1';
import { WelcomeCardV2 } from '@/components/ui/welcome-card-v2/WelcomeCardV2';
import { resolveIcon } from '@/layout/ikon-menu';
import { menu, saringMenu } from '@/layout/menu';
import { PER_HALAMAN_BAWAAN } from '@/lib/daftar';
import './dashboard.css';

const RINGKASAN = [
  { kunci: 'komponen', ikon: Component, judul: 'Komponen UI', nilai: '55 elemen', helper: null },
  { kunci: 'layout', ikon: LayoutDashboard, judul: 'Layout', nilai: '1 layout', helper: null },
  { kunci: 'token', ikon: Boxes, judul: 'Token Tema', nilai: '60+ variabel', helper: null },
  { kunci: 'pengguna', ikon: Users, judul: 'Pengguna', nilai: '1 akun', helper: 'mode demo' },
] as const;

const KOLOM = [
  { key: 'kode', label: 'Kode', width: '130px' },
  { key: 'nama', label: 'Nama Item' },
  { key: 'tanggal', label: 'Tanggal', width: '130px' },
  { key: 'jumlah', label: 'Jumlah', align: 'right' as const, width: '150px' },
  { key: 'status', label: 'Status', align: 'center' as const, width: '130px' },
  { key: 'aksi', label: 'Aksi', align: 'right' as const, width: '150px' },
];

type Status = 'aktif' | 'baru' | 'tinjau' | 'arsip';

/** Ganti dengan data dari backend Anda. */
const DATA: { kode: string; nama: string; tanggal: string; jumlah: number; status: Status }[] = [
  { kode: 'TRX-1001', nama: 'Paket Langganan Pro', tanggal: '01 Sep 2026', jumlah: 4500000, status: 'aktif' },
  { kode: 'TRX-1002', nama: 'Tambahan Penyimpanan', tanggal: '01 Sep 2026', jumlah: 750000, status: 'baru' },
  { kode: 'TRX-1003', nama: 'Dukungan Prioritas', tanggal: '31 Agu 2026', jumlah: 1200000, status: 'aktif' },
  { kode: 'TRX-1004', nama: 'Integrasi API', tanggal: '31 Agu 2026', jumlah: 2400000, status: 'tinjau' },
  { kode: 'TRX-1005', nama: 'Paket Langganan Dasar', tanggal: '30 Agu 2026', jumlah: 1800000, status: 'aktif' },
  { kode: 'TRX-1006', nama: 'Pelatihan Tim', tanggal: '30 Agu 2026', jumlah: 3200000, status: 'baru' },
  { kode: 'TRX-1007', nama: 'Migrasi Data', tanggal: '29 Agu 2026', jumlah: 5600000, status: 'arsip' },
  { kode: 'TRX-1008', nama: 'Domain Kustom', tanggal: '29 Agu 2026', jumlah: 400000, status: 'aktif' },
  { kode: 'TRX-1009', nama: 'Modul Laporan Lanjutan', tanggal: '28 Agu 2026', jumlah: 2100000, status: 'tinjau' },
  { kode: 'TRX-1010', nama: 'Cadangan Harian', tanggal: '28 Agu 2026', jumlah: 950000, status: 'aktif' },
];

const LENCANA: Record<Status, ReactNode> = {
  aktif: (
    <Badge icon={Check} variant="green">
      Selesai
    </Badge>
  ),
  baru: (
    <Badge icon={Sparkles} variant="blue">
      Baru
    </Badge>
  ),
  tinjau: (
    <Badge icon={CircleAlert} variant="amber">
      Tinjau
    </Badge>
  ),
  arsip: (
    <Badge icon={Package} variant="gray">
      Arsip
    </Badge>
  ),
};

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);

function TabelTerbaru() {
  const [cari, setCari] = useState('');
  const [perHalaman, setPerHalaman] = useState(PER_HALAMAN_BAWAAN);
  const [halaman, setHalaman] = useState(1);

  const cocok = useMemo(() => {
    const k = cari.toLowerCase();
    return DATA.filter((d) => d.nama.toLowerCase().includes(k) || d.kode.toLowerCase().includes(k));
  }, [cari]);

  // perHalaman 0 = "Semua" pada TableToolbar.
  const ukuran = perHalaman > 0 ? perHalaman : cocok.length || 1;
  const totalHalaman = Math.max(1, Math.ceil(cocok.length / ukuran));
  const halamanAman = Math.min(halaman, totalHalaman);
  const mulai = (halamanAman - 1) * ukuran;
  const terlihat = cocok.slice(mulai, mulai + ukuran);

  const baris = terlihat.map((d) => ({
    kode: d.kode,
    nama: d.nama,
    tanggal: d.tanggal,
    jumlah: rupiah(d.jumlah),
    status: LENCANA[d.status],
    aksi: (
      <div className="tablelist-v1__aksi">
        <ActionButton icon={Eye} aria-label={`Lihat ${d.kode}`} />
        <ActionButton icon={Pencil} aria-label={`Ubah ${d.kode}`} />
        <ActionButton icon={Trash2} variant="danger" aria-label={`Hapus ${d.kode}`} />
      </div>
    ),
  }));

  return (
    <TableListV1
      title="Transaksi Terbaru"
      subtitle="Sepuluh transaksi terakhir yang tercatat"
      columns={KOLOM}
      rows={baris}
      rowKey={(row) => String(row.kode)}
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
          placeholderCari="Cari kode atau nama item…"
        />
      }
      paginasi={{
        halaman: halamanAman,
        totalHalaman,
        info: `Menampilkan ${cocok.length === 0 ? 0 : mulai + 1}–${mulai + terlihat.length} dari ${
          cocok.length
        } data`,
        onNavigasi: setHalaman,
      }}
      minBaris={8}
      emptyText="Tidak ada transaksi yang cocok."
    />
  );
}

function AksesCepat() {
  const tujuan = useMemo(() => {
    const m = saringMenu(menu, undefined);
    return [...m.main, ...m.groups.flatMap((g) => g.items), ...m.others].filter(
      (i) => i.href !== '/dashboard' && !i.external,
    );
  }, []);

  if (tujuan.length === 0) return null;

  return (
    <section className="akses-cepat" aria-label="Akses cepat">
      <div className="akses-cepat__isi">
        <span className="akses-cepat__badge">
          <Sparkles className="akses-cepat__badge-ikon" aria-hidden="true" />
          Akses Cepat
        </span>
        <h2 className="akses-cepat__judul">Langsung Ke Halaman Yang Sering Dibuka</h2>
      </div>

      <div className="akses-cepat__tombol">
        {tujuan.map((item) => {
          const Ikon = resolveIcon(item.icon);
          return (
            <Link key={item.key} className="akses-cepat__butir" to={item.href}>
              <Ikon className="akses-cepat__ikon" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="dashboard space-y-6">
      {/* Aksi dibiarkan bawaan: Hubungi Pengembang. */}
      <WelcomeCardV2 name="Administrator" badge="DealTech UI 2.0 Next" />

      <div className="dashboard__stat">
        {RINGKASAN.map(({ kunci, ikon, judul, nilai, helper }) => (
          <StatCard key={kunci} icon={ikon} title={judul} value={nilai} helper={helper} />
        ))}
      </div>

      <TabelTerbaru />

      <AksesCepat />
    </div>
  );
}
