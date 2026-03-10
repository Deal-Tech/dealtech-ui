import React, { useState, useRef, useEffect } from 'react';
import { AlignLeft, LogOut, User as UserIcon } from 'lucide-react';

export interface AdminUser {
    name: string;
    mail?: string;
    email?: string;
    [key: string]: any;
}

export interface AdminHeaderProps {
    onMenuClick: () => void;
    user?: AdminUser | null;
    onLogout?: () => void;
    title?: React.ReactNode;
}

export const AdminHeader = ({
    onMenuClick,
    user,
    onLogout,
    title = 'Dashboard Admin'
}: AdminHeaderProps) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-20 flex h-14 items-center bg-white border-b border-gray-200 px-6 shadow-sm">
            {/* Mobile menu toggle */}
            <button
                onClick={onMenuClick}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
                aria-label="Buka menu"
            >
                <AlignLeft className="h-5 w-5" />
            </button>

            <span className="hidden lg:block text-sm font-semibold text-gray-900 ml-2">
                {title}
            </span>

            <div className="ml-auto flex items-center gap-3">
                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        <UserIcon className="h-5 w-5" />
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                            <div className="px-3 py-2 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">{user?.name || 'Administrator'}</p>
                                <p className="text-xs text-gray-400">{user?.mail || user?.email || 'admin@system.com'}</p>
                            </div>
                            {onLogout && (
                                <button
                                    onClick={onLogout}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Keluar
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
