import { ApiError, api, apiMentah, simpanCSRF, hapusCSRF } from '@/lib/api';
import { MODE_DEMO, jeda } from '@/lib/demo';

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

export async function masuk(email: string, sandi: string, ingat = false): Promise<Pengguna> {
  const hasil = await api<JawabanMasuk>('/api/v1/auth/login', {
    method: 'POST',
    // `remember` diteruskan supaya backend bisa memberi cookie sesi berumur
    // panjang; tanpa itu sesinya ikut habis saat peramban ditutup.
    body: { email, password: sandi, remember: ingat },
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

export const PANJANG_KODE_SANDI = 6;

// Demo: kode ini selalu ditolak
export const KODE_DEMO_SALAH = '000000';

export async function mintaKodeSandi(email: string): Promise<void> {
  if (MODE_DEMO) {
    await jeda();
    return;
  }
  await api<{ terkirim: boolean }>('/api/v1/auth/forgot-password', {
    method: 'POST',
    body: { email },
    tanpaCSRF: true,
  });
}

/** Kode benar menghasilkan token atur ulang. */
export async function periksaKodeSandi(email: string, kode: string): Promise<string> {
  if (MODE_DEMO) {
    await jeda();
    if (kode === KODE_DEMO_SALAH) throw new ApiError(422, 'Kode salah atau sudah kedaluwarsa.');
    return 'demo';
  }
  const hasil = await api<{ token: string }>('/api/v1/auth/verify-code', {
    method: 'POST',
    body: { email, code: kode },
    tanpaCSRF: true,
  });
  return hasil.token;
}

export interface DataAturUlang {
  token: string;
  email: string;
  sandi: string;
  ulang: string;
}

export async function aturUlangSandi(data: DataAturUlang): Promise<void> {
  if (MODE_DEMO) {
    await jeda();
    return;
  }
  await api<{ diatur: boolean }>('/api/v1/auth/reset-password', {
    method: 'POST',
    body: {
      token: data.token,
      email: data.email,
      password: data.sandi,
      password_confirmation: data.ulang,
    },
    tanpaCSRF: true,
  });
}
