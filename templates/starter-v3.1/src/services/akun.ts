import { api, simpanCSRF } from '@/lib/api';
import { MODE_DEMO, bacaSesi, jeda, namaDariEmail, penggunaDemo, ubahSesi } from '@/lib/demo';
import { type Pengguna, type ZonaWaktu } from './auth';

export async function ambilAkun(signal?: AbortSignal): Promise<Pengguna> {
  if (MODE_DEMO) return bacaSesi() ?? penggunaDemo('admin@dealtech-ui.com');
  return api<Pengguna>('/api/v1/akun', { signal });
}

/** Sengaja tanpa `email`. */
export interface DataAkun {
  name?: string;
  zona_waktu?: ZonaWaktu;
}

export async function perbaruiAkun(data: DataAkun): Promise<Pengguna> {
  if (MODE_DEMO) {
    await jeda();
    const tambalan: Partial<Pengguna> = {};
    if (data.name !== undefined) tambalan.name = data.name.trim();
    if (data.zona_waktu) tambalan.zona_waktu = data.zona_waktu;
    return ubahSesi(tambalan);
  }
  // Kunci kosong tidak dikirim.
  const isi: DataAkun = {};
  if (data.name !== undefined) isi.name = data.name.trim();
  if (data.zona_waktu) isi.zona_waktu = data.zona_waktu;
  return api<Pengguna>('/api/v1/akun', { method: 'PATCH', body: isi });
}

export async function gantiEmail(emailBaru: string, sandiSaatIni: string): Promise<Pengguna> {
  if (MODE_DEMO) {
    await jeda();
    const email = emailBaru.trim().toLowerCase();
    return ubahSesi({ email, name: namaDariEmail(email) });
  }
  return api<Pengguna>('/api/v1/akun/email', {
    method: 'POST',
    body: { new_email: emailBaru.trim().toLowerCase(), current_password: sandiSaatIni },
  });
}

export async function gantiSandi(sandiLama: string, sandiBaru: string): Promise<void> {
  if (MODE_DEMO) {
    await jeda();
    return;
  }
  const hasil = await api<{ diganti: boolean; csrf_token: string }>('/api/v1/akun/sandi', {
    method: 'POST',
    body: { current_password: sandiLama, new_password: sandiBaru },
  });
  if (hasil?.csrf_token) simpanCSRF(hasil.csrf_token);
}
