import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ModalGalat from '@/components/ui/modal-galat/ModalGalat';
import AdminApp from '@/layout/AdminApp';
import AdminLogin from '@/pages/auth/AdminLogin';
import LupaSandi from '@/pages/auth/LupaSandi';
import Maintenance from '@/pages/maintenance/Maintenance';
import { AuthProvider } from '@/lib/auth';
import { bacaWarnaTersimpan, ingatWarna, rapikanHex, terapkanWarna } from '@/lib/tema';
import { ambilTema } from '@/services/pengaturan';

import './index.css';
import './styles/theme.css';

// Sebelum render: tanpa kedip
terapkanWarna(bacaWarnaTersimpan());
ambilTema()
  .then(({ warna_utama }) => {
    const hex = rapikanHex(warna_utama);
    if (!hex) return;
    ingatWarna(hex);
    terapkanWarna(hex);
  })
  .catch(() => {});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ModalGalat />
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/lupa-sandi" element={<LupaSandi />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/dashboard/*" element={<AdminApp />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
