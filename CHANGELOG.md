# Changelog

## v2.3.0 - 2026-11-17

### Starter v3.1 (terbaru)

Starter baru di `templates/starter-v3.1`, dipasang lewat `dealtech-ui-v3.1` atau bendera
`--v3.1`. Isinya v3.0 ditambah aturan tampilan yang sudah teruji di project produksi.
`dealtech-ui-v3` tetap memasang v3.0 tanpa perubahan.

- Kartu tanpa bayangan, cukup border: `--app-control-ring` dan `--app-control-ring-error` bernilai `none`, jadi kartu, seksi, tabel, chart, dan isian form rata dengan halaman. Bayangan tinggal di elemen yang melayang: modal, panel dropdown, tooltip, dan kenop toggle.
- Header tabel jadi bar abu terpisah setinggi 38px, sudut 3px (`border-collapse: separate` + border bawah transparan + `background-clip: padding-box`), tanpa garis bawah.
- Toolbar tabel dan bar aksi massal jadi bar abu yang sama tingginya (42,8px), menempel 2px dari tepi kartu dengan sudut atas sejajar radius kartu. Bar massal menggantikan posisi toolbar, jadi tabel tidak bergeser saat baris dipilih.
- Klik baris tabel membuka Lihat Detail, atau Ubah bila tidak ada detail: daftar produk ke halaman detail, transaksi dashboard ke modal rincian baru, dan daftar member ke modal Ubah Member (modal tambah kini bisa mengubah). Klik checkbox dan menu aksi tidak ikut memicu klik baris. Aturannya ditulis di `AGENTS.md`.
- Jarak tabel diseragamkan lewat `--tablelist-jarak`: tepi baris dan header sejajar bar cari, padding sel dua kali padding bar, checkbox tepat di tengah.
- Kepala `Modal` jadi bar abu setinggi kepala `Seksi` (37,8px, 2px dari tepi, sudut atas sejajar radius modal) dengan judul 13px seperti judul seksi; Esc menutup dropdown yang terbuka dulu, baru modalnya.
- Kepala `Seksi` jadi bar abu ringkas (37,8px), badan seksi memakai padding rata 12px di semua sisi (7,5px di HP).
- Isian setinggi tombol dan butir menu sidebar (`--app-control-h` = 30,8px); isian galat cukup berubah warna border.
- Kartu statistik berbentuk segmen chevron yang saling mengunci, warna mengikuti kolom (`--app-stat-1` s.d. `--app-stat-5`), paling banyak lima per baris, plus prop `memuat`.
- `TabButton` dan `SearchInput` punya gaya `pil`, dan tab di halaman Pengaturan serta detail produk kini memakai `gaya="pil"`; `PageTitle` meratakan tombol ke bawah judul; animasi `TombolTuang` dua kali lebih cepat dan bisa difokuskan dari luar.
- Tambah element `seksi`: kartu `app-section-card` berkepala bar abu, judul saja, aksi di kanan. Semua kartu seksi di halaman starter kini berjudul lewat `Seksi`: checkout, pembayaran, detail produk, tambah/ubah produk, dan Pengaturan (Informasi Akun, Ganti Kata Sandi, Warna Tema, Kontak Publik, Media Sosial).
- Tambah element `bidang`: label, tanda wajib, hint, dan galat untuk kontrol tanpa label sendiri seperti `Select`.
- Tambah element `konfirmasi-modal`: konfirmasi aksi berisiko dengan `TombolTuang`, peringatan, dan `kataKunci` (tombol baru aktif setelah pengguna mengetik, misalnya HAPUS).
- Tambah element `hapus-massal`: hapus banyak baris dengan konfirmasi ketik HAPUS; yang gagal tetap terpilih beserta alasannya. Dipakai di tabel dashboard.
- Tambah element `tombol-muat-ulang` dan hook `useAksiTuang` untuk tombol async.
- Katalog element punya grup baru **Baru di v3.1**, dan grup **TabButton** berisi sembilan varian: pil teks, pil + ikon, pil + jumlah (termasuk 99+), label `short` untuk layar sempit, tab sama rata (`tab-button--rata`), chip kategori bergaya kustom, dan gaya garis bawaan.
- Halaman login dan lupa sandi: latar putih, kartu form abu tipis tanpa bayangan dan tanpa border yang menyatu dengan panel kanan bersudut 18px, serta garis isian lebih tebal yang berubah ke warna utama saat disorot atau fokus. Judul, teks per langkah, dan titik di panel kanan tetap seperti v3.0.
- Perbaiki `LembarCetak`: aturan cetak hanya aktif saat halaman memang berisi lembar cetak.
- Perbaiki `InputNumber` (non-rupiah): nol di depan dibuang saat mengetik, jadi isian bernilai 0 yang diketik 1000 tidak lagi tampil 01000. Desimal (0.5) dan negatif tetap aman.
- `AGENTS.md` v3.1 menambah aturan kartu tanpa bayangan, kepala seksi dan bar abu, jarak antar section, tombol aksi async, serta toolbar dan hapus massal tabel.

