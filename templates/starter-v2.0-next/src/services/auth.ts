import { api, apiMentah, simpanCSRF, hapusCSRF } from '@/lib/api';

export type Peran = 'admin' | 'operator';

export type ZonaWaktu = 'WIB' | 'WITA' | 'WIT';

export const ZONA_WAKTU_BAWAAN: ZonaWaktu = 'WIB';

export interface Pengguna {
  id: number;
  name: string;
  email: string;
  role: Peran;
  is_active: boolean;
  wajib_ganti_sandi?: boolean;
  zona_waktu?: ZonaWaktu;
}

interface JawabanMasuk {
  user: Pengguna;
  csrf_token: string;
  kedaluwarsa: string;
}

export async function masuk(email: string, sandi: string): Promise<Pengguna> {
  const hasil = await api<JawabanMasuk>('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password: sandi },
    tanpaCSRF: true,
  });
  simpanCSRF(hasil.csrf_token);
  return hasil.user;
}

export async function profil(signal?: AbortSignal): Promise<Pengguna> {
  const r = await apiMentah<{ data: Pengguna; csrf_token?: string }>('/api/v1/auth/me', { signal });
  if (r.csrf_token) simpanCSRF(r.csrf_token);
  return r.data;
}

export async function keluar(): Promise<void> {
  try {
    await api<{ keluar: boolean }>('/api/v1/auth/logout', { method: 'POST' });
  } finally {
    hapusCSRF();
  }
}
