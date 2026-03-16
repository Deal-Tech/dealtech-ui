# dealtech-ui

`dealtech-ui` adalah CLI untuk generate `UI Panel Starter` dan menambahkan UI element atau layout secara terpisah ke project React Anda.

Core `dealtech-ui` v2.0.0:
- `install` untuk starter admin panel lengkap
- `add` untuk copy UI element siap pakai
- `add-layout` untuk copy layout beserta style CSS pendukungnya

## Usage

### Install starter app

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

### Add UI element

```bash
npx dealtech-ui add button badge modal
```

Command ini akan menyalin file ke `src/components/ui/...` dan otomatis membawa dependency lokal yang dibutuhkan.

Contoh:

```bash
npx dealtech-ui add tabledata-v2
```

`tabledata-v2` akan ikut membawa `button` dan `actionbutton` bila belum ada.

### Add layout

```bash
npx dealtech-ui add-layout admin-layout
```

Command ini akan menyalin:
- `src/layout/AdminLayout.tsx`
- `src/components/layout/AdminHeader.tsx`
- `src/components/layout/AdminSidebar.tsx`
- `src/styles/admin.css`

### Add page

```bash
npx dealtech-ui add-page reports
```

Command ini akan:
- membuat file `src/pages/reports/ReportsPage.tsx`
- menambahkan route `/dashboard/reports` ke `src/layout/AdminApp.tsx`

### Flags

```bash
npx dealtech-ui install my-admin-app --no-install
npx dealtech-ui install my-admin-app --force
npx dealtech-ui add button --force
npx dealtech-ui add-layout admin-layout --force
```

- `--no-install` untuk skip `npm install`
- `--force` untuk overwrite file atau folder yang sudah ada

## Available UI

`actionbutton`, `badge`, `button`, `cardtabelv1`, `confirmmodal`, `filterselect`, `formmodal`, `infosection`, `input`, `inputdate`, `longtextinput`, `modal`, `notecard`, `pageheader`, `pagination`, `plancard`, `progresbarv1`, `progresbarv2`, `progresbarv3`, `scroltotop`, `searchableselect`, `searchinput`, `statcardoverview`, `tabledata-v1`, `tabledata-v2`, `timelinetabel`, `uploadfield`, `welcomecard`

Alias umum seperti `action-button`, `page-header`, `search-input`, `scroll-to-top`, dan `progress-bar-v2` juga didukung.

## Available Layout

`admin-layout`

## Local development

```bash
git clone <this-repo>
cd dealtech-ui
npm link
```

Lalu dari folder lain:

```bash
dealtech-ui install demo-app
dealtech-ui add badge
dealtech-ui add-layout admin-layout
```

## License

MIT | [Deal-Tech](https://tech.mudahdeal.com)
