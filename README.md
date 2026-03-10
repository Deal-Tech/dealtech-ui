# dealtech-ui

DealTech UI Component Library — installable React + Tailwind components via `npx`.

## Manual Installation (Local Development)

Jika Anda ingin mengembangkan atau menambahkan komponen baru ke CLI ini secara lokal, Anda dapat meng-clone repository ini dan melakukan `npm link`:

```bash
git clone https://github.com/Deal-Tech/dealtech-ui.git
cd dealtech-ui
npm link
```

Setelah menjalankan perintah di atas, Anda dapat menggunakan command `dealtech-ui` secara global di terminal project aplikasi Anda (misal untuk menambah/modifikasi komponen).

## Install (via npx)

```bash
npx dealtech-ui add button              # single component
npx dealtech-ui add card modal          # multiple at once
npx dealtech-ui add-layout sidebar-layout  # install a layout
npx dealtech-ui install                 # install EVERYTHING
npx dealtech-ui list                    # show all available
```

Components → `src/components/<name>/` · Layouts → `src/layouts/<name>/`

## Available Components

| Component | Description |
|-----------|-------------|
| `button` | 7 variants, 3 sizes, icon support, loading state |
| `card` | Card container with CardHeader, CardTitle, CardContent |
| `modal` | Modal dialog with 4 sizes, scrollable body, hidden scrollbar |
| `action-button` | Compact table action button (default/danger variants + icon) |
| `data-table` | Data table with columns, custom render, pagination, empty state |

## Available Layouts

| Layout | Description |
|--------|-------------|
| `sidebar-layout` | Sidebar nav + top header + profile dropdown, mobile responsive |

---

## Usage

### Button

```tsx
import { Button } from '@/components/button/button';
import { Plus } from 'lucide-react';

<Button variant="primary" size="md" icon={Plus}>Add Product</Button>
<Button variant="danger" loading>Deleting...</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card/card';

<Card>
  <CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
  <CardContent><p>Rp 12.500.000</p></CardContent>
</Card>
```

### Modal

```tsx
import { Modal } from '@/components/modal/modal';

<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Tambah Data" size="md"
  footer={<><Button variant="secondary">Batal</Button><Button variant="primary" type="submit" form="f">Simpan</Button></>}
>
  <form id="f" className="space-y-4">...</form>
</Modal>
```

### ActionButton

```tsx
import { ActionButton } from '@/components/action-button/action-button';
import { Edit, Trash2 } from 'lucide-react';

<ActionButton variant="default" icon={Edit}>Edit</ActionButton>
<ActionButton variant="danger" icon={Trash2}>Delete</ActionButton>
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

### Sidebar Layout

```tsx
import { SidebarLayout } from '@/layouts/sidebar-layout';
import { Home, Package, Users, ShoppingBag } from 'lucide-react';

<SidebarLayout
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
</SidebarLayout>
```

## Peer Dependencies

- `react` >= 18
- `tailwindcss` >= 3
- `lucide-react`
- `react-router-dom` (for sidebar-layout only)

## License

MIT
