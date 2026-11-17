# Aturan Project untuk AI dan Pengembang

Berkas ini dibaca otomatis oleh asisten AI (Claude Code lewat `CLAUDE.md`, Codex,
Cursor, Gemini CLI, dan sejenisnya). Ikuti aturan di bawah setiap kali menambah
atau mengubah halaman di project ini.

## Warna tema

Admin bisa mengganti warna utama di **Pengaturan → Atur System**, jadi warna
merek tidak boleh ditulis langsung sebagai hex.

1. Pakai variabel: `var(--color-primary)`, `var(--color-primary-dark)`,
   `var(--color-primary-darker)`, `var(--color-accent)`, atau turunan
   `--app-primary-*`. Jangan menulis `#01498b` dan kawan-kawannya di CSS
   maupun komponen.
2. Butuh versi lebih muda atau transparan? Turunkan dari variabel, misalnya
   `color-mix(in srgb, var(--color-primary) 12%, #ffffff)`.
3. Warna untuk grafik di JavaScript diambil lewat `chartColors()` atau
   `seriesColors()` dari `@/lib/chart`, karena keduanya membaca warna tema yang
   sedang aktif.

## Kartu tanpa bayangan

1. **Kartu, seksi, tabel, chart, dan isian form rata dengan halaman: cukup border
   `1px solid var(--app-card-border)`, tanpa bayangan.** Token
   `--app-shadow-card` dan `--app-control-ring` bernilai `none` di `theme.css`.
   Jangan menulis `box-shadow` baru untuk kartu atau isian; tulis
   `box-shadow: var(--app-shadow-card)` supaya bisa diubah dari satu tempat.
2. **Bayangan hanya untuk yang melayang di atas halaman:** modal, panel dropdown
   (`select`, `menu-aksi`, `badgev2`), tooltip chart, dan kenop `toggleonoff`.
3. Fokus isian tetap memakai `--app-control-ring-focus`; galat cukup
   `border-color: var(--app-danger-text)`.

## Kepala seksi dan bar abu

Header tabel, toolbar tabel, bar aksi massal, kepala `Seksi`, dan kepala `Modal`
memakai bahasa yang sama: **bar abu `var(--app-fill-strong)` bersudut kecil, tanpa
garis bawah**.

1. **Kartu berjudul pakai `Seksi`** (`@/components/ui/seksi/Seksi`), bukan
   `app-section-card` dengan `<h2>` buatan sendiri. Kepalanya judul saja, tanpa
   ikon dan deskripsi; catatan penting taruh di badan sebagai `BadgeInfo`.
   Tombol atau menu di kanan kepala lewat prop `action`.
2. **Label untuk kontrol tanpa label sendiri** (`Select`, grup tombol) pakai
   `Bidang`, bukan `<span style={{ fontSize: ... }}>`.
3. Jangan menambah `border-bottom` pada kepala kartu atau modal; pemisahnya
   sudah bar abu itu.
4. **Saring laporan pakai `<Seksi saring>`** berisi `<div className="app-saring">`:
   tanggal, select, dan cari duduk langsung di bar abu tanpa judul kolom. Label
   tetap ditulis (`label=` di DateInput/Bidang) karena hanya disembunyikan dari
   layar, bukan dari pembaca layar. Toggle yang labelnya bagian dari kontrol tetap
   berlabel.
5. **Tab memakai `TabButton gaya="pil"`.** Pakai `short` untuk label di layar
   sempit, `count` untuk jumlah, dan `className="tab-button--rata"` untuk tab
   selebar wadah. Gaya `garis` bawaan hanya untuk kebutuhan khusus. Contoh semua
   varian ada di katalog element, grup TabButton.

```tsx
import { Seksi } from '@/components/ui/seksi/Seksi';
import { Bidang } from '@/components/ui/bidang/Bidang';

<Seksi title="Informasi Produk" action={<MenuAksi item={aksi} />}>
  <Bidang label="Kategori" wajib>
    <Select value={kategori} onValueChange={setKategori} options={OPSI} />
  </Bidang>
</Seksi>
```

