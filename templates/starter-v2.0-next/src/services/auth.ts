import { api, apiMentah, simpanCSRF, hapusCSRF } from '@/lib/api';

export type Peran = 'admin' | 'operator';

/** Zona waktu tampilan milik pengguna. Bawaannya WIB kalau server belum mengirimnya. */
export type ZonaWaktu = 'WIB' | 'WITA' | 'WIT';

export const ZONA_WAKTU_BAWAAN: ZonaWaktu = 'WIB';

export interface Pengguna {
  id: number;
  name: string;
  email: string;
  role: Peran;
  is_active: boolean;
  /** Admin baru mereset sandi orang ini; layar ganti sandi wajib menyusul. */
  wajib_ganti_sandi?: boolean;
  /** Opsional supaya sesi yang dimuat sebelum field ini ada tetap terbaca. */
  zona_waktu?: ZonaWaktu;
}

interface JawabanMasuk {
  user: Pengguna;
  csrf_token: string;
  kedaluwarsa: string;
}

/**
 * Auth ke backend Go. TIDAK ada token yang dikembalikan untuk disimpan —
 * kredensial sesi ada di cookie `sk_sesi` HttpOnly. Klien cuma memegang token
 * CSRF, yang sendirian tidak berguna.
 */
export async function masuk(email: string, sandi: string): Promise<Pengguna> {
  const hasil = await api<JawabanMasuk>('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password: sandi },
    tanpaCSRF: true,
  });
  simpanCSRF(hasil.csrf_token);
  return hasil.user;
}

/** Siapa yang sedang masuk. Cookie sesi dikirim peramban sendiri; 401 = ke login. */
export async function profil(signal?: AbortSignal): Promise<Pengguna> {
  const r = await apiMentah<{ data: Pengguna; csrf_token?: string }>('/api/v1/auth/me', { signal });
  if (r.csrf_token) simpanCSRF(r.csrf_token);
  return r.data;
}

/**
 * Keluar. Wajib lewat server: sesinya dicabut di database, supaya salinan cookie
 * yang sempat diambil orang lain ikut mati.
 */
export async function keluar(): Promise<void> {
  try {
    await api<{ keluar: boolean }>('/api/v1/auth/logout', { method: 'POST' });
  } finally {
    // Sesi lokal tetap dibersihkan walau permintaannya gagal.
    hapusCSRF();
  }
}
