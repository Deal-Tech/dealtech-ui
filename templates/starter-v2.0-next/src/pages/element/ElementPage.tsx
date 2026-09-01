import { useState, type ReactNode } from 'react';
import {
  Building2,
  Check,
  CircleAlert,
  Clock,
  Download,
  Eye,
  Package,
  Pencil,
  Plus,
  ShoppingCart,
  Sparkles,
  Trash2,
  Users,
  Wallet,
} from 'lucide-react';

import ActionButton from '@/components/ui/action-button/ActionButton';
import { Badge } from '@/components/ui/badge/Badge';
import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';
import { BadgeV2 } from '@/components/ui/badgev2/BadgeV2';
import { BlokTentang } from '@/components/ui/blok-tentang/BlokTentang';
import { Button } from '@/components/ui/button/Button';
import { CardBarChart } from '@/components/ui/cardbar-chart/CardBarChart';
import { CardBarList } from '@/components/ui/cardbar-list/CardBarList';
import { ChartBarGanda } from '@/components/ui/chartbar-ganda/ChartBarGanda';
import { ChartBarHor } from '@/components/ui/chartbarhor/ChartBarHor';
import { ChartBarVer } from '@/components/ui/chartbarver/ChartBarVer';
import { ChartLine } from '@/components/ui/chartline/ChartLine';
import { ChartLineV2 } from '@/components/ui/chartlinev2/ChartLineV2';
import { ChartListBar } from '@/components/ui/chartlistbar/ChartListBar';
import { ChartPie } from '@/components/ui/chartpie/ChartPie';
import { ChartTopList } from '@/components/ui/charttoplist/ChartTopList';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { CountUp } from '@/components/ui/count-up/CountUp';
import { DateInput } from '@/components/ui/date-input/DateInput';
import { Heatmap } from '@/components/ui/heatmap/Heatmap';
import HexBackdrop from '@/components/ui/hex-backdrop/HexBackdrop';
import { InputLongText } from '@/components/ui/inputlongtext/InputLongText';
import { InputNumber } from '@/components/ui/inputnumber/InputNumber';
import { InputText } from '@/components/ui/inputtext/InputText';
import { Kalender } from '@/components/ui/kalender/Kalender';
import { KartuKatalog } from '@/components/ui/kartu-katalog/KartuKatalog';
import { KepalaPublik } from '@/components/ui/kepala-publik/KepalaPublik';
import { KodeOtomatis } from '@/components/ui/kode-otomatis/KodeOtomatis';
import { LabelQR } from '@/components/ui/label-qr/LabelQR';
import { LembarCetak } from '@/components/ui/lembar-cetak/LembarCetak';
import { TombolCetak } from '@/components/ui/lembar-cetak/TombolCetak';
import LightboxGambar from '@/components/ui/lightbox/LightboxGambar';
import LogoShape from '@/components/ui/logo-shape/LogoShape';
import { Memuat } from '@/components/ui/memuat/Memuat';
import { Modal } from '@/components/ui/modal/Modal';
import { PageTitle } from '@/components/ui/pagetitle/PageTitle';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { PilihBanyak } from '@/components/ui/pilih-banyak/PilihBanyak';
import { PitaBerjalan } from '@/components/ui/pita-berjalan/PitaBerjalan';
import { ProgressBar } from '@/components/ui/progress-bar/ProgressBar';
import { ProsesModal, type TugasProses } from '@/components/ui/proses-modal/ProsesModal';
import { IsiKaya } from '@/components/ui/richtext/IsiKaya';
import { RichText } from '@/components/ui/richtext/RichText';
import { SearchInput } from '@/components/ui/search-input/SearchInput';
import { SearchSelect } from '@/components/ui/search-select/SearchSelect';
import { Select } from '@/components/ui/select/Select';
import { StatCard } from '@/components/ui/stat-card/StatCard';
import { TabButton } from '@/components/ui/tab-button/TabButton';
import { TabelCardV1 } from '@/components/ui/tabelcardv1/TabelCardV1';
import { TableToolbar } from '@/components/ui/table-toolbar/TableToolbar';
import { TableListV1 } from '@/components/ui/tablelist-v1/TableListV1';
import { ToggleOnOff } from '@/components/ui/toggleonoff/ToggleOnOff';
import { UlasanBerjalan } from '@/components/ui/ulasan-berjalan/UlasanBerjalan';
import { UnggahGambar } from '@/components/ui/unggah-gambar/UnggahGambar';
import { WelcomeCardV2 } from '@/components/ui/welcome-card-v2/WelcomeCardV2';
import { PER_HALAMAN_BAWAAN, usePilihan } from '@/lib/daftar';
import './element.css';