## Form dua kolom

Di desktop, isian form tidak boleh semuanya lebar penuh berderet satu per satu.
Bungkus isian pendek dengan `<div className="app-form-kisi">` supaya terbagi dua
kolom (layar ≥ 768px; di bawahnya otomatis satu kolom). Isian panjang seperti URL,
alamat lengkap, `RichText`, `InputLongText`, unggah gambar, `BadgeInfo`, dan baris
tombol tetap lebar penuh di luar kisi, atau beri kelas `app-form-kisi__penuh`.
Form di kartu yang sudah sempit (setengah layar) atau di modal kecil boleh satu
kolom.

```tsx
<div className="app-form-kisi">
  <InputText label="Kode Produk" ... />
  <InputText label="Nama Produk" ... />
  <InputNumber label="Harga" ... />
  <InputNumber label="Stok" ... />
</div>
<RichText label="Deskripsi" ... />
```

## Jarak antar section

Jarak antar section, kartu, dan blok halaman 12px (9px di layar < 640px). Pakai
`space-y-6` / `gap-6` (sudah ditimpa di `theme.css`) atau `var(--app-jarak-seksi)`
di CSS sendiri. Jangan menulis 16px, 20px, atau 24px untuk jarak antar section.

## Tombol aksi async

1. Tombol simpan, kirim, unggah, unduh, dan hapus memakai `TombolTuang` + hook
   `useAksiTuang` (`@/components/ui/tombol-tuang/`), bukan `Button` dengan
   loading. Tanpa popup "berhasil"; centang animasi sudah jadi umpan baliknya.
2. Refresh memakai `TombolMuatUlang`; handler-nya wajib menyalakan state loading
   supaya halaman tampil skeleton.
3. Cari, navigasi, dan cetak tetap `Button`.

## Keterangan dan catatan (`BadgeInfo`)

1. **Keterangan, catatan, atau info tambahan wajib memakai
   `<BadgeInfo variant="info" icon={false}>`.** Jangan membuat paragraf
   ber-style sendiri seperti `<p className="...-catatan">` dengan latar, padding,
   atau ukuran huruf baru.
2. **Ukuran dan tebal teks BadgeInfo tanpa ikon selalu sama** (12px, tebal
   500, dari `badgeinfo.css`). Jangan menimpanya lewat `className`, `style`,
   atau kelas Tailwind seperti `text-xs` / `font-bold`. `className` hanya boleh
   dipakai untuk jarak dan penempatan, misalnya `margin`.
3. **Isinya teks polos.** Jangan membungkus sebagian isi dengan `<strong>`,
   `<b>`, `<small>`, atau elemen lain untuk mengubah ukuran dan tebal; elemen di
   dalam BadgeInfo tanpa ikon dipaksa mengikuti ukuran induknya.
4. Varian mengikuti makna: `info` untuk keterangan, `warning` untuk
   peringatan, `success` untuk berhasil, `error` untuk gagal.

### Benar

```tsx
import { BadgeInfo } from '@/components/ui/badgeinfo/BadgeInfo';

<BadgeInfo variant="info" icon={false}>
  Bukti tidak dapat diganti setelah dikirim.
</BadgeInfo>
```

### Salah

```tsx
// Gaya catatan buatan sendiri
<p className="pengaturan-catatan">Bukti tidak dapat diganti setelah dikirim.</p>

// Ukuran dan tebal ditimpa
<BadgeInfo variant="info" icon={false} className="text-[11px] font-bold">
  Bukti tidak dapat diganti setelah dikirim.
</BadgeInfo>

// Sebagian isi ditebalkan
<BadgeInfo variant="info" icon={false}>
  Bukti <strong>tidak dapat</strong> diganti setelah dikirim.
</BadgeInfo>
```

## Tabel data (`TableListV1`)

