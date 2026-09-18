# Changelog

## v2.2.0 - 2026-09-18

- Tambah starter `v3.0` di `templates/starter-v3.0`: set element sama persis dengan v2.0-next, shell baru (halaman login, dashboard, header, dan palet tema).
- Tambah perintah `dealtech-ui-v3` beserta bendera `--v3`. `dealtech-ui` dan `dealtech-ui-v2-next` tidak berubah.
- `add-layout` pada v3 ikut menyalin `theme.css`, font, dan berkas menu seperti pada v2.
- Perbaiki alias element: alias milik v1 (`progressbarv1`, `scroll-to-top`, dan seterusnya) tidak lagi lolos validasi di v2/v3 lalu gagal saat menyalin folder yang tidak ada. Sekarang ditolak rapi dengan daftar element varian aktif.
- `install` tidak lagi ikut menyalin `node_modules`, `dist`, dan artefak dev lain milik folder template.
- Perbaiki penjaga skema URL di `RichText` supaya dikenali sebagai barrier taint oleh CodeQL (`js/xss-through-dom`); perilaku runtime tidak berubah.
- README menjelaskan beda ketiga starter: v1 punya set element sendiri, v2.0-next dan v3.0 identik di sisi element.

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