### CLI

- Tambah perintah `dealtech-ui-v3.1` beserta bendera `--v3.1` (alias `--v31`).
- `help` memakai contoh `dealtech-ui ... --v3.1` dan menjelaskan bahwa npm baru berisi starter v1; starter v2 ke atas dipasang dengan clone repo lalu `npm link`.
- README ditulis ulang dengan tangkapan layar v3.1 dan panduan pasang lewat clone.

### Starter v3.0

- Tambah element `tombol-tuang`: teks tombol dituang ke ikon selama proses (ikon simpan, unggah, hapus, file, kunci, kirim, lambang Google), mengikuti status `idle` / `pending` / `success` / `error`, dengan progres unggah, titik kata sandi, dan label hasil seperti Authorized / Unauthorized.
- Tombol masuk, tombol simpan di pengaturan, produk, dan member, tombol unggah di `unggah-gambar` dan pembayaran, serta tombol hapus produk kini memakai `tombol-tuang`. Form dan modal baru ditutup sesudah animasi centang.
- `StatCard` lebih dinamis: ukuran ikon, padding, dan jarak mengikuti lebar kartu (container query), kartu sempit beralih ke format kolom, judul dibatasi dua baris, dan nilai serta lencana dipotong elipsis tanpa keluar kartu.
- Tambah `StatGrid`: jumlah kolom mengikuti lebar wadah dengan baris seimbang (4 → 2 → 1, tanpa sisa 3 + 1), dipakai di dashboard dan katalog element.
- Halaman login: panel kanan memakai adegan dashboard 3D beranimasi — lempeng bertebal, kartu melayang, angka menghitung, kamera bergoyang (diam saat reduced motion), logo 50% lebih besar dan lebih rapat ke sambutan, sambutan jadi `BadgeInfo`, judul dihapus, tombol Google tanpa border, kontrol di PC 10% lebih kecil, dan footer baru rata kiri.
- Tombol "Masuk dengan Google" beranimasi: huruf jadi titik sambil tersedot ke lambang G (lambang tetap utuh, tanpa air), lalu "Memproses OAuth". Mode demo langsung masuk dashboard; produksi dialihkan ke `VITE_OAUTH_GOOGLE_URL`.
- Login dan lupa sandi di layar ≤ 860px: latar biru bergradasi dengan lingkaran seperti panel kanan, halaman tetap diam tanpa scroll.
- Halaman pembayaran: keterangan bukti pembayaran jadi `BadgeInfo` tanpa ikon.
- Tabel: semua isi sel dipotong elipsis supaya tinggi baris seragam, dan aksi baris jadi dropdown ikon titik tiga lewat `AksiBaris` (panel sama dengan menu akun di header) di dashboard, produk, member, dan katalog element.
- Tambah halaman lupa kata sandi (`/lupa-sandi`) tiga langkah: kirim kode (amplop berubah jadi pesawat kertas yang terbang), verifikasi OTP 6 angka, lalu kata sandi baru dengan meter kekuatan. Pesan terkirim selalu generik supaya email terdaftar tak bisa ditebak, kirim ulang berjeda 60 detik, dan selesai kembali ke login dengan pesan sukses. Mode demo menerima kode apa pun kecuali 000000.
- Tambah element `kode-otp`: kotak kode sekali pakai yang menumpuk ke tengah jadi perisai hijau centang atau merah silang, lalu kosong lagi kalau ditolak.
- Tambah `KerangkaMasuk`: kerangka bersama halaman masuk dan pemulihan sandi, dengan adegan 3D sendiri untuk lupa sandi (email berkode, kotak OTP terisi, gembok mengunci).
- Tambah halaman pemeliharaan (`/maintenance`): latar biru penuh dengan lingkaran seperti login versi HP, tanpa scroll, dan adegan 3D server yang diperbaiki lalu dioptimalkan — garis pindai menyapu rak, beban turun ke hijau, progres optimasi 0–100%, jarum performa naik, gir berputar, kunci pas bergoyang, lalu muncul "Sistem optimal". Gerak berhenti saat reduced motion.
- Warna tema admin bisa diganti di Pengaturan → Atur System: pilih dari palet atau ketik kode hex (3 atau 6 digit), pratinjau langsung ke seluruh admin, empat turunan (utama, hover, aktif, aksen) dihitung otomatis, peringatan kalau warnanya terlalu terang untuk teks putih, dan tombol kembali ke bawaan `#01498b`. Warna tersimpan dipasang sebelum render (tanpa kedip) dan ikut ke halaman login, maintenance, serta grafik. Backend cukup menyediakan `GET /api/v1/pengaturan/tema` (publik) dan `PUT` (admin) berisi `{ "warna_utama": "#rrggbb" }`.
- Semua keterangan memakai `BadgeInfo` tanpa ikon dengan ukuran dan tebal teks yang sama (12px, 500): gaya `pengaturan-catatan` dan `login-catatan` dihapus, elemen di dalamnya dipaksa mengikuti ukuran induk, dan aturannya ditulis di `AGENTS.md`.
- Tambah menu **Lydia Chat UI** (`/dashboard/lydia`): halaman chat AI berkerangka editor CMS, tampil layar penuh dengan sidebar admin jadi laci. Riwayat chat di kiri (dikelompokkan per tanggal, bisa dicari, dihapus langsung lewat ikon tempat sampah tanpa konfirmasi, dan lebarnya digeser seperti sipekum), chat di kanan dengan bubble dan foto Lydia gaya sipekum-next dalam ukuran starter. Selama menunggu tampil langkah proses ala Claude Code (glyph berputar, centang, teks berkilau, hitungan detik) dengan warna primary tema. Jawaban mengalir kata demi kata dan bisa dihentikan, mendukung markdown ringkas dengan blok kode bertombol salin, lampiran gambar atau dokumen (tombol klip, tempel, atau seret; maks 4 berkas, 10 MB), mode gelap dengan efek lingkaran, serta pengaturan nama, sapaan, deskripsi, instruksi AI, dan saran pertanyaan.
- Kontrak backend Lydia (kunci API model hanya di backend): `GET /api/v1/lydia/percakapan`, `GET`/`DELETE /api/v1/lydia/percakapan/{id}`, `POST /api/v1/lydia/lampiran` (multipart `berkas`), `POST /api/v1/lydia/chat` berisi `{ percakapan_id, pesan, lampiran }` yang menjawab SSE dengan event `mulai`, `potongan`, `selesai`, dan `galat`, serta `GET`/`PUT /api/v1/lydia/pengaturan`. Mode demo menyimulasikan semuanya.
- Tambah `AGENTS.md` dan `CLAUDE.md` di starter v3.0: aturan tabel untuk asisten AI — satu sel satu data, isi satu baris, aksi lewat dropdown.
- `RichText` (juga di v2.0-next): modal tautan diganti gelembung di bawah teks. Gelembung muncul begitu teks diblok (tanpa merebut fokus, jadi Ctrl+B tetap jalan) atau saat kursor atau penunjuk berada di tautan, berisi URL, terapkan, buka, dan hapus. Teks terpilih tetap tersorot, dan tombol toolbar berlatar putih supaya tidak menyatu dengan bilah.
- Tambah element `skeleton` dan pakai di semua halaman yang memuat data: daftar produk (baris tabel dengan bentuk sel per kolom), detail produk, ubah produk, serta Pengaturan (warna tema, kontak, sosmed). Skeleton meniru susunan halamannya — label, hint, dan judul tetap teks asli, hanya bagian data yang berkilau — jadi tidak ada yang bergeser saat data datang. `InputText`, `InputNumber`, `Select`, `RichText`, dan `TableListV1` kini menerima prop `memuat`, dan aturannya ditulis di `AGENTS.md`.

