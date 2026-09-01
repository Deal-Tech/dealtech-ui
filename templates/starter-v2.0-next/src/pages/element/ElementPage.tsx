import { useState, type ReactNode } from 'react';
import {
  Anchor,
  Check,
  CircleAlert,
  Compass,
  Download,
  Eye,
  MapPin,
  Package,
  Pencil,
  Plus,
  Ship,
  Sparkles,
  Trash2,
  Users,
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

const OPSI_FASILITAS = [
  { value: 'snorkel', label: 'Snorkeling', warna: '#066aca' },
  { value: 'makan', label: 'Makan Siang', warna: '#16a34a' },
  { value: 'foto', label: 'Foto Bawah Air', warna: '#d29922' },
  { value: 'jemput', label: 'Antar Jemput', warna: '#9333ea' },
];

const DATA_GARIS = [
  { bulan: 'Jan', kunjungan: 320, pesanan: 180 },
  { bulan: 'Feb', kunjungan: 410, pesanan: 220 },
  { bulan: 'Mar', kunjungan: 380, pesanan: 205 },
  { bulan: 'Apr', kunjungan: 520, pesanan: 290 },
  { bulan: 'Mei', kunjungan: 610, pesanan: 340 },
  { bulan: 'Jun', kunjungan: 580, pesanan: 325 },
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
  { key: 'kode', label: 'Kode', width: '120px' },
  { key: 'nama', label: 'Nama Paket' },
  { key: 'kuota', label: 'Kuota', align: 'right' as const },
  { key: 'status', label: 'Status', align: 'center' as const },
];

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
  const [teks, setTeks] = useState('Snorkeling 3 Gili');
  const [angka, setAngka] = useState('450000');
  const [panjang, setPanjang] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [status, setStatus] = useState('aktif');
  const [pencarian, setPencarian] = useState('');
  const [cariTabel, setCariTabel] = useState('');
  const [perHalaman, setPerHalaman] = useState(10);
  const [setuju, setSetuju] = useState(true);
  const [aktif, setAktif] = useState(true);
  const [fasilitas, setFasilitas] = useState<string[]>(['snorkel', 'makan']);
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

  const barisTabel = [
    {
      kode: 'SNOR3GIL',
      nama: 'Snorkeling 3 Gili',
      kuota: '12',
      status: (
        <Badge icon={Check} variant="green">
          Aktif
        </Badge>
      ),
    },
    {
      kode: 'SUNSETGT',
      nama: 'Sunset Cruise Trawangan',
      kuota: '20',
      status: (
        <Badge icon={Ship} variant="blue">
          Baru
        </Badge>
      ),
    },
    {
      kode: 'FISHTRIP',
      nama: 'Fishing Trip Lombok',
      kuota: '8',
      status: (
        <Badge icon={CircleAlert} variant="amber">
          Tinjau
        </Badge>
      ),
    },
  ];

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
          <BadgeInfo variant="info">Jadwal keberangkatan berubah menjadi 08.30 WITA.</BadgeInfo>
          <BadgeInfo variant="success">Paket tour berhasil disimpan.</BadgeInfo>
          <BadgeInfo variant="warning">Kuota tersisa tinggal 2 kursi.</BadgeInfo>
          <BadgeInfo variant="error">Koneksi ke server terputus.</BadgeInfo>

          <p className="element-catatan">Tanpa ikon — <code>icon={'{false}'}</code>.</p>
          <BadgeInfo variant="info" icon={false}>
            Jadwal keberangkatan berubah menjadi 08.30 WITA.
          </BadgeInfo>
          <BadgeInfo variant="success" icon={false}>
            Paket tour berhasil disimpan.
          </BadgeInfo>
          <BadgeInfo variant="warning" icon={false}>
            Kuota tersisa tinggal 2 kursi.
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
            <Badge icon={Ship} variant="blue">
              Berlayar
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
            label="Kode Paket"
            kode="SNOR3GIL-004"
            tetap={false}
            keterangan="Masih perkiraan — kode final dibuat saat data disimpan."
          />
        </Petak>
      </Seksi>

      {/* ------------------------------------------------------------------ */}
      <Seksi id="form" judul="Form" jumlah={12}>
        <Petak nama="InputText / InputNumber" jalur="inputtext/, inputnumber/">
          <InputText
            label="Nama Paket"
            value={teks}
            onChange={(e) => setTeks(e.target.value)}
            hint="Nama yang tampil di halaman pemesanan."
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
            label="Tanggal Berangkat"
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
            placeholder="Cari paket, kode, atau pemandu…"
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
            opsi={OPSI_FASILITAS}
            terpilih={fasilitas}
            onToggle={(v) =>
              setFasilitas((prev) =>
                prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
              )
            }
            onPilihSemua={() => setFasilitas(OPSI_FASILITAS.map((o) => o.value))}
            onKosongkan={() => setFasilitas([])}
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
            <StatCard icon={Compass} title="Tour" value="24 tour" helper="3 nonaktif" />
            <StatCard icon={MapPin} title="SpotView" value="18 spot" />
            <StatCard icon={Package} title="Paket" value="12 paket" />
            <StatCard icon={Users} title="Pengguna" value="7 akun" helper="1 nonaktif" />
          </div>
        </Petak>

        <Petak nama="PageTitle" jalur="pagetitle/">
          <PageTitle
            title="Daftar Tour"
            subtitle="Semua tour yang tampil di halaman publik."
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
            toolbar={
              <TableToolbar
                cari={cariTabel}
                onCari={setCariTabel}
                perHalaman={perHalaman}
                onPerHalaman={setPerHalaman}
                placeholderCari="Cari paket…"
              />
            }
            paginasi={{
              halaman: 1,
              totalHalaman: 4,
              info: 'Menampilkan 1–3 dari 12 data',
              onNavigasi: () => {},
            }}
          />
        </Petak>

        <Petak nama="TabelCardV1" jalur="tabelcardv1/">
          <TabelCardV1
            title="Pemandu Aktif"
            subtitle="Tiga pemandu dengan jadwal terpadat"
            count={3}
            items={[
              {
                title: 'Wayan Sudiarta',
                subtitle: 'Gili Trawangan',
                initials: 'WS',
                meta: '12 trip',
                badge: { label: 'Aktif', icon: Check, variant: 'green' },
              },
              {
                title: 'Komang Ari',
                subtitle: 'Gili Air',
                initials: 'KA',
                meta: '9 trip',
                badge: { label: 'Aktif', icon: Check, variant: 'green' },
              },
              {
                title: 'Putu Rahayu',
                subtitle: 'Gili Meno',
                initials: 'PR',
                meta: '4 trip',
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
            title="Kepadatan Trip"
            subtitle="Jumlah keberangkatan per hari"
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
            title="Kunjungan & Pesanan"
            subtitle="Enam bulan terakhir"
            data={DATA_GARIS}
            xKey="bulan"
            series={[
              { key: 'kunjungan', label: 'Kunjungan' },
              { key: 'pesanan', label: 'Pesanan' },
            ]}
          />
        </Petak>

        <Petak nama="ChartLineV2" jalur="chartlinev2/">
          <ChartLineV2
            title="Tren Pesanan"
            subtitle="Dengan tabel rincian"
            data={DATA_GARIS}
            xKey="bulan"
            series={[{ key: 'pesanan', label: 'Pesanan' }]}
            showTable
          />
        </Petak>

        <Petak nama="ChartBarVer" jalur="chartbarver/">
          <ChartBarVer title="Trip per Hari" subtitle="Minggu ini" data={DATA_BATANG} />
        </Petak>

        <Petak nama="ChartBarHor" jalur="chartbarhor/">
          <ChartBarHor
            title="Paket Terlaris"
            data={[
              { label: 'Snorkeling 3 Gili', value: 128 },
              { label: 'Sunset Cruise', value: 94 },
              { label: 'Fishing Trip', value: 61 },
              { label: 'Private Boat', value: 38 },
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
            title="Asal Pemesan"
            data={[
              { name: 'Domestik', value: 420 },
              { name: 'Eropa', value: 310 },
              { name: 'Asia', value: 190 },
              { name: 'Lainnya', value: 80 },
            ]}
            showSummary
            showLegend
          />
        </Petak>

        <Petak nama="ChartListBar" jalur="chartlistbar/">
          <ChartListBar
            title="Kanal Pemesanan"
            items={[
              { label: 'Website', value: 62, valueLabel: '62%', meta: '740 pesanan' },
              { label: 'WhatsApp', value: 24, valueLabel: '24%', meta: '286 pesanan' },
              { label: 'Agen', value: 14, valueLabel: '14%', meta: '167 pesanan' },
            ]}
          />
        </Petak>

        <Petak nama="ChartTopList" jalur="charttoplist/">
          <ChartTopList
            title="Pemandu Terbaik"
            subtitle="Berdasarkan ulasan bulan ini"
            items={[
              { name: 'Wayan Sudiarta', meta: 'Gili Trawangan', value: '4.9' },
              { name: 'Komang Ari', meta: 'Gili Air', value: '4.8' },
              { name: 'Putu Rahayu', meta: 'Gili Meno', value: '4.7' },
            ]}
          />
        </Petak>

        <Petak nama="CardBarChart" jalur="cardbar-chart/">
          <CardBarChart
            title="Keberangkatan"
            subtitle="Tujuh hari terakhir"
            data={DATA_BATANG}
            unit="trip"
          />
        </Petak>

        <Petak nama="CardBarList" jalur="cardbar-list/">
          <CardBarList
            title="Kategori Tour"
            items={[
              { label: 'Snorkeling', value: 48 },
              { label: 'Sunset', value: 26 },
              { label: 'Fishing', value: 17 },
              { label: 'Private', value: 9 },
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
            title="Hapus Paket Tour"
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
              Paket <strong>Snorkeling 3 Gili</strong> akan dihapus permanen. Tindakan ini tidak
              bisa dibatalkan.
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
                  judul: 'Laporan Pesanan',
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
            aksiIkon={Compass}
          />
        </Petak>

        <Petak nama="KartuKatalog" jalur="kartu-katalog/">
          <KartuKatalog
            ke="/dashboard"
            nama="Snorkeling 3 Gili"
            gambar={GAMBAR_CONTOH}
            kategori="Snorkeling"
            durasi="6 jam"
            lokasi="Gili Trawangan"
            harga={450000}
            hargaAwalan="From"
          />
        </Petak>

        <Petak nama="KepalaPublik" jalur="kepala-publik/">
          <KepalaPublik
            remah="Tours"
            judul="Semua Trip Kami"
            deskripsi="Pilih trip harian yang berangkat dari tiga pulau."
          />
        </Petak>

        <Petak nama="BlokTentang" jalur="blok-tentang/">
          <BlokTentang
            judul="Tentang Kami"
            ikon={Anchor}
            isi={<p>Operator lokal yang berangkat setiap hari dari Gili Trawangan.</p>}
            angka={[
              { nilai: '12+', label: 'Tahun' },
              { nilai: '8.400', label: 'Tamu' },
            ]}
          />
        </Petak>

        <Petak nama="PitaBerjalan" jalur="pita-berjalan/">
          <PitaBerjalan
            atas={['Snorkeling', 'Sunset Cruise', 'Fishing Trip', 'Private Boat']}
            bawah={['Gili Trawangan', 'Gili Meno', 'Gili Air', 'Lombok']}
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
            kode="SNOR3GIL-004"
            judul="Snorkeling 3 Gili"
            rincian={['12 Sep 2026', '08.30 WITA']}
          />
        </Petak>

        <Petak nama="LembarCetak / TombolCetak" jalur="lembar-cetak/">
          <div className="element-baris">
            <TombolCetak jumlah={3} />
          </div>
          <LembarCetak
            judul="Label Keberangkatan"
            subjudul="12 September 2026"
            label={[
              { kode: 'SNOR3GIL-001', judul: 'Snorkeling 3 Gili', rincian: ['08.30 WITA'] },
              { kode: 'SNOR3GIL-002', judul: 'Snorkeling 3 Gili', rincian: ['08.30 WITA'] },
              { kode: 'SUNSETGT-001', judul: 'Sunset Cruise', rincian: ['16.00 WITA'] },
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
