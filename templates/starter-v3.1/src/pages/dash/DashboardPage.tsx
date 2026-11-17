import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Boxes,
  Check,
  CircleAlert,
  Component,
  Download,
  Eye,
  LayoutDashboard,
  Package,
  PackageX,
  Pencil,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge/Badge';
import { BilahLipat } from '@/components/ui/bilah-lipat/BilahLipat';
import { Button } from '@/components/ui/button/Button';
import {
  GridKartuRingkas,
  GridKartuRingkasSkeleton,
  KartuRingkas,
  type KartuRingkasProps,
} from '@/components/ui/kartu-ringkas/KartuRingkas';
import { HapusMassal } from '@/components/ui/hapus-massal/HapusMassal';
import { Modal } from '@/components/ui/modal/Modal';
import { Seksi } from '@/components/ui/seksi/Seksi';
import { StatCard, StatGrid } from '@/components/ui/stat-card/StatCard';
import { TableToolbar } from '@/components/ui/table-toolbar/TableToolbar';
import { AksiBaris, TableListV1 } from '@/components/ui/tablelist-v1/TableListV1';
import { WelcomeCardV2 } from '@/components/ui/welcome-card-v2/WelcomeCardV2';
import { PER_HALAMAN_BAWAAN, usePilihan } from '@/lib/daftar';
import { ambilProduk, type Produk } from '@/services/produk';
import './dashboard.css';

const RINGKASAN = [
  { kunci: 'komponen', ikon: Component, judul: 'Komponen UI', nilai: '67 elemen', helper: null },
  { kunci: 'layout', ikon: LayoutDashboard, judul: 'Layout', nilai: '1 layout', helper: null },
  { kunci: 'token', ikon: Boxes, judul: 'Token Tema', nilai: '60+ variabel', helper: null },
  { kunci: 'pengguna', ikon: Users, judul: 'Pengguna', nilai: '1 akun', helper: 'mode demo' },
] as const;

