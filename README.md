# DealTech Web & Apps Development

DealTech Web & Apps Development builds modern web and mobile application solutions for businesses that need fast, scalable, and practical digital products.

# dealtech-ui

`dealtech-ui` is a CLI for generating a `UI Panel Starter` and adding UI elements or layouts separately into your React project.

Core features in `dealtech-ui` v2.1.0:
- `install` for a complete admin panel starter
- `add` to copy ready-to-use UI elements
- `add-layout` to copy layouts along with their supporting CSS styles
- `pagination-v2` untuk pagination gaya admin dengan tombol `Previous / Next`

## Usage

### Install starter app

```bash
npx dealtech-ui install my-admin-app
```

This command will:
1. Create a new project folder
2. Copy the DealTech UI starter template
3. Run `npm install` automatically

Then run:

```bash
cd my-admin-app
npm run dev
```

### Add UI element

```bash
npx dealtech-ui add button badge modal
```

This command copies files into `src/components/ui/...` and automatically includes the required local dependencies.

Example:

```bash
npx dealtech-ui add tabledata-v2
```

`tabledata-v2` will also include `button` and `actionbutton` if they are not already available.

Pagination versi baru:

```bash
npx dealtech-ui add pagination-v2
```

### Add layout

```bash
npx dealtech-ui add-layout admin-layout
```

This command will copy:
- `src/layout/AdminLayout.tsx`
- `src/components/layout/AdminHeader.tsx`
- `src/components/layout/AdminSidebar.tsx`
- `src/styles/admin.css`

### Add page

```bash
npx dealtech-ui add-page reports
```

This command will:
- create `src/pages/reports/ReportsPage.tsx`
- add the `/dashboard/reports` route to `src/layout/AdminApp.tsx`

### Flags

```bash
npx dealtech-ui install my-admin-app --no-install
npx dealtech-ui install my-admin-app --force
npx dealtech-ui add button --force
npx dealtech-ui add-layout admin-layout --force
```

- `--no-install` skips `npm install`
- `--force` overwrites existing files or folders

## Available UI

`actionbutton`, `badge`, `button`, `cardtabelv1`, `confirmmodal`, `filterselect`, `formmodal`, `infosection`, `input`, `inputdate`, `longtextinput`, `modal`, `notecard`, `pageheader`, `pagination` (v1), `pagination-v2`, `plancard`, `progresbarv1`, `progresbarv2`, `progresbarv3`, `scroltotop`, `searchableselect`, `searchinput`, `statcardoverview`, `tabledata-v1`, `tabledata-v2`, `timelinetabel`, `uploadfield`, `welcomecard`

Common aliases such as `action-button`, `page-header`, `search-input`, `scroll-to-top`, and `progress-bar-v2` are also supported.

## Available Layout

`admin-layout`

## Local development

```bash
git clone <this-repo>
cd dealtech-ui
npm link
```

Then from another folder:

```bash
dealtech-ui install demo-app
dealtech-ui add badge
dealtech-ui add-layout admin-layout
```

## License

MIT | [Official Website Deal-Tech](https://tech.mudahdeal.com) | [GitHub](https://github.com/Deal-Tech)
