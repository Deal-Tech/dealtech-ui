import { api } from '@/lib/api';

export interface Kontak {
  whatsapp: string;
  /** Angka saja untuk tautan wa.me. DITURUNKAN server dari `whatsapp`. */
  whatsapp_nomor: string;
  email: string;
  lokasi: string;
  jam_buka: string;
  /** Tautan sosial. Kosong = ikonnya tidak muncul di footer. */
  sosial_whatsapp: string;
  sosial_instagram: string;
  sosial_tiktok: string;
  /** Titik peta "lintang,bujur". Kosong = peta di Contact tidak muncul. */
  maps: string;
}

/** Yang boleh dikirim klien — `whatsapp_nomor` diturunkan server, bukan dikirim. */
export interface InputKontak {
  whatsapp: string;
  email: string;
  lokasi: string;
  jam_buka: string;
  sosial_whatsapp: string;
  sosial_instagram: string;
  sosial_tiktok: string;
  maps: string;
}

export function ambilKontak(signal?: AbortSignal): Promise<Kontak> {
  return api<Kontak>('/api/v1/pengaturan/kontak', { signal });
}

export function simpanKontak(data: InputKontak): Promise<Kontak> {
  return api<Kontak>('/api/v1/pengaturan/kontak', { method: 'PUT', body: data });
}
