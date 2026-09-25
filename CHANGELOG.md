# Changelog

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
