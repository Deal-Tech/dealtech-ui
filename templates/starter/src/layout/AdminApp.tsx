import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import DashboardPage from '../pages/dash/DashboardPage';
import AdminLogin from '../pages/auth/AdminLogin';
import PageTabel from '../pages/page-tabel/PageTabel';
import PageTabelV2 from '../pages/page-tabel-v2/PageTabelV2';
// [dealtech:auto-imports]

const AdminApp = () => (
  <Routes>
    <Route path="login" element={<AdminLogin />} />
    <Route element={<AdminLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="page-tabel" element={<PageTabel />} />
      <Route path="page-tabel-v2" element={<PageTabelV2 />} />
      {/* [dealtech:auto-routes] */}
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AdminApp;
