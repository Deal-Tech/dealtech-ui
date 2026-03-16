# dealtech-ui

`dealtech-ui` adalah CLI untuk generate `UI Panel Starter` berbasis React, Vite, TypeScript, dan Tailwind.

Core `dealtech-ui` saat ini adalah starter admin panel siap pakai, bukan package import per komponen. Dokumentasi sementara difokuskan untuk instalasi starter app langsung lewat `npx dealtech-ui install`.

Starter app yang dihasilkan sudah menyiapkan:
- halaman login admin
- layout dashboard admin
- reusable UI components
- struktur `src` siap lanjut development
- konfigurasi Vite, TypeScript, dan Tailwind

## Usage

### Create starter app

```bash
npx dealtech-ui install my-admin-app
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

### Install di folder saat ini

```bash
npx dealtech-ui install
```

Gunakan hanya pada folder yang masih kosong.

### Flags

```bash
npx dealtech-ui install my-admin-app --no-install
npx dealtech-ui install my-admin-app --force
```

- `--no-install` untuk skip `npm install`
- `--force` untuk scaffold ke folder yang tidak kosong

## Current scope

Dokumentasi saat ini masih fokus ke flow install starter app.

Belum ada dokumentasi resmi untuk:
- import per komponen secara terpisah
- publish komponen sebagai package terpisah
- registry komponen seperti `add component`

## Optional command

```bash
npx dealtech-ui add-page reports
```

Command ini akan:
- membuat file `src/pages/reports/ReportsPage.tsx`
- menambahkan route `/dashboard/reports` ke `src/layout/AdminApp.tsx`

## Local development

```bash
git clone <this-repo>
cd dealtech-ui
npm link
```

Lalu dari folder lain:

```bash
dealtech-ui install demo-app
```

## License

MIT
