# Changelog

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
