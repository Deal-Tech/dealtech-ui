import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminHeader, AdminHeaderProps } from './admin-header';
import { AdminSidebar, AdminSidebarProps } from './admin-sidebar';

export interface AdminLayoutProps {
    sidebarProps: Omit<AdminSidebarProps, 'open' | 'onClose'>;
    headerProps?: Omit<AdminHeaderProps, 'onMenuClick'>;
    children?: React.ReactNode;
}

export const AdminLayout = ({ sidebarProps, headerProps, children }: AdminLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen admin-app">
            <AdminSidebar
                {...sidebarProps}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="flex-1 ml-0 lg:ml-64 min-w-0 overflow-x-hidden admin-body">
                <AdminHeader
                    {...headerProps}
                    onMenuClick={() => setSidebarOpen(true)}
                />
                <main className="px-4 py-4 md:px-6 admin-main">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