## v2.2.0 - 2026-09-18

### Starter dan CLI

- Tambah starter `v3.0` di `templates/starter-v3.0`: set element sama persis dengan v2.0-next, shell baru (halaman login, dashboard, header, dan palet tema).
- Tambah perintah `dealtech-ui-v3` beserta bendera `--v3`. `dealtech-ui` dan `dealtech-ui-v2-next` tidak berubah.
- `add-layout` pada v3 ikut menyalin `theme.css`, font, dan berkas menu seperti pada v2.
- `install` tidak lagi ikut menyalin `node_modules`, `dist`, dan artefak dev lain milik folder template.
- Izinkan skrip pasang esbuild supaya `vite` langsung jalan setelah install starter v2.0-next.
- README menjelaskan beda ketiga starter (v1 punya set element sendiri, v2.0-next dan v3.0 identik di sisi element) dan menampilkan tangkapan layar tampilan v3.

### Halaman baru di starter v2.0-next dan v3.0

- Tambah halaman daftar member berisi tabel kode user, nama, no hp, email, dan aksi, lengkap dengan modal tambah member.
- Tambah halaman daftar produk dan halaman tambah produk.
- Tambah halaman detail produk: bagian informasi yang bisa dilipat, menu aksi dropdown berisi ubah dan hapus, serta tab deskripsi yang menampilkan isi rich editor.
- Tambah template transaksi berupa halaman checkout dan halaman pembayaran beserta entri menunya.
- Pisah halaman pengaturan jadi tab profil, system, dan sosmed, dengan sepuluh platform sosial di tab sosmed.
- Tambah komponen kartu paket di starter v1, v2.0-next, dan v3.0.