1. **Satu sel, satu data.** Jangan menumpuk dua data dalam satu sel, misalnya
   nama user dengan nomor HP atau email di bawahnya. Data kedua dijadikan
   kolom sendiri.
2. **Isi sel selalu satu baris.** Sel tidak boleh membungkus ke baris kedua,
   jadi semua baris setinggi sama. Isi yang lebih panjang dari kolomnya otomatis
   dipotong elipsis, dan teks lengkapnya muncul sebagai tooltip. Jangan memaksa
   sel memanjang dengan `<br>`, `white-space: normal`, atau elemen blok yang
   bertumpuk.
3. **Aksi baris lewat dropdown.** Pakai `AksiBaris` dari
   `@/components/ui/tablelist-v1/TableListV1` di kolom terakhir. Jangan
   menderetkan beberapa `ActionButton` dalam satu sel.
4. **Kolom aksi selebar `64px`, rata kanan.** Pemicunya ikon titik tiga tanpa
   teks; sisa lebar diberikan ke kolom data.
5. **Toolbar masuk lewat prop `toolbar`, tombol tabel (Tambah, Refresh) lewat
   `action`, aksi massal lewat `aksiMassal`.** Cari/saring dan tombol duduk di satu
   bar abu: cari di kiri, tombol di kanan. Saat ada baris terpilih, bar massal
   menggantikan bar itu dengan tinggi yang sama, jadi tabel tidak bergeser. Jangan
   menaruh toolbar atau tombol tabel di luar `TableListV1`.
6. **Hapus massal pakai `HapusMassal`** (`@/components/ui/hapus-massal/`), yang
   meminta pengguna mengetik `HAPUS`. Hapus satuan pakai `KonfirmasiModal`;
   isi `kataKunci` bila datanya penting.
7. Jangan menimpa padding sel, tinggi header (38px), atau sudut header di halaman.
   Semua jarak tabel diatur di `tablelist-v1.css`.
8. **Klik baris membuka Lihat Detail** lewat prop `onKlikBaris`. Bila datanya tidak
   punya halaman atau modal detail, klik baris membuka Ubah. Aksi yang dipicu klik
   baris tetap ada di `AksiBaris`, dan menu jangan berisi Lihat Detail yang tidak
   melakukan apa-apa.

### Benar

```tsx
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { AksiBaris, TableListV1 } from '@/components/ui/tablelist-v1/TableListV1';

const KOLOM = [
  { key: 'kode', label: 'Kode User', width: '140px' },
  { key: 'nama', label: 'Nama' },
  { key: 'hp', label: 'No HP', width: '170px' },
  { key: 'email', label: 'Email' },
  { key: 'aksi', label: 'Aksi', align: 'right' as const, width: '64px' },
];

const baris = member.map((m) => ({
  kode: m.kode,
  nama: m.nama,
  hp: m.hp,
  email: m.email,
  aksi: (
    <AksiBaris
      nama={m.nama}
      item={[
        { kunci: 'lihat', label: 'Lihat Detail', ikon: Eye, onClick: () => lihat(m) },
        { kunci: 'ubah', label: 'Ubah', ikon: Pencil, onClick: () => ubah(m) },
        { kunci: 'hapus', label: 'Hapus', ikon: Trash2, bahaya: true, onClick: () => hapus(m) },
      ]}
    />
  ),
}));
```

### Salah

```tsx
// Dua data ditumpuk dalam satu sel
nama: (
  <div>
    <p>{m.nama}</p>
    <p>{m.hp}</p>
  </div>
),

// Deretan tombol aksi dalam satu sel
aksi: (
  <div className="tablelist-v1__aksi">
    <ActionButton icon={Eye} />
    <ActionButton icon={Pencil} />
    <ActionButton icon={Trash2} variant="danger" />
  </div>
),
```

`TabelCardV1` adalah daftar kartu, bukan tabel. Judul dengan subjudul di
bawahnya memang bagian dari desain kartu itu, jadi aturan di atas tidak berlaku
untuknya.

## Loading data (`Skeleton`)

