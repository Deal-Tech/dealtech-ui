import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, User as UserIcon, X, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/button';
import { AdminUser } from './admin-header';

export interface NavItem {
    to: string;
    icon: React.ElementType;
    label: string;
    end?: boolean;
}

export interface NavGroup {
    label?: string;
    items: NavItem[];
}

export interface AdminSidebarProps {
    open?: boolean;
    onClose?: () => void;
    user?: AdminUser | null;
    onLogout?: () => void;
    navGroups: NavGroup[];
    brandName?: string;
    brandIcon?: React.ReactNode;
    version?: string;
}

export const AdminSidebar = ({
    open = false,
    onClose,
    user,
    onLogout,
    navGroups,
    brandName = 'Admin Panel',
    brandIcon = <ShoppingBag className="h-5 w-5 text-white" />,
    version = 'v1.0'
}: AdminSidebarProps) => {

    const handleClose = () => {
        if (onClose) onClose();
    };

    return (
        <>
            {/* Overlay backdrop — mobile only */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={handleClose}
                />
            )}

            <aside
                className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Header */}
                <div className="flex h-14 items-center justify-between px-4 bg-white border-b border-gray-200 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900">
                            {brandIcon}
                        </div>
                        <span className="font-bold text-lg tracking-tight text-gray-900">{brandName}</span>
                    </div>
                    {/* Close button — mobile only */}
                    <button
                        onClick={handleClose}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
                        aria-label="Tutup sidebar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-3 space-y-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {navGroups.map((group, gi) => (
                        <div key={gi}>
                            {group.label && (
                                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                    {group.label}
                                </p>
                            )}
                            <div className="space-y-1">
                                {group.items.map(({ to, icon: Icon, label, end }) => (
                                    <NavLink
                                        key={to}
                                        to={to}
                                        end={end}
                                        onClick={handleClose}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                                ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md shadow-gray-900/20'
                                                : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-900 hover:text-white'
                                            }`
                                        }
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        {label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="border-t border-gray-200 p-3 space-y-2 shrink-0">
                    {/* Profile card */}
                    <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 p-3">
                        <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
                            <p className="text-[11px] text-white/60 truncate">{user?.mail || user?.email || 'admin@system.com'}</p>
                        </div>
                    </div>

                    {/* Logout button */}
                    {onLogout && (
                        <Button
                            className="w-full"
                            variant="danger"
                            size="md"
                            icon={LogOut}
                            onClick={onLogout}
                        >
                            Keluar
                        </Button>
                    )}
                    {version && (
                        <p className="text-[10px] text-gray-400 text-center pt-1">{brandName} {version}</p>
                    )}
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