const KOLOM = [
  { key: 'kode', label: 'Kode', width: '130px' },
  { key: 'nama', label: 'Nama Item' },
  { key: 'tanggal', label: 'Tanggal', width: '130px' },
  { key: 'jumlah', label: 'Jumlah', align: 'right' as const, width: '150px' },
  { key: 'status', label: 'Status', align: 'center' as const, width: '130px', skeleton: 'pil' as const },
  { key: 'aksi', label: 'Aksi', align: 'right' as const, width: '64px', skeleton: 'ikon' as const },
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

type Transaksi = (typeof DATA)[number];

function TabelTerbaru() {
  const [data, setData] = useState(DATA);
  const [dilihat, setDilihat] = useState<Transaksi | null>(null);
  const [cari, setCari] = useState('');
  const [perHalaman, setPerHalaman] = useState(PER_HALAMAN_BAWAAN);
  const [halaman, setHalaman] = useState(1);

  const cocok = useMemo(() => {
    const k = cari.toLowerCase();
    return data.filter((d) => d.nama.toLowerCase().includes(k) || d.kode.toLowerCase().includes(k));
  }, [cari, data]);

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
    tanggal: d.tanggal,
    jumlah: rupiah(d.jumlah),
    status: LENCANA[d.status],
    aksi: (
      <AksiBaris
        nama={d.kode}
        item={[
          { kunci: 'lihat', label: 'Lihat Detail', ikon: Eye, onClick: () => setDilihat(d) },
          { kunci: 'ubah', label: 'Ubah', ikon: Pencil, onClick: () => {} },
          { kunci: 'hapus', label: 'Hapus', ikon: Trash2, bahaya: true, onClick: () => {} },
        ]}
      />
    ),
  }));

  return (
    <>
      <TableListV1
        columns={KOLOM}
        rows={baris}
        rowKey={(row) => String(row.kode)}
        onKlikBaris={(row) => setDilihat(data.find((d) => d.kode === row.kode) ?? null)}
        pilihan={pilihan}
        aksiMassal={
          <>
            <Button variant="ghost" icon={Download}>
              Ekspor
            </Button>
            <HapusMassal
              terpilih={pilihan.terpilih}
              satuan="transaksi"
              nama={(kode) => data.find((d) => d.kode === kode)?.nama ?? kode}
              hapus={(kode) => setData((lama) => lama.filter((d) => d.kode !== kode))}
              onBersihkan={pilihan.onBersihkan}
              onToggle={pilihan.onToggle}
            />
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
        emptyText="Tidak ada transaksi yang cocok."
      />

      <Modal
        open={!!dilihat}
        onClose={() => setDilihat(null)}
        title={dilihat ? `Transaksi ${dilihat.kode}` : 'Transaksi'}
        footer={
          <Button variant="ghost" onClick={() => setDilihat(null)}>
            Tutup
          </Button>
        }
      >
        {dilihat ? (
          <dl className="dashboard-rincian">
            {(
              [
                ['Kode', dilihat.kode],
                ['Nama Item', dilihat.nama],
                ['Tanggal', dilihat.tanggal],
                ['Jumlah', rupiah(dilihat.jumlah)],
                ['Status', LENCANA[dilihat.status]],
              ] as const
            ).map(([label, nilai]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{nilai}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Modal>
    </>
  );
}

type BarisKartu = KartuRingkasProps & { kunci: string };

const BATAS_KARTU = 6;
// Stok di bawah ini perlu diisi ulang
const STOK_MINIMUM = 50;

const NOTIFIKASI: BarisKartu[] = [
  { kunci: 'n1', judul: 'Pembayaran TRX-1002 diterima', status: '5 menit lalu', info: 'TRX-1002', ikon: Bell, ke: '/dashboard/pembayaran' },
  { kunci: 'n2', judul: 'Harga Paket Langganan Pro diubah', status: '32 menit lalu', info: 'PRD-2002', ikon: Bell, ke: '/dashboard/produk/PRD-2002' },
  { kunci: 'n3', judul: 'Member baru mendaftar', status: '1 jam lalu', info: 'USR-1012', ikon: Bell, ke: '/dashboard/member' },
  { kunci: 'n4', judul: 'Warna tema admin diperbarui', status: 'Kemarin', info: 'Pengaturan', ikon: Bell, ke: '/dashboard/pengaturan' },
  { kunci: 'n5', judul: 'Bukti bayar TRX-1006 diunggah', status: 'Kemarin', info: 'TRX-1006', ikon: Bell, ke: '/dashboard/pembayaran' },
];

const MEMBER_BARU: BarisKartu[] = [
  { kunci: 'USR-1012', judul: 'Yoga Pratama', status: 'Bergabung hari ini', info: 'USR-1012', ikon: UserPlus, nada: 'sukses' },
  { kunci: 'USR-1011', judul: 'Nadia Puspita', status: 'Bergabung hari ini', info: 'USR-1011', ikon: UserPlus, nada: 'sukses' },
  { kunci: 'USR-1010', judul: 'Rizky Ramadhan', status: 'Kemarin', info: 'USR-1010', ikon: UserPlus, nada: 'sukses' },
];

const TINDAKAN: BarisKartu[] = DATA.filter((d) => d.status === 'baru' || d.status === 'tinjau').map((d) => ({
  kunci: d.kode,
  judul: d.nama,
  status: d.status === 'baru' ? 'Menunggu pembayaran' : 'Perlu ditinjau',
  info: `${d.kode} · ${rupiah(d.jumlah)}`,
  ikon: d.status === 'baru' ? Wallet : CircleAlert,
  nada: 'awas',
  ke: d.status === 'baru' ? '/dashboard/pembayaran' : '/dashboard/checkout',
}));

interface SeksiKartuProps {
  judul: string;
  /** Tanpa halaman daftar: tanpa tautan */
  ke?: string;
  baris: BarisKartu[];
  memuat: boolean;
}

/** Seksi kartu data: skeleton, lalu sembunyi bila kosong */
function SeksiKartu({ judul, ke, baris, memuat }: SeksiKartuProps) {
  if (!memuat && baris.length === 0) return null;
  return (
    <Seksi
      title={memuat ? judul : `${judul} (${baris.length})`}
      rapat
      action={
        ke ? (
          <Link to={ke} className="dashboard-tautan">
            Lihat semua
          </Link>
        ) : undefined
      }
    >
      <div className="app-section-body">
        {memuat ? (
          <GridKartuRingkasSkeleton />
        ) : (
          <GridKartuRingkas>
            {baris.slice(0, BATAS_KARTU).map(({ kunci, ...b }) => (
              <KartuRingkas key={kunci} {...b} ke={b.ke ?? ke} />
            ))}
          </GridKartuRingkas>
        )}
      </div>
    </Seksi>
  );
}

function KartuData() {
  const [produk, setProduk] = useState<Produk[] | null>(null);
  const memuat = produk === null;

  useEffect(() => {
    let hidup = true;
    ambilProduk()
      .then((d) => hidup && setProduk(d))
      .catch(() => hidup && setProduk([]));
    return () => {
      hidup = false;
    };
  }, []);

  const stok = useMemo<BarisKartu[]>(
    () =>
      (produk ?? [])
        .filter((p) => p.stok < STOK_MINIMUM)
        .sort((a, b) => a.stok - b.stok)
        .map((p) => ({
          kunci: p.kode,
          judul: p.nama,
          status: `Sisa ${p.stok}`,
          info: `minimal ${STOK_MINIMUM}`,
          ikon: PackageX,
          nada: p.stok < 20 ? 'bahaya' : 'awas',
          ke: `/dashboard/produk/${encodeURIComponent(p.kode)}`,
        })),
    [produk],
  );

  return (
    <>
      <div className="dashboard-dua">
        <SeksiKartu judul="Perlu Tindakan" ke="/dashboard/pembayaran" baris={TINDAKAN} memuat={memuat} />
        <SeksiKartu judul="Stok di Bawah Minimum" ke="/dashboard/produk" baris={stok} memuat={memuat} />
      </div>
      <div className="dashboard-satu">
        <SeksiKartu judul="Notifikasi Baru" baris={NOTIFIKASI} memuat={memuat} />
        <SeksiKartu judul="Member Baru" ke="/dashboard/member" baris={MEMBER_BARU} memuat={memuat} />
      </div>
    </>
  );
}

export default function DashboardPage() {
  /* Terbuka sejak awal: sambutan dan ringkasan angka memang yang pertama dilihat.
     Bilah lipatnya untuk yang datang ke sini demi tabelnya, bukan demi angkanya. */
  const [ringkasTerbuka, setRingkasTerbuka] = useState(true);

  return (
    <div className="dashboard space-y-6">
      <BilahLipat
        terbuka={ringkasTerbuka}
        onToggle={() => setRingkasTerbuka((v) => !v)}
        teks={
          ringkasTerbuka
            ? 'Tutup sambutan dan ringkasan?'
            : `Sambutan dan ${RINGKASAN.length} ringkasan angka disembunyikan. Tampilkan lagi?`
        }
        aksi={ringkasTerbuka ? 'Tutup Sekarang' : 'Buka Sekarang'}
      />

      {ringkasTerbuka ? (
        <>
          {/* Aksi dibiarkan bawaan: Hubungi Pengembang. */}
          <WelcomeCardV2 name="Administrator" badge="DealTech UI 3.1" />

          <StatGrid>
            {RINGKASAN.map(({ kunci, ikon, judul, nilai, helper }) => (
              <StatCard key={kunci} icon={ikon} title={judul} value={nilai} helper={helper} />
            ))}
          </StatGrid>
        </>
      ) : null}

      <TabelTerbaru />

      <KartuData />
    </div>
  );
}
