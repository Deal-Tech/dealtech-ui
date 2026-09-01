import { api } from '@/lib/api';
import { simpanCSRF } from '@/lib/api';
import { type Pengguna, type ZonaWaktu } from './auth';

/**
 * Akun sendiri. Dua aturan yang tidak boleh dilanggar:
 *
 * - Tidak ada fungsi yang menerima id pengguna. Target selalu pemilik sesi;
 *   begitu ada `/akun/:id`, itu IDOR.
 * - Tidak ada field `role` atau `is_active`. Backend juga tidak membacanya.
 */

export async function ambilAkun(signal?: AbortSignal): Promise<Pengguna> {
  return api<Pengguna>('/api/v1/akun', { signal });
}

/** Sengaja tanpa `email`. Ganti email punya endpointnya sendiri di bawah. */
export interface DataAkun {
  name?: string;
  zona_waktu?: ZonaWaktu;
}

export async function perbaruiAkun(data: DataAkun): Promise<Pengguna> {
  // Field yang tidak dikirim tidak diubah server — jangan kirim kunci kosong.
  const isi: DataAkun = {};
  if (data.name !== undefined) isi.name = data.name.trim();
  if (data.zona_waktu) isi.zona_waktu = data.zona_waktu;
  return api<Pengguna>('/api/v1/akun', { method: 'PATCH', body: isi });
}

/**
 * Ganti email sendiri. Sejak 2026-09-01 (Bos) TANPA OTP: sandi saat ini yang
 * membuktikan pemilik akun, dan emailnya langsung berpindah.
 *
 * Alamat barunya tidak diverifikasi — salah ketik mengunci akun dari sistem,
 * dan pemulihannya cuma lewat reset sandi oleh admin.
 */
export async function gantiEmail(emailBaru: string, sandiSaatIni: string): Promise<Pengguna> {
  return api<Pengguna>('/api/v1/akun/email', {
    method: 'POST',
    body: { new_email: emailBaru.trim().toLowerCase(), current_password: sandiSaatIni },
  });
}

/**
 * Ganti sandi sendiri. Backend mencabut SELURUH sesi lalu menerbitkan sesi baru
 * untuk perangkat ini — perangkat lain ikut terusir, dan itu memang tujuannya.
 *
 * Token CSRF ikut berganti, jadi harus disimpan ulang.
 */
export async function gantiSandi(sandiLama: string, sandiBaru: string): Promise<void> {
  const hasil = await api<{ diganti: boolean; csrf_token: string }>('/api/v1/akun/sandi', {
    method: 'POST',
    body: { current_password: sandiLama, new_password: sandiBaru },
  });
  if (hasil?.csrf_token) simpanCSRF(hasil.csrf_token);
}
