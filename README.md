# dealtech-ui

`dealtech-ui` adalah CLI untuk generate `UI Panel Starter` dan menambahkan UI element atau layout secara terpisah ke project React Anda.

## Tiga starter, tiga perintah

Nama perintah menentukan starter mana yang dipakai:

| Perintah | Starter | Gaya | Jumlah element |
| --- | --- | --- | --- |
| `dealtech-ui` | `templates/starter` | v1 — Tailwind inline | 29 |
| `dealtech-ui-v2-next` | `templates/starter-v2.0-next` | v2.0-next — token CSS + CSS per komponen | 58 |
| `dealtech-ui-v3` | `templates/starter-v3.0` | v3.0 — element sama dengan v2, shell & tema baru | 58 |

```bash
npx dealtech-ui install my-admin-app             # starter v1
npx dealtech-ui-v2-next install my-admin-app     # starter v2.0-next
npx dealtech-ui-v3 install my-admin-app          # starter v3.0
```

Bendera `--v1` / `--v2` / `--v3` menimpa pilihan berdasarkan nama perintah —
berguna saat menguji lokal lewat `npm link`, dan berlaku untuk semua sub-perintah:

```bash
npx dealtech-ui install my-admin-app --v3
npx dealtech-ui add tablelist-v1 --v3
```

Semua sub-perintah (`add`, `add-layout`, `add-page`) mengikuti varian yang sama,
jadi `add button` mengambil Button v1, v2, atau v3 sesuai perintah yang dipakai.

## Bedanya di mana

**v1 vs v2/v3 — set element-nya memang beda, bukan versi yang sama dinaikkan.**
Nama folder, API prop, dan cara styling-nya tidak saling kompatibel:

| | v1 | v2.0-next & v3.0 |
| --- | --- | --- |
| Styling | class Tailwind inline di dalam TSX | token CSS di `src/styles/theme.css` + satu berkas CSS per komponen |
| Penamaan folder | rapat, campur Inggris (`actionbutton`, `searchinput`, `progresbarv1`) | ber-tanda hubung, sebagian Indonesia (`action-button`, `search-input`, `progress-bar`) |
| Impor antar komponen | jalur relatif (`../button/Button`) | alias (`@/components/ui/button/Button`) |
| Chart | tidak ada | 10 element berbasis `recharts` |
| Font | dari CDN | di-bundel di `src/styles/fonts` |

Karena itu nama element v1 tidak dikenali di v2/v3 dan sebaliknya. `add tabledata-v2`
hanya ada di v1; padanannya di v2/v3 bernama `tablelist-v1`. CLI menolak nama yang
tidak ada di varian aktif dan menampilkan daftar yang tersedia, jadi tidak ada
penyalinan setengah jadi.

**v2.0-next vs v3.0 — element-nya identik, yang berbeda hanya kulit aplikasinya.**
Ke-58 folder di `src/components/ui/` sama persis di kedua starter (satu-satunya
selisih: teks badge bawaan `WelcomeCardV2`). Dependensi npm-nya juga sama persis.
Yang berbeda hanya berkas shell:

- `src/pages/auth/` — v3 punya halaman login baru (`LoginArt.tsx`, `GoogleMark.tsx`) menggantikan `LoginBg.tsx` milik v2
- `src/pages/dash/DashboardPage.tsx` dan `src/pages/element/ElementPage.tsx`
- `src/components/layout/AdminHeader.tsx` — header bergaya dokumen
- `src/styles/admin.css` dan `src/styles/theme.css` — sidebar biru, palet token disetel ulang
- `src/lib/chart.ts`, `src/assets/hexmark-icon.svg`, `index.html`

Praktisnya: pilih **v3.0** untuk project baru. Pilih **v2.0-next** kalau sudah
terlanjur memakai tampilannya. Komponen yang Anda `add` dari salah satunya bisa
dipakai di keduanya tanpa penyesuaian.

## Perintah

- `install` untuk starter admin panel lengkap
- `add` untuk copy UI element siap pakai
- `add-layout` untuk copy layout beserta style CSS pendukungnya
- `add-page` untuk membuat halaman baru sekaligus mendaftarkan rutenya

## Usage

### Install starter app

```bash
npx dealtech-ui-v3 install my-admin-app
```

Command ini akan:
1. Membuat folder project baru
2. Menyalin starter template DealTech UI
3. Menjalankan `npm install` otomatis

Lalu jalankan:

```bash
cd my-admin-app
npm run dev
```

### Add UI element

```bash
npx dealtech-ui-v3 add button badge modal
```

