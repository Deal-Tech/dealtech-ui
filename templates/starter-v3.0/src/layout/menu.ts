import type { Peran } from '@/services/auth';

export interface MenuItem {
  key: string;
  label: string;
  icon: string;
  href: string;
  badge?: number | null;
  external?: boolean;
  peran?: Peran[];
}

export interface MenuGroup {
  key: string;
  label: string;
  open?: boolean;
  items: MenuItem[];
}

export interface AppMenu {
  main: MenuItem[];
  groups: MenuGroup[];
  others: MenuItem[];
}

export const menu: AppMenu = {
  main: [{ key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: '/dashboard' }],
  groups: [
    {
      key: 'ui',
      label: 'UI Kit',
      open: true,
      items: [
        {
          key: 'element',
          label: 'Semua Element',
          icon: 'component',
          href: '/dashboard/element',
        },
      ],
    },
    {
      key: 'transaksi',
      label: 'Template Transaksi',
      open: true,
      items: [
        {
          key: 'checkout',
          label: 'Checkout',
          icon: 'shopping-cart',
          href: '/dashboard/checkout',
        },
        {
          key: 'pembayaran',
          label: 'Pembayaran',
          icon: 'receipt-text',
          href: '/dashboard/pembayaran',
        },
      ],
    },
  ],
  /* Butir lepas yang duduk di bawah semua grup — bukan grup, jadi tidak punya
     kepala yang bisa dilipat. */
  others: [
    {
      key: 'produk',
      label: 'Daftar Produk',
      icon: 'package',
      href: '/dashboard/produk',
    },
    {
      key: 'member',
      label: 'Daftar Member',
      icon: 'users',
      href: '/dashboard/member',
    },
    {
      key: 'pengaturan',
      label: 'Pengaturan',
      icon: 'settings',
      href: '/dashboard/pengaturan',
    },
  ],
};

export function saringMenu(sumber: AppMenu, peran: Peran | undefined): AppMenu {
  const boleh = (item: MenuItem) => !item.peran || (!!peran && item.peran.includes(peran));

  return {
    main: sumber.main.filter(boleh),
    groups: sumber.groups
      .map((g) => ({ ...g, items: g.items.filter(boleh) }))
      .filter((g) => g.items.length > 0),
    others: sumber.others.filter(boleh),
  };
}
