import { Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from './AdminLayout';
import DashboardPage from '@/pages/dash/DashboardPage';
import ElementPage from '@/pages/element/ElementPage';
// [dealtech:auto-imports]

const AdminApp = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="element" element={<ElementPage />} />
      {/* [dealtech:auto-routes] */}
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AdminApp;