Command ini akan menyalin file ke `src/components/ui/...` dan otomatis membawa dependency lokal yang dibutuhkan.

Contoh:

```bash
npx dealtech-ui-v3 add tablelist-v1
```

`tablelist-v1` akan ikut membawa `button`, `checkbox`, dan `pagination` bila belum ada.
Folder yang sudah ada dilewati, kecuali dijalankan dengan `--force`.

### Add layout

```bash
npx dealtech-ui-v3 add-layout admin-layout
```

Pada v1 command ini menyalin:
- `src/layout/AdminLayout.tsx`
- `src/components/layout/AdminHeader.tsx`
- `src/components/layout/AdminSidebar.tsx`
- `src/styles/admin.css`

Pada v2 dan v3 ikut tersalin berkas pendukung tema dan menu — tanpa ini layoutnya
kehilangan seluruh token warna dan huruf:
- `src/layout/menu.ts`, `ikon-menu.ts`, `jam-zona.ts`, `judul-halaman.ts`
- `src/styles/theme.css`
- `src/styles/fonts/`

### Add page

```bash
npx dealtech-ui-v3 add-page reports
```

Command ini akan:
- membuat file `src/pages/reports/ReportsPage.tsx`
- menambahkan route `/dashboard/reports` ke `src/layout/AdminApp.tsx`

Gaya impor mengikuti berkas router yang ada (alias `@/pages/...` atau relatif
`../pages/...`), bukan varian CLI-nya — jadi aman dijalankan di project yang sudah
berpindah gaya.

### Flags

```bash
npx dealtech-ui install my-admin-app --no-install
npx dealtech-ui install my-admin-app --force
npx dealtech-ui add button --force
npx dealtech-ui add-layout admin-layout --force
```

- `--no-install` untuk skip `npm install`
- `--force` untuk overwrite file atau folder yang sudah ada
- `--v1` / `--v2` / `--v3` untuk memilih starter tanpa mengganti nama perintah

## Available UI

### v1 — `dealtech-ui`

`actionbutton`, `badge`, `button`, `cardtabelv1`, `confirmmodal`, `filterselect`, `formmodal`, `infosection`, `input`, `inputdate`, `kartupaket`, `longtextinput`, `modal`, `notecard`, `pageheader`, `pagination`, `plancard`, `progresbarv1`, `progresbarv2`, `progresbarv3`, `scroltotop`, `searchableselect`, `searchinput`, `statcardoverview`, `tabledata-v1`, `tabledata-v2`, `timelinetabel`, `uploadfield`, `welcomecard`

Alias umum seperti `action-button`, `page-header`, `search-input`, `scroll-to-top`, dan `progress-bar-v2` juga didukung.

### v2.0-next & v3.0 — `dealtech-ui-v2-next`, `dealtech-ui-v3`

`action-button`, `badge`, `badgeinfo`, `badgev2`, `bilah-lipat`, `blok-tentang`, `button`, `cardbar-chart`, `cardbar-list`, `chartbar-ganda`, `chartbarhor`, `chartbarver`, `chartline`, `chartlinev2`, `chartlistbar`, `chartpie`, `charttoplist`, `checkbox`, `date-input`, `heatmap`, `hex-backdrop`, `inputlongtext`, `inputnumber`, `inputtext`, `kalender`, `kartu-katalog`, `kartu-paket`, `kepala-publik`, `kode-otomatis`, `label-qr`, `lembar-cetak`, `lightbox`, `logo-shape`, `memuat`, `menu-aksi`, `modal`, `modal-galat`, `pagetitle`, `pagination`, `peta-titik`, `pilih-banyak`, `pita-berjalan`, `progress-bar`, `proses-modal`, `protected-route`, `richtext`, `search-input`, `search-select`, `select`, `stat-card`, `tab-button`, `tabelcardv1`, `table-toolbar`, `tablelist-v1`, `toggleonoff`, `ulasan-berjalan`, `unggah-gambar`, `welcome-card-v2`

Tanda hubung boleh dilepas: `add searchselect` sama dengan `add search-select`.

Daftar yang paling mutakhir selalu bisa dilihat langsung dari CLI:

```bash
npx dealtech-ui-v3 help
```

## Available Layout

`admin-layout` (alias: `admin`) — tersedia di ketiga varian.

## Local development

```bash
git clone <this-repo>
cd dealtech-ui
npm link
```

Lalu dari folder lain:

```bash
dealtech-ui install demo-app --v3
dealtech-ui add badge --v3
dealtech-ui add-layout admin-layout --v3
```

## License

MIT | [Deal-Tech](https://tech.mudahdeal.com)
