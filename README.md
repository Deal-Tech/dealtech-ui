# dealtech-ui

DealTech UI Component Library — installable React + Tailwind components via `npx`, inspired by [shadcn/ui](https://ui.shadcn.com/).

> **Copy-paste components into your project.** No bundler lock-in, full control over the source code.

[![npm version](https://img.shields.io/npm/v/dealtech-ui)](https://www.npmjs.com/package/dealtech-ui)
[![license](https://img.shields.io/npm/l/dealtech-ui)](https://github.com/Deal-Tech/dealtech-ui/blob/main/LICENSE)

🌐 **Developer Website**: [tech.mudahdeal.com](https://tech.mudahdeal.com)

---

## Quick Start

```bash
npx dealtech-ui add button          # install single component
npx dealtech-ui add card modal      # install multiple at once
npx dealtech-ui add-layout admin-layout  # install a layout
npx dealtech-ui install             # install ALL components & layouts
npx dealtech-ui list                # show all available
```

Components are copied to `src/components/<name>/`  
Layouts are copied to `src/layouts/<name>/`

---

## Peer Dependencies

Make sure your project has these installed:

```bash
npm install react react-dom tailwindcss lucide-react
```

Some layouts also require:

```bash
npm install react-router-dom    # for admin-layout
```

---

## Available Components

| Component | Description | Dependencies |
|-----------|-------------|--------------|
| `button` | 7 variants (`primary` `secondary` `outline` `danger` `ghost` `action` `action-danger`), 3 sizes, icon support, loading state | `lucide-react` |
| `card` | Card container with `CardHeader`, `CardTitle`, `CardContent` sub-components | — |
| `page-header` | Page header with title, subtitle, and optional action area on the right | — |
| `modal` | Modal dialog with 4 sizes (`sm` `md` `lg` `xl`), scrollable body, optional footer | `lucide-react` |
| `action-button` | Compact action button for table rows (`default` / `danger` variants + icon) | `lucide-react` |
| `data-table` | Data table with column definitions, custom render cells, pagination, and empty state | `lucide-react` |
| `form` | Form fields: `TextInput`, `TextArea`, `NumberInput`, `SelectField`, `ImageUpload`, `RatingInput`, `DateInput` | `lucide-react` |
| `search-input` | Search input with optional icon, responsive width | `lucide-react` |
| `filter` | Filter components: `FilterSelect` dropdown and `FilterDate` input | — |
| `tab-button` | Segmented control style tabs with 3 sizes and horizontal/vertical orientation | — |
| `badge` | Status badges with 5 variants (`default` `primary` `success` `warning` `danger`) | — |

## Available Layouts

| Layout | Description | Dependencies |
|--------|-------------|--------------|
| `admin-layout` | Complete admin framework: responsive sidebar with nav groups, sticky header with user profile/logout, flexible content area | `lucide-react` `react-router-dom` |
| `login-layout` | Split-screen login page: form on left, auto-rotating dark slider panel on right | `lucide-react` |

---

## Usage Examples

### Button

```tsx
import { Button } from '@/components/button/button';
import { Plus, Trash2 } from 'lucide-react';

// Basic variants
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Details</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Skip</Button>

// With icon
<Button variant="primary" icon={Plus}>Add Product</Button>
<Button variant="danger" icon={Trash2} iconPosition="right">Remove</Button>

// Loading state
<Button variant="primary" loading>Saving...</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card/card';

<Card>
  <CardHeader>
    <CardTitle>Total Revenue</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold">Rp 12.500.000</p>
  </CardContent>
</Card>
```

### PageHeader

```tsx
import { PageHeader } from '@/components/page-header/page-header';
import { Button } from '@/components/button/button';
import { Plus } from 'lucide-react';

<PageHeader
  title="Produk"
  subtitle="Kelola semua produk di sini"
  action={<Button variant="primary" icon={Plus}>Tambah Produk</Button>}
/>
```

### Modal

```tsx
import { Modal } from '@/components/modal/modal';
import { Button } from '@/components/button/button';

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Tambah Data"
  size="md"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>Batal</Button>
      <Button variant="primary" type="submit" form="myForm">Simpan</Button>
    </>
  }
>
  <form id="myForm" className="space-y-4">
    {/* form fields here */}
  </form>
</Modal>
```

### ActionButton

```tsx
import { ActionButton } from '@/components/action-button/action-button';
import { Edit, Trash2 } from 'lucide-react';

<div className="flex items-center gap-1.5">
  <ActionButton variant="default" icon={Edit}>Edit</ActionButton>
  <ActionButton variant="danger" icon={Trash2}>Delete</ActionButton>
</div>
```

### DataTable

```tsx
import { DataTable } from '@/components/data-table/data-table';
import { ActionButton } from '@/components/action-button/action-button';
import { Edit, Trash2 } from 'lucide-react';

const columns = [
  { key: 'id', label: 'ID', render: (row) => `#${row.id}` },
  { key: 'name', label: 'NAMA', render: (row) => (
    <div>
      <p className="text-sm font-medium text-gray-900">{row.name}</p>
      <p className="text-xs text-gray-400">{row.slug}</p>
    </div>
  )},
  { key: 'price', label: 'HARGA' },
  { key: 'actions', label: 'AKSI', render: (row) => (
    <div className="flex items-center gap-1.5">
      <ActionButton icon={Edit}>Edit</ActionButton>
      <ActionButton variant="danger" icon={Trash2} onClick={() => handleDelete(row.id)}>Delete</ActionButton>
    </div>
  )},
];

<DataTable
  columns={columns}
  data={products}
  rowKey={(row) => row.id}
  emptyMessage="Belum ada produk"
  pagination={{ currentPage: 1, lastPage: 5 }}
  onPageChange={(page) => setPage(page)}
/>
```

### Form Fields

```tsx
import { TextInput, TextArea, NumberInput, SelectField, DateInput, RatingInput, ImageUpload } from '@/components/form';

// Text Input — with label, error, and hint
<TextInput label="Nama Produk" placeholder="Masukkan nama" required error={errors.name} />

// Text Area
<TextArea label="Deskripsi" placeholder="Tulis deskripsi produk..." />

// Number Input
<NumberInput label="Harga" placeholder="0" />

// Select Field
<SelectField
  label="Kategori"
  placeholder="Pilih kategori..."
  options={[
    { value: 'food', label: 'Makanan' },
    { value: 'drink', label: 'Minuman' },
  ]}
/>

// Date Input
<DateInput label="Tanggal" />

// Rating Input
<RatingInput label="Rating" />

// Image Upload
<ImageUpload label="Foto Produk" />
```

### SearchInput

```tsx
import { SearchInput } from '@/components/search-input/search-input';

<SearchInput
  placeholder="Cari produk..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

// Without icon
<SearchInput showIcon={false} placeholder="Search..." />
```

### Filter

```tsx
import { FilterSelect, FilterDate } from '@/components/filter';

// Dropdown filter
<FilterSelect
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  placeholder="Semua Status"
  options={[
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Nonaktif' },
  ]}
/>

// Date filter
<FilterDate value={date} onChange={(e) => setDate(e.target.value)} />
```

### TabButton

```tsx
import { TabButton } from '@/components/tab-button/tab-button';

const [activeTab, setActiveTab] = useState('all');

<TabButton
  value={activeTab}
  onChange={setActiveTab}
  options={[
    { value: 'all', label: 'Semua' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Nonaktif' },
  ]}
  size="sm"
/>
```

### Badge

```tsx
import { Badge } from '@/components/badge/badge';

<Badge variant="success">Active</Badge>
<Badge variant="danger">Cancelled</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="primary">Admin</Badge>
<Badge variant="default">Draft</Badge>
```

### Admin Layout

```tsx
import { AdminLayout } from '@/layouts/admin-layout';
import { Home, Package, Users, ShoppingBag } from 'lucide-react';
import { Outlet } from 'react-router-dom';

<AdminLayout
  navGroups={[
    { items: [{ to: '/admin', icon: Home, label: 'Dashboard' }] },
    { label: 'Menu', items: [
      { to: '/admin/products', icon: Package, label: 'Produk' },
      { to: '/admin/users', icon: Users, label: 'Users' },
    ]},
  ]}
  brandIcon={ShoppingBag}
  brandTitle="Admin Panel"
  headerTitle="Dashboard Admin | My App"
  user={{ name: 'Admin', email: 'admin@example.com' }}
  onLogout={() => logout()}
>
  <Outlet />
</AdminLayout>
```

### Login Layout

```tsx
import { LoginLayout } from '@/layouts/login-layout/login-layout';

<LoginLayout
  // Configure your login form and slider content
/>
```

---

## Local Development

Clone and link for local development:

```bash
git clone https://github.com/Deal-Tech/dealtech-ui.git
cd dealtech-ui
npm link
```

After linking, you can use `dealtech-ui` commands globally to test components locally.

---

## License

MIT © [Deal-Tech](https://tech.mudahdeal.com)