/* -------------------------------------------------------------------------- */
/* Kerangka halaman                                                            */
/* -------------------------------------------------------------------------- */

interface SeksiProps {
  id: string;
  judul: string;
  jumlah: number;
  children: ReactNode;
}

function Seksi({ id, judul, jumlah, children }: SeksiProps) {
  return (
    <section className="element-seksi" id={id}>
      <div className="element-seksi__kepala">
        <h2 className="element-seksi__judul">
          {judul}
          <span className="element-seksi__jumlah">{jumlah} elemen</span>
        </h2>
      </div>
      <div className="element-grid">{children}</div>
    </section>
  );
}

function Petak({ nama, jalur, children }: { nama: string; jalur: string; children: ReactNode }) {
  return (
    <div className="element-petak">
      <div className="element-petak__kepala">
        <span className="element-petak__nama">{nama}</span>
        <span className="element-petak__jalur">{jalur}</span>
      </div>
      <div className="element-petak__isi">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Data contoh                                                                 */
/* -------------------------------------------------------------------------- */

const GAMBAR_CONTOH =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#066aca"/><stop offset="100%" stop-color="#0a3b45"/>' +
      '</linearGradient></defs>' +
      '<rect width="640" height="420" fill="url(#g)"/>' +
      '<text x="50%" y="52%" text-anchor="middle" fill="#ffffff" ' +
      'font-family="sans-serif" font-size="34" font-weight="600">Gambar Contoh</text>' +
      '</svg>',
  );

const OPSI_STATUS = [
  { value: 'aktif', label: 'Aktif' },
  { value: 'draf', label: 'Draf' },
  { value: 'arsip', label: 'Arsip' },
];

const OPSI_BADGE = [
  { value: 'aktif', label: 'Aktif', icon: Check, variant: 'green' as const },
  { value: 'tinjau', label: 'Perlu Tinjau', icon: CircleAlert, variant: 'amber' as const },
  { value: 'arsip', label: 'Arsip', icon: Trash2, variant: 'gray' as const },
];

const OPSI_FITUR = [
  { value: 'notifikasi', label: 'Notifikasi', warna: '#066aca' },
  { value: 'ekspor', label: 'Ekspor Data', warna: '#16a34a' },
  { value: 'multi', label: 'Multi Pengguna', warna: '#d29922' },
  { value: 'api', label: 'Akses API', warna: '#9333ea' },
];

const DATA_GARIS = [
  { bulan: 'Jan', kunjungan: 320, transaksi: 180 },
  { bulan: 'Feb', kunjungan: 410, transaksi: 220 },
  { bulan: 'Mar', kunjungan: 380, transaksi: 205 },
  { bulan: 'Apr', kunjungan: 520, transaksi: 290 },
  { bulan: 'Mei', kunjungan: 610, transaksi: 340 },
  { bulan: 'Jun', kunjungan: 580, transaksi: 325 },
];

const DATA_BATANG = [
  { label: 'Sen', value: 42 },
  { label: 'Sel', value: 58 },
  { label: 'Rab', value: 35 },
  { label: 'Kam', value: 71 },
  { label: 'Jum', value: 64 },
  { label: 'Sab', value: 88 },
  { label: 'Min', value: 79 },
];

const KOLOM_TABEL = [
  { key: 'kode', label: 'Kode', width: '130px' },
  { key: 'nama', label: 'Nama Item' },
  { key: 'jumlah', label: 'Jumlah', align: 'right' as const, width: '110px' },
  { key: 'status', label: 'Status', align: 'center' as const, width: '130px' },
  { key: 'aksi', label: 'Aksi', align: 'right' as const, width: '150px' },
];

type StatusItem = 'aktif' | 'baru' | 'tinjau' | 'arsip';

const ITEM_CONTOH: { kode: string; nama: string; jumlah: number; status: StatusItem }[] = [
  { kode: 'ITM-001', nama: 'Paket Langganan Dasar', jumlah: 128, status: 'aktif' },
  { kode: 'ITM-002', nama: 'Paket Langganan Pro', jumlah: 64, status: 'baru' },
  { kode: 'ITM-003', nama: 'Tambahan Penyimpanan', jumlah: 19, status: 'tinjau' },
  { kode: 'ITM-004', nama: 'Dukungan Prioritas', jumlah: 42, status: 'aktif' },
  { kode: 'ITM-005', nama: 'Modul Laporan Lanjutan', jumlah: 31, status: 'aktif' },
  { kode: 'ITM-006', nama: 'Integrasi API', jumlah: 8, status: 'tinjau' },
  { kode: 'ITM-007', nama: 'Pelatihan Tim', jumlah: 12, status: 'baru' },
  { kode: 'ITM-008', nama: 'Migrasi Data', jumlah: 5, status: 'arsip' },
  { kode: 'ITM-009', nama: 'Domain Kustom', jumlah: 23, status: 'aktif' },
  { kode: 'ITM-010', nama: 'Cadangan Harian', jumlah: 57, status: 'aktif' },
];

const LENCANA: Record<StatusItem, ReactNode> = {
  aktif: (
    <Badge icon={Check} variant="green">
      Aktif
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

const NAVIGASI = [
  { id: 'tombol', label: 'Tombol & Navigasi' },
  { id: 'status', label: 'Status & Umpan Balik' },
  { id: 'form', label: 'Form' },
  { id: 'data', label: 'Data & Tabel' },
  { id: 'chart', label: 'Chart' },
  { id: 'overlay', label: 'Overlay' },
  { id: 'publik', label: 'Publik & Cetak' },
];

/* -------------------------------------------------------------------------- */
/* Halaman                                                                     */
/* -------------------------------------------------------------------------- */

export default function ElementPage() {
  const [teks, setTeks] = useState('Paket Langganan Pro');
  const [angka, setAngka] = useState('450000');
  const [panjang, setPanjang] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [status, setStatus] = useState('aktif');
  const [pencarian, setPencarian] = useState('');
  const [cariTabel, setCariTabel] = useState('');
  const [perHalaman, setPerHalaman] = useState(PER_HALAMAN_BAWAAN);
  const [halamanTabel, setHalamanTabel] = useState(1);
  const [setuju, setSetuju] = useState(true);
  const [aktif, setAktif] = useState(true);
  const [fitur, setFitur] = useState<string[]>(['notifikasi', 'ekspor']);
  const [isiKaya, setIsiKaya] = useState('<p>Tulis <strong>deskripsi</strong> paket di sini.</p>');
  const [gambar, setGambar] = useState('');
  const [badge, setBadge] = useState('aktif');
  const [tab, setTab] = useState('semua');
  const [halaman, setHalaman] = useState(3);
  const [bulan, setBulan] = useState({ tahun: 2026, bulan: 8 });
  const [tanggalPilih, setTanggalPilih] = useState<string | null>('2026-09-12');
  const [modalBuka, setModalBuka] = useState(false);
  const [lightbox, setLightbox] = useState(-1);
  const [tugas, setTugas] = useState<TugasProses | null>(null);

  const cocok = ITEM_CONTOH.filter(
    (i) =>
      i.nama.toLowerCase().includes(cariTabel.toLowerCase()) ||
      i.kode.toLowerCase().includes(cariTabel.toLowerCase()),
  );
  // perHalaman 0 = "Semua" pada TableToolbar.
  const ukuran = perHalaman > 0 ? perHalaman : cocok.length || 1;
  const totalHalaman = Math.max(1, Math.ceil(cocok.length / ukuran));
  const halamanAman = Math.min(halamanTabel, totalHalaman);
  const mulai = (halamanAman - 1) * ukuran;
  const terlihat = cocok.slice(mulai, mulai + ukuran);

  const pilihanTabel = usePilihan(terlihat.map((i) => i.kode));

  const barisTabel = terlihat.map((i) => ({
    kode: i.kode,
    nama: i.nama,
    jumlah: i.jumlah.toLocaleString('id-ID'),
    status: LENCANA[i.status],
    aksi: (
      <div className="tablelist-v1__aksi">
        <ActionButton icon={Eye} aria-label={`Lihat ${i.nama}`} />
        <ActionButton icon={Pencil} aria-label={`Ubah ${i.nama}`} />
        <ActionButton icon={Trash2} variant="danger" aria-label={`Hapus ${i.nama}`} />
      </div>
    ),
  }));

  return (
    <div className="element-page">
      <PageTitle
        title="Semua Element"
        subtitle="Katalog komponen DealTech UI v2. Setiap kotak menampilkan satu komponen beserta letak berkasnya di src/components/ui/."
        action={<span className="element-hitung">55 komponen</span>}
      />

      <nav className="element-nav" aria-label="Lompat ke seksi">
        {NAVIGASI.map((n) => (
          <a key={n.id} className="element-nav__tautan" href={`#${n.id}`}>
            {n.label}
          </a>
        ))}
      </nav>

      {/* ------------------------------------------------------------------ */}
      <Seksi id="tombol" judul="Tombol & Navigasi" jumlah={4}>
        <Petak nama="Button" jalur="button/">
          <p className="element-catatan">Satu ukuran, empat keadaan.</p>
          <div className="element-baris">
            <Button>Normal</Button>
            <Button variant="ghost">Ghost</Button>
            <Button loading>Loading</Button>
            <Button disabled>Nonaktif</Button>
          </div>
          <div className="element-baris">
            <Button icon={Plus}>Normal</Button>
            <Button variant="ghost" icon={Plus}>
              Ghost
            </Button>
            <Button loading>Loading</Button>
            <Button icon={Plus} disabled>
              Nonaktif
            </Button>
          </div>
          <div className="element-baris">
            <Button icon={Plus} aria-label="Tambah" />
            <Button variant="ghost" icon={Pencil} aria-label="Ubah" />
            <Button icon={Download} disabled aria-label="Unduh" />
          </div>
        </Petak>

        <Petak nama="ActionButton" jalur="action-button/">
          <div className="element-baris">
            <ActionButton icon={Eye} aria-label="Lihat" />
            <ActionButton icon={Pencil} aria-label="Ubah" />
            <ActionButton icon={Download} aria-label="Unduh" />
            <ActionButton icon={Trash2} variant="danger" aria-label="Hapus" />
            <ActionButton icon={Pencil} disabled aria-label="Nonaktif" />
          </div>
          <p className="element-catatan">Tombol ikon untuk kolom aksi di tabel.</p>
        </Petak>

        <Petak nama="TabButton" jalur="tab-button/">
          <TabButton
            value={tab}
            onChange={setTab}
            tabs={[
              { key: 'semua', label: 'Semua', icon: Package, count: 24 },
              { key: 'aktif', label: 'Aktif', icon: Check, count: 18 },
              { key: 'arsip', label: 'Arsip', icon: Trash2, count: 6 },
            ]}
          />
          <p className="element-catatan">Tab aktif: {tab}</p>
        </Petak>

        <Petak nama="Pagination" jalur="pagination/">
          <Pagination
            current={halaman}
            last={12}
            onNavigate={setHalaman}
            info="Menampilkan 21–30 dari 118 data"
          />
        </Petak>
      </Seksi>

      {/* ------------------------------------------------------------------ */}
      <Seksi id="status" judul="Status & Umpan Balik" jumlah={6}>
        <Petak nama="BadgeInfo" jalur="badgeinfo/">
          <p className="element-catatan">Dengan ikon — bawaan tiap varian.</p>
          <BadgeInfo variant="info">Sinkronisasi data dijadwalkan malam ini.</BadgeInfo>
          <BadgeInfo variant="success">Perubahan berhasil disimpan.</BadgeInfo>
          <BadgeInfo variant="warning">Sisa kuota penyimpanan tinggal 8%.</BadgeInfo>
          <BadgeInfo variant="error">Koneksi ke server terputus.</BadgeInfo>

          <p className="element-catatan">Tanpa ikon — <code>icon={'{false}'}</code>.</p>
          <BadgeInfo variant="info" icon={false}>
            Sinkronisasi data dijadwalkan malam ini.
          </BadgeInfo>
          <BadgeInfo variant="success" icon={false}>
            Perubahan berhasil disimpan.
          </BadgeInfo>
          <BadgeInfo variant="warning" icon={false}>
            Sisa kuota penyimpanan tinggal 8%.
          </BadgeInfo>
          <BadgeInfo variant="error" icon={false}>
            Koneksi ke server terputus.
          </BadgeInfo>
        </Petak>

        <Petak nama="Badge" jalur="badge/">
          <div className="element-baris">
            <Badge icon={Check} variant="green">
              Aktif
            </Badge>
            <Badge icon={CircleAlert} variant="amber">
              Tinjau
            </Badge>
            <Badge icon={Trash2} variant="red">
              Batal
            </Badge>
            <Badge icon={Clock} variant="blue">
              Menunggu
            </Badge>
            <Badge icon={Sparkles} variant="purple">
              Baru
            </Badge>
            <Badge icon={Package} variant="gray">
              Arsip
            </Badge>
          </div>
        </Petak>

        <Petak nama="BadgeV2" jalur="badgev2/">
          <BadgeV2 value={badge} onValueChange={setBadge} options={OPSI_BADGE} />
          <p className="element-catatan">Badge yang bisa diklik untuk ganti status: {badge}</p>
        </Petak>

        <Petak nama="ProgressBar" jalur="progress-bar/">
          <ProgressBar value={72} label="Unggahan berkas" showValue />
          <ProgressBar value={34} />
          <ProgressBar indeterminate label="Menyiapkan data" />
        </Petak>

        <Petak nama="Memuat" jalur="memuat/">
          <Memuat teks="Memuat data…" ukuran="halaman" />
        </Petak>

        <Petak nama="CountUp" jalur="count-up/">
          <div className="element-baris" style={{ fontSize: 28, fontWeight: 600 }}>
            <CountUp value={1284} />
            <span style={{ fontSize: 14, fontWeight: 400 }}>kunjungan bulan ini</span>
          </div>
          <p className="element-catatan">Angka menghitung naik saat pertama tampil.</p>
        </Petak>

        <Petak nama="KodeOtomatis" jalur="kode-otomatis/">
          <KodeOtomatis
            label="Kode Item"
            kode="ITM-2026-004"
            tetap={false}
            keterangan="Masih perkiraan — kode final dibuat saat data disimpan."
          />
        </Petak>
      </Seksi>

      {/* ------------------------------------------------------------------ */}
      <Seksi id="form" judul="Form" jumlah={12}>
        <Petak nama="InputText / InputNumber" jalur="inputtext/, inputnumber/">
          <InputText
            label="Nama Item"
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            hint="Nama yang tampil di daftar dan laporan."
          />
          <InputNumber
            label="Harga"
            currency
            value={angka}
            onChange={(e) => setAngka(e.target.value)}
          />
          <InputText label="Email" error="Format email belum benar." defaultValue="halo@" />
        </Petak>

        <Petak nama="InputLongText / DateInput" jalur="inputlongtext/, date-input/">
          <InputLongText
            label="Catatan"
            placeholder="Tulis catatan tambahan…"
            autoResize
            value={panjang}
            onChange={(e) => setPanjang(e.target.value)}
          />
          <DateInput
            label="Tanggal Mulai"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
          />
        </Petak>

        <Petak nama="Select / SearchSelect" jalur="select/, search-select/">
          <div>
            <span style={{ fontSize: 'var(--app-field-label-size)', fontWeight: 500 }}>Status</span>
            <Select value={status} onValueChange={setStatus} options={OPSI_STATUS} />
          </div>
          <div>
            <span style={{ fontSize: 'var(--app-field-label-size)', fontWeight: 500 }}>
              Dengan pencarian
            </span>
            <SearchSelect
              value={status}
              onValueChange={setStatus}
              options={OPSI_STATUS}
              placeholder="Cari status…"
            />
          </div>
        </Petak>

        <Petak nama="SearchInput" jalur="search-input/">
          <SearchInput
            placeholder="Cari nama, kode, atau kategori…"
            value={pencarian}
            onChange={(e) => setPencarian(e.target.value)}
          />
          <p className="element-catatan">Kata kunci: {pencarian || '—'}</p>
        </Petak>

        <Petak nama="Checkbox / ToggleOnOff" jalur="checkbox/, toggleonoff/">
          <Checkbox
            label="Saya menyetujui syarat dan ketentuan"
            checked={setuju}
            onChange={(e) => setSetuju(e.target.checked)}
          />
          <Checkbox label="Sebagian terpilih" indeterminate checked={false} readOnly />
          <Checkbox label="Nonaktif" disabled />
          <ToggleOnOff checked={aktif} onChange={setAktif} label="Tampilkan di halaman publik" />
        </Petak>

        <Petak nama="PilihBanyak" jalur="pilih-banyak/">
          <PilihBanyak
            opsi={OPSI_FITUR}
            terpilih={fitur}
            onToggle={(v) =>
              setFitur((prev) =>
                prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
              )
            }
            onPilihSemua={() => setFitur(OPSI_FITUR.map((o) => o.value))}
            onKosongkan={() => setFitur([])}
          />
        </Petak>

        <Petak nama="RichText" jalur="richtext/RichText">
          <RichText label="Deskripsi" value={isiKaya} onChange={setIsiKaya} />
        </Petak>

        <Petak nama="UnggahGambar" jalur="unggah-gambar/">
          <UnggahGambar label="Foto Sampul" nilai={gambar} onChange={setGambar} />
          <p className="element-catatan">
            Pengunggahan memerlukan backend. Tanpa itu tombolnya tetap tampil, hanya berkasnya
            yang gagal terkirim.
          </p>
        </Petak>
      </Seksi>

      {/* ------------------------------------------------------------------ */}
      <Seksi id="data" judul="Data & Tabel" jumlah={7}>
        <Petak nama="StatCard" jalur="stat-card/">
          <div
            style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}
          >
            <StatCard icon={Package} title="Produk" value="248 produk" helper="12 nonaktif" />
            <StatCard icon={ShoppingCart} title="Transaksi" value="1.860 transaksi" />
            <StatCard icon={Wallet} title="Pendapatan" value="Rp 412 jt" />
            <StatCard icon={Users} title="Pengguna" value="1.204 akun" helper="18 nonaktif" />
          </div>
        </Petak>

        <Petak nama="PageTitle" jalur="pagetitle/">
          <PageTitle
            title="Daftar Produk"
            subtitle="Semua produk yang tampil di katalog."
            action={
              <Button icon={Plus}>
                Tambah
              </Button>
            }
          />
        </Petak>

        <Petak nama="TableToolbar + TableListV1" jalur="table-toolbar/, tablelist-v1/">
          <TableListV1
            columns={KOLOM_TABEL}
            rows={barisTabel}
            rowKey={(row) => String(row.kode)}
            minBaris={8}
            pilihan={pilihanTabel}
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
                cari={cariTabel}
                onCari={(v) => {
                  setCariTabel(v);
                  setHalamanTabel(1);
                }}
                perHalaman={perHalaman}
                onPerHalaman={(v) => {
                  setPerHalaman(v);
                  setHalamanTabel(1);
                }}
                placeholderCari="Cari item…"
              />
            }
            paginasi={{
              halaman: halamanAman,
              totalHalaman,
              info: `Menampilkan ${cocok.length === 0 ? 0 : mulai + 1}–${
                mulai + terlihat.length
              } dari ${cocok.length} data`,
              onNavigasi: setHalamanTabel,
            }}
          />
        </Petak>

        <Petak nama="TabelCardV1" jalur="tabelcardv1/">
          <TabelCardV1
            title="Tim Paling Aktif"
            subtitle="Tiga anggota dengan tugas terbanyak"
            count={3}
            items={[
              {
                title: 'Dewi Anggraini',
                subtitle: 'Operasional',
                initials: 'DA',
                meta: '12 tugas',
                badge: { label: 'Aktif', icon: Check, variant: 'green' },
              },
              {
                title: 'Bagus Prasetyo',
                subtitle: 'Keuangan',
                initials: 'BP',
                meta: '9 tugas',
                badge: { label: 'Aktif', icon: Check, variant: 'green' },
              },
              {
                title: 'Rina Kusuma',
                subtitle: 'Dukungan',
                initials: 'RK',
                meta: '4 tugas',
                badge: { label: 'Cuti', icon: CircleAlert, variant: 'amber' },
              },
            ]}
          />
        </Petak>

        <Petak nama="Kalender" jalur="kalender/">
          <Kalender
            tahun={bulan.tahun}
            bulan={bulan.bulan}
            onGantiBulan={(tahun, bln) => setBulan({ tahun, bulan: bln })}
            badge={{ '2026-09-12': 3, '2026-09-18': 1, '2026-09-24': 5 }}
            aktif={tanggalPilih}
            onPilih={setTanggalPilih}
          />
        </Petak>

        <Petak nama="Heatmap" jalur="heatmap/">
          <Heatmap
            title="Kepadatan Aktivitas"
            subtitle="Jumlah transaksi per shift"
            rows={['Pagi', 'Siang', 'Sore']}
            cols={['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']}
            values={[
              [2, 4, 1, 5, 3, 8, 7],
              [1, 2, 3, 2, 4, 6, 5],
              [0, 1, 1, 3, 2, 5, 4],
            ]}
          />
        </Petak>
      </Seksi>

      {/* ------------------------------------------------------------------ */}
      <Seksi id="chart" judul="Chart" jumlah={10}>
        <Petak nama="ChartLine" jalur="chartline/">
          <ChartLine
            title="Kunjungan & Transaksi"
            subtitle="Enam bulan terakhir"
            data={DATA_GARIS}
            xKey="bulan"
            series={[
              { key: 'kunjungan', label: 'Kunjungan' },
              { key: 'transaksi', label: 'Transaksi' },
            ]}
          />
        </Petak>

        <Petak nama="ChartLineV2" jalur="chartlinev2/">
          <ChartLineV2
            title="Tren Transaksi"
            subtitle="Dengan tabel rincian"
            data={DATA_GARIS}
            xKey="bulan"
            series={[{ key: 'transaksi', label: 'Transaksi' }]}
            showTable
          />
        </Petak>

        <Petak nama="ChartBarVer" jalur="chartbarver/">
          <ChartBarVer title="Transaksi per Hari" subtitle="Minggu ini" data={DATA_BATANG} />
        </Petak>

        <Petak nama="ChartBarHor" jalur="chartbarhor/">
          <ChartBarHor
            title="Produk Terlaris"
            data={[
              { label: 'Paket Langganan Pro', value: 128 },
              { label: 'Paket Langganan Dasar', value: 94 },
              { label: 'Tambahan Penyimpanan', value: 61 },
              { label: 'Dukungan Prioritas', value: 38 },
            ]}
          />
        </Petak>

        <Petak nama="ChartBarGanda" jalur="chartbar-ganda/">
          <ChartBarGanda
            title="Selesai vs Batal"
            data={[
              { label: 'Jun', a: 82, b: 6 },
              { label: 'Jul', a: 96, b: 11 },
              { label: 'Agu', a: 118, b: 8 },
              { label: 'Sep', a: 104, b: 14 },
            ]}
            namaA="Selesai"
            namaB="Batal"
          />
        </Petak>

        <Petak nama="ChartPie" jalur="chartpie/">
          <ChartPie
            title="Sumber Trafik"
            data={[
              { name: 'Organik', value: 420 },
              { name: 'Iklan', value: 310 },
              { name: 'Rujukan', value: 190 },
              { name: 'Langsung', value: 80 },
            ]}
            showSummary
            showLegend
          />
        </Petak>

        <Petak nama="ChartListBar" jalur="chartlistbar/">
          <ChartListBar
            title="Kanal Penjualan"
            items={[
              { label: 'Website', value: 62, valueLabel: '62%', meta: '740 transaksi' },
              { label: 'Aplikasi', value: 24, valueLabel: '24%', meta: '286 transaksi' },
              { label: 'Mitra', value: 14, valueLabel: '14%', meta: '167 transaksi' },
            ]}
          />
        </Petak>

        <Petak nama="ChartTopList" jalur="charttoplist/">
          <ChartTopList
            title="Staf Terbaik"
            subtitle="Berdasarkan penilaian bulan ini"
            items={[
              { name: 'Dewi Anggraini', meta: 'Operasional', value: '4.9' },
              { name: 'Bagus Prasetyo', meta: 'Keuangan', value: '4.8' },
              { name: 'Rina Kusuma', meta: 'Dukungan', value: '4.7' },
            ]}
          />
        </Petak>

        <Petak nama="CardBarChart" jalur="cardbar-chart/">
          <CardBarChart
            title="Transaksi Harian"
            subtitle="Tujuh hari terakhir"
            data={DATA_BATANG}
            unit="transaksi"
          />
        </Petak>

        <Petak nama="CardBarList" jalur="cardbar-list/">
          <CardBarList
            title="Kategori Produk"
            items={[
              { label: 'Langganan', value: 48 },
              { label: 'Add-on', value: 26 },
              { label: 'Layanan', value: 17 },
              { label: 'Lainnya', value: 9 },
            ]}
          />
        </Petak>
      </Seksi>

      {/* ------------------------------------------------------------------ */}
      <Seksi id="overlay" judul="Overlay" jumlah={3}>
        <Petak nama="Modal" jalur="modal/">
          <div className="element-baris">
            <Button onClick={() => setModalBuka(true)}>Buka Modal</Button>
          </div>
          <Modal
            open={modalBuka}
            onClose={() => setModalBuka(false)}
            title="Hapus Item"
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalBuka(false)}>
                  Batal
                </Button>
                <Button onClick={() => setModalBuka(false)}>
                  Hapus
                </Button>
              </>
            }
          >
            <p style={{ margin: 0 }}>
              Item <strong>Paket Langganan Pro</strong> akan dihapus permanen. Tindakan ini
              tidak bisa dibatalkan.
            </p>
          </Modal>
        </Petak>

        <Petak nama="ProsesModal" jalur="proses-modal/">
          <div className="element-baris">
            <Button
              icon={Download}
              onClick={() =>
                setTugas({
                  aksi: 'unduh',
                  judul: 'Laporan Transaksi',
                  tahap: 'selesai',
                  progress: 100,
                })
              }
            >
              Tampilkan Proses
            </Button>
          </div>
          <ProsesModal
            tugas={tugas}
            onClose={() => setTugas(null)}
            formatUnduh={[
              { label: 'Excel', format: 'xlsx' },
              { label: 'PDF', format: 'pdf' },
            ]}
            onUnduh={() => setTugas(null)}
            pesanSelesai="Laporan siap diunduh."
          />
        </Petak>

        <Petak nama="LightboxGambar" jalur="lightbox/">
          <div className="element-baris">
            <button
              type="button"
              onClick={() => setLightbox(0)}
              style={{ border: 0, padding: 0, background: 'none', cursor: 'zoom-in' }}
            >
              <img src={GAMBAR_CONTOH} alt="Contoh" style={{ width: 180, borderRadius: 6 }} />
            </button>
          </div>
          <LightboxGambar
            gambar={[GAMBAR_CONTOH]}
            indeks={lightbox}
            onTutup={() => setLightbox(-1)}
            alt="Gambar contoh"
          />
        </Petak>
      </Seksi>

      {/* ------------------------------------------------------------------ */}
      <Seksi id="publik" judul="Publik & Cetak" jumlah={11}>
        <Petak nama="WelcomeCardV2" jalur="welcome-card-v2/">
          <WelcomeCardV2
            name="Administrator"
            badge="DealTech UI"
            aksiLabel="Ke Dashboard"
            aksiKe="/dashboard"
          />
        </Petak>

        <Petak nama="KartuKatalog" jalur="kartu-katalog/">
          <KartuKatalog
            ke="/dashboard"
            nama="Paket Langganan Pro"
            gambar={GAMBAR_CONTOH}
            kategori="Langganan"
            durasi="12 bulan"
            lokasi="Semua wilayah"
            harga={450000}
            hargaAwalan="Mulai"
          />
        </Petak>

        <Petak nama="KepalaPublik" jalur="kepala-publik/">
          <KepalaPublik
            remah="Katalog"
            judul="Semua Produk Kami"
            deskripsi="Telusuri seluruh paket dan layanan yang tersedia."
          />
        </Petak>

        <Petak nama="BlokTentang" jalur="blok-tentang/">
          <BlokTentang
            judul="Tentang Kami"
            ikon={Building2}
            isi={<p>Tim lokal yang membangun perangkat lunak untuk usaha di Indonesia.</p>}
            angka={[
              { nilai: '12+', label: 'Tahun' },
              { nilai: '8.400', label: 'Klien' },
            ]}
          />
        </Petak>

        <Petak nama="PitaBerjalan" jalur="pita-berjalan/">
          <PitaBerjalan
            atas={['Dashboard', 'Laporan', 'Inventori', 'Penggajian']}
            bawah={['Retail', 'Manufaktur', 'Jasa', 'Distribusi']}
          />
        </Petak>

        <Petak nama="UlasanBerjalan" jalur="ulasan-berjalan/">
          <UlasanBerjalan />
        </Petak>

        <Petak nama="LogoShape" jalur="logo-shape/">
          <div className="element-gelap">
            <LogoShape revealOnScroll={false} />
          </div>
        </Petak>

        <Petak nama="HexBackdrop" jalur="hex-backdrop/">
          <div className="element-gelap">
            <HexBackdrop />
          </div>
          <p className="element-catatan">Hiasan latar; dipakai di halaman masuk dan hero.</p>
        </Petak>

        <Petak nama="IsiKaya" jalur="richtext/IsiKaya">
          <IsiKaya html={isiKaya} />
          <p className="element-catatan">
            Penampil HTML dari RichText di atas — isinya disaring sebelum dirender.
          </p>
        </Petak>

        <Petak nama="LabelQR" jalur="label-qr/">
          <LabelQR
            kode="ITM-2026-004"
            judul="Paket Langganan Pro"
            rincian={['12 Sep 2026', 'Gudang A']}
          />
        </Petak>

        <Petak nama="LembarCetak / TombolCetak" jalur="lembar-cetak/">
          <div className="element-baris">
            <TombolCetak jumlah={3} />
          </div>
          <LembarCetak
            judul="Label Inventori"
            subjudul="12 September 2026"
            label={[
              { kode: 'ITM-2026-001', judul: 'Paket Langganan Dasar', rincian: ['Gudang A'] },
              { kode: 'ITM-2026-002', judul: 'Paket Langganan Pro', rincian: ['Gudang A'] },
              { kode: 'ITM-2026-003', judul: 'Tambahan Penyimpanan', rincian: ['Gudang B'] },
            ]}
          />
          <p className="element-catatan">Lembarnya hanya muncul di hasil cetak.</p>
        </Petak>
      </Seksi>

      {/* ------------------------------------------------------------------ */}
      <section className="element-seksi" id="infrastruktur">
        <div className="element-seksi__kepala">
          <h2 className="element-seksi__judul">
            Tanpa Tampilan
            <span className="element-seksi__jumlah">2 elemen</span>
          </h2>
        </div>
        <BadgeInfo variant="info">
          <strong>ProtectedRoute</strong> (protected-route/) adalah gerbang rute yang mengalihkan
          ke halaman masuk, dan <strong>ModalGalat</strong> (modal-galat/) sudah terpasang sekali
          di <code>src/main.tsx</code> untuk menangkap gangguan sistem dari seluruh halaman.
        </BadgeInfo>
      </section>
    </div>
  );
}
