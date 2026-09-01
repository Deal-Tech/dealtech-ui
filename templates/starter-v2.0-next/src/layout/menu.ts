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
      key: 'sistem',
      label: 'Sistem',
      open: true,
      items: [
        {
          key: 'pengaturan',
          label: 'Pengaturan',
          icon: 'settings',
          href: '/dashboard/pengaturan',
        },
      ],
    },
  ],
  others: [],
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
