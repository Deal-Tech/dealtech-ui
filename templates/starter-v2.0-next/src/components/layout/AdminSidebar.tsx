import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut, UserRound, X } from 'lucide-react';

import { resolveIcon } from '@/layout/ikon-menu';
import type { AppMenu, MenuItem } from '@/layout/menu';

export interface SidebarUser {
  name: string;
  email: string;
  initials?: string;
}

function isItemActive(href: string, pathname: string, hash: string): boolean {
  const hashIndex = href.indexOf('#');
  if (hashIndex !== -1) {
    const path = href.slice(0, hashIndex);
    return pathname === path && hash === href.slice(hashIndex);
  }
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface MenuItemProps {
  item: MenuItem;
  active: boolean;
  onNavigate?: () => void;
}

function SidebarMenuItem({ item, active, onNavigate }: MenuItemProps) {
  const Icon = resolveIcon(item.icon);
  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.badge ? <span className="sidebar-menu-badge">{item.badge}</span> : null}
    </>
  );

  if (item.external) {
    return (
      <li>
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="sidebar-menu-btn"
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link
        to={item.href}
        onClick={onNavigate}
        className={`sidebar-menu-btn ${active ? 'active' : ''}`}
      >
        {content}
      </Link>
    </li>
  );
}

export interface AdminSidebarProps {
  menu: AppMenu;
  user: SidebarUser;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export default function AdminSidebar({
  menu,
  user,
  isOpen = false,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  const { pathname, hash } = useLocation();

  const mainItems = menu.main ?? [];

  const groups = useMemo(
    () =>
      [
        ...(menu.groups ?? []).map((group) => ({
          key: group.key,
          title: group.label,
          open: group.open,
          items: group.items ?? [],
        })),
        ...((menu.others ?? []).length
          ? [{ key: '__others', title: 'Lainnya', open: false, items: menu.others }]
          : []),
      ].filter((group) => group.items.length > 0),
    [menu],
  );

  const defaultOpen = useMemo(
    () =>
      Object.fromEntries(
        groups.map((g) => [
          g.key,
          !!g.open || g.items.some((i) => isItemActive(i.href, pathname, hash)),
        ]),
      ),
    [groups, pathname, hash],
  );

  // Persist buka/tutup grup ke localStorage.
  const readStored = (): Record<string, boolean> => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(window.localStorage.getItem('dealtech_sidebar_groups') || '{}') || {};
    } catch {
      return {};
    }
  };

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => ({
    ...defaultOpen,
    ...readStored(),
  }));

  const persist = (next: Record<string, boolean>) => {
    try {
      window.localStorage.setItem('dealtech_sidebar_groups', JSON.stringify(next));
    } catch {
    }
  };

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      groups.forEach((g) => {
        if (g.items.some((i) => isItemActive(i.href, pathname, hash))) next[g.key] = true;
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash]);

  const toggleGroup = (key: string) =>
    setOpenGroups((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      persist(next);
      return next;
    });

  return (
    <>
      <div
        className={`sidebar-overlay md:hidden ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
      />

      <aside
        className={`app-sidebar fixed left-0 top-0 z-50 flex h-screen w-64 flex-col md:sticky ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="sidebar-header flex h-14 items-center justify-between px-4">
          <Link to="/dashboard" className="sidebar-brand" onClick={onClose}>
            <span className="sidebar-brand__name">
              DealTech <strong>UI</strong>
            </span>
          </Link>
          <button type="button" onClick={onClose} className="sidebar-close-btn md:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="sidebar-nav-scroll flex flex-1 flex-col p-3">
          {mainItems.length > 0 && (
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {mainItems.map((item) => (
                <SidebarMenuItem
                  key={item.key}
                  item={item}
                  active={isItemActive(item.href, pathname, hash)}
                  onNavigate={onClose}
                />
              ))}
            </ul>
          )}

          {groups.map((group) => {
            const expanded = openGroups[group.key] ?? false;
            return (
              <div key={group.key}>
                <button
                  type="button"
                  className="sidebar-group-toggle"
                  onClick={() => toggleGroup(group.key)}
                  aria-expanded={expanded}
                >
                  <span className="flex-1 text-left">{group.title}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      expanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expanded && (
                  <ul className="sidebar-submenu">
                    {group.items.map((item) => (
                      <SidebarMenuItem
                        key={item.key}
                        item={item}
                        active={isItemActive(item.href, pathname, hash)}
                        onNavigate={onClose}
                      />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">
              {user?.initials ? user.initials : <UserRound className="h-5 w-5" />}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="sidebar-user-name truncate">{user?.name}</span>
              <span className="sidebar-user-email truncate">{user?.email}</span>
            </div>
          </div>

          <button type="button" onClick={onLogout} className="sidebar-logout-btn">
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
