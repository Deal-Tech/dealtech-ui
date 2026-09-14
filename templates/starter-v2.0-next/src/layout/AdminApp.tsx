import { Navigate, Route, Routes } from 'react-router-dom';

import AdminLayout from './AdminLayout';
import DashboardPage from '@/pages/dash/DashboardPage';
import ElementPage from '@/pages/element/ElementPage';
import MemberPage from '@/pages/member/MemberPage';
import ProdukPage from '@/pages/produk/ProdukPage';
import ProdukTambahPage from '@/pages/produk/ProdukTambahPage';
import PengaturanPage from '@/pages/pengaturan/PengaturanPage';
// [dealtech:auto-imports]

const AdminApp = () => (
  <Routes>
    <Route element={<AdminLayout />}>
      <Route index element={<DashboardPage />} />
      <Route path="element" element={<ElementPage />} />
      <Route path="produk" element={<ProdukPage />} />
      <Route path="produk/tambah" element={<ProdukTambahPage />} />
      <Route path="member" element={<MemberPage />} />
      <Route path="pengaturan" element={<PengaturanPage />} />
      {/* [dealtech:auto-routes] */}
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AdminApp;