### Tampilan

- Ganti tulisan merek di sidebar dengan lambang ui.dealtech, dan tambah berkas ikon hexmark di starter v1 dan v2.0-next.
- Halaman masuk starter v2.0-next: latar peta bertitik yang bergeser pelan, pilihan ingat saya, font Inter, dan skala font baru.
- Samakan tepi, cincin, dan padding kartu dengan isian form di seluruh halaman.
- Lipat ringkasan dashboard dan pindahkan tombol tambah member ke sisi kanan judul halaman.

### Perbaikan

- Perbaiki alias element: alias milik v1 (`progressbarv1`, `scroll-to-top`, dan seterusnya) tidak lagi lolos validasi di v2/v3 lalu gagal saat menyalin folder yang tidak ada. Sekarang ditolak rapi dengan daftar element varian aktif.
- Perbaiki validasi URL `RichText` supaya mengembalikan nilai bersih, sehingga `href` tidak lagi membawa input mentah.
- Perbaiki penjaga skema URL di `RichText` supaya dikenali sebagai barrier taint oleh CodeQL (`js/xss-through-dom`); perilaku runtime tidak berubah.
- Perbaiki menu dashboard yang ikut menyala di semua halaman.
- Perbaiki kontras tombol close sidebar di header putih.
- Keluarkan komponen privat dari katalog element.
- Perbaiki animasi peta di layar sempit: keyframes keluar dari media query dan geserannya dipercepat.
- Ringkas komentar di CLI dan `RichText`.

## v2.1.0 - 2026-09-02

- Tambah starter `v2.0-next` di `templates/starter-v2.0-next`: token CSS, style terpisah per komponen, 54 UI element.
- Tambah perintah `dealtech-ui-v2-next` yang memasang starter v2. `dealtech-ui` tetap memasang starter v1.
- Tambah bendera `--v1` / `--v2` untuk menimpa pilihan starter berdasarkan nama perintah.
- Perbaiki pemindai dependency `add` supaya membaca impor alias `@/components/ui/...`, bukan hanya jalur relatif.
- `add-layout` pada v2 ikut menyalin `theme.css`, font, dan berkas pendukung menu.
- `add-page` mengikuti gaya impor berkas router yang ada, alias maupun relatif.
- Perbaiki nama paket hasil `install` yang ikut ter-slug dari seluruh jalur saat argumennya berupa path.

## v2.0.0 - 2026-03-16

- Tambah command `add` untuk menyalin UI element satuan beserta dependency lokalnya.
- Tambah command `add-layout` untuk memasang layout admin lengkap dengan file CSS pendukung.
- Dokumentasi diperbarui untuk flow starter, element, dan layout.

## v1.2.0 - 2026-03-14

- Transformasi dari package yang sebelumnya fokus ke component saja menjadi UI panel starter yang lebih lengkap.
- Sekali install, user langsung mendapatkan struktur project, login page, dashboard, layout, routing, dan komponen dasar siap pakai.
