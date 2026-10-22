import { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import AdminHeader from '@/components/layout/AdminHeader';
import AdminSidebar, { type SidebarUser } from '@/components/layout/AdminSidebar';
import { useAuth } from '@/lib/auth';
import { zonaPengguna } from './jam-zona';
import { menu, saringMenu } from './menu';
import '@/styles/admin.css';

// Layar penuh, sidebar jadi laci
const JALUR_LAYAR_PENUH = ['/dashboard/lydia'];

export interface AdminOutletContext {
  bukaSidebar: () => void;
}

const PENGGUNA_CONTOH: SidebarUser = {
  name: 'Administrator',
  email: 'admin@dealtech-ui.com',
  initials: 'AD',
};

function inisial(nama: string): string {
  return nama
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pengguna, keluar } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const layarPenuh = JALUR_LAYAR_PENUH.some((j) => location.pathname.startsWith(j));
  const konteks: AdminOutletContext = { bukaSidebar: () => setIsSidebarOpen(true) };

  const user: SidebarUser = pengguna
    ? { name: pengguna.name, email: pengguna.email, initials: inisial(pengguna.name) }
    : PENGGUNA_CONTOH;

  const menuPeran = useMemo(() => saringMenu(menu, pengguna?.role), [pengguna?.role]);

  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsSidebarOpen(false);
    mainRef.current?.scrollTo({ top: 0, left: 0 });
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, [location.pathname]);

  const logout = () => {
    void keluar().catch(() => {});
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell flex overflow-hidden">
      <AdminSidebar
        menu={menuPeran}
        user={user}
        laci={layarPenuh}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={logout}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {layarPenuh ? null : (
          <AdminHeader
            nama={user.name}
            inisial={user.initials ?? ''}
            zona={zonaPengguna(pengguna)}
            onBukaSidebar={() => setIsSidebarOpen(true)}
            onKeluar={logout}
          />
        )}

        <main
          ref={mainRef}
          className={
            layarPenuh
              ? 'app-main app-main--penuh min-h-0 flex-1 overflow-hidden'
              : 'app-main min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 pt-4 md:px-6 md:pb-6 md:pt-6'
          }
        >
          <Outlet context={konteks} />
        </main>
      </div>
    </div>
  );
}
