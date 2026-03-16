import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/layout/AdminHeader';
import AdminSidebar from '../components/layout/AdminSidebar';
import '../styles/admin.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64 min-w-0 overflow-x-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-4 py-4 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
