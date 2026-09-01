import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ModalGalat from '@/components/ui/modal-galat/ModalGalat';
import AdminApp from '@/layout/AdminApp';
import { AuthProvider } from '@/lib/auth';

import './index.css';
import './styles/theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* Satu tempat untuk semua gangguan sistem, di halaman mana pun. */}
        <ModalGalat />
        <Routes>
          <Route path="/dashboard/*" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
