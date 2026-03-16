import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Table2,
  LogOut,
  User,
  X,
  ShoppingBag,
} from 'lucide-react';

const PRIMARY_MENU = { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' };

const NAV_GROUPS = [
  {
    label: 'Group Menu',
    items: [
      { to: '/dashboard/page-tabel', icon: Table2, label: 'Page Tabel V1' },
      { to: '/dashboard/page-tabel-v2', icon: Table2, label: 'Page Tabel V2' },
    ],
  },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const AdminSidebar = ({ open = false, onClose }: AdminSidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      navigate('/login');
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={handleClose}
        />
      ) : null}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded" style={{ background: 'linear-gradient(135deg, #334a34, #4a6b4b)' }}>
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">DealTech UI</span>
          </div>
          <button
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            aria-label="Tutup sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto p-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="space-y-1">
            <NavLink
              to={PRIMARY_MENU.to}
              end
              onClick={handleClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                  isActive ? 'text-white shadow-md' : 'text-gray-600 hover:text-white'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #334a34, #4a6b4b)',
                      boxShadow: '0 4px 12px rgba(51,74,52,0.25)',
                    }
                  : {}
              }
              onMouseEnter={(event) => {
                const element = event.currentTarget;
                if (!element.getAttribute('aria-current')) {
                  element.style.background = 'linear-gradient(135deg, #334a34, #4a6b4b)';
                }
              }}
              onMouseLeave={(event) => {
                const element = event.currentTarget;
                if (!element.getAttribute('aria-current')) {
                  element.style.background = '';
                }
              }}
            >
              <PRIMARY_MENU.icon className="h-4 w-4 shrink-0" />
              {PRIMARY_MENU.label}
            </NavLink>
          </div>

          {NAV_GROUPS.map((group, index) => (
            <div key={index}>
              {group.label ? (
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {group.label}
                </p>
              ) : null}
              <div className="space-y-1">
                {group.items.map(({ to, icon: Icon, label, end }: any) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end || to === '/dashboard'}
                    onClick={handleClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                        isActive ? 'text-white shadow-md' : 'text-gray-600 hover:text-white'
                      }`
                    }
                    style={({ isActive }) =>
                      isActive
                        ? {
                            background: 'linear-gradient(135deg, #334a34, #4a6b4b)',
                            boxShadow: '0 4px 12px rgba(51,74,52,0.25)',
                          }
                        : {}
                    }
                    onMouseEnter={(event) => {
                      const element = event.currentTarget;
                      if (!element.getAttribute('aria-current')) {
                        element.style.background = 'linear-gradient(135deg, #334a34, #4a6b4b)';
                      }
                    }}
                    onMouseLeave={(event) => {
                      const element = event.currentTarget;
                      if (!element.getAttribute('aria-current')) {
                        element.style.background = '';
                      }
                    }}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-2 border-t border-gray-200 p-3">
          <div className="flex items-center gap-3 rounded p-3" style={{ background: 'linear-gradient(135deg, #334a34, #4a6b4b)' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">Administrator</p>
              <p className="truncate text-[11px] text-white/60">admin@dealtechui.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
          <p className="pt-1 text-center text-[10px] text-gray-400">DealTech UI Starter v2.0</p>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
