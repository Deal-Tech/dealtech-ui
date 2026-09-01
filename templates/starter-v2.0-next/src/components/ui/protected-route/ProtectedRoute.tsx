import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Memuat } from '@/components/ui/memuat/Memuat';
import { useAuth } from '@/lib/auth';
import type { Peran } from '@/services/auth';

export interface ProtectedRouteProps {
  /**
   * Kalau diisi, hanya peran dalam daftar ini yang boleh masuk.
   * Kosong = cukup sudah login.
   */
  peran?: Peran[];
}

/**
 * Gerbang rute, gagal-tertutup.
 *
 * Hanya mencegah salah klik — backend WAJIB memeriksa peran sendiri di setiap
 * endpoint. Jangan pernah menganggap ini pengaman.
 */
export function ProtectedRoute({ peran }: ProtectedRouteProps = {}) {
  const { pengguna, memuat } = useAuth();
  const lokasi = useLocation();

  if (memuat) return <Memuat teks="Memeriksa sesi…" ukuran="layar" />;

  if (!pengguna) {
    return <Navigate to="/login" replace state={{ dari: lokasi.pathname }} />;
  }

  if (peran && !peran.includes(pengguna.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