Halaman yang menunggu data menampilkan skeleton yang meniru susunan halaman itu
sendiri. Jangan memakai spinner, teks "Memuat…", atau balok abu-abu acak di dalam
halaman admin.

1. **Bentuknya sama dengan tampilan jadinya.** Skeleton memakai wadah dan class
   yang sama dengan halaman aslinya (`app-section-card`, kisi, form), jadi saat
   data datang tidak ada yang bergeser.
2. **Teks statis tetap asli.** Judul halaman, label, hint, nama tab, dan judul
   kartu tidak menunggu data, jadi ditulis apa adanya. Yang diganti skeleton
   hanya bagian yang berasal dari data.
3. **Isian form pakai prop `memuat`.** `InputText`, `InputNumber`, `InputLongText`, `Select`, dan
   `RichText` menerima `memuat`: label dan hint tetap, kotaknya jadi skeleton.
4. **Tabel pakai `memuat` di `TableListV1`.** Header, toolbar, dan paginasi tetap;
   barisnya jadi skeleton. Bentuk sel diatur lewat `skeleton` di definisi kolom:
   `'ikon'` untuk kolom aksi, `'pil'` untuk kolom status ber-`Badge`, selebihnya
   teks. `ChartLine`, `ChartListBar`, dan `ChartTopList` juga menerima `memuat` (jumlah baris lewat
   `barisMemuat`); jangan membungkus chart dengan satu kotak `SkeletonBila`.
5. **Kontrol yang bergantung data dibungkus `SkeletonBila`.** Tombol simpan,
   menu aksi, dan badge status dirender tak terlihat di dalam skeleton, jadi
   ukurannya persis sama. Tombol yang tetap berfungsi tanpa data, seperti
   Kembali atau Batal, tetap tombol asli.
6. **Nilai teks pakai `<Skeleton />` di dalam elemen teks aslinya**, supaya tinggi
   barisnya ikut ukuran huruf aslinya.
7. **Halaman detail punya komponen skeleton sendiri** di folder halamannya,
   misalnya `ProdukDetailSkeleton.tsx`, dibungkus `SkeletonHalaman` supaya
   pembaca layar mendengar status memuat.
8. `Memuat` hanya untuk layar penuh di luar layout, misalnya saat memeriksa sesi.
9. **Kisi kartu saat memuat selalu penuh satu baris.** Jumlah kartu skeleton minimal
   4, dibulatkan ke atas ke kelipatan jumlah kolom kisi yang sedang tampil (4 kolom →
   4, 3 kolom → 6, 2 kolom → 4, 1 kolom → 4). Baca jumlah kolom dari
   `getComputedStyle(kisi).gridTemplateColumns` dan ukur ulang lewat
   `ResizeObserver`, jangan menebak dari lebar layar.

### Benar

```tsx
import { Skeleton, SkeletonBila } from '@/components/ui/skeleton/Skeleton';

<PageTitle title="Ubah Produk" subtitle={memuat ? <Skeleton lebar={140} /> : produk.nama} />

<InputText label="Nama Produk" value={isian.nama} memuat={memuat} required />

<SkeletonBila memuat={memuat}>
  <TombolTuang type="submit" ikon="simpan" status={status}>
    Simpan Perubahan
  </TombolTuang>
</SkeletonBila>

<Keterangan nama="Harga">
  <p className="produk-detail__isi">{memuat ? <Skeleton lebar="60%" /> : rupiah(produk.harga)}</p>
</Keterangan>
```

### Salah

```tsx
// Spinner atau teks di tengah halaman
if (memuat) return <Memuat teks="Memuat produk…" />;

// Balok acak yang tidak mengikuti susunan halaman
if (memuat) return <div className="h-64 animate-pulse rounded bg-gray-200" />;

// Label ikut dijadikan skeleton padahal teksnya sudah diketahui
<Skeleton lebar={80} />
<Skeleton bentuk="kotak" lebar="100%" tinggi={34} />
```
